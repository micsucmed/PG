# Django imports
from django.shortcuts import render
from petition.models import Petition
# from simulation.api.serializers import SimulationSerializer
from django.http import Http404
# Data process imports
import matplotlib.pyplot as plt
import matplotlib as mpl
import pandas_datareader
import pandas as pd
import  quandl
import numpy
import math
import json
from sklearn.linear_model import LinearRegression
from fredapi import Fred
from datetime import date, datetime, timedelta

# Create your views here.

# Creates every simulation for a petition of a Simple Geometric Brownian Model
def createMBGSimulations(p_date, oil_reference, num_days, num_reps):
    # try:
    #     petition = Petition.objects.get(pk=petition_id)
    # except Petition.DoesNotExist:
    #     raise Http404
    # Gets the historical data for the prices of the given oil reference
    # end_date = petition.date.strftime('%Y-%m-%d')
    end_date = p_date

    # if petition.oil_reference == 'BRENT':
    if oil_reference == 'BRENT':
        mydata = quandl.get(
                "FRED/DCOILBRENTEU",
                returns="pandas",
                authtoken="7gMvGvRq_p7EH3iWZnW5",
                end_date=end_date
            )
    else:
        mydata = quandl.get(
                "FRED/DCOILWTICO",
                returns="pandas",
                authtoken="7gMvGvRq_p7EH3iWZnW5",
                end_date=end_date
            )
    # Performs the simulation
    df1 = numpy.log(mydata / mydata.shift(1))
    df1.columns = df1.columns.map(lambda x: x.replace('Value', 'Log-Return'))
    df = pd.concat([mydata, df1], axis=1)

    # Calculate the volatility of the asset
    sigma = (numpy.std(df['Log-Return'][1:]))*math.sqrt(252)

    # Risk free rate
    fred = Fred(api_key="b6a7119857170bd5943832561d969285")
    series = fred.get_series_as_of_date('TB3MS', end_date)
    data = pd.DataFrame(data=series)
    rf = (data['value'].values[-1])

    # Calcular Drift
    drift = ((df['Log-Return'].mean())*252)+(0.5*(sigma**2))

    # Simulacion de Montecarlo con probabilidades neutrales al riesgo y R caminos
    # n = petition.num_days
    n = num_days
    # R = petition.num_reps
    R = num_reps
    s0 = df['Value'].values[-1]
    dt = 1/252
    sqrt_dt = math.sqrt(dt)
    s_Q = numpy.zeros((n+1, R))
    s_Q[0,:]=s0
    for i in range(1,n+1):
        s_Q[i,:]=s_Q[i-1,:]*(numpy.exp((rf-((sigma**2)/2))*dt+sigma*numpy.random.normal(size=(1,R))*math.sqrt(dt)))
        
    prices = s_Q.tolist()

    return prices
        
        # for j in range(1, R):
        #     data_serializer = {
        #         'petition': petition_id,
        #         'day': (petition.date+timedelta(i)).strftime('%Y-%m-%d'),
        #         'replica': j,
        #         'price': s_Q[i,j]
        #     }
            # serializer = SimulationSerializer(data=data_serializer)
            # if serializer.is_valid():
            #     serializer.save(petition=Petition.objects.get(pk=petition_id))
            # else:
            #     print(serializer.errors)

# Creates every simulation for a petition of a Reverse Mean Geometric Brownian Motion
def createMBGMRSimulations(petition_id):

    try:
        petition = Petition.objects.get(pk=petition_id)
    except Petition.DoesNotExist:
        raise Http404
    # Gets the historical data for the prices of the given oil reference
    end_date = petition.date.strftime('$Y-%m-%d')

    if petition.oil_reference == 'BRENT':
        mydata = quandl.get(
                "FRED/DCOILBRENTEU",
                returns="pandas",
                authtoken="7gMvGvRq_p7EH3iWZnW5",
                end_date=end_date
            )
    else:
        mydata = quandl.get(
                "FRED/DCOILWTICO",
                returns="pandas",
                authtoken="7gMvGvRq_p7EH3iWZnW5",
                end_date=end_date
            )
    
    df = numpy.diff(mydata['Value'])
    l = len(df)

    p_l1 = numpy.array(mydata['Value'][0:l]).reshape((-1, 1))

    model = LinearRegression().fit(p_l1, df)
    r_sq = model.score(p_l1, df)
    a = model.intercept_
    b = model.coef_

    m = -a/b
    eta = (-numpy.log(1+b))

    pred = model.predict(p_l1)
    residual = (df-pred)

    sigma_e = numpy.std(residual)

    n = 252
    s0 = mydata['Value'][-1]
    R = 1000
    S = numpy.zeros((n+1, R))
    S[0,:] = s0
    for i in range(1, n+1):
        S[i,:] = m*(1-numpy.exp(-eta)) + numpy.exp(-eta)*S[i-1,:] + numpy.random.normal(0, sigma_e, size=(R))
        # for j in range(1, R):
        #     data_serializer = {
        #         'petition': petition_id,
        #         'day': petition.date+timedelta(i),
        #         'replica': j,
        #         'price': S[i,j]
        #     }
            # serializer = SimulationSerializer(data=data_serializer)
            # if serializer.is_valid():
            #     serializer.save(petition=Petition.objects.get(pk=petition_id))