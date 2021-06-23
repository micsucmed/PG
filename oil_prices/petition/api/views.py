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
    perimission_classes=(IsAuthenticated,)
    def get(self, request):
        petitions = models.Petition.objects.filter(owner=request.user)
        serializer = serializers.PetitionSerializer(petitions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = serializers.PetitionSerializer(data=request.data)
        if serializer.is_valid():
            owner_id = request.data.get('owner')
            date = request.data.get('date')
            oil_reference = request.data.get('oil_reference')
            num_days = request.data.get('num_days')
            num_reps = request.data.get('num_reps')
            sim_model = request.data.get('sim_model')
            if sim_model == 'MBG':
                prices = createMBGSimulations(p_date=date, oil_reference=oil_reference, num_days=num_days, num_reps=num_reps)
            if sim_model == 'MBGMR':
                prices = createMBGMRSimulations(p_date=date, oil_reference=oil_reference, num_days=num_days, num_reps=num_reps)
            serializer.save(owner=request.user)
            priceSerializer = serializers.PriceSerializer(data={})
            if priceSerializer.is_valid():
                priceSerializer.save(prices=prices, petition=models.Petition.objects.get(pk=serializer.data['id']))
            else:
                print("could not save prices")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PetitionDetail(APIView):
    permission_classes=(IsAuthenticatedOrReadOnly,)
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

class Prices(APIView):
    def get(self, request, petition_id):
        prices = models.Price.objects.filter(petition_id=petition_id)
        serializer = serializers.PriceSerializer(prices, many=True)
        return Response(serializer.data)