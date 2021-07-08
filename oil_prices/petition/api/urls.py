from django.urls import path
from petition.api.views import Petitions, PetitionDetail, Prices

app_name = "worker"

urlpatterns = [
    path('', Petitions.as_view(), name="petitions"),
    path('detail/<str:petition_id>/', PetitionDetail.as_view(), name="petition_detail"),
    path('detail/<str:petition_id>/prices/', Prices.as_view(), name="price_detail"),
    # path('detail/<str:petition_id>/cis/', Intervals.as_view(), name="ics_detail"),
]
