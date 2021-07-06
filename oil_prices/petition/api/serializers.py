from rest_framework import serializers
from petition import models

class PetitionSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField('get_petition_owner')
    id = serializers.ReadOnlyField()
    processed = serializers.ReadOnlyField()
    # prices = serializers.ListField(child=serializers.ListField(child=serializers.FloatField(read_only=True), read_only=True), read_only=True)

    class Meta:
        model = models.Petition
        fields = ['id', 'owner', 'num_days', 'num_reps', 'oil_reference', 'date', 'sim_model', 'processed']

    def get_petition_owner(self, petition):
        petition_owner = petition.owner.id
        return petition_owner

class PriceSerializer(serializers.ModelSerializer):
    petition = serializers.SerializerMethodField('get_price_petition')
    id = serializers.ReadOnlyField()
    prices = serializers.ListField(child=serializers.ListField(child=serializers.FloatField(read_only=True), read_only=True), read_only=True)
    ci = serializers.ListField(child=serializers.ListField(child=serializers.ListField(child=serializers.FloatField(read_only=True), read_only=True), read_only=True), read_only=True)

    class Meta:
        model = models.Price
        fields = ['id', 'petition', 'prices', 'ci']

    def get_price_petition(self, price):
        price_petition = price.petition.id
        return price_petition

# class ConfidenceIntervalSerializer(serializers.ModelSerializer):
#     petition = serializers.SerializerMethodField('get_c_i_petition')
#     id = serializers.ReadOnlyField()

#     class Meta:
#         model = models.ConfidenceInterval
#         fields = ['id', 'petition', 'ci']

#     def get_c_i_petition(self, c_i):
#         c_i_petition = c_i.petition.id
#         return c_i_petition