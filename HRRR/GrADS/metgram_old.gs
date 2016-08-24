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

*======================================================================================
*==================GET THE FIRST AND TIME STAMP FOR THE MODEL RUN==========================
   'set t 1'
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
***************************************************************************************

*======================================================================================
*=======First plot --- RH contours and shading, temperature (F) --- 1013-200 mb========
   
'set parea 2.0 10.4 6.7 8.2'
'set t 1 'maxtime
'set grid horizontal 5 16 0.1'
'set xlab off'
'set grads off'
'set lev 1013 200'

*==========Define RH colors==========
  'set rgb 20 158  84   0'
  'set rgb 21 168 103   0'
  'set rgb 22 178 122   1'
  'set rgb 23 189 141   1'
  'set rgb 24 199 160   2'
  'set rgb 25 209 179   2'
  'set rgb 26 220 198   3'
  'set rgb 27 230 217   3'
  'set rgb 28 240 236   4'
  'set rgb 29 251 255   5'
  'set rgb 30 206 254   8'
  'set rgb 31 162 254  12'
  'set rgb 32 117 253  15'
  'set rgb 33  73 253  19'
  'set rgb 34  29 253  23'
  'set rgb 35  24 218  18'
  'set rgb 36  19 184  13'
  'set rgb 37  15 149   9'
  'set rgb 38  10 115   4'
  'set rgb 39   6  81   0'
  'set rgb 40   6  58   3'
*==================================

'set gxout shaded'
'set clopts 15 -1 0.08'
'set clskip 1 3.5'
'set clevs 5 10 15 20 25 30 35 40 45 50 55 60 65 70 75 80 85 90 95 100'
'set ccols 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40'
'set ylint 100'
'set ylpos 0 l'
'set ylopts 1 1 0.08'
'set xlopts 1 1 0.08'
'd rhprs'
'run colorbar/xcbar.gs 10.55 10.7 6.75 8.2 -direction v -fs 1 -fw .08 -fh .08 -line'

   'set gxout contour'
   'set cthick 1'
   'set cstyle 5'
   'set clopts 15 -1 0.05'
   'set clab masked'
   'set clevs  10 20 30 70 80 90 100'
   'set ccols 15'
'd rhprs'

   'set gxout contour'
   'set cthick 5'
   'set clopts 1 2 0.05'
   'set clab masked'
   'set clevs -80 -60 -40 -20 0 10 20 30 40 50 60 70 80 90 100 110 120'
   'set ccols 1'
   'set e 1 'ee
     'define ttc=((TMPprs-273.15)*(9/5)+32)'
   'set e 1'
   'd ave(ttc,e=1,e='ee')'

   'set gxout contour'
   'set cthick 2'
   'set clopts 4 -1 0.04'
   'set clab masked'
   'set clevs 32'
   'set ccols 4'
   'd ave(ttc,e=1,e='ee')'

   'set string 1 c 3'
   'set strsiz 0.08'
   'draw string 0.9 7.85 Temperature (F)'

   'set string 1 c 3'
   'set strsiz 0.06'
   'draw string 0.9 7.73 (Contours)'

   'set string 1 c 3'
   'set strsiz 0.08'
   'draw string 0.9 7.5 Relative Humidity (RH)'

   'set string 30 c 3'
   'set strsiz 0.06'
   'draw string 0.9 7.38 (Shaded)'
***************************************************************************************
'set z 1'
*======================================================================================
*=======Second plot --- Dewpoint (F), temperature (F) --- ========

   'set parea 2.0 10.4 5.65 6.65'
   'set grads off'
   'set grid horizontal 5 16 0.1'
   'set xlab off'
   'set t 1 'maxtime

*     ===Get Max and Min 2m temp in F===
      'set t 1 'maxtime
      'set e 1 'ee
        'define tf=32+1.8*(TMP2m(z=1)-273.15)'
      'set e 1'
      'set gxout stat'
      'd ave(tf,e=1,e='ee')'
      rec=sublin(result,9)
      minval=subwrd(rec,4)-10
      maxval=subwrd(rec,5)+2
