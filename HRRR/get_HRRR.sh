#!/bin/bash

export PATH=/hurricane/r0/clark/software/mpich/gfortran/bin\:/hurricane/r0/clark/software/netcdf/gfortran/bin\:/hurricane/r0/clark/grads/grads-2.1.a3/bin\:/usr/lib64/qt-3.3/bin\:/usr/local/bin\:/usr/bin\:/bin\:/usr/local/sbin\:/usr/sbin\:/sbin\:/home/clark/bin
export GADDIR=/hurricane/r0/clark/grads/grads-2.1.a3/data/

mypath="/tornado/r1/bmburlin/NCEP/HRRR"
cd $mypath/data/hour

filepath="ftp://ftp.ncep.noaa.gov/pub/data/nccf/nonoperational/com/hrrr/prod/"
Year=`date -u +'%Y'`
Month=`date -u +%m`
mon_string=`date -u +%b`
Day=`date -u +%d`
folder="hrrr.$Year$Month$Day"

attempts=1
max_attempts=3
function getfiles { 
  wget $filepath/$folder/
  hour=`cat index.html | tail -4 | head -1 | cut -c134-135`
  fhr=`cat index.html | tail -4 | head -1 | cut -c178-179`

  rm index.html 
  if [ $fhr -ge 15 ]
    then

      ### Update html page ###
      pagepath="/tornado/r1/bmburlin/NCEP"
      sed "54c\          HRRRcol=Green" $pagepath/data.html > $pagepath/data.html.temp
      sed "55c\          HRRRhr='$hour'" $pagepath/data.html.temp > $pagepath/data.html
      rm $pagepath/data.html.temp
      cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
      ########################

      rm *grib2 *idx
      x=0
      while [ $x -le $fhr ] 
        do
          if [ $x -lt 10 ]
            then
              hr="0"$x
            else
              hr=$x
          fi

          wget $filepath/$folder/hrrr.t$hour\z.wrfprsf$hr.grib2 

        (( x++ ))
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

testnum=`ls *grib2 | wc -l`
if [ $testnum -eq 16 ]
  then 
    echo ""
  else
    sed "54c\          HRRRcol=Red" $pagepath/data.html > $pagepath/data.html.temp
    mv $pagepath/data.html.temp $pagepath/data.html
    cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
    exit
fi

cd $mypath
sed "1c\dset ^data/hour/hrrr.t$hour\z.wrfprsf%f2.grib2" HRRR.ctl > HRRR.ctl.temp
sed "5c\title HRRR $Day $mon_string $Year time: $hour\z" HRRR.ctl.temp > HRRR.ctl
sed "12c\tdef 16 linear $hour\Z$Day$mon_string$Year 60mn" HRRR.ctl > HRRR.ctl.temp
mv HRRR.ctl.temp HRRR.ctl

gribmap -i HRRR.ctl 

rm getdata.txt

cd $mypath/GrADS

#Run HRRR on CONUS
clats=(43.04 43.14 44.48 42.49 44.35 43.62 41.78 41.08 42.75)
clons=(-87.91 -89.35 -88.14 -82.89 -84.67 -84.73 -87.76 -85.14 -73.8)
cnames=("Milwaukee" "Madison" "Green_Bay" "Saint_Clair_Shores" "St._Helen" "Mt._Pleasant" "Chicago" "Fort_Wayne" "Albany")
cstates=("WI" "WI" "WI" "MI" "MI" "MI" "IL" "IN" "NY")
model=HRRR

m=0
while [ $m -le 8 ]
  do
    grads -lbc "run metgram.gs ${clats[$m]} ${clons[$m]} ${cnames[$m]} ${cstates[$m]} $model" & 
    grads -lbc "run skewt.gs ${clats[$m]} ${clons[$m]} ${cnames[$m]} ${cstates[$m]} $model" &
  (( m++ ))
done

#Run HRRR in Great Lakes 
#latmin=40.5
latmin=38
latmax=46.3
#lonmin=-91.7
lonmin=-93
lonmax=-81.2
model=glHRRR

grads -lbc "run 10m_wind.gs $latmin $latmax $lonmin $lonmax $model" & 
grads -lbc "run 2m_temp.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_hourly.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_total.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_winds.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run PWAT.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run thetae_adv.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run maxUpHel.gs $latmin $latmax $lonmin $lonmax $model" &
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
model=HRRR

grads -lbc "run 10m_wind.gs $latmin $latmax $lonmin $lonmax $model" & 
grads -lbc "run 2m_temp.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_hourly.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run precip_total.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run UL_winds.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run PWAT.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run thetae_adv.gs $latmin $latmax $lonmin $lonmax $model" &
grads -lbc "run maxUpHel.gs $latmin $latmax $lonmin $lonmax $model" &
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
sed "54c\          HRRRcol=Blue" $pagepath/data.html > $pagepath/data.html.temp
mv $pagepath/data.html.temp $pagepath/data.html
cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
########################




