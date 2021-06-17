from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from account.models import Account
from account.api.serializers import RegistrationSerializer, AccountSerializer

class AccountCreateAPIView(generics.CreateAPIView):
    queryset = Account.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)

class AccountList(APIView):
    def get(self, request):
        accounts = Account.objects.all()
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)

class CurrentUser(APIView):
    def get(self, request):
        permission_classes = (IsAuthenticated,)
        current_user = request.user
        if(current_user.id == None):
            return Response({'user': 'undefined'})
        serializer = AccountSerializer(current_user)
        return Response(serializer.data)