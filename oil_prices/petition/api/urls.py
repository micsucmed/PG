from django.urls import path
from petition.api.views import Petitions, PetitionDetail, GeneratePetitionSimulations

app_name = "worker"

urlpatterns = [
    path('', Petitions.as_view(), name="petitions"),
    path('detail/<str:petition_id>/simulate/', GeneratePetitionSimulations.as_view(), name="generate_petition_simulations"),
    path('detail/<str:petition_id>/', PetitionDetail.as_view(), name="petition_detail"),
]
