function main(args)
*======================================================================================
* Script created by: Bryan Burlingame - (Sept, 2014)
***************************************************************************************

lat=subwrd(args,1)
lon=subwrd(args,2)
city=subwrd(args,3)
state=subwrd(args,4)
model=subwrd(args,5)

'reinit'
'open /tornado/r1/bmburlin/NCEP/HRRR/HRRR.ctl'
'set display color white'
'set vpage 0 11 0 8.5'
'q file'
  rec=sublin(result,5)
  maxtime=subwrd(rec,12)
  ee=subwrd(rec,15)
'set lat 'lat
'set lon 'lon
'set rgb 16 250 60 60 150'

'q time'
  init = subwrd(result,3)
  inittime = substr(init,1,12)
  initday = substr(init,4,2)
  inithr = substr(init,1,3)
  initmonth = substr(init,6,3)
  inityr = substr(init,9,12)

'set t 'maxtime
'q time'
  res = subwrd(result,3)
  vtime = substr(res,1,12)
  vhr = substr(vtime,1,3)
  vmonth = substr(vtime,6,3)
  vday = substr(vtime,4,2)
  vyr = substr(vtime,9,12)

'set t 1 'maxtime
'set grads off'
setcols()
***************************************************************************************

*======================================================================================
*=======First plot --- RH contours and shading, temperature (F) --- 1013-200 mb========
'!echo Plot 1'
'set parea 1.7 10.5 6.5 8.2'
'set grid on 3 15 2'
'set xlab on'
'set xlopts 1 0 0'
*Avoids warning printed to screen*
'set lev 1000 300'
'define ttc=((TMPprs-273.15)*(9/5)+32)'
**********************************
'set lev 1050 300'

'set gxout shaded'
'set clopts 15 -1 0.08'
'set clskip 1 3.5'
'set clevs 5 10 15 20 25 30 35 40 45 50 55 60 65 70 75 80 85 90 95 100'
'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40'
'set ylint 100'
'set ylpos 0 l'
'set ylopts 1 1 0.08'
'd rhprs'
'run colorbar/xcbar.gs 10.55 10.7 6.5 8.2 -direction v -fs 1 -fw .08 -fh .08 -line'

'set frame off'
'set ylab off'
'set xlab off'
'set grid off'

'set gxout contour'
'set cthick 5'
'set clopts 1 6 0.08'
'set clab masked'
'set clevs -80 -60 -40 -20 0 10 20 30 40 50 60 70 80 90 100 110 120'
'set ccols 1'
'd ttc'

'set gxout contour'
'set cthick 2'
'set cstyle 3'
'set clopts 4 6 0.08'
'set clab masked'
'set clevs 32'
'set ccols 4'
'd ttc'

'set string 1 c 3'
'set strsiz 0.08'
'draw string 0.75 7.6 Temperature (F)'
'set strsiz 0.06'
'draw string 0.75 7.48 (Contours)'
'set strsiz 0.08'
'draw string 0.75 7.2 Relative Humidity'
'set string 3 c 3'
'set strsiz 0.06'
'draw string 0.75 7.08 (Shaded)'
*======================================================================================

'set z 1'
'set frame on'

*======================================================================================
*=======Second plot --- Dewpoint (F), temperature (F) --- ========
'!echo Plot 2'
'set parea 1.7 10.5 5.5 6.5'
'set grid on 3 15 2'
'set xlab on'
'set xlopts 1 0 0'

* ===Get Max and Min 2m temp in F===
'set gxout stat'
'define tempF=(tmp2m-273.16)*(9/5)+32'
'd tempF'
rec=sublin(result,8)
  minval=subwrd(rec,4)-2
  maxval=subwrd(rec,5)+5
'define dewF=(DPT2m-273.15)*(9/5)+32'
'd dewF'
rec=sublin(result,8)
  minvalDPT=subwrd(rec,4)-5
*==================================

'set frame off'
'set ylab off'

'set datawarn off'
'set vrange 'minvalDPT' 'maxval
'set gxout linefill'
set_linefill()

'set frame on'
'set xlab off'
'set ylab on'