*     ==================================

   'set gxout line'
   'set vrange 'minval' 'maxval
   'set cthick 6'
   'set ccolor 5'
   'set cmark 0'
   'set ylint 3'
   'set ylpos 0 r'
   'set ylopts 1 0.5 0.07'
   'set e 1 'ee
     'define temp=(TMP2m-273.16)*(9/5)+32'
   'set e 1'
   'd ave(temp,e=1,e='ee')'

   'set gxout linefill'
   'set lfcols 9 0' ; 'd temp;const(temp,00.01,-a)'
   'set lfcols 14 0' ; 'd temp;const(temp,10.01,-a)'
   'set lfcols 4 0' ; 'd temp;const(temp,20.01,-a)'
   'set lfcols 11 0' ; 'd temp;const(temp,30.01,-a)'
   'set lfcols 5 0' ; 'd temp;const(temp,40.01,-a)'
   'set lfcols 13 0' ; 'd temp;const(temp,50.01,-a)'
   'set lfcols 3 0' ; 'd temp;const(temp,60.01,-a)'
   'set lfcols 10 0' ; 'd temp;const(temp,70.01,-a)'
   'set lfcols 7 0' ; 'd temp;const(temp,80.01,-a)'
   'set lfcols 12 0' ; 'd temp;const(temp,90.01,-a)'
   'set lfcols 8 0' ; 'd temp;const(temp,100.01,-a)'
   'set lfcols 2 0' ; 'd temp;const(temp,110.01,-a)'
   'set lfcols 6 0' ; 'd temp;const(temp,120.01,-a)'

   'set gxout line'
   'set vrange 'minval' 'maxval
   'set cthick 6'
   'set ccolor 5'
   'set digsize 0.04'
   'set cmark 2'
   'set ylab off'
   'd ave(temp,e=1,e='ee')'

   'set gxout line'
   'set ylab on'
   'set cthick 6'
   'set ccolor 1'
   'set cmark 2'
   'set digsize 0.05'
   'set ylint 3'
   'set ylpos 0 l'
   'set ylopts 1 0.5 0.07'
   'd ave((DPT2m-273.15)*(9/5)+32,e=1,e='ee')'

   'set string 5 c 3'
   'set strsiz 0.08'
   'draw string 0.9 6.40 2m Temperature (F)'
   'set string 5 c 3'
   'set strsiz 0.07'
      val = maxval-2
      fmt = '%-6.1f'
      maxTMP = math_format(fmt,val)
   'draw string 0.9 6.25 MAX: 'maxTMP'F'
      val = minval+10
      fmt = '%-6.1f'
      minTMP = math_format(fmt,val)
   'draw string 0.9 6.15 MIN: 'minTMP'F'

   'set string 1 c 3'
   'set strsiz 0.08'
   'draw string 0.9 6.00 2m Dewpoint (F)'

***************************************************************************************
'set z 1'
*======================================================================================
*=======Third plot --- Winds --- ========

   'set grads off'
   'set grid off'
   'set xlab off'
   'set t 1 'maxtime
   'set parea 2.0 10.4 4.6 5.6'

*     ===Get Max and Min 200mb winds in knots===
      'set e 1 'ee
        'define wind10=mag(UGRDprs(lev=200),VGRDprs(lev=200))*1.9438444924406'
      'set e 1'
      'set gxout stat'
      'd ave(wind10,e=1,e='ee')'
      rec=sublin(result,9)
      minval=subwrd(rec,4)*0
      maxval=subwrd(rec,5)+10
      'set vrange -1 'maxval
*     ==================================

*  === 850mb Winds ===
   'set lev 850'
   'set gxout line'
   'set cthick 12'
   'set ccolor 12'
   'set ylint 10'
   'set ylpos 0 r'
   'set ylopts 10 0.5 0.07'
   'set cmark 0'
   'set e 1 'ee
     'define wind850=mag(UGRDprs*1.9438444924406,VGRDprs*1.9438444924406)'
   'set e 1'
   'd ave(wind850,e=1,e='ee')'
   'set frame off'
   'set ylab off'
   'set gxout barb'
   'set cthick 5'
   'set ccolor 12'
   'set digsize 0.03'
   'set vrange -5 5'
   'd const(ave(UGRDprs,e=1,e='ee')*1.9438444924406,0); ave(UGRDprs,e=1,e='ee')*1.9438444924406 ; ave(VGRDprs,e=1,e='ee')*1.9438444924406'

