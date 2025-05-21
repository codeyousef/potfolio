from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Authenticate a user and return access and refresh tokens.
    This endpoint mimics the Directus /auth/login endpoint.
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'message': 'Email and password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Try to find a user with the given email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'message': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Authenticate with the username (not email)
    authenticated_user = authenticate(username=user.username, password=password)
    
    if not authenticated_user:
        return Response(
            {'message': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate tokens
    refresh = RefreshToken.for_user(authenticated_user)
    
    # Format response to match Directus format
    return Response({
        'data': {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'expires': 3600  # Token expiration in seconds
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Return the authenticated user's details.
    This endpoint mimics the Directus /users/me endpoint.
    """
    user = request.user
    
    # Format response to match Directus format
    return Response({
        'data': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'avatar': None  # Django doesn't have avatars by default
        }
    })