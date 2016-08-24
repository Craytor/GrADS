function main(args)
*======================================================================================
* Script created by: Bryan Burlingame - (2013-2014)
***************************************************************************************

*=====================READS IN ARGUMENTS FROM Autorun_WRF.sh===========================
latmin=subwrd(args,1)
latmax=subwrd(args,2)
lonmin=subwrd(args,3)
lonmax=subwrd(args,4)
model=subwrd(args,5)

'reinit'
'set display color white'
'open /tornado/r1/bmburlin/NCEP/HRRR/HRRR.ctl'
'set vpage 0 11.0 0 8.5'
'set parea 0.1 10.1 .3 7.9'
'set mpdraw on'
'set mpdset hires'
'set mpt 0 1 1 1'
'set mpt 1 1 1 1'
'set mpt 2 1 1 1'
'set mpt 2 1 1 4'
'set xlab off'
'set ylab off'
'set grid off'
'set mproj scaled'
'set lat 'latmin ' 'latmax
'set lon 'lonmin ' 'lonmax

count = 0
t = 1
fhr = 0
inc = 1
'q file'
rec=sublin(result,5)
numbfor=subwrd(rec,12)
ee=subwrd(rec,15)

*==================GET THE FIRST TIME STAMP FOR THE MODEL RUN==========================
'set t 1'
'q time'
init = subwrd(result,3)
inittime = substr(init,1,12)
initday = substr(init,4,2)
inithr = substr(init,1,3)
initmonth = substr(init,6,3)
inityr = substr(init,9,12)
***************************************************************************************

*===============================RUN THE COLOR SCRIPT===================================
'run colors/EPTadvection_colors.gs'
***************************************************************************************

*======================================================================================
*============START THE WHILE LOOP TO CREATE ALL IMAGES AT EVERY TIME-STEP==============
while (count < numbfor)
  'set t 't
*====================================*
*===For the "VALID" forecast hour====*
  'q time'
  res = subwrd(result,3)
  Z_temp = substr(res,3,1)

  if (Z_temp = Z )
    vtime = substr(res,1,12)
    vhr = substr(vtime,1,2)
    vmonth = substr(vtime,6,3)
    vday = substr(vtime,4,2)
    vyr = substr(vtime,9,12)
    vmin = 00
  else
    vtime = substr(res,1,15)
    vhr = substr(vtime,1,2)
    vmonth = substr(vtime,9,3)
    vday = substr(vtime,7,2)
    vyr = substr(vtime,12,12)
    vmin = substr(vtime,4,2)
  endif
*************************************
***Calculate Theta and Theta-e***
'set grads off'
'set lev 850'
'theta=tmpprs*pow((1000/850),0.286)'
'es=6.1173*exp(((2.501*pow(10,6))/461.50)*(1/273.16 - 1/tmpprs))'
'ws=621.97*(es/(85000-es))'
'w=(rhprs*ws)/(100*1000)'
'thetae=(tmpprs+((2.501*pow(10,6))/1004)*w)*pow((1000/850),0.286)'
*
'hgt=hgtprs'
'tmp=thetae'
'vwnd=vgrdprs'
'uwnd=ugrdprs'
'pi=3.14159'
'dtr=pi/180'
'a=6.37122e6'
'omega=7.2921e-5'
'g=9.8'
'R=287'

'define f=2*omega*sin(lat*dtr)'
'define p=85000'

'dy=cdiff(lat,y)*dtr*a'
'dx=cdiff(lon,x)*dtr*a*cos(lat*dtr)'

'dhgtx=cdiff(hgt,x)'
'dhgty=cdiff(hgt,y)'

'define ug=-1*(g/f)*(dhgty/dy)'
'define vg=(g/f)*(dhgtx/dx)'

'define ua=uwnd-ug'
'define va=vwnd-vg'

'dugx=cdiff(ug,x)'
'dugy=cdiff(ug,y)'
'dvgx=cdiff(vg,x)'
'dvgy=cdiff(vg,y)'

'dtdx=cdiff(thetae,x)/dx'
'dtdy=cdiff(thetae,y)/dy'

'define tadv=(-uwnd*dtdx-vwnd*dtdy)*100000'
*
'set clevs -70 -65 -60 -55 -50 -45 -40 -35 -30 -25 -20 -15 -10 -5 0 5 10 15 20 25 30 35 40 45 50 55 60 65 70'
'set ccols 21 22 23 24 25 26 27 28 29 30 31 32 33 35 50 0 51 36 37 38 39 40 41 42 43 44 45 46 47 48 49'
'set gxout shaded'
'd tadv'

  if (model = "glHRRR")
    'set rgb 255 128 128 128 100'
    'set line 255 1 0.001'
    'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/counties/dtl_cnty.shp'
  endif
    'set rgb 254   0   3 229 100'
    'set line 254 1 0.01'
    'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/highways/in101503.shp'
    'set line 1 1 1'
    'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/states/dtl_st.shp'

*
  'set gxout contour'
  'set cthick 4'
  'set ccolor 1'
  'set clopts 1 4 .08' 
  'set clab masked'
  if (model = "glHRRR")
    'set cint 2'
  else
    'set cint 4'
  endif
  'd smth9(smth9(smth9(thetae)))'

  'set gxout barb'
  'set digsiz 0.035'
  'set cthick 4'
  'set ccolor 1'
  'define uwind=ugrdprs * 1.9438444924406'
  'define vwind=vgrdprs * 1.9438444924406'
  if (model = "glHRRR")
    'd skip(uwind,15,15);maskout(vwind,mag(uwind,vwind)-10)'
  else
    'd skip(uwind,25,25);maskout(vwind,mag(uwind,vwind)-10)'
  endif

  'run colorbar/xcbar.gs -direction v -fw .12 -fh .12 -line on'
  'set strsiz 0.15'
  'set string 1 l 2'
  'draw string .1 8.25 850mb `3z`1-e Surfaces and Advection (K/Hr), Winds (knts)'
  'set strsiz 0.11'
  'draw string .1 8.02 Initialized: 'inithr': 'initmonth' 'initday', 'inityr' -- Forecast Hour ['fhr':00]'
  'set string 1 r 1'
  'set strsiz 0.1'
  'draw string 10.95 8.4 High Resolution Rapid Refresh (HRRR) 3km'
  'set strsiz 0.08'
  'draw string 10.95 8.2 Data from NCEP'
  'set strsiz 0.12'
  'set string 1 bl 1'
  'draw string 6.4 0.08 Forecast Valid: 'vhr':'vmin'z: 'vmonth' 'vday', 'vyr
  'set rgb 255 0 0 229'
  'set string 255'
  'set string 255 bl 1'
  'draw string 0.11 0.08 http://derecho.math.uwm.edu/~bmburlin/'
  'gxprint 'fhr'_thetae_adv.png x800 y600'
  'clear'
*************************************

*===================================*
*===For the forecast hour, valid time, and while loop===*
  count = count + inc
  t = t + inc
  fhr = fhr + inc
*************************************

endwhile
***************************************************************************************

*======================================================================================
*======================MOVE ALL IMAGES TO IMAGES DIRECTORY=============================
*'!mv *thetae_adv.png /tstorm/s0/bmburlin/wrf/POST/NCEP/'model'/images/thetae_adv'
'!mv *thetae_adv.png /tornado/r1/bmburlin/public_html/graphics/'model'/thetae_adv'
***************************************************************************************
'quit'