*  === 200mb Winds ===
   'set lev 250'
   'set gxout line'
   'set cthick 12'
   'set ccolor 10'
   'set cmark 0'
   'set grid horizontal 5 16 0.1'
   'set e 1 'ee
     'define wind250=mag(UGRDprs*1.9438444924406,VGRDprs*1.9438444924406)'
   'set e 1'
   'd ave(wind250,e=1,e='ee')'
   'set frame off'
   'set ylab off'
   'set gxout barb'
   'set cthick 5'
   'set ccolor 10'
   'set digsize 0.03'
   'set vrange -8 2'
   'd const(ave(UGRDprs,e=1,e='ee')*1.9438444924406,0); ave(UGRDprs,e=1,e='ee')*1.9438444924406 ; ave(VGRDprs,e=1,e='ee')*1.9438444924406'

*  === 10m Winds ===
   'set z 1'
   'set vrange -1 50'
   'set ylab on'
   'set gxout line'
   'set cthick 12'
   'set ccolor 14'
   'set cmark 0'
   'set ylint 5'
   'set ylpos 0 l'
   'set ylopts 14 0.5 0.07'
   'set e 1 'ee
     'define wind=mag(UGRD10m*1.9438444924406,VGRD10m*1.9438444924406)'
   'set e 1'
   'd ave(wind,e=1,e='ee')'
   'set frame off'
   'set ylab off'
   'set gxout barb'
   'set cthick 5'
   'set ccolor 14'
   'set digsize 0.04'
   'set vrange -2 8'
   'd const(ave(UGRD10m,e=1,e='ee')*1.9438444924406,0); ave(UGRD10m,e=1,e='ee')*1.9438444924406 ; ave(VGRD10m,e=1,e='ee')*1.9438444924406'
   'set frame on'
   'set ylab on'
*     ==================================

   'set string 14 c 3'
   'set strsiz 0.08'
   'draw string 0.9 4.9 10m Winds (knots)'

   'set string 12 c 3'
   'set strsiz 0.08'
   'draw string 0.9 5.1 850mb Winds (knots)'

   'set string 10 c 3'
   'set strsiz 0.08'
   'draw string 0.9 5.3 250mb Winds (knots)'
***************************************************************************************
'set z 1'
*======================================================================================
*=======Fourth plot --- Cape, CIN --- ========

   'set parea 2.0 10.4 3.85 4.55'
   'set grads off'
   'set grid horizontal 5 16 0.1'
   'set xlab off'
   'set t 1 'maxtime
  
*     ===Get Max and Min mCIN===
      'set gxout stat'
      'set e 1 'ee
        'define c=CIN180_0mb'
      'set e 1'
      'd ave(c,e=1,e='ee')'
      rec=sublin(result,9)
      minval=subwrd(rec,4)-5
      maxval=subwrd(rec,5)+5
*     ==================================
 
   'set gxout line'
   'set vrange 'minval' 'maxval
   'set cthick 12'
   'set ccolor 11'
   'set cmark 0'
   'set ylint 50'
   'set ylpos 0 r'
   'set ylopts 1 0.5 0.07'
   'd ave(CIN180_0mb,e=1,e='ee')'

*     ===Get Max and Min mCAPE===
      'set gxout stat'
      'set e 1 'ee
        'define mc=CAPE180_0mb'
      'set e 1'
      'd ave(mc,e=1,e='ee')'
      rec=sublin(result,9)
      minval=subwrd(rec,4)-50
      maxval=subwrd(rec,5)+50
*     ==================================

   'set gxout line'
   'set grid horizontal 5 1 0.1'
   'set vrange 'minval' 'maxval
   'set cthick 12'
   'set ccolor 8'
   'set cmark 0'
   'set ylint 250'
   'set ylpos 0 l'
   'set ylopts 1 0.5 0.07'
   'd ave(CAPE180_0mb,e=1,e='ee')'

   'set string 8 c 3'
   'set strsiz 0.08'
   'draw string 0.9 4.35 MLCAPE'

   'set string 11 c 3'
   'set strsiz 0.08'
   'draw string 0.9 4.15 MLCIN'

***************************************************************************************
'set z 1'
*======================================================================================
*=======Fifth plot --- MSLP --- ========

   'set parea 2.0 10.4 3.1 3.8'
   'set grads off'
   'set grid horizontal 5 16 0.1'
   'set xlab off'
   'set t 1 'maxtime

