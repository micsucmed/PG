# Django imports
from django.shortcuts import render
from petition import models
from petition.api import serializers
from rest_framework import status
from rest_framework.response import Response

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
from scipy.stats import norm
import os

# Create your views here.

# Creates every simulation for a petition of a Simple Geometric Brownian Model
def createMBGSimulations(p_date, oil_reference, num_days, num_reps, petition_id):

    end_date = p_date

    if oil_reference == 'BRENT':
        mydata = quandl.get(
                "FRED/DCOILBRENTEU",
                returns="pandas",
                authtoken=os.environ['QUANDL_API_KEY'],
                end_date=end_date
            )
    else:
        mydata = quandl.get(
                "FRED/DCOILWTICO",
                returns="pandas",
                authtoken=os.environ['QUANDL_API_KEY'],
                end_date=end_date
            )
    # Performs the simulation
    df1 = numpy.log(mydata / mydata.shift(1))
    df1.columns = df1.columns.map(lambda x: x.replace('Value', 'Log-Return'))
    df = pd.concat([mydata, df1], axis=1)

    # Calculate the volatility of the asset
    sigma = (numpy.std(df['Log-Return'][1:]))*math.sqrt(252)

    # Risk free rate
    # fred = Fred(api_key="b6a7119857170bd5943832561d969285")
    # Risk free rate
    fred = Fred(api_key=os.environ['PG_FRED_API_KEY'])
    series = fred.get_series_as_of_date('TB3MS', end_date)
    data = pd.DataFrame(data=series)
    rf = (data['value'].values[-1])

    # Calcular Drift
    drift = ((df['Log-Return'].mean())*252)+(0.5*(sigma**2))

    # Simulacion de Montecarlo con probabilidades neutrales al riesgo y R caminos\
    n = num_days
    R = num_reps
    s0 = df['Value'].values[-1]
    dt = 1/252
    sqrt_dt = math.sqrt(dt)
    s_Q = numpy.zeros((n+1, R))
    s_Q[0,:]=s0
    ci_95 = numpy.zeros((n+1, 2))
    ci_90 = numpy.zeros((n+1, 2))
    ci_50 = numpy.zeros((n+1, 2))
    ci_25 = numpy.zeros((n+1, 2))
    ci_10 = numpy.zeros((n+1, 2))
    n_inv_95 = norm.ppf((0.95 + (1 - 0.95) / 2))
    n_inv_90 = norm.ppf((0.90 + (1 - 0.90) / 2))
    n_inv_50 = norm.ppf((0.5 + (1 - 0.5) / 2))
    n_inv_25 = norm.ppf((0.25 + (1 - 0.25) / 2))
    n_inv_10 = norm.ppf((0.1 + (1 - 0.1) / 2))
    B = 1000
    for i in range(1,n+1):
        s_Q[i,:]=s_Q[i-1,:]*(numpy.exp((rf-((sigma**2)/2))*dt+sigma*numpy.random.normal(size=(1,R))*math.sqrt(dt)))
        mub = numpy.zeros((B, 1))
        for j in range(1,B):
            samp_b = numpy.random.choice(s_Q[i], size=len(s_Q[i]), replace=True, p=None)
            mub[j] = numpy.mean(samp_b)

        se = numpy.std(mub)
        ci_95[i,0] = numpy.mean(mub) - n_inv_95*se
        ci_95[i,1] = numpy.mean(mub) + n_inv_95*se
        ci_90[i,0] = numpy.mean(mub) - n_inv_90*se
        ci_90[i,1] = numpy.mean(mub) + n_inv_90*se
        ci_50[i,0] = numpy.mean(mub) - n_inv_50*se
        ci_50[i,1] = numpy.mean(mub) + n_inv_50*se
        ci_25[i,0] = numpy.mean(mub) - n_inv_25*se
        ci_25[i,1] = numpy.mean(mub) + n_inv_25*se
        ci_10[i,0] = numpy.mean(mub) - n_inv_10*se
        ci_10[i,1] = numpy.mean(mub) + n_inv_10*se
    
    ci_95[0,0] = numpy.mean(s_Q[0])
    ci_95[0,1] = numpy.mean(s_Q[0])
    ci_90[0,0] = numpy.mean(s_Q[0])
    ci_90[0,1] = numpy.mean(s_Q[0])
    ci_50[0,0] = numpy.mean(s_Q[0])
    ci_50[0,1] = numpy.mean(s_Q[0])
    ci_25[0,0] = numpy.mean(s_Q[0])
    ci_25[0,1] = numpy.mean(s_Q[0])
    ci_10[0,0] = numpy.mean(s_Q[0])
    ci_10[0,1] = numpy.mean(s_Q[0])

    cis = numpy.array([ci_10, ci_25, ci_50, ci_90, ci_95])
        
    prices = s_Q.tolist()
    lists_ci = cis.tolist()

    serializer = serializers.PriceSerializer(data={})
    # serializer_ci = serializers.ConfidenceIntervalSerializer(data={})
    if serializer.is_valid():
        petition = models.Petition.objects.get(pk=petition_id)
        serializer.save(ci=lists_ci, prices=prices, petition=petition)
        petition.clean()
        # if serializer_ci.is_valid():
        #     serializer_ci.save(ci=lists_ci, petition=petition)
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Creates every simulation for a petition of a Reverse Mean Geometric Brownian Motion
def createMBGMRSimulations(p_date, oil_reference, num_days, num_reps, petition_id):
    # Gets the historical data for the prices of the given oil reference
    end_date = p_date

    if oil_reference == 'BRENT':
        mydata = quandl.get(
                "FRED/DCOILBRENTEU",
                returns="pandas",
                authtoken=os.environ['QUANDL_API_KEY'],
                end_date=end_date
            )
    else:
        mydata = quandl.get(
                "FRED/DCOILWTICO",
                returns="pandas",
                authtoken=os.environ['QUANDL_API_KEY'],
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

    n = num_days
    s0 = mydata['Value'][-1]
    R = num_reps
    S = numpy.zeros((n+1, R))
    S[0,:] = s0
    ci_95 = numpy.zeros((n+1, 2))
    ci_90 = numpy.zeros((n+1, 2))
    ci_50 = numpy.zeros((n+1, 2))
    ci_25 = numpy.zeros((n+1, 2))
    ci_10 = numpy.zeros((n+1, 2))
    n_inv_95 = norm.ppf((0.95 + (1 - 0.95) / 2))
    n_inv_90 = norm.ppf((0.90 + (1 - 0.90) / 2))
    n_inv_50 = norm.ppf((0.5 + (1 - 0.5) / 2))
    n_inv_25 = norm.ppf((0.25 + (1 - 0.25) / 2))
    n_inv_10 = norm.ppf((0.1 + (1 - 0.1) / 2))
    B = 1000
    for i in range(1, n+1):
        S[i,:] = m*(1-numpy.exp(-eta)) + numpy.exp(-eta)*S[i-1,:] + numpy.random.normal(0, sigma_e, size=(R))
        mub = numpy.zeros((B, 1))
        for j in range(1,B):
            samp_b = numpy.random.choice(S[i], size=len(S[i]), replace=True, p=None)
            mub[j] = numpy.mean(samp_b)  

        se = numpy.std(mub)
        ci_95[i,0] = numpy.mean(S[i]) - n_inv_95*se
        ci_95[i,1] = numpy.mean(S[i]) + n_inv_95*se
        ci_90[i,0] = numpy.mean(S[i]) - n_inv_90*se
        ci_90[i,1] = numpy.mean(S[i]) + n_inv_90*se
        ci_50[i,0] = numpy.mean(S[i]) - n_inv_50*se
        ci_50[i,1] = numpy.mean(S[i]) + n_inv_50*se
        ci_25[i,0] = numpy.mean(S[i]) - n_inv_25*se
        ci_25[i,1] = numpy.mean(S[i]) + n_inv_25*se
        ci_10[i,0] = numpy.mean(S[i]) - n_inv_10*se
        ci_10[i,1] = numpy.mean(S[i]) + n_inv_10*se

    ci_95[0,0] = numpy.mean(S[0])
    ci_95[0,1] = numpy.mean(S[0])
    ci_90[0,0] = numpy.mean(S[0])
    ci_90[0,1] = numpy.mean(S[0])
    ci_50[0,0] = numpy.mean(S[0])
    ci_50[0,1] = numpy.mean(S[0])
    ci_25[0,0] = numpy.mean(S[0])
    ci_25[0,1] = numpy.mean(S[0])
    ci_10[0,0] = numpy.mean(S[0])
    ci_10[0,1] = numpy.mean(S[0])

    cis = numpy.array([ci_10, ci_25, ci_50, ci_90, ci_95])

    lists_ci = cis.tolist()
    prices = S.tolist()

    serializer = serializers.PriceSerializer(data={})
    # serializer_ci = serializers.ConfidenceIntervalSerializer(data={})
    if serializer.is_valid():
        petition = models.Petition.objects.get(pk=petition_id)
        serializer.save(ci=lists_ci, prices=prices, petition=petition)
        petition.clean()
        # if serializer_ci.is_valid():
        #     serializer_ci.save(ci=lists_ci, petition=petition)
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)