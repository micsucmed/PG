from django.db import models
from django.contrib.postgres.fields import ArrayField
from account.models import Account

# Create your models here.
class Petition(models.Model):
    owner = models.ForeignKey(Account, on_delete=models.CASCADE)
    num_days = models.IntegerField()
    num_reps = models.IntegerField()
    BRENT = 'BRENT'
    WTI = 'WTI'
    OIL_REFERENCE_CHOICES = [(BRENT, 'BRENT'), (WTI, 'WTI')]
    oil_reference = models.CharField(max_length=50, choices=OIL_REFERENCE_CHOICES)
    MBG = 'MBG'
    MBGMR = 'MBGMR'
    MODEL_CHOICES = [
            (MBG, 'Movimiento Browniano Geometrico simple'),
            (MBGMR, 'Movimiento Browniano Gometrico simple con Reversion a la Media')
        ]
    sim_model = models.CharField(max_length=50, choices=MODEL_CHOICES)
    prices = ArrayField(ArrayField(models.FloatField()))
    date = models.DateField(auto_now=False, auto_now_add=False)