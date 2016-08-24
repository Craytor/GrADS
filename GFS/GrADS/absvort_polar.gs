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
'set mproj nps'
'set lat 'latmin ' 'latmax
'set lon 'lonmin ' 'lonmax

'q file'
rec=sublin(result,5)
numbfor=subwrd(rec,12)
ee=subwrd(rec,15)
***************************************************************************************
'q time'
  init = subwrd(result,3)
  inittime = substr(init,1,12)
  initday = substr(init,4,2)
  inithr = substr(init,1,3)
  initmonth = substr(init,6,3)
  inityr = substr(init,9,12)

count = 0
t = 1
fhr = 0
inc = 3

'run colors/vort_colors.gs'

while (count < numbfor)
  'set t 't
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
  'set lev 500'
  'set clevs 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60'
  'set ccols 0 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 100 101 102 103 104 105 106'
  'set gxout shaded'
  'define coriol=2*7.29e-5*sin(lat*3.1415/180)'
  'd (100000*hcurl(ugrdprs,vgrdprs))+coriol'

  'set rgb 254   0   3 229 100'
  'set line 254 1 0.01'
  'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/highways/in101503.shp'
  'set line 1 1 1'
  'draw shp /tornado/r1/bmburlin/NCEP/misc/shapefiles/states/dtl_st.shp'

  'set gxout contour'
  'set ccolor 1'
  'set cthick 4'
  'set cint 60'
  'set clab masked'
  'set clopts -1 4 0.08'
  'd smth9(HGTprs)'

*  ===Runs colorbar and prints all text seen on image===*
  'run colorbar/xcbar.gs -direction v -fs 5 -fw .12 -fh .12 -line'
  'set strsiz 0.15'
  'set string 1 l 2'
  'draw string .1 8.25 500mb Absolute Vorticity (s`a-1`n) & Heights (gpm)'
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
  'gxprint 'fhr'_500_absvort_polar.png x800 y600'
  'clear'

  count = count + 1
  t = t + 1
  fhr = fhr + inc

endwhile
*  '!mv *500_absvort_polar.png /tstorm/s0/bmburlin/wrf/POST/NCEP/GEFS/images/500_absvort_polar'
  '!mv *500_absvort_polar.png /tornado/r1/bmburlin/public_html/graphics/'model'/500_absvort_polar'
'quit'