'set gxout line'
'set ylint 8'
'set ylpos 0 l'
'set ylopts 1 1 0.08'
'set cthick 5'
'set ccolor 15'
'set cmark 8'
'd tempF'

'set grid off'
'set frame off'
'set ylab off'

'set gxout line'
'set cthick 3'
'set ccolor 1'
'set cmark 2'
'set digsize 0.05'
'd (DPT2m-273.15)*(9/5)+32'

'set string 4 c 3'
'set strsiz 0.08'
'draw string 0.75 6.3 2m Temperature (F)'
'set strsiz 0.07'
  val = maxval-5
  fmt = '%-4.1f'
  maxTMP = math_format(fmt,val)
'draw string 0.75 6.15 MAX: 'maxTMP'F'
  val = minval+5
  fmt = '%-4.1f'
  minTMP = math_format(fmt,val)
'draw string 0.75 6.05 MIN: 'minTMP'F'

'set string 1 c 3'
'set strsiz 0.08'
'draw string 0.75 5.8 2m Dewpoint (F)'
*======================================================================================

'set z 1'
'set frame on'

*======================================================================================
*=======Third plot --- MSLP & Thickness --- ========
'!echo Plot 3'
'set parea 1.7 10.5 4.5 5.5'
'set grid on 3 15 2'
'set xlab on'
'set xlopts 1 0 0'
'set ylab on'

*===Get Max and Min slp===
'set gxout stat'
'define p=PRMSLmsl/100'
'd p'
rec=sublin(result,8)
  minval=subwrd(rec,4)-4
  maxval=subwrd(rec,5)+4
*==================================

'set gxout line'
'set vrange 'minval' 'maxval
'set cthick 6'
'set ccolor 4'
'set cmark 0'
'set ylint 4'
'set ylpos 0 l'
'set ylopts 1 1 0.08'
'd PRMSLmsl/100'

'set frame off'
'set grid off'  
'set xlab off'

*===Get Max and Min Thickness===
'set gxout stat'
'define thickness = (HGTprs(lev=500)-HGTprs(lev=1000))/10'
'd thickness'
rec=sublin(result,8)
  minval=subwrd(rec,4)-10
  maxval=subwrd(rec,5)+10
*==================================

'set gxout line'
'set vrange 'minval' 'maxval
'set cthick 6'
'set ccolor 5'
'set cmark 4'
'set ylint 8'
'set ylpos 0 r'
'set ylopts 1 1 0.08'
'set digsize 0.03'
'define thickness = (HGTprs(lev=500)-HGTprs(lev=1000))/10'
'd thickness' 

'set string 4 c 3'
'set strsiz 0.08'
'draw string 0.75 5.1 MSLP (mb)'
'set string 5 c 3'
'set strsiz 0.08'
'draw string 0.75 4.9 1000-500mb'
'draw string 0.75 4.75 Thickness (dm)'
*======================================================================================

'set z 1'
'set frame on'

*======================================================================================
*=======Fourth plot --- Winds --- ========
'!echo Plot 4'
'set parea 1.7 10.5 3.0 4.5'
'set grid on 3 15 2'
'set xlab on'
'set xlopts 1 0 0'
'set ylab on'

'set lev 850'
*===Get Max and Min Wind===
'set gxout stat'
'define wind=mag(UGRDprs*1.9438444924406,VGRDprs*1.9438444924406)'
'd wind'
rec=sublin(result,8)
  minval=subwrd(rec,4)-5
  maxval=subwrd(rec,5)+5
*==================================

'set z 1'
'set gxout line'
'set vrange -1 'maxval
'set cthick 3'
'set ccolor 101'
'set cmark 2'
'set ylint 5'
'set ylpos 0 l'
'set ylopts 101 1 0.08'
'set digsize 0.03'
'define wind=mag(UGRD10m*1.9438444924406,VGRD10m*1.9438444924406)'
'd wind'

'set frame off'
'set grid off'
'set xlab off'
'set ylab off'

'set lev 850'
'set gxout line'
'set vrange -1 'maxval
'set cthick 3'
'set ccolor 103'
'set cmark 2'
'set digsize 0.03'
'define wind=mag(UGRDprs*1.9438444924406,VGRDprs*1.9438444924406)'
'd wind'

