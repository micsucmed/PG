from rest_framework import serializers
from petition import models


class PetitionSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField('get_petition_owner')
    id = serializers.ReadOnlyField()
    prices = serializers.ListField(child=serializers.ListField(child=serializers.FloatField(read_only=True), read_only=True), read_only=True)

    class Meta:
        model = models.Petition
        fields = ['id', 'owner', 'num_days', 'num_reps', 'oil_reference', 'date', 'prices', 'sim_model']

    def get_petition_owner(self, petition):
        petition_owner = petition.owner.id
        return petition_owner