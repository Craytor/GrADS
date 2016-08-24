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

'q file'
  rec=sublin(result,5)
  numbfor=subwrd(rec,12)
  ee=subwrd(rec,15)
***************************************************************************************
***************************************************************************************
***************************************************************************************
*  ==================GET THE FIRST TIME STAMP FOR THE MODEL RUN==========================
  'q time'
    init = subwrd(result,3)
    inittime = substr(init,1,12)
    initday = substr(init,4,2)
    inithr = substr(init,1,3)
    initmonth = substr(init,6,3)
    inityr = substr(init,9,12)

templevs="925 850 700 500 250"
tlev=1
while (tlev<=5)
  lev=subwrd(templevs,tlev)
  count = 0
  t = 1
  fhr = 0
  inc = 6

*  ===============================RUN THE COLOR SCRIPT===================================
   'run colors/colors_'lev'_temp.gs'

*  ============START THE WHILE LOOP TO CREATE ALL IMAGES AT EVERY TIME-STEP==============
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
    'set lev 'lev
    if (lev=925)
      'set clevs  -30 -29 -28 -27 -26 -25 -24 -23 -22 -21 -20 -19 -18 -17 -16 -15 -14 -13 -12 -11 -10 -9 -8 -7 -6 -5 -4 -3 -2 -1 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40'
      'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91'
      mask=5
      contour=30
    endif
    if (lev=850)
      'set clevs  -30 -29 -28 -27 -26 -25 -24 -23 -22 -21 -20 -19 -18 -17 -16 -15 -14 -13 -12 -11 -10 -9 -8 -7 -6 -5 -4 -3 -2 -1 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30'
      'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81'
      mask=5
      contour=30
    endif
    if (lev=700)
      'set clevs  -30 -29 -28 -27 -26 -25 -24 -23 -22 -21 -20 -19 -18 -17 -16 -15 -14 -13 -12 -11 -10 -9 -8 -7 -6 -5 -4 -3 -2 -1 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30'
      'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81'
      mask=15
      contour=60
    endif
    if (lev=500)
      'set clevs  -40 -39 -38 -37 -36 -35 -34 -33 -32 -31 -30 -29 -28 -27 -26 -25 -24 -23 -22 -21 -20 -19 -18 -17 -16 -15 -14 -13 -12 -11 -10 -9 -8 -7 -6 -5 -4 -3 -2 -1 0'
      'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61'
      mask=25
      contour=60
    endif
    if (lev=250)
      'set clevs  -70 -69 -68 -67 -66 -65 -64 -63 -62 -61 -60 -59 -58 -57 -56 -55 -54 -53 -52 -51 -50 -49 -48 -47 -46 -45 -44 -43 -42 -41 -40 -39 -38 -37 -36 -35 -34 -33 -32 -31 -30'
      'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61'
      mask=35
      contour=120
    endif
    'set gxout shaded'
    'd ave(tmpprs,e=1,e='ee')-273.16'
*
    'set gxout contour'
    'set ccolor 1'
    'set cthick 6'
    'set cint 'contour
    'set clab masked'
    'set clopts -1 4 0.08'
    'd ave(HGTprs,e=1,e='ee')'
*
    'set gxout barb'
    'set digsiz 0.02'
    'set cthick 5'
    'set ccolor 1'
    'set e 1 'ee
      'define uwind=UGRDprs*1.9438444924406'
      'define vwind=VGRDprs*1.9438444924406'
    'set e 1'
    'd skip(ave(uwind,e=1,e='ee'),7,7);maskout(ave(vwind,e=1,e='ee'),mag(ave(uwind,e=1,e='ee'),ave(vwind,e=1,e='ee'))-'mask')'

*  ===Runs colorbar and prints all text seen on image===*
    'run colorbar/xcbar.gs -direction v -fs 2 -fw .12 -fh .12'
    'set strsiz 0.15'
    'set string 1 l 2'
    'draw string .1 8.25 'lev'mb Temperature (`ao`nC), Wind Barbs (kts), Heights (gpm)'
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
    'gxprint 'fhr'_'lev'_temp.png x800 y600'
    'clear'

    count = count + 1
    t = t + 1
    fhr = fhr + inc
  endwhile

*  ======================MOVE ALL IMAGES TO IMAGES DIRECTORY=============================
*  '!mv *'lev'_temp.png /tstorm/s0/bmburlin/wrf/POST/NCEP/GEFS/images/'lev'_temp'
  '!mv *'lev'_temp.png /tornado/r1/bmburlin/public_html/graphics/GEFS/'lev'_temp'
  tlev=tlev+1
endwhile
'quit'
