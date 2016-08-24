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
'open /tornado/r1/bmburlin/NCEP/HRRR/HRRR.ctl'
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
inc = 1
'q file'
rec=sublin(result,5)
numbfor=subwrd(rec,12)
ee=subwrd(rec,15)
***************************************************************************************

*======================================================================================
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

'run colors/colors_precip.gs'

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

  'set grads off'
  'set clevs  0.01 0.02 0.04 0.06 0.08 0.1 0.15 0.2 0.25 0.3 0.35 0.4 0.45 0.5 0.6 0.7 0.8 0.9 1 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0 2.25 2.5 2.75 3 3.5 4 4.5 5 6 7 8 9 10'
  'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62'
  'set gxout shaded'
  if (t = 1)
   'd APCPsfc*0'
  else
   'define prec=APCPsfc/25.4'
   'd prec'
  endif

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

*===For the point forecast display===*
if (model = "glHRRR" )
 if (t > 1)
  istat = 0               
  while (istat != 2)      
    data = read("/tornado/r1/bmburlin/NCEP/misc/gfslampcities.txt")
    istat = sublin(data,1) 
    if (istat = 2)         
      break                 
    endif                  
    line = sublin(data,2)   
    station_lat = subwrd(line,1)
    station_lon = subwrd(line,2)
    'q w2xy 'station_lon' 'station_lat
    xx = subwrd(result,3) ; yy = subwrd(result,6)
    'set lon 'station_lon ; 'set lat 'station_lat
    'd prec'
    value = subwrd(result,4)
    if (station_lat > (latmin+0.05) & station_lat < (latmax-0.05))
      if (station_lon > (lonmin+0.05) & station_lon < (lonmax-0.05))
        if (value < 200 & value > -100)
          print_value = math_format("%0.2f",value)
          if (model = "HRRR")
            'set string 1 c 4'
            'set strsiz 0.06 0.06'
          else
            'set string 1 c 6'
            'set strsiz 0.1 0.1'
          endif
          'draw string 'xx' 'yy' 'print_value
        endif
      endif
    endif
  endwhile
  rc = close("/tornado/r1/bmburlin/NCEP/misc/gfslampcities.txt")

  'set lat 'latmin ' 'latmax
  'set lon 'lonmin ' 'lonmax
 endif
endif
*************************************

*===================================*
*===Runs colorbar and prints all text seen on image===*
  if (t=1)
   else
    'run colorbar/xcbar.gs -direction v -fs 2 -fw .12 -fh .12 -line'
   endif
  'set strsiz 0.15'
  'set string 1 l 2'
  'draw string .1 8.25 Hourly Precipitation (inches)'
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
  'gxprint 'fhr'_precip_hourly.png x800 y600'
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
*'!mv *precip_hourly.png /tstorm/s0/bmburlin/wrf/POST/NCEP/'model'/images/precip_hourly'
'!mv *precip_hourly.png /tornado/r1/bmburlin/public_html/graphics/'model'/precip_hourly'
***************************************************************************************
'quit'
