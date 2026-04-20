from datetime import datetime

from django.db import transaction
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, permissions
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Autor, Libro, UsuarioLili, Amistad, Prestamo, Serie, Categoria, UsuarioLibro, Notificacion, \
    LibroCategoria, Editorial
from lili_api.serializers import AutorSerializer, LibroSerializer, UsuarioLiliSerializer, SerieSerializer, \
    CategoriaSerializer, UsuarioLibroSerializer, AmistadSerializer, PrestamoSerializer, NotificacionSerializer, \
    LibroCategoriaSerializer, EditorialSerializer
from .permissions import OwnProfilePermission, PrestamoPermission, LibroCategoriaPermission, AmistadPermission


class AutorView(ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']

    def get_permissions(self):
        if self.action not in ["destroy", "partial_update"]:
            return [IsAuthenticated()]
        return [IsAdminUser()]

class EditorialView(ModelViewSet):
    queryset = Editorial.objects.all()
    serializer_class = EditorialSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']

    def get_permissions(self):
        if self.action not in ["destroy", "partial_update"]:
            return [IsAuthenticated()]
        return [IsAdminUser()]

class LibroView(ModelViewSet):
    queryset = Libro.objects.all().select_related('editorial').prefetch_related('autores')
    serializer_class = LibroSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['titulo', 'isbn', 'autores', 'editorial', 'ano_pub_og', 'sinopsis']
    ordering_fields = ['nombre']

    def get_permissions(self):
        if self.action not in ["destroy", "partial_update"]:
            return [IsAuthenticated()]
        return [IsAdminUser()]

class UsuarioLiliView(ModelViewSet):
    queryset = UsuarioLili.objects.all().prefetch_related('libros')
    serializer_class = UsuarioLiliSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['username']
    ordering_fields = ['username', 'date_joined']

    # Permisos: cada usuario puede cambiar sus cosas
    def get_permissions(self):
        return [OwnProfilePermission()]

class SerieView(ModelViewSet):
    queryset = Serie.objects.all().select_related('usuario')
    serializer_class = SerieSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']

    # Permisos: cada usuario puede cambiar sus cosas y el admin las de todos
    def get_permissions(self):
        return [OwnProfilePermission()]

class CategoriaView(ModelViewSet):
    queryset = Categoria.objects.all().select_related('usuario')
    serializer_class = CategoriaSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['nombre']
    ordering_fields = ['nombre']

    # Permisos: cada usuario puede cambiar sus cosas y el admin las de todos
    def get_permissions(self):
        return [OwnProfilePermission()]

class UsuarioLibroView(ModelViewSet):
    # queryset = UsuarioLibro.objects.all().select_related('usuario', 'libro', 'serie').prefetch_related('categorias')
    serializer_class = UsuarioLibroSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return UsuarioLibro.objects.all().select_related('usuario', 'libro', 'serie').prefetch_related('categorias')
        return UsuarioLibro.objects.filter(usuario__pk=self.request.user.pk).select_related('usuario', 'libro', 'serie').prefetch_related('categorias')

    # Cambiar estado de libro
    @action(detail=True, methods=['post']) # permission_classes=[]
    def cambiar_estado(self, request, pk=None):
        libro = self.get_object()
        nuevo_estado = request.data.get('estado')

        estados_validos = [estado[0] for estado in UsuarioLibro.ESTADOS_LECTURA]
        if nuevo_estado not in estados_validos:
            return Response(
                {"error": "El estado no es válido"},
                status=status.HTTP_400_BAD_REQUEST
            )

        libro.estado = nuevo_estado
        libro.save()
        return Response(
            {"estado": f'Estado de {libro.titulo} cambiado correctamente a {libro.estado}'},
            status=status.HTTP_200_OK
        )

    # Alternar favorito libro
    @action(detail=True, methods=['post'])
    def cambiar_favorito(self, request, pk=None):
        libro = self.get_object()

        if libro.favorito:
            libro.favorito = False
        else:
            libro.favorito = True

        libro.save()

        serializer = self.get_serializer(libro)
        return Response(
            {"mensaje": "Estado de favorito cambiado correctamente", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    # Mostrar lista de libros en estado "leyendo"
    @action(detail=False, methods=['get'])
    def leyendo(self, request):
        libros_leyendo = UsuarioLibro.objects.filter(
            usuario=request.user,
            estado='leyendo'
        )
        return Response(UsuarioLibroSerializer(libros_leyendo, many=True).data)

    # Mostrar lista de favoritos
    @action(detail=False, methods=['get'])
    def favoritos(self, request):
        libros_favoritos = UsuarioLibro.objects.filter(
            usuario=request.user,
            favorito=True
        )
        return Response(UsuarioLibroSerializer(libros_favoritos, many=True).data)

    # Añadir libro a una categoría, si la categoría no existe, la crea
    @action(detail=False, methods=['post'])
    @transaction.atomic # Sin commits intermedios
    def anadir(self, request):
        """
        :param request:
            {
                "libro_id": 1,
                "categoria": "Sci-fi" # o ID
            }
        """
        libro_id = request.data.get('libro_id')
        categoria = request.data.get('categoria')

        if not libro_id or not categoria:
            return Response(
                {"error": "Es necesario indicar libro_id y categoría"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear UsuarioLibro
        usuario_libro, _ = UsuarioLibro.objects.get_or_create(
            usuario=request.user,
            libro=libro_id,
            defaults={'estado': UsuarioLibro.ESTADOS_LECTURA.s_e}
        )

        # Categoría ID o nombre
        if isinstance(categoria, int):
            cat, _ = Categoria.objects.get_or_create(
                id=categoria,
                usuario=request.user,
            )
        else:
            cat, _ = Categoria.objects.get_or_create(
                nombre=categoria,
                usuario=request.user,
                defaults={'publica': False}
            )

        # Crear relación
        _, creada = LibroCategoria.objects.get_or_create(
            usuario_libro=usuario_libro,
            categoria=cat,
        )

        return Response(
            {
                'usuario_libro': UsuarioLibroSerializer(usuario_libro).data,
                'categoria': CategoriaSerializer(cat).data,
                'relacion': LibroCategoriaSerializer(creada).data,
            },
            status=status.HTTP_201_CREATED if creada else status.HTTP_200_OK
        )

    # Añadir libro a una serie, si la serie no existe, la crea
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def anadir_serie(self, request, pk=None):
        """
            :param pk: 1
            :param request:
                {
                    "serie": "La Tumba Sellada", # o ID
                    "num_en_serie": 1
                }
        """
        usuario_libro = self.get_object()
        serie = request.data.get('serie')
        num_en_serie = request.data.get('num_en_serie')

        if not serie:
            return Response(
                {"error": "Es necesario indicar la serie"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Comprobar si serie es id o nombre
        if isinstance(serie, int):
            serie, _ = Serie.objects.get_or_create(
                id=serie,
                usuario=request.user,
            )
        else:
            serie, _ = Serie.objects.get_or_create(
                nombre=serie,
                usuario=request.user,
                defaults={'volumenes': 0}
            )

        # Asignar serie y num en serie a usuario_libro
        usuario_libro.serie = serie
        usuario_libro.numero_en_serie = num_en_serie
        usuario_libro.save()

        return Response(
        {
                'usuario_libro': UsuarioLibroSerializer(usuario_libro).data,
                'serie': SerieSerializer(serie).data,
            },
            status=status.HTTP_201_CREATED if serie else status.HTTP_200_OK
        )

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_fields = ['serie', 'estado', 'favorito', 'categorias']
    search_fields = ['libro', 'serie', 'estado', 'favorito']
    ordering_fields = ['libro', 'fecha_anadido']

    # Permisos: cada usuario puede cambiar sus cosas y el admin las de todos
    def get_permissions(self):
        return [OwnProfilePermission()]

class AmistadView(ModelViewSet):
    queryset = Amistad.objects.all().select_related('usuario_a', 'usuario_b')
    serializer_class = AmistadSerializer

    @action(detail=True, methods=['post'])
    def aceptar(self, request, pk=None):
        amistad = self.get_object()

        if amistad.usuario_a != request.user and amistad.usuario_b != request.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        amistad.estado = Amistad.ESTADOS_AMISTAD.ac
        amistad.save()
        return Response(
            {"mensaje": "Amistad aceptada"},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def ignorar(self, request, pk=None):
        amistad = self.get_object()

        if amistad.usuario_a != request.user and amistad.usuario_b != request.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        amistad.estado = Amistad.ESTADOS_AMISTAD.s_s
        amistad.save()
        return Response(
            {"mensaje": "Amistad ignorada"},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=True, methods=['post'])
    def bloquear(self, request, pk=None):
        amistad = self.get_object()

        if amistad.usuario_a != request.user and amistad.usuario_b != request.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        amistad.estado = Amistad.ESTADOS_AMISTAD.blo
        amistad.save()
        return Response(
            {"mensaje": "Usuario bloqueado"},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        amistades_pendientes = Amistad.objects.filter(
            Q(usuario_a = request.user) | Q(usuario_b = request.user),
            estado = 'pen'
        )
        return Response(
            AmistadSerializer(amistades_pendientes, many=True).data,
            status=status.HTTP_200_OK
        )

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_fields = ['usuario_a', 'usuario_b', 'estado']

    # Permisos: cada usuario puede cambiar sus cosas y el admin las de todos
    def get_permissions(self):
        return [AmistadPermission()]

class PrestamoView(ModelViewSet):
    queryset = Prestamo.objects.all().select_related('usuario_libro', 'prestatario')
    serializer_class = PrestamoSerializer

    @action(detail=True, methods=['post'])
    def prestar(self, request, pk=None):
        prestamo = self.get_object()

        if prestamo.usuario_libro.usuario != request.user and prestamo.prestatario != request.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        prestamo.estado = Prestamo.ESTADOS_PRESTAMO.activo
        prestamo.fecha_inicio = datetime.now()
        prestamo.save()
        return Response(
            {"mensaje": "Préstamo aceptado"},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def devolver(self, request, pk=None):
        prestamo = self.get_object()

        if prestamo.prestatario != request.user and prestamo.usuario_libro.usuario != request.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        prestamo.estado = Prestamo.ESTADOS_PRESTAMO.devuelto
        prestamo.fecha_fin = datetime.now()
        prestamo.save()
        return Response(
            {"mensaje": "Préstamo devuelto"},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def recibidos(self, request):
        prestamos_recibidos = Prestamo.objects.filter(
            prestatario = request.user,
            estado = Prestamo.ESTADOS_PRESTAMO.activo
        )
        return Response(
            PrestamoSerializer(prestamos_recibidos, many=True).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def cedidos(self, request):
        prestamos_cedidos = Prestamo.objects.filter(
            usuario_libro__usuario = request.user,
            estado = Prestamo.ESTADOS_PRESTAMO.activo
        )
        return Response(
            PrestamoSerializer(prestamos_cedidos, many=True).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def solicitados_por_mi(self, request):
        prestamos_solicitados = Prestamo.objects.filter(
            prestatario = request.user,
            estado = Prestamo.ESTADOS_PRESTAMO.solicitado
        )
        return Response(
            PrestamoSerializer(prestamos_solicitados, many=True).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def solicitados_a_mi(self, request):
        prestamos_solicitados = Prestamo.objects.filter(
            usuario_libro__usuario = request.user,
            estado = Prestamo.ESTADOS_PRESTAMO.solicitado
        )
        return Response(
            PrestamoSerializer(prestamos_solicitados, many=True).data,
            status=status.HTTP_200_OK
        )

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_fields = ['estado']
    search_fields = ['usuario_libro', 'prestatario']
    ordering_fields = ['usuario_libro', 'fecha_inicio', 'fecha_fin']

    # Permisos: cada usuario puede cambiar sus cosas, pero sólo el prestador puede marcar devuelto
    # y el admin las de todos
    def get_permissions(self):
        return [PrestamoPermission()]

class NotificacionView(ModelViewSet):
    queryset = Notificacion.objects.all().select_related('usuario')
    serializer_class = NotificacionSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_fields = ['usuario', 'tipo', 'leida']
    search_fields = ['usuario', 'tipo']
    ordering_fields = ['usuario', 'fecha_creacion']

    # Permisos: cada usuario puede cambiar sus cosas y el admin las de todos
    def get_permissions(self):
        return [OwnProfilePermission()]

class LibroCategoriaView(ModelViewSet):
    queryset = LibroCategoria.objects.all().select_related('usuario_libro', 'categoria')
    serializer_class = LibroCategoriaSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filter_fields = ['usuario_libro', 'categoria']
    search_fields = ['usuario_libro', 'categoria']
    ordering_fields = ['usuario_libro', 'fecha_creacion']

    # Permisos: cada usuario puede cambiar sus cosas y el admin las de todos
    def get_permissions(self):
        return [LibroCategoriaPermission()]