from django.db.models import Q
from rest_framework import serializers

from .models import Autor, Libro, UsuarioLili, Amistad, Prestamo, Serie, Categoria, UsuarioLibro, Notificacion, LibroCategoria

# ===================== Serializers de detalle ===========================
class LibroTituloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = ['id', 'titulo']

class AutorNombreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = ['id', 'nombre']

class CategoriaNombreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class UsuarioNombreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioLili
        fields = ['id', 'username']

# ===================== Serializers principales ===========================
class AutorSerializer(serializers.ModelSerializer):
    libros = LibroTituloSerializer(many=True)

    class Meta:
        model = Autor
        fields = ['id', 'nombre', 'openlibrary_key', 'libros']

class LibroSerializer(serializers.ModelSerializer):
    autores = AutorNombreSerializer(many=True)
    class Meta:
        model = Libro
        fields = ['id', 'isbn', 'titulo', 'formato',
                  'ano_pub', 'ano_pub_og',
                  'portada', 'sinopsis',
                  'openlibrary_key', 'fecha_actualizacion',
                  'autores']

class UsuarioLiliSerializer(serializers.ModelSerializer):
    amistades = serializers.SerializerMethodField()
    prestamos_hechos = serializers.SerializerMethodField()
    prestamos_recibidos = serializers.SerializerMethodField()

    def get_amistades(self, obj):
        amistades = Amistad.objects.filter( Q(usuario_a=obj) | Q(usuario_b=obj) )
        return [
            {
                "id": amistad.pk,
                "usuario_a": amistad.usuario_a.username,
                "usuario_b": amistad.usuario_b.username,
                "estado": amistad.estado,
            }
            for amistad in amistades
        ]

    def get_prestamos_hechos(self, obj):
        prestamos = Prestamo.objects.filter(usuario_libro__usuario=obj)
        return prestamos.values_list('id', flat=True)

    def get_prestamos_recibidos(self, obj):
        prestamos = Prestamo.objects.filter(prestatario=obj)
        return prestamos.values_list('id', flat=True)

    class Meta:
        model = UsuarioLili
        fields = ['id', 'username', 'first_name', 'last_name',
                  'email', 'is_staff', 'is_active', 'date_joined',
                  'libros', 'amistades', 'prestamos_hechos', 'prestamos_recibidos']

class SerieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Serie
        fields = ['id', 'usuario', 'nombre', 'volumenes']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'usuario', 'nombre', 'publica']

class UsuarioLibroSerializer(serializers.ModelSerializer):
    libro = serializers.CharField(source='libro.titulo')
    serie = serializers.CharField(source='serie.nombre', allow_null=True)
    categorias = CategoriaNombreSerializer(many=True)

    class Meta:
        model = UsuarioLibro
        fields = ['id', 'usuario', 'libro',
                  'serie', 'numero_en_serie',
                  'estado', 'favorito', 'publico',
                  'categorias']

class AmistadSerializer(serializers.ModelSerializer):
    usuario_a = UsuarioNombreSerializer()
    usuario_b = UsuarioNombreSerializer()

    class Meta:
        model = Amistad
        fields = ['id', 'usuario_a', 'usuario_b', 'estado',
                  'fecha_creacion', 'fecha_actualizacion']

class PrestamoSerializer(serializers.ModelSerializer):
    usuario_libro = serializers.CharField(source='usuario_libro.libro.titulo')
    prestatario = UsuarioNombreSerializer()

    class Meta:
        model = Prestamo
        fields = ['id', 'usuario_libro', 'prestatario',
                  'fecha_inicio', 'fecha_fin', 'estado']

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['id', 'usuario', 'tipo',
                  'texto', 'leida', 'fecha_creacion',
                  'referencia']

class LibroCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibroCategoria
        fields = ['id', 'usuario_libro', 'categoria', 'fecha_creacion']