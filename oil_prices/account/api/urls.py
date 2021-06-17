from django.urls import path
from account.api.views import AccountCreateAPIView, AccountList, CurrentUser
from rest_framework.authtoken.views import obtain_auth_token

app_name = "account"

urlpatterns = [
    path('register/', AccountCreateAPIView.as_view(), name="register"),
    path('login/', obtain_auth_token, name="register"),
    path('list/', AccountList.as_view(), name="list_users"),
    path('current-user/', CurrentUser.as_view(), name="current_user"),
]