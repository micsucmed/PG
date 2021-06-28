from django.db import models
from account.models import Account
from django.contrib.postgres.fields import ArrayField

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
    date = models.DateField(auto_now=False, auto_now_add=False)
    processed = models.BooleanField(default=False)

    def clean(self):
        self.processed = True
        self.save()

class Price(models.Model):
    petition = models.OneToOneField(Petition, on_delete=models.CASCADE)
    prices = ArrayField(ArrayField(models.FloatField()))