*     ===Get Max and Min slp===
      'set gxout stat'
      'set e 1 'ee
        'define p=PRMSLmsl/100'
      'set e 1'
      'd ave(p,e=1,e='ee')'
      rec=sublin(result,9)
      minval=subwrd(rec,4)-4
      maxval=subwrd(rec,5)+4
*     ==================================

   'set gxout line'
   'set vrange 'minval' 'maxval
   'set cthick 12'
   'set ccolor 11'
   'set cmark 0'
   'set ylint 4'
   'set ylpos 0 l'
   'set ylopts 1 0.5 0.07'
   'd ave(PRMSLmsl/100,e=1,e='ee')'  

   'set string 11 c 3'
   'set strsiz 0.08'
   'draw string 0.9 3.4 MSLP (mb)'

***************************************************************************************
'set z 1'
*======================================================================================
*=======Sixth plot --- 2m RH --- ========

   'set parea 2.0 10.4 2.35 3.05'
   'set grads off'
   'set grid off'
   'set xlab off'
   'set z 1'
   'set t 1 'maxtime

*    ==========Define RH colors==========
     'set rgb 31 181 181 181 200'
     'set rgb 32 159 177 158 200'
     'set rgb 33 137 174 135 200'
     'set rgb 34 115 170 113 200'
     'set rgb 35  93 167  90 200'
     'set rgb 36  71 163  67 200'
     'set rgb 37  49 160  45 200'
     'set rgb 38  27 156  22 200'
     'set rgb 39   5 103   0 200'
     'set rgb 40   1 131  18 200'
*    ==================================

   'set vrange 0 110'
   'set gxout line'
   'set ccolor 1'
   'set ylint 20'
   'set ylpos 0 l'
   'set ylopts 1 0.5 0.07'
   'set cmark 0'
   'd ave(rhprs,e=1,e='ee')'

   'set ylab off'
   'set gxout linefill'
   'set lfcols 31 0' ; 'd rhprs;const(rhprs,00.01,-a)'
   'set lfcols 32 0' ; 'd rhprs;const(rhprs,20.01,-a)'
   'set lfcols 33 0' ; 'd rhprs;const(rhprs,30.01,-a)'
   'set lfcols 34 0' ; 'd rhprs;const(rhprs,40.01,-a)'
   'set lfcols 35 0' ; 'd rhprs;const(rhprs,50.01,-a)'
   'set lfcols 36 0' ; 'd rhprs;const(rhprs,60.01,-a)'
   'set lfcols 37 0' ; 'd rhprs;const(rhprs,70.01,-a)'
   'set lfcols 38 0' ; 'd rhprs;const(rhprs,80.01,-a)'
   'set lfcols 39 0' ; 'd rhprs;const(rhprs,90.01,-a)'

   'set ccolor 1'
   'set cthick 2'
   'set gxout line'
   'set cmark 2'
   'set digsize 0.06'
   'd ave(rhprs,e=1,e='ee')'

   'set string 3 c 3'
   'set strsiz 0.08'
   'draw string 0.9 2.7 SFC Relative Humidity (%)'
***************************************************************************************
'set z 1'
*======================================================================================
*=======Seventh plot --- precip --- ========

   'set parea 2.0 10.4 1.5 2.3'
   'set grads off'
   'set grid horizontal 5 16 0.1'
   'set xlab off'
   'set ylab on'
   'set t 1 'maxtime

*     ===Get Max and Min precip===
      'set e 1 'ee
        'define prec=sum((APCPsfc)/25.4,t=1,t='maxtime')'
      'set e 1'
      'set gxout stat'
      'd ave(prec,e=1,e='ee')'
      rec=sublin(result,9)
      minval=subwrd(rec,4)*0
      maxval=subwrd(rec,5)+0.01
*     ==================================

*     ===Define Precip interval===
     
      int=0.005
      if ((maxval-0.01) > 0)
        int=0.005
      endif
      if ((maxval-0.01) > 0.05)
        int=0.01
      endif
      if ((maxval-0.01) > 0.1)
        int=0.03
      endif
      if ((maxval-0.01) > 0.2)
        int=0.05
      endif
      if ((maxval-0.01) > 0.5)
        int=0.1
      endif
      if ((maxval-0.01) > 1)
        int=0.1
      endif
      if ((maxval-0.01) > 2)
        int=0.25
      endif
      if ((maxval-0.01) > 3)
        int=0.5
      endif
      if ((maxval-0.01) > 5)
        int=1
      endif
  
