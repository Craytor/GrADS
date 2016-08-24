#!/bin/bash

export PATH=/hurricane/r0/clark/software/mpich/gfortran/bin\:/hurricane/r0/clark/software/netcdf/gfortran/bin\:/hurricane/r0/clark/grads/grads-2.1.a3/bin\:/usr/lib64/qt-3.3/bin\:/usr/local/bin\:/usr/bin\:/bin\:/usr/local/sbin\:/usr/sbin\:/sbin\:/home/clark/bin
export GADDIR=/hurricane/r0/clark/grads/grads-2.1.a3/data/

mypath="/tornado/r1/bmburlin/NCEP/GFS"
max_hr=180
cd $mypath/data

filepath="ftp://ftp.ncep.noaa.gov/pub/data/nccf/com/gfs/prod"
Year=`date +'%Y'`
Month=`date +%m`
mon_string=`date +%b`
Day=`date +%d`
Hour=`date -u +%H`

if [ $Hour -eq 5 ] 
  then 
    run="00" 
  fi
if [ $Hour -eq 11 ]  
  then 
    run="06" 
  fi
if [ $Hour -eq 17 ] 
  then 
    run="12" 
  fi
if [ $Hour -eq 23 ] 
  then 
    run="18" 
  fi

folder="gfs.$Year$Month$Day$run/"

attempts=1
max_attempts=3
function getfiles { 
  wget $filepath/$folder/
  num=`cat index.html | grep pgrb2.0p25.f | wc -l`

  rm index.html 
  if [ $num -ge 120 ]
    then

      ### Update html page ###
      pagepath="/tornado/r1/bmburlin/NCEP"
      sed "66c\          GFScol=Green" $pagepath/data.html > $pagepath/data.html.temp
      sed "67c\          GFShr='$run'" $pagepath/data.html.temp > $pagepath/data.html
      rm $pagepath/data.html.temp
      cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
      ########################

      rm *pgrb2* *idx
      x=0
      while [ $x -le $max_hr ] 
        do
          if [ $x -lt 10 ] 
            then 
              hr="00"$x
          elif [ $x -lt 100 ]   
            then 
              hr="0"$x
          else 
              hr=$x 
          fi
          wget $filepath/$folder/gfs.t$run\z.pgrb2.0p25.f$hr 
        x=$(( $x + 3 ))
      done
    else
      while [ $attempts -le $max_attempts ]
        do
          (( attempts++ ))
          sleep 180
          getfiles
        done
  fi
}
getfiles

cd $mypath
sed "1c\dset ^data/gfs.t$run\z.pgrb2.0p25.f%f3" GFS.ctl > GFS.ctl.temp
sed "5c\title GFS $Day $mon_string $Year time: $hour\z" GFS.ctl.temp > GFS.ctl
sed "12c\tdef 61 linear $run\Z$Day$mon_string$Year 180mn" GFS.ctl > GFS.ctl.temp
mv GFS.ctl.temp GFS.ctl

gribmap -i GFS.ctl 

rm getdata.txt

cd $mypath/GrADS

latmin=23
latmax=67
lonmin=-180
lonmax=-50
model=GFS
grads -lbc "run 10m_wind.gs $latmin $latmax $lonmin $lonmax $model" & 
grads -lbc "run 2m_temp.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_hourly.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_total.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_winds.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run PWAT.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run thetae_adv.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run maxUpHel.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run helicity.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run reflectivity.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run cape.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run lcl.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_dpt.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_RH.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_MR.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run absvort.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run MTV.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_MR.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_RH.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_vv.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_temps.gs $latmin $latmax $lonmin $lonmax $model" &

latmin=20
latmax=90
lonmin=-270
lonmax=90
grads -lbc "run absvort_polar $latmin $latmax $lonmin $lonmax $model" & 
grads -lbc "run wind_polar.gs $latmin $latmax $lonmin $lonmax $model" &

### Update html page ###
sed "66c\          GFScol=Blue" $pagepath/data.html > $pagepath/data.html.temp
mv $pagepath/data.html.temp $pagepath/data.html
cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
########################