'set ylab on'

'set lev 300'
*===Get Max and Min Wind===
'set gxout stat'
'define wind=mag(UGRDprs*1.9438444924406,VGRDprs*1.9438444924406)'
'd wind'
rec=sublin(result,8)
  minval=subwrd(rec,4)-5
  maxval=subwrd(rec,5)+8
*==================================

'set gxout line'
'set vrange -4 'maxval
'set cthick 3'
'set ccolor 105'
'set cmark 2'
'set ylint 15'
'set ylpos 0 r'
'set ylopts 104 1 0.08'
'set digsize 0.03'
'define wind=mag(UGRDprs*1.9438444924406,VGRDprs*1.9438444924406)'
'd wind'

'set ylab off'

'set z 1'
'set gxout barb'
'set vrange -2 8'
'set cthick 3'
'set ccolor 100'
'set digsize 0.03'
'd const(UGRD10m*1.9438444924406,0); UGRD10m*1.9438444924406 ; VGRD10m*1.9438444924406'

'set lev 850'
'set gxout barb'
'set vrange -5 5'
'set cthick 3'
'set ccolor 102'
'set digsize 0.03'
'd const(UGRDprs*1.9438444924406,0); UGRDprs*1.9438444924406 ; VGRDprs*1.9438444924406'

'set lev 300'
'set gxout barb'
'set vrange -8 2'
'set cthick 3'
'set ccolor 104'
'set digsize 0.03'
'd const(UGRDprs*1.9438444924406,0); UGRDprs*1.9438444924406 ; VGRDprs*1.9438444924406'

'set string 1 c 4'
'set strsiz 0.1'
'draw string 0.75 4.2 Winds (knots)'

'set string 104 c 3'
'set strsiz 0.08'
'draw string 0.75 4.0 300mb (right)'

'set string 102 c 3'
'set strsiz 0.08'
'draw string 0.75 3.8 850mb (left)'

'set string 100 c 3'
'set strsiz 0.08'
'draw string 0.75 3.6 10m (left)'
*======================================================================================

'set z 1'
'set frame on'

*======================================================================================
*=======Fifth plot --- svr Indices --- ========
'!echo Plot 5'
'set parea 1.7 10.5 2.0 3.0'
'set grid on 3 15 2'
'set xlab on'
'set xlopts 1 0 0'
'set ylab on'

*===Get Max and Min LI===
'set gxout stat'
'define li=no4LFTX180_0mb'
'd li'
rec=sublin(result,8)
  minval=subwrd(rec,4)
  maxval=subwrd(rec,5)
*==================================

'set gxout bar'
'set bargap 50'
'set vrange -11 0'
'set cthick 3'
'set ccolor 113'
'set cmark 2'
'set ylint 3'
'set yflip on'
'set ylpos 0 r'
'set ylopts 112 1 0.08'
'd no4LFTX180_0mb'

'set frame off'
'set grid off'
'set xlab off'
'set yflip off'

*===Get Max and Min CAPE===
'set gxout stat'
'define cape=CAPE180_0mb'
'd cape'
rec=sublin(result,8)
  minval=subwrd(rec,4)-100
  maxval=subwrd(rec,5)+100
if (minval <= 0)
  minval=-20
endif
interval=(maxval-minval)/4
*==================================

'set gxout line'
'set vrange 'minval' 'maxval
'set cthick 3'
'set ccolor 111'
'set cmark 2'
'set ylab %4.0f'
'set ylint 'interval
'set ylpos 0 l'
'set ylopts 110 1 0.08'
'set digsize 0.03'
'define cape=CAPE180_0mb'
'd cape'

'set string 110 c 3'
'set strsiz 0.08'
'draw string 0.75 2.6 ML CAPE (J/Kg)'

'set string 112 c 3'
'set strsiz 0.08'
'draw string 0.75 2.4 Lifted Index'
*======================================================================================

'set z 1'
'set frame on'

