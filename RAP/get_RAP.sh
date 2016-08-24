#!/bin/bash

export PATH=/hurricane/r0/clark/software/mpich/gfortran/bin\:/hurricane/r0/clark/software/netcdf/gfortran/bin\:/hurricane/r0/clark/grads/grads-2.1.a3/bin\:/usr/lib64/qt-3.3/bin\:/usr/local/bin\:/usr/bin\:/bin\:/usr/local/sbin\:/usr/sbin\:/sbin\:/home/clark/bin
export GADDIR=/hurricane/r0/clark/grads/grads-2.1.a3/data/

mypath="/tornado/r1/bmburlin/NCEP/RAP"
cd $mypath/data

filepath="ftp://ftp.ncep.noaa.gov/pub/data/nccf/com/rap/prod"
Year=`date -u +'%Y'`
Month=`date -u +%m`
mon_string=`date -u +%b`
Day=`date -u +%d`
folder="rap.$Year$Month$Day"

attempts=1
max_attempts=3
function getfiles { 
  wget $filepath/$folder/
  hour=`cat index.html | grep awp130pgrbf | tail -1 | cut -c115-116`
  fhr=`cat index.html | grep t$hour\z.awp130pgrbf | wc -l`

  rm index.html 
  if [ $fhr -ge 38 ]
    then

      ### Update html page ###
      pagepath="/tornado/r1/bmburlin/NCEP"
      sed "57c\          RAPcol=Green" $pagepath/data.html > $pagepath/data.html.temp
      sed "58c\          RAPhr='$hour'" $pagepath/data.html.temp > $pagepath/data.html
      rm $pagepath/data.html.temp
      cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
      ########################

      rm *grib2 *idx
      x=0
      while [ $x -le 18 ] 
        do
          if [ $x -lt 10 ]
            then
              hr="0"$x
            else
              hr=$x
          fi

          wget $filepath/$folder/rap.t$hour\z.awp130pgrbf$hr.grib2 

        (( x++ ))
      done
    else
      while [ $attempts -le $max_attempts ]
        do
          (( attempts++ ))
          sleep 120
          getfiles
        done
  fi
}
getfiles

cd $mypath
sed "1c\dset ^data/rap.t$hour\z.awp130pgrbf%f2.grib2" RAP.ctl > RAP.ctl.temp
sed "5c\title RAP $Day $mon_string $Year time: $hour\z" RAP.ctl.temp > RAP.ctl
sed "12c\tdef 19 linear $hour\Z$Day$mon_string$Year 60mn" RAP.ctl > RAP.ctl.temp
mv RAP.ctl.temp RAP.ctl

gribmap -i RAP.ctl 

rm getdata.txt

cd $mypath/GrADS

#Run RAP on CONUS
clats=(43.04 43.14 44.48 42.49 44.35 43.62 41.78 41.08 42.75)
clons=(-87.91 -89.35 -88.14 -82.89 -84.67 -84.73 -87.76 -85.14 -73.8)
cnames=("Milwaukee" "Madison" "Green_Bay" "Saint_Clair_Shores" "St._Helen" "Mt._Pleasant" "Chicago" "Fort_Wayne" "Albany")
cstates=("WI" "WI" "WI" "MI" "MI" "MI" "IL" "IN" "NY")
model=RAP

m=0
while [ $m -le 8 ]
  do
    grads -lbc "run metgram.gs ${clats[$m]} ${clons[$m]} ${cnames[$m]} ${cstates[$m]} $model" & 
    grads -lbc "run skewt.gs ${clats[$m]} ${clons[$m]} ${cnames[$m]} ${cstates[$m]} $model" &
  (( m++ ))
done

#Run RAP in Great Lakes 
#latmin=40.5
latmin=38
latmax=46.3
#lonmin=-91.7
lonmin=-93
lonmax=-81.2
model=glRAP

grads -lbc "run 10m_wind.gs $latmin $latmax $lonmin $lonmax $model" & 
grads -lbc "run 2m_temp.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_hourly.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_total.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_winds.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run PWAT.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run thetae_adv.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run shear.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run helicity.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run reflectivity.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run lapse_rates.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run cape.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run mlEHI.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run lcl.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run LI.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_dpt.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_RH.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_MR.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run absvort.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run MTV.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_MR.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_RH.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_vv.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_temps.gs $latmin $latmax $lonmin $lonmax $model" &
pid=$!
wait $pid

latmin=25
latmax=50
lonmin=-110
lonmax=-72
model=RAP

grads -lbc "run 10m_wind.gs $latmin $latmax $lonmin $lonmax $model" & 
grads -lbc "run 2m_temp.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_hourly.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_total.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_winds.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run PWAT.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run thetae_adv.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run shear.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run helicity.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run reflectivity.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run lapse_rates.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run cape.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run mlEHI.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run lcl.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run LI.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_dpt.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_RH.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run 2m_MR.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run absvort.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run MTV.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_MR.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_RH.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_vv.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_temps.gs $latmin $latmax $lonmin $lonmax $model" &
pid=$!
wait $pid

### Update html page ###
sed "57c\          RAPcol=Blue" $pagepath/data.html > $pagepath/data.html.temp
mv $pagepath/data.html.temp $pagepath/data.html
cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
########################




