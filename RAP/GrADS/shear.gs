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
'open /tornado/r1/bmburlin/NCEP/RAP/RAP.ctl'
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

'q time'
  init = subwrd(result,3)
  inittime = substr(init,1,12)
  initday = substr(init,4,2)
  inithr = substr(init,1,3)
  initmonth = substr(init,6,3)
  inityr = substr(init,9,12)

Blevs="1000 6000"
Blevs2="1 6"
Blev=2
while (Blev<=2)
  shear=subwrd(Blevs,Blev)
  km=subwrd(Blevs2,Blev)
  count = 0
  t = 1
  fhr = 0
  inc = 1
  'q file'
    rec=sublin(result,5)
    numbfor=subwrd(rec,12)

  'run colors/colors_BulkShear.gs'

  while (count < numbfor)
    'set t 't
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

    'set grads off'
    if (shear=1000)
      'set clevs 10 15 20 25 30 35 40 45 50 55 60 65 70 75'
      mask=15
    endif
    if (shear=6000)
      'set clevs 30 35 40 45 50 55 60 65 70 75 80 85 90 95'
      mask=30
    endif

    'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34'
    'set gxout shaded'
    'd smth9(sqrt(pow((vuCSH'shear'_0m*1.94384), 2) + pow((vvCSH'shear'_0m*1.94384), 2)))'

  if (model = "glRAP")
    'set rgb 255 128 128 128 100'
    'set line 255 1 0.001'
    'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/counties/dtl_cnty.shp'
  endif
    'set rgb 254   0   3 229 100'
    'set line 254 1 0.01'
    'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/highways/in101503.shp'
    'set line 1 1 1'
    'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/states/dtl_st.shp'

    'set gxout barb'
    'set digsiz 0.03'
    'set cthick 4'
    'set ccolor 1'
    'define uwind=vuCSH'shear'_0m*1.9438444924406'
    'define vwind=vvCSH'shear'_0m*1.9438444924406'
    'd skip(uwind,6,6);maskout(vwind,mag(uwind,vwind)-'mask')'

    'run colorbar/xcbar.gs -direction v -fs 1 -fw .12 -fh .12 -line'
    'set strsiz 0.15'
    'set string 1 l 2'
    'draw string .1 8.25 0-'km'km AGL Wind Shear (kts)'
    'set strsiz 0.11'
    'draw string .1 8.02 Initialized: 'inithr': 'initmonth' 'initday', 'inityr' -- Forecast Hour ['fhr':00]'
    'set string 1 r 1'
    'set strsiz 0.1'
    'draw string 10.95 8.4 Rapid Refresh (RAP) 13km'
    'set strsiz 0.08'
    'draw string 10.95 8.2 Data from NCEP'
    'set strsiz 0.12'
    'set string 1 bl 1'
    'draw string 6.4 0.08 Forecast Valid: 'vhr':'vmin'z: 'vmonth' 'vday', 'vyr
  'set rgb 255 0 0 229'
    'set string 255'
    'set string 255 bl 1'
    'draw string 0.11 0.08 http://derecho.math.uwm.edu/~bmburlin/'
    'gxprint 'fhr'_'km'km_BulkShear.png x800 y600'
    'clear'
    count = count + inc
    t = t + inc
    fhr = fhr + inc

  endwhile
*  '!mv *'km'km_BulkShear.png /tstorm/s0/bmburlin/wrf/POST/NCEP/'model'/images/'km'km_BulkShear'
  '!mv *'km'km_BulkShear.png /tornado/r1/bmburlin/public_html/graphics/'model'/'km'km_BulkShear'
  Blev=Blev+1
endwhile
'quit'