*======================================================================================
*=======Sixth plot --- Precip --- ========
'!echo Plot 6'
'set parea 1.7 10.5 0.5 2.0'
'set grid on 3 15 2'
'set xlab on'
'set xlopts 1 1 0.08'
'set ylab on'

*===Get Max and Min Precip===
'set gxout stat'
'define prec=(APCPsfc)/25.4'
'd prec'
rec=sublin(result,8)
  minval=subwrd(rec,4)-0.1
  maxval=subwrd(rec,5)+0.1
interval=(maxval-minval)/5
*==================================

'set gxout bar'
'set bargap 30'
'set vrange 0 'maxval
'set ccolor 3'
'set ylab %0.2f'
'set ylevs 'interval' 'interval*2' 'interval*3' 'interval*4' 'interval*5
'set ylpos 0 l'
'set ylopts 1 1 0.08'
'define prec=(APCPsfc)/25.4'
'd prec'

'set frame off'
'set grid off'
'set ylab off'
'set xlab off'

*snow
'set gxout bar'
'set bargap 30'
'set ccolor 5'
if (CSNOWsfc = 1)
  'set ylab on'
  'set ylab %2.1f'
  'set ylevs 'interval*10' 'interval*20' 'interval*30' 'interval*40' 'interval*50
  'set ylpos 0 r'
  'set ylopts 1 1 0.08'
endif
'd (prec*CSNOWsfc)*10'

*Sleet (Frz rain)
'set gxout bar'
'set bargap 30'
'set ccolor 2'
'd prec*CFRZRsfc'

'set string 1 c 3'
'set strsiz 0.08'
'draw string 0.75 1.25 Precipitation (in.)'
'set strsiz 0.06'
'draw string 0.75 1.1 Snow (10:1)'

'define prec=sum((APCPsfc)/25.4,t=1,t='maxtime')'

'set gxout stat'
'd prec'
rec=sublin(result,8)
  total_rain=subwrd(rec,5)
'set string 1 l 4'
'set strsiz 0.08'
  val = total_rain
  fmt = '%-6.2f'
  rc = math_format(fmt,val)
'draw string 1.8 1.88 Total:   'rc

'set gxout stat'
'd prec*CSNOWsfc'
rec=sublin(result,9)
  total_snow=subwrd(rec,5)
'set string 5 l 4'
'set strsiz 0.08'
  val = total_snow*10
  fmt = '%-6.2f'
  rc = math_format(fmt,val)
'draw string 1.8 1.725 Snow:   'rc

'set gxout stat'
'd prec*CFRZRsfc'
rec=sublin(result,9)
  total_frzr=subwrd(rec,5)
'set string 2 l 4'
'set strsiz 0.08'
  val = total_frzr
  fmt = '%-6.2f'
  rc = math_format(fmt,val)
'draw string 1.8 1.57 Frzr:    'rc

'set string 4 l 3'
'set line 1 1 2'
'draw rec 1.75 1.5 2.75 1.95'
*======================================================================================

'set string 1 c 3'
'set strsiz 0.1'
'set rgb 255 0 0 229'
'set string 255 l 3'
'draw string 0.1 8.4 http://derecho.math.uwm.edu/~bmburlin/'
'set string 1 r 3'
'set strsiz 0.08'
'draw string 10.9 0.1 Initialized: 'inithr': 'initmonth' 'initday', 'inityr ' - Valid Through: 'vhr' 'vmonth' 'vday', 'vyr
'set strsiz 0.12'
'set string 1 c 4'
'draw string 6.2 8.3 'city', 'state
'set string 1 r 1'
'set strsiz 0.08'
'draw string 10.95 8.4 High Resolution Rapid Refresh (HRRR) 3km'
'gxprint metgram_'city'.png x800 y600'

'!mv metgram_'city'.png /tornado/r1/bmburlin/public_html/graphics/'model'/metgram'
'quit'
*================================   END OF SCRIPT   ==================================*

