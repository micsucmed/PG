from rest_framework import serializers
from account.models import Account

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = Account
        fields = ['email', 'password']

    def save(self):
        user = Account(
                email = self.validated_data['email']
        )
        password = self.validated_data['password']
        user.set_password(password)
        user.save()
        return user

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email',]