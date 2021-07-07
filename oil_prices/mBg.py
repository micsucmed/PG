#%%
import matplotlib as mpl
import matplotlib.pyplot as plt
import pandas as pd
import numpy
import math
import json
import quandl
import statistics
from fredapi import Fred
import pandas_datareader
from scipy.stats import norm

# Obtener la informacion historica del precio para el WTI y calcular sus retornos logaritmicos
mydata = quandl.get("FRED/DCOILWTICO", returns="pandas", authtoken="7gMvGvRq_p7EH3iWZnW5")
# mydata = quandl.get("FRED/DCOILBRENTEU", returns="pandas", authtoken="7gMvGvRq_p7EH3iWZnW5")
df1 = numpy.log(mydata / mydata.shift(1))
df1.columns = df1.columns.map(lambda x: x.replace('Value', 'Log-Return'))
df = pd.concat([mydata, df1], axis=1)

# Calcular la volatilidad del activo
sigma = (numpy.std(df['Log-Return'][1:]))*math.sqrt(252)
# sigma = (df.var()['Log-Return'])*math.sqrt(252)

# Tasa libre de riesgo
fred = Fred(api_key="b6a7119857170bd5943832561d969285")
series = fred.get_series_latest_release('TB3MS')
data = pd.DataFrame(data=series)
rf = (data[0].values[-1])

# Calcular Drift
drift = ((df['Log-Return'].mean())*252)+(0.5*(sigma**2))

# Simulacion de Montecarlo con probabilidades neutrales al riesgo y R caminos
n = 10
R = 10
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
    s_Q[i,:]=s_Q[i-1,:]*(numpy.exp((rf-sigma**2/2)*dt+sigma*numpy.random.normal(size=(1,R))*math.sqrt(dt)))
    mub = numpy.zeros((B, 1))
    for j in range(1,B):
        samp_b = numpy.random.choice(s_Q[i], size=len(s_Q[i]), replace=True, p=None)
        mub[j] = numpy.mean(samp_b)

    se = numpy.std(mub)
    ci_95[i,0] = numpy.mean(s_Q[i]) - n_inv_95*se
    ci_95[i,1] = numpy.mean(s_Q[i]) + n_inv_95*se
    ci_90[i,0] = numpy.mean(s_Q[i]) - n_inv_90*se
    ci_90[i,1] = numpy.mean(s_Q[i]) + n_inv_90*se
    ci_50[i,0] = numpy.mean(s_Q[i]) - n_inv_50*se
    ci_50[i,1] = numpy.mean(s_Q[i]) + n_inv_50*se
    ci_25[i,0] = numpy.mean(s_Q[i]) - n_inv_25*se
    ci_25[i,1] = numpy.mean(s_Q[i]) + n_inv_25*se
    ci_10[i,0] = numpy.mean(s_Q[i]) - n_inv_10*se
    ci_10[i,1] = numpy.mean(s_Q[i]) + n_inv_10*se

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

# print(s_Q)
# Convertir a JSON
lists_ci = cis.tolist()
lists = s_Q.tolist()
json_str = json.dumps(lists)

print(mub)
print(lists)
print(lists_ci)
# Graficar
plt.plot(s_Q)
plt.show()

#%%
import matplotlib.pyplot as plt
import matplotlib as mpl
import quandl
import numpy
import pandas as pd
import math
from sklearn.linear_model import LinearRegression
from fredapi import Fred
import json
import pandas_datareader
from scipy.stats import norm

# Obtener la informacion historica del precio para el WTI y calcular sus retornos logaritmicos
mydata = quandl.get("FRED/DCOILWTICO", returns="pandas", authtoken="7gMvGvRq_p7EH3iWZnW5")
# mydata = quandl.get("FRED/DCOILBRENTEU", returns="pandas", authtoken="7gMvGvRq_p7EH3iWZnW5")
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

n = 10
s0 = mydata['Value'][-1]
R = 10
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

# Convertir a JSON
lists = S.tolist()
lists_ci = cis.tolist()
json_str = json.dumps(lists)
print(lists_ci)

# Graficar
plt.plot(S)
plt.show()

# %%
