from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.parsers import FormParser, MultiPartParser
from account.models import Account
from petition.api import serializers
from petition import models
from petition.views import createMBGSimulations, createMBGMRSimulations


class Petitions(APIView):
    def get(self, request):
        petitions = models.Petition.objects.all()
        serializer = serializers.PetitionsSerializer(petitions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = serializers.PetitionSerializer(data=request.data)
        if serializer.is_valid():
            owner_id = request.data.get('owner')
            date = request.data.get('date')
            oil_reference = request.data.get('oil_reference')
            num_days = request.data.get('num_days')
            num_reps = request.data.get('num_reps')
            prices = createMBGSimulations(p_date=date, oil_reference=oil_reference, num_days=num_days, num_reps=num_reps)
            serializer.save(prices=prices, owner=Account.objects.get(pk=owner_id))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PetitionDetail(APIView):
    def get(self, request, petition_id):
        try:
            petition = models.Petition.objects.get(pk=petition_id)
        except models.Petition.DoesNotExist:
            raise Http404
        serializer = serializers.PetitionSerializer(petition)
        return Response(serializer.data)

    def delete(self, request, petition_id):
        try:
            petition = models.Petition.objects.get(pk=petition_id)
        except models.Petition.DoesNotExist:
            raise Http404
        petition.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class GeneratePetitionSimulations(APIView):
    def get(self, request, petition_id):
        try:
            petition = models.Petition.objects.get(pk=petition_id)
        except models.Petition.DoesNotExist:
            raise Http404
        if petition.sim_model == 'MBG':
            createMBGSimulations(petition.id)
            return Response(status.HTTP_200_OK)
        elif petition.sim_model == 'MBGMR':
            createMBGMRSimulations(petition.id)
            return Response(status.HTTP_200_OK)
        else:
            raise ValueError("Ocurrio un error con el modelo, intente nuevamente.")