from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


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
                'access': str(access),
                'user': {'id': user.pk, 'username': user.get_username()},
            }
        )

        res.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=getattr(settings, 'AUTH_COOKIE_HTTPONLY', True),
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
                {'dertail': 'No refresh cookie'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token

            if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS', False):
                if settings.SIMPLE_JWT.get('BLACKLIST_AFTER_ROTATION', False):
                    try:
                        refresh.blacklist()
                    except Exception:
                        pass

                user_id = refresh.get("user_id")
                if not user_id:
                    return Response(
                        {'detail': 'No user id'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

                user = User.objects.get(pk=user_id)
                new_refresh = RefreshToken.for_user(user)
                new_refresh_value = str(new_refresh)

            else:
                new_refresh_value = None

        except User.DoesNotExist:
            return Response(
                {'detail': 'Usuario no existe'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except TokenError:
            return Response(
                {'detail': 'Refresh inválido'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        res = Response({'access': str(access)}, status=status.HTTP_200_OK)

        if new_refresh_value:
            res.set_cookie(
                key='refresh_token',
                value=new_refresh_value,
                httponly=getattr(settings, 'AUTH_COOKIE_HTTPONLY', True),
                secure=getattr(settings, 'AUTH_COOKIE_SECURE', True),
                samesite=getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax'),
                path='/api/auth/',
                max_age=7 * 24 * 60 * 60
            )

        return res

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
        res.delete_cookie('refresh_token', path='/api/auth/')
        return res