#%%
import matplotlib.pyplot as plt
import matplotlib as mpl
import pandas as pd
import numpy
import math
import json
import quandl
import statistics
from fredapi import Fred
import pandas_datareader

# Obtener la informacion historica del precio para el WTI y calcular sus retornos logaritmicos
mydata = quandl.get("FRED/DCOILWTICO", returns="pandas", authtoken="7gMvGvRq_p7EH3iWZnW5")
# mydata = quandl.get("FRED/DCOILBRENTEU", returns="pandas", authtoken="7gMvGvRq_p7EH3iWZnW5")
df1 = numpy.log(mydata / mydata.shift(1))
df1.columns = df1.columns.map(lambda x: x.replace('Value', 'Log-Return'))
df = pd.concat([mydata, df1], axis=1)

# Calcular la volatilidad del activo
sigma = (numpy.std(df['Log-Return'][1:]))*math.sqrt(252)
# sigma = (df.var()['Log-Return'])*math.sqrt(252)
print(sigma)

# Tasa libre de riesgo
fred = Fred(api_key="b6a7119857170bd5943832561d969285")
series = fred.get_series_latest_release('TB3MS')
data = pd.DataFrame(data=series)
rf = (data[0].values[-1])

# Calcular Drift
drift = ((df['Log-Return'].mean())*252)+(0.5*(sigma**2))

# Simulacion de Montecarlo con probabilidades neutrales al riesgo y R caminos
n = 252
R = 100
s0 = df['Value'].values[-1]
dt = 1/252
sqrt_dt = math.sqrt(dt)
s_Q = numpy.zeros((n+1, R))
s_Q[0,:]=s0
for i in range(1,n+1):
    s_Q[i,:]=s_Q[i-1,:]*(numpy.exp((rf-sigma**2/2)*dt+sigma*numpy.random.normal(size=(1,R))*math.sqrt(dt)))

# print(s_Q)
# Convertir a JSON
lists = s_Q.tolist()
print(lists)
json_str = json.dumps(lists)

# Graficar
plt.plot(s_Q)
plt.show()

# %%
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

n = 252
s0 = mydata['Value'][-1]
R = 100
S = numpy.zeros((n+1, R))
S[0,:] = s0
for i in range(1, n+1):
    S[i,:] = m*(1-numpy.exp(-eta)) + numpy.exp(-eta)*S[i-1,:] + numpy.random.normal(0, sigma_e, size=(R))

print(S)
# Convertir a JSON
lists = S.tolist()
json_str = json.dumps(lists)

# Graficar
plt.plot(S)
plt.show()

# %%