* * * * * * * * * * * * * * * * * * * * * * *
*                FUNCTIONS                  *
* * * * * * * * * * * * * * * * * * * * * * *
function setcols()
*    ==========Define RH colors==========
  'set rgb  20 158  84   0 200'
  'set rgb  21 168 103   0 200'
  'set rgb  22 178 122   1 200'
  'set rgb  23 189 141   1 200'
  'set rgb  24 199 160   2 200'
  'set rgb  25 209 179   2 200'
  'set rgb  26 220 198   3 200'
  'set rgb  27 230 217   3 200'
  'set rgb  28 240 236   4 200'
  'set rgb  29 251 255   5 200'
  'set rgb  30 206 254   8 200'
  'set rgb  31 162 254  12 200'
  'set rgb  32 117 253  15 200'
  'set rgb  33  73 253  19 200'
  'set rgb  34  29 253  23 200'
  'set rgb  35  24 218  18 200'
  'set rgb  36  19 184  13 200'
  'set rgb  37  15 149   9 200'
  'set rgb  38  10 115   4 200'
  'set rgb  39   6  81   0 200'
  'set rgb  40   6  58   3 200'
*==================================
*======Define 2m Temp colors=======
  'set rgb 200 230 230 230 200'
  'set rgb 201 220 220 220 200'
  'set rgb 202 210 200 210 200'
  'set rgb 203 176 160 185 200'
  'set rgb 204 144 128 160 200'
  'set rgb 205 127  85 210 200'
  'set rgb 206 170 127 255 200'
  'set rgb 207 213 170 255 200'
  'set rgb 208 150 210 250 200'
  'set rgb 209  80 165 245 200'
  'set rgb 210  40 130 240 200'
  'set rgb 211  40 190  40 200'
  'set rgb 212  80 240  80 200'
  'set rgb 213 244 255 120 200'
  'set rgb 214 255 182  60 200'
  'set rgb 215 255 110   0 200'
  'set rgb 216 250  50   0 200'
  'set rgb 217 180   0   0 200'
  'set rgb 218 120  70  60 200'
*==================================
*========Define Wind colors========
  'set rgb 100 116  17 162'
  'set rgb 101 116  17 162 200'
  'set rgb 102 254 154   6'
  'set rgb 103 254 154   6 200'
  'set rgb 104  28 145   8'
  'set rgb 105  28 145   8 200'
*==================================
*======Define CAPE/LI colors=======
  'set rgb 110 200   9 145'
  'set rgb 111 200   9 145 200'
  'set rgb 112   9 142 200'
  'set rgb 113   9 142 200 200'
*==================================
return

function set_linefill()
  'set lfcols 200 0' ; 'd tempF;const(tempF,-32,-a)'
  'set lfcols 201 0' ; 'd tempF;const(tempF,-24,-a)'
  'set lfcols 202 0' ; 'd tempF;const(tempF,-16,-a)'
  'set lfcols 203 0' ; 'd tempF;const(tempF,-8,-a)'
  'set lfcols 204 0' ; 'd tempF;const(tempF,0,-a)'
  'set lfcols 205 0' ; 'd tempF;const(tempF,8,-a)'
  'set lfcols 206 0' ; 'd tempF;const(tempF,16,-a)'
  'set lfcols 207 0' ; 'd tempF;const(tempF,24,-a)'
  'set lfcols 208 0' ; 'd tempF;const(tempF,32,-a)'
  'set lfcols 209 0' ; 'd tempF;const(tempF,40,-a)'
  'set lfcols 210 0' ; 'd tempF;const(tempF,48,-a)'
  'set lfcols 211 0' ; 'd tempF;const(tempF,56,-a)'
  'set lfcols 212 0' ; 'd tempF;const(tempF,64,-a)'
  'set lfcols 213 0' ; 'd tempF;const(tempF,72,-a)'
  'set lfcols 214 0' ; 'd tempF;const(tempF,80,-a)'
  'set lfcols 215 0' ; 'd tempF;const(tempF,88,-a)'
  'set lfcols 216 0' ; 'd tempF;const(tempF,96,-a)'
  'set lfcols 217 0' ; 'd tempF;const(tempF,104,-a)'
  'set lfcols 218 0' ; 'd tempF;const(tempF,112,-a)'
return
* * * * * * * * * * * * * * * * * * * * * * *
