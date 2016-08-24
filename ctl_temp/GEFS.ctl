dset ^data/gep%e.t18z.pgrb2af%f2
index ^data/GEFS.idx
options template
undef 9.999E+20
title GEFS 31 Mar 2015 time: 18z
*  produced by g2ctl v0.0.4n
* griddef=1:0:(360 x 181):grid_template=0:winds(N/S): lat-lon grid:(360 x 181) units 1e-06 input WE:NS output WE:SN res 48 lat 90.000000 to -90.000000 by 1.000000 lon 0.000000 to 359.000000 by 1.000000 #points=65160:winds(N/S)
dtype grib2
ydef 181 linear -90.000000 1
xdef 360 linear 0.000000 1.000000
tdef 31 linear 18Z31Mar2015 360mn
* PROFILE hPa
zdef 10 levels 100000 92500 85000 70000 50000 25000 20000 10000 5000 1000
options pascals
vars 28
CAPE180_0mb  0,108,18000,0   0,7,6 ** 180-0 mb above ground Convective Available Potential Energy [J/kg]
CIN180_0mb  0,108,18000,0   0,7,7 ** 180-0 mb above ground Convective Inhibition [J/kg]
DLWRFsfc   0,1,0   0,5,192,0 ** surface Downward Long-Wave Rad. Flux [W/m^2]
DSWRFsfc   0,1,0   0,4,192,0 ** surface Downward Short-Wave Radiation Flux [W/m^2]
HGTsfc   0,1,0   0,3,5 ** surface Geopotential Height [gpm]
HGTprs    10,100  0,3,5 ** (1000 925 850 700 500.. 250 200 100 50 10) Geopotential Height [gpm]
LHTFLsfc   0,1,0   0,0,10,0 ** surface Latent Heat Net Flux [W/m^2]
PRESsfc   0,1,0   0,3,0 ** surface Pressure [Pa]
PRMSLmsl   0,101,0   0,3,1 ** mean sea level Pressure Reduced to MSL [Pa]
PWATclm   0,200,0   0,1,3 ** entire atmosphere (considered as a single layer) Precipitable Water [kg/m^2]
RHprs    10,100  0,1,1 ** (1000 925 850 700 500.. 250 200 100 50 10) Relative Humidity [%]
RH2m   0,103,2   0,1,1 ** 2 m above ground Relative Humidity [%]
SHTFLsfc   0,1,0   0,0,11,0 ** surface Sensible Heat Net Flux [W/m^2]
SNODsfc   0,1,0   0,1,11 ** surface Snow Depth [m]
SOILW0_10cm  0,106,0,0.1   2,0,192 ** 0-0.1 m below ground Volumetric Soil Moisture Content [Fraction]
TCDCclm   0,200,0   0,6,1,0 ** entire atmosphere (considered as a single layer) Total Cloud Cover [%]
TMPprs    10,100  0,0,0 ** (1000 925 850 700 500.. 250 200 100 50 10) Temperature [K]
TMP2m   0,103,2   0,0,0 ** 2 m above ground Temperature [K]
TMP0_10cm  0,106,0,0.1   0,0,0 ** 0-0.1 m below ground Temperature [K]
UGRDprs    10,100  0,2,2 ** (1000 925 850 700 500.. 250 200 100 50 10) U-Component of Wind [m/s]
UGRD10m   0,103,10   0,2,2 ** 10 m above ground U-Component of Wind [m/s]
ULWRFsfc   0,1,0   0,5,193,0 ** surface Upward Long-Wave Rad. Flux [W/m^2]
ULWRFtoa   0,8,0   0,5,193,0 ** top of atmosphere Upward Long-Wave Rad. Flux [W/m^2]
USWRFsfc   0,1,0   0,4,193,0 ** surface Upward Short-Wave Radiation Flux [W/m^2]
VGRDprs    10,100  0,2,3 ** (1000 925 850 700 500.. 250 200 100 50 10) V-Component of Wind [m/s]
VGRD10m   0,103,10   0,2,3 ** 10 m above ground V-Component of Wind [m/s]
VVEL850mb   0,100,85000   0,2,8 ** 850 mb Vertical Velocity (Pressure) [Pa/s]
WEASDsfc   0,1,0   0,1,13 ** surface Water Equivalent of Accumulated Snow Depth [kg/m^2]
ENDVARS
EDEF 20
 01 31  18Z31Mar2015 3,1
 02 31  18Z31Mar2015 3,2
 03 31  18Z31Mar2015 3,3
 04 31  18Z31Mar2015 3,4
 05 31  18Z31Mar2015 3,5
 06 31  18Z31Mar2015 3,6
 07 31  18Z31Mar2015 3,7
 08 31  18Z31Mar2015 3,8
 09 31  18Z31Mar2015 3,9
 10 31  18Z31Mar2015 3,10
 11 31  18Z31Mar2015 3,11
 12 31  18Z31Mar2015 3,12
 13 31  18Z31Mar2015 3,13
 14 31  18Z31Mar2015 3,14
 15 31  18Z31Mar2015 3,15
 16 31  18Z31Mar2015 3,16
 17 31  18Z31Mar2015 3,17
 18 31  18Z31Mar2015 3,18
 19 31  18Z31Mar2015 3,19
 20 31  18Z31Mar2015 3,20
ENDEDEF
