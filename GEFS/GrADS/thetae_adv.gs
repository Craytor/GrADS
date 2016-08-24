function main(args)
*======================================================================================
* Script created by: Bryan Burlingame - (2013-2014)
***************************************************************************************

latmin=subwrd(args,1)
latmax=subwrd(args,2)
lonmin=subwrd(args,3)
lonmax=subwrd(args,4)

'reinit'
'set display color white'
'open /tornado/r1/bmburlin/NCEP/GEFS/GEFS.ctl'
'set vpage 0 11.0 0 8.5'
'set parea 0.1 10.1 .3 7.9'
'set mpdraw on'
'set mpdset hires'
'set mpt 0 1 1 1'
'set mpt 1 1 1 1'
'set mpt 2 1 1 1'
'set xlab off'
'set ylab off'
'set grid off'
'set mproj scaled'
'set lat 'latmin ' 'latmax
'set lon 'lonmin ' 'lonmax

count = 0
t = 1
fhr = 0
inc = 6
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
'set e 1 'ee
  'theta=tmpprs*pow((1000/850),0.286)'
  'es=6.1173*exp(((2.501*pow(10,6))/461.50)*(1/273.16 - 1/tmpprs))'
  'ws=621.97*(es/(85000-es))'
  'w=(rhprs*ws)/(100*1000)'
  'thetae=(tmpprs+((2.501*pow(10,6))/1004)*w)*pow((1000/850),0.286)'
  'vwnd=vgrdprs'
  'uwnd=ugrdprs'
  'pi=3.14159'
  'dtr=pi/180'
  'a=6.37122e6'
  'dy=cdiff(lat,y)*dtr*a'
  'dx=cdiff(lon,x)*dtr*a*cos(lat*dtr)'
  'dtdx=cdiff(thetae,x)/dx'
  'dtdy=cdiff(thetae,y)/dy'
  'define tadv=(-uwnd*dtdx-vwnd*dtdy)*100000'
'set e 1'
*
'set clevs -70 -65 -60 -55 -50 -45 -40 -35 -30 -25 -20 -15 -10 -5 0 5 10 15 20 25 30 35 40 45 50 55 60 65 70'
'set ccols 21 22 23 24 25 26 27 28 29 30 31 32 33 35 50 0 51 36 37 38 39 40 41 42 43 44 45 46 47 48 49'
'set gxout shaded'
'd ave(tadv,e=1,e='ee')'
*
'set gxout contour'
'set cthick 4'
'set ccolor 1'
'set clopts 1 4 .08' 
'set clab masked'
'set cint 4'
'd ave(thetae,e=1,e='ee')'
*
'set gxout barb'
'set digsiz 0.02'
'set cthick 5'
'set ccolor 1'
    'set e 1 'ee
      'define uwind=UGRDprs*1.9438444924406'
      'define vwind=VGRDprs*1.9438444924406'
    'set e 1'
    'd skip(ave(uwind,e=1,e='ee'),7,7);maskout(ave(vwind,e=1,e='ee'),mag(ave(uwind,e=1,e='ee'),ave(vwind,e=1,e='ee'))-10)'
*
*====================================*

*===================================*
*===Runs colorbar and prints all text seen on image===*
  'run colorbar/xcbar.gs -direction v -fw .12 -fh .12 -line on'
  'set strsiz 0.15'
  'set string 1 l 2'
  'draw string .1 8.25 850mb `3z`1-e Surfaces and Advection (K/Hr), Winds (knts)'
  'set strsiz 0.11'
  'draw string .1 8.02 Initialized: 'inithr': 'initmonth' 'initday', 'inityr' -- Forecast Hour ['fhr':00]'
  'set string 1 r 1'
  'set strsiz 0.1'
  'draw string 10.95 8.4 GFS Ensemble Forecast System (GEFS) 1`ao`n'
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

  count = count + 1
  t = t + 1
  fhr = fhr + inc

endwhile

*'!mv *thetae_adv.png /tstorm/s0/bmburlin/wrf/POST/NCEP/GEFS/images/thetae_adv'
'!mv *thetae_adv.png /tornado/r1/bmburlin/public_html/graphics/GEFS/thetae_adv'
***************************************************************************************
'quit'
