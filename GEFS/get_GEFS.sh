#!/bin/bash

export PATH=/hurricane/r0/clark/software/mpich/gfortran/bin\:/hurricane/r0/clark/software/netcdf/gfortran/bin\:/hurricane/r0/clark/grads/grads-2.1.a3/bin\:/usr/lib64/qt-3.3/bin\:/usr/local/bin\:/usr/bin\:/bin\:/usr/local/sbin\:/usr/sbin\:/sbin\:/home/clark/bin
export GADDIR=/hurricane/r0/clark/grads/grads-2.1.a3/data/

mypath="/tornado/r1/bmburlin/NCEP/GEFS"
max_hr=180
cd $mypath/data

filepath="ftp://ftp.ncep.noaa.gov/pub/data/nccf/com/gens/prod"
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

folder="gefs.$Year$Month$Day/$run/pgrb2a/"

attempts=1
max_attempts=3
function getfiles { 
  wget $filepath/$folder/
  num=`cat index.html | grep gep | grep f$max_hr | wc -l`

  rm index.html 
  if [ $num -eq 40 ]
    then

      ### Update html page ###
      pagepath="/tornado/r1/bmburlin/NCEP"
      sed "60c\          GEFScol=Green" $pagepath/data.html > $pagepath/data.html.temp
      sed "61c\          GEFShr='$run'" $pagepath/data.html.temp > $pagepath/data.html
      rm $pagepath/data.html.temp
      cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
      ########################

      rm *pgrb2a* *idx
      mem=1
      while [ $mem -le 20 ] 
        do 
          if [ $mem -lt 10 ] 
            then 
              NN="0"$mem 
            else 
              NN=$mem 
          fi
          x=0
          while [ $x -le $max_hr ] 
            do
              if [ $x -lt 10 ] 
                then 
                  hr="0"$x  
                else 
                  hr=$x 
              fi
              wget $filepath/$folder/gep$NN.t$run\z.pgrb2af$hr &
            x=$(( $x + 6 ))
          done
        (( mem++ ))
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
sleep 90
echo "done"

numtimes=`ls gep01* | wc -l`

cd ..
sed "1c\dset ^data/gep%e.t$run\z.pgrb2af%f2" GEFS.ctl > GEFS.ctl.temp
sed "5c\title GEFS $Day $mon_string $Year time: $run\z" GEFS.ctl.temp > GEFS.ctl
sed "11c\tdef $numtimes linear $run\Z$Day$mon_string$Year 360mn" GEFS.ctl > GEFS.ctl.temp
z=1
y=46
while [ $z -le 20 ]
  do 
    if [ $z -lt 10 ]
      then
        e="0"$z
      else
        e=$z
    fi
    sed $y"c\ $e $numtimes  $run\Z$Day$mon_string$Year 3,$z" GEFS.ctl.temp > GEFS.ctl
    (( y++ ))
    (( z++ ))

    if [ $z -lt 10 ]
      then
        e="0"$z
      else
        e=$z
    fi
    sed $y"c\ $e $numtimes  $run\Z$Day$mon_string$Year 3,$z" GEFS.ctl > GEFS.ctl.temp 
    (( y++ ))
    (( z++ ))
done
mv GEFS.ctl.temp GEFS.ctl

gribmap -i GEFS.ctl 

rm getdata.txt

cd $mypath/GrADS
latmin=-90
latmax=90
lonmin=-270
lonmax=90

grads -lbc "run 10m_wind.gs $latmin $latmax $lonmin $lonmax" & 
grads -lbc "run 2m_temp.gs $latmin $latmax $lonmin $lonmax" &
grads -lbc "run UL_winds.gs $latmin $latmax $lonmin $lonmax" &
grads -lbc "run UL_temps.gs $latmin $latmax $lonmin $lonmax" &
grads -lbc "run PWAT.gs $latmin $latmax $lonmin $lonmax" &
grads -lbc "run cape.gs $latmin $latmax $lonmin $lonmax" &
pid=$!
wait $pid


### Update html page ###
sed "60c\          GEFScol=Blue" $pagepath/data.html > $pagepath/data.html.temp
mv $pagepath/data.html.temp $pagepath/data.html
cp $pagepath/data.html /tornado/r1/bmburlin/public_html/
########################
