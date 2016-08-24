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

'q file'
rec=sublin(result,5)
numbfor=subwrd(rec,12)
ee=subwrd(rec,15)

  'q time'
  init = subwrd(result,3)
  inittime = substr(init,1,12)
  initday = substr(init,4,2)
  inithr = substr(init,1,3)
  initmonth = substr(init,6,3)
  inityr = substr(init,9,12)

windlevs="925 850 700 500 250"
wlev=1
while (wlev<=5)
  lev=subwrd(windlevs,wlev)

  count = 0
  t = 1
  fhr = 0
  inc = 3

  'run colors/colors_ULwind.gs'

  while (count < numbfor)
    'set t 't
*  ====================================*
*  ===For the "VALID" forecast hour====*
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
*  ************************************

    'set grads off'
    'set lev 'lev
    if (lev=925)
      'set clevs 5 10 15 20 25 30 35 40 45 50 55 60 65 70 75 80 85 90 95 100'
      mask=5
      contour=30
    endif
    if (lev=850)
      'set clevs 5 10 15 20 25 30 35 40 45 50 55 60 65 70 75 80 85 90 95 100'
      mask=5
      contour=30
    endif
    if (lev=700)
      'set clevs 15 20 25 30 35 40 45 50 55 60 65 70 75 80 85 90 95 100 105 110'
      mask=15
      contour=30
    endif
    if (lev=500)
      'set clevs 25 30 35 40 45 50 55 60 65 70 75 80 85 90 95 100 105 110 115 120'
      mask=25
      contour=60
    endif
    if (lev=250)
      'set clevs 35 40 45 50 55 60 65 70 75 80 90 100 110 120 130 140 150 160 170 180'
      mask=35
      contour=120
    endif
    'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40'
    'set gxout shaded'
    'define magwind=mag(UGRDprs*1.9438444924406,VGRDprs*1.9438444924406)'
    'd magwind'

    'set rgb 254   0   3 229 100'
    'set line 254 1 0.01'
    'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/highways/in101503.shp'
    'set line 1 1 1'
    'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/states/dtl_st.shp'

    'set gxout contour'
    'set ccolor 1'
    'set cthick 4'
    'set cint 'contour
    'set clab masked'
    'set clopts -1 4 0.08'
    'd smth9(HGTprs)'

    'set gxout barb'
    'set digsiz 0.035'
    'set cthick 1'
    'set ccolor 1'
    'define uwind=UGRDprs*1.9438444924406'
    'define vwind=VGRDprs*1.9438444924406'
    'd skip(uwind,5,5);maskout(vwind,mag(uwind,vwind)-'mask')'

*  ===Runs colorbar and prints all text seen on image===*
  'run colorbar/xcbar.gs -direction v -fs 1 -fw .12 -fh .12 -line'
  'set strsiz 0.15'
  'set string 1 l 2'
  'draw string .1 8.25 'lev'mb Isotachs (kts), Wind Barbs (kts), Heights (gpm)'
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
  'gxprint 'fhr'_'lev'_wind.png x800 y600'
  'clear'

    count = count + 1
    t = t + 1
    fhr = fhr + inc

  endwhile
*  '!mv *'lev'_wind.png /tstorm/s0/bmburlin/wrf/POST/NCEP/'model'/images/'lev'_wind'
  '!mv *'lev'_wind.png /tornado/r1/bmburlin/public_html/graphics/'model'/'lev'_wind'
*  **************************************************************************************
  wlev=wlev+1
endwhile
'quit'
