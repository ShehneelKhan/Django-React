from django.urls import path
from .views import CustomTokenObtainPairView, UserDetailView, signup, logout, ProductList, ProductDetail

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('signup/', signup, name='signup'),
    path('logout/', logout, name='logout'),
    path('products/', ProductList.as_view(), name='product-list'),
    path('product/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('user/', UserDetailView.as_view(), name='user-info'),
]
