from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    driverId = serializers.CharField(source='driver_id_ref', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'phone', 'driverId']
        read_only_fields = ['id', 'role', 'driverId']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['email', 'password', 'name', 'role', 'phone', 'driver_id_ref']
        
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            role=validated_data.get('role', 'Admin'),
            phone=validated_data.get('phone', ''),
            driver_id_ref=validated_data.get('driver_id_ref', '')
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['name'] = user.name
        token['role'] = user.role
        token['driverId'] = user.driver_id_ref or ''
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
