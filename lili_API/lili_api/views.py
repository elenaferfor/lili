from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet

from .models import Autor, Libro, UsuarioLili, Amistad, Prestamo, Serie, Categoria, UsuarioLibro, Notificacion
from lili_api.serializers import AutorSerializer, LibroSerializer, UsuarioLiliSerializer, SerieSerializer, \
    CategoriaSerializer, UsuarioLibroSerializer, AmistadSerializer, PrestamoSerializer, NotificacionSerializer


class AutorView(ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer

class LibroView(ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer

class UsuarioLiliView(ModelViewSet):
    queryset = UsuarioLili.objects.all()
    serializer_class = UsuarioLiliSerializer

class SerieView(ModelViewSet):
    queryset = Serie.objects.all()
    serializer_class = SerieSerializer

class CategoriaView(ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class UsuarioLibroView(ModelViewSet):
    queryset = UsuarioLibro.objects.all()
    serializer_class = UsuarioLibroSerializer

class AmistadView(ModelViewSet):
    queryset = Amistad.objects.all()
    serializer_class = AmistadSerializer

class PrestamoView(ModelViewSet):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer

class NotificacionView(ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer