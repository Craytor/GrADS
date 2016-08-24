function main(args)
*======================================================================================
* Script created by: Bryan Burlingame - (2013-2014)
***************************************************************************************

latmin=subwrd(args,1)
latmax=subwrd(args,2)
lonmin=subwrd(args,3)
lonmax=subwrd(args,4)
model=subwrd(args,5)

'reinit'
'set display color white'
'open /tornado/r1/bmburlin/NCEP/GFS/GFS.ctl'
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
inc = 3
'q file'
rec=sublin(result,5)
numbfor=subwrd(rec,12)

'set t 1'
'q time'
init = subwrd(result,3)
inittime = substr(init,1,12)
initday = substr(init,4,2)
inithr = substr(init,1,3)
initmonth = substr(init,6,3)
inityr = substr(init,9,12)

'run colors/colors_2m_dewpoint.gs'

while (count < numbfor)
  'set t 't

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

  'set grads off'
  'set clevs 0 2 4 6 8 10 12 14 16 18 20 22 24 26 28 30 32 34 36 38 40 42 44 46 48 50 52 54 56 58 60 62 64 66 68 70 72 74 76 78 80 82 84 86 88 90'
  'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66'
  'set gxout shaded'
  'define dewpoint=(DPT2m-273.16)*(9/5)+32'
  'd dewpoint'

  'set rgb 254   0   3 229 100'
  'set line 254 1 0.01'
  'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/highways/in101503.shp'
  'set line 1 1 1'
  'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/states/dtl_st.shp'

*  'set gxout contour'
*  'set cint 4'
*  'set ccolor 1'
*  'set cthick 0.6'
*  'set clopts -1 2 0.08'
*  'set clab masked'
*  'set csmooth on'
*  'd dewpoint'

  'set gxout barb'
  'set digsiz 0.03'
  'set cthick 5'
  'set ccolor 1'
  'define uwind=UGRD10m*1.9438444924406'
  'define vwind=VGRD10m*1.9438444924406'
  'd skip(uwind,7,7);maskout(vwind,mag(uwind,vwind)-6)'
*
*===Runs colorbar and prints all text seen on image===*
  'run colorbar/xcbar.gs -direction v -fs 5 -fw .12 -fh .12'
  'set strsiz 0.15'
  'set string 1 l 2'
  'draw string .1 8.25 2m Dewpoint (F) and 10m Wind Barbs (kts)'
  'set strsiz 0.11'
  'draw string .1 8.02 Initialized: 'inithr': 'initmonth' 'initday', 'inityr' -- Forecast Hour ['fhr':00]'
  'set string 1 r 1'
  'set strsiz 0.1'
  'draw string 10.95 8.4 Global Forecast System (GFS) 0.25`ao`n'
  'set strsiz 0.08'
  'draw string 10.95 8.2 Data from NCEP'
  'set strsiz 0.12'
  'set string 1 bl 1'
  'draw string 6.4 0.08 Forecast Valid: 'vhr':'vmin'z: 'vmonth' 'vday', 'vyr
  'set rgb 255 0 0 229'
  'set string 255'
  'set string 255 bl 1'
  'draw string 0.11 0.08 http://derecho.math.uwm.edu/~bmburlin/'
  'gxprint 'fhr'_2m_dpt.png x800 y600'
  'clear'
*************************************

  count = count + 1
  t = t + 1
  fhr = fhr + inc

endwhile
*'!mv *2m_dpt.png /tstorm/s0/bmburlin/wrf/POST/NCEP/'model'/images/2m_dpt'
'!mv *2m_dpt.png /tornado/r1/bmburlin/public_html/graphics/'model'/2m_dpt'
***************************************************************************************
'quit'