*     ==================================

   'set vrange 'minval' 'maxval
   'set ylint 'int
   'set ylpos 0 l'
   'set ylopts 1 0.5 0.07'
   'set gxout bar'
   'set barbase 0'
   'set bargap 40'
   'set ccolor 3'
   'd ave((APCPsfc)/25.4,e=1,e='ee')'  

   'set gxout bar'
   'set barbase 0'
   'set bargap 80'
   'set ccolor 4'
*   'd /25.4'

   'set string 3 c 3'
   'set strsiz 0.08'
   'draw string 0.9 1.9 Precipitation (inches)'
   'set string 1 l 3'
   'set strsiz 0.06'
      val = maxval-0.01
      fmt = '%-6.2f'
      rc = math_format(fmt,val)
   'draw string 2.1 2.2 Total:   'rc
   'set string 5 l 3'
   'set strsiz 0.06'
   'draw string 2.1 2.1 Snow:   0.000'
   'set string 2 l 3'
   'set strsiz 0.06'
   'draw string 2.1 2.0 Sleet:   0.000'
   'set string 4 l 3'
   'set strsiz 0.06'
   'draw string 2.1 1.9 Ice:     0.000'
   'set string 4 l 3'
   'set line 1 1 6'
   'draw rec 2.05 1.85 2.9 2.25'
***************************************************************************************
'set z 1'
*======================================================================================
*=======Eigth plot --- Theta-e --- ========

   'set parea 2.0 10.4 0.45 1.45'
   'set grads off'
   'set grid horizontal 5 16 0.1'
   'set xlab on'
   'set ylab on'
   'set t 1 'maxtime
   'set lev 1000 150'

*     ===Define Theta-e===
*      'set e 1 'ee
        't=tmpprs'
        'td=(tmpprs-273.15)-((14.55+0.114*(tmpprs-273.15))*(1-0.01*rhprs) + pow((2.5+0.007*(tmpprs-273.15))*(1-0.01*rhprs),3) + (15.9+0.117*(tmpprs-273.15))*pow((1-0.01*rhprs),14) )'     
        'define vapr=6.112*exp((17.67*td)/(td+243.5))'
        'define eee=vapr*1.001+(lev-100)/900*0.0034'
        'define mixr=0.62197*(eee/(lev-eee))*1000'
        'define dwpk=(td+273.15)'
        'undefine td'
        'define tlcl= 1/(1/(dwpk-56)+log(t/dwpk)/800)+56'
        'undefine eee'
        'define theta=t*pow(1000/lev,0.286)'
        'define thte=theta*exp((3.376/tlcl-0.00254)*mixr*1.0+0.00081*mixr)'  
*      'set e 1'
  
*     ==================================

   'set vrange 250 380'
   'set gxout contour'
   'set cthick 1'
   'set ylint 100'
   'set ylpos 0 l'
   'set ylopts 1 4 0.08'
   'set clopts 2 -1 0.06'
   'set clab masked'
   'set cint 5'
   'd ave(thte,e=1,e='ee')'

   'set string 4 c 3'
   'set strsiz 0.08'
   'draw string 0.9 0.95 Theta-e'
***************************************************************************************

   'set string 1 c 3'
   'set strsiz 0.1'
   'set rgb 255 0 238 240 200'
   'set string 255 r 3'
   'draw string 10.9 0.1 http://derecho.math.uwm.edu/~bmburlin/'
   'set string 1 l 3'
   'set strsiz 0.08'
   'draw string 0.1 8.4 Initialized: 'inithr': 'initmonth' 'initday', 'inityr ' - Valid Through: 'vhr' 'vmonth' 'vday', 'vyr
   'set strsiz 0.1'
   'set string 1 c 8'
   'draw string 6.2 8.3 'city', 'state
   'set string 1 r 1'
   'set strsiz 0.08'
   'draw string 10.95 8.4 High Resolution Rapid Refresh (HRRR) 3km'
   'gxprint metgram_'city'.png x800 y600'
   'c'
   '!echo Done with 'city  
*======================================================================================
*======================MOVE ALL IMAGES TO IMAGES DIRECTORY=============================
'!mv metgram*.png /tornado/r1/bmburlin/public_html/graphics/'model'/metgram'
***************************************************************************************
'quit'
