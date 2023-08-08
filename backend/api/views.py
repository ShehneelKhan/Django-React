from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Product
from .serializers import ProductSerializer
from django.views.decorators.csrf import csrf_exempt

class CustomTokenObtainPairView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'message': 'Invalid credentials'}, status=400)
        

class ProductList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        search_query = request.query_params.get('search', '')
        queryset = Product.objects.filter(name__icontains=search_query)

        sort_field = request.query_params.get('ordering', 'id')
        sort_direction = request.query_params.get('sortDirection', 'asc')

        if sort_direction == 'asc':
            queryset = queryset.order_by(sort_field.lstrip('-'))
        else:
            queryset = queryset.order_by(sort_field.lstrip('-')).reverse()

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

class ProductDetail(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, pk):
        instance = Product.objects.get(pk=pk)
        selected = request.data.get("selected", None)

        if selected is not None:
            instance.selected = selected
            instance.save()
            serializer = ProductSerializer(instance)
            return Response(serializer.data)
        else:
            return Response(
                {"error": "selected field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'message': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username, password=password)

    return Response({'message': 'Signup successful'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def logout(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)



class UserDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Return the username from the request data
        username = request.query_params.get('username', '')
        print(username)
        return Response({'username': username})
