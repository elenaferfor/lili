from rest_framework import serializers

from .models import Autor, Libro, UsuarioLili, Amistad, Prestamo, Serie, Categoria, UsuarioLibro, Notificacion

class AutorSerializer(serializers.ModelSerializer):
    libros = serializers.PrimaryKeyRelatedField(many=True, queryset=Libro.objects.all())

    class Meta:
        model = Autor
        fields = ['id', 'nombre', 'openlibrary_key', 'libros']

class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = ['id', 'isbn', 'titulo', 'formato',
                  'ano_pub', 'ano_pub_og',
                  'portada', 'sinopsis',
                  'openlibrary_key', 'fecha_actualizacion'
                  'autores']

class UsuarioLiliSerializer(serializers.ModelSerializer):
    amistades = serializers.SerializerMethodField()
    prestamos_hechos = serializers.SerializerMethodField()
    prestamos_recibidos = serializers.SerializerMethodField()

    def get_amistades(self, obj):
        # TODO - No sé si buscando sólo por usuario_a aparecen todas las amistades
        aimstades = Amistad.objects.filter(usuario_a=obj)

    def get_prestamos_hechos(self, obj):
        prestamos = Prestamo.objects.filter(usuario_libro__usuario=obj)
        return prestamos.values_list('id', flat=True)

    def get_prestamos_recibidos(self, obj):
        prestamos = Prestamo.objects.filter(prestatario=obj)
        return prestamos.values_list('id', flat=True)

    class Meta:
        model = UsuarioLili
        fields = ['id', 'libros', 'amistades', 'prestamos_hechos', 'prestamos_recibidos']

class SerieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Serie
        fields = ['id', 'usuario', 'nombre', 'volumenes']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'usuario', 'nombre', 'publica']

class UsuarioLibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioLibro
        fields = ['id', 'usuario', 'libro'
                  'serie', 'numero_en_serie',
                  'estado', 'favorito', 'publico',
                  'cartegorias']

class AmistadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amistad
        fields = ['id', 'usuario_a', 'usuario_b', 'estado',
                  'fecha_creacion', 'fecha_actualizacion']

class PrestamoSerializer(serializers.ModelSerializer):
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
