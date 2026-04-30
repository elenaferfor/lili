from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from lili_api.models import UsuarioLili


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'detail': 'Es obligatorio introducir usuario y contraseña'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {'detail': 'Credenciales no válidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        res = Response(
            {
                # 'access': str(access),
                'user': {'id': user.pk, 'username': user.get_username()},
            }
        )

        res.set_cookie(
            key='access_token',
            value=str(access),
            # httponly=getattr(settings, 'AUTH_COOKIE_HTTPONLY', True),
            secure=getattr(settings, 'AUTH_COOKIE_SECURE', True),
            samesite=getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax'),
            # path='/auth/',
            max_age=5 * 60
        )
        res.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=getattr(settings, 'AUTH_COOKIE_SECURE', True),
            samesite=getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax'),
            path='/api/auth/',
            max_age=7 * 24 * 60 * 60
        )

        return res

class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response(
                {'detail': 'No refresh cookie'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token

        except TokenError:
            return Response(
                {'detail': 'Refresh inválido'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        res = Response({'detail': 'ok'}, status=status.HTTP_200_OK)

        res.set_cookie(
            key='access_token',
            value=str(access),
            httponly=True,
            secure=getattr(settings, 'AUTH_COOKIE_SECURE', True),
            samesite=getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax'),
            max_age=5 * 60
        )

        return res

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {'id': request.user.pk, 'username': request.user.get_username(), })

class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                try:
                    token.blacklist()
                except Exception:
                    pass
            except TokenError:
                pass

        res = Response(
            {'detail': 'logout ok'},
            status=status.HTTP_200_OK
        )
        res.delete_cookie('refresh_token', path='/auth/')
        return res

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password or not email:
            return Response(
                {'detail': 'Todos los campos son obligatorios'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if UsuarioLili.objects.filter(username=username).exists():
            return Response(
                {'detail': 'El usuario ya existe'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if UsuarioLili.objects.filter(email=email).exists():
            return Response(
                {'detail': 'El email ya está registrado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = UsuarioLili.objects.create_user(username=username, email=email, password=password)

        return Response(
            {'detail': 'Usuario creado correctamente'},
            status=status.HTTP_201_CREATED
        )