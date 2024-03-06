// The component imports necessary dependencies from Material-UI, React, Axios, and moment.js.
import { Grid, Stack } from '@mui/material'
import React from 'react'
import Divider from '@mui/material/Divider';
import  PrayerCard  from './PrayerCard';
import myimageF from '.././images/fajr-prayer.png';
import myimageD from '.././images/dhhr-prayer-mosque.png';
import myimageA from '.././images/asr-prayer-mosque.png';
import myimageM from '.././images/sunset-prayer-mosque.png';
import myimageI from '.././images/night-prayer-mosque.png';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { useState ,useEffect } from 'react';
import moment from 'moment';
import "moment/dist/locale/ar-sa";


// Setting moment.js locale to Arabic
moment.locale("ar"); 

export const MainContent = () => {
   // State variables initialization
  
  const[timings,SetTimings]= useState({
    "Fajr": "03:57",
    "Dhuhr": "12:59",
    "Asr": "16:55",
    "Maghrib": "20:12",
    "Isha": "22:02",

});

 // Array to hold prayer data
const prayersArray = [
  { key: "Fajr", displayName: "الفجر" },
  { key: "Dhuhr", displayName: "الظهر" },
  { key: "Asr", displayName: "العصر" },
  { key: "Sunset", displayName: "المغرب" },
  { key: "Isha", displayName: "العشاء" },
];

  // State variables for today's date and selected city

const[today,setToday] = useState('');
const [selectedCity, SetSelectedCity] = useState({
  displayName: "مكة المكرمة",
  ApiName: "Makkah al Mukarramah",
});

  // Array of available cities

const AvailableCities =[
  {
    displayName: "مكة المكرمة",
		ApiName: "Makkah al Mukarramah",
  },
    {
      displayName: "الرياض",
      ApiName: "Riyadh",
    },

  ];
    // State variables for timer and next prayer

  const[timer,setTimer] = useState();
  const [prayerNext, setPrayerNext] = useState(''); // Define prayerNext state


  const getTimings = async() =>{
    // console.log("the data is api");

    const response = await axios.get(
			`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.ApiName}`
      );
    SetTimings (response.data.data.timings);
  }

  useEffect(() => {
  
  
    getTimings()
  },[selectedCity]);


  useEffect(() => {
    // This function will be executed after every render
    let interval = setInterval(() => {
        // This function will be called every 1000 milliseconds (1 second)
        // console.log("calling timer"); // Log a message to the console
        setupCountdownTimer(); // Call the setupCountdownTimer function
    }, 1000); // Execute the interval function every 1000 milliseconds (1 second)

    // Get the current time using moment.js, format it, and update the state variable 'today'
    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));

    // This function will be executed when the component unmounts or when the 'timings' dependency changes
    return () => {
        clearInterval(interval); // Clear the interval when the component unmounts or when the 'timings' dependency changes
    };
}, [timings]); // This effect will be re-run if the value of 'timings' changes

const setupCountdownTimer = () => {
  const momentNow = moment();
  let nextPrayer = null;
  
  if (momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) && momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))) {
    nextPrayer = "Dhuhr";
  } else if (momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) && momentNow.isBefore(moment(timings["Asr"], "hh:mm"))) {
    nextPrayer = "Asr";
  }
  if (momentNow.isAfter(moment(timings["Asr"], "hh:mm")) && momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))) {
    nextPrayer = "Maghrib";
} else if (momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) && momentNow.isBefore(moment(timings["Isha"], "hh:mm"))) {
  nextPrayer = "Isha";
}
if (momentNow.isAfter(moment(timings["Isha"], "hh:mm")) && momentNow.isBefore(moment(timings["Fajr"], "hh:mm"))) {
  nextPrayer = "Fajr";

}

if (nextPrayer) {
  const nextPrayerTime = moment(timings[nextPrayer], "HH:mm");
  const countdownDuration = moment.duration(nextPrayerTime.diff(momentNow));
  const hours = countdownDuration.hours();
  const minutes = countdownDuration.minutes();
  const seconds = countdownDuration.seconds();
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  setTimer(formattedTime);
  setPrayerNext(nextPrayer); // Set prayerNext state
} else {
  setPrayerNext(null); // Reset prayerNext state
}
}




  const handleCityChange = (event) => {
    const selectedCityName= event.target.value;
    const selectedCityData =AvailableCities.find((city) => city.ApiName === selectedCityName)
    console.log(event.target.value);
    SetSelectedCity(selectedCityData);
  };
  return (
    <>
    {/* {top Row} */}
    <Grid container style={{display:"flex",justifyContent:"space-between",width:"90%",}} >
      <Grid item xs={6} style={{padding:"10px"}}>
        <div>
          <h2>   {today}</h2>
          <h1>{selectedCity.displayName}</h1>
        </div>
      </Grid>
      <Grid item xs={6}>
				<div>
        {prayerNext && <h2>متبقي حتى صلاة {prayersArray.find(prayer => prayer.key === prayerNext)?.displayName}</h2>}
          <h1>{timer}</h1>
				</div>
			</Grid>
    </Grid>

    <Divider  style={{borderColor:"grey",PaddingBottom:"15px"}}  />

    {/* {Prayers card  ,material uI stack} */}
    <Stack direction='row' justifyContent={'space-around'} style={{marginTop:"30px",width:"80rem"}}>
      <PrayerCard  name="الفجر" time={timings.Fajr} image={myimageF}  />
      <PrayerCard  name="الظهر" time={timings.Dhuhr} image={myimageD}  />
      <PrayerCard  name="العصر "time={timings.Asr} image={myimageA}  />
      <PrayerCard  name="المغرب"time={timings.Maghrib} image={myimageM}  />
      <PrayerCard  name="العشاء"time={timings.Isha} image={myimageI} />
    </Stack>
    {/* {select city } */}
    <Stack direction="row" justifyContent={'center'}style={{marginTop:"40px" ,marginBottom:"10px"}}>
    <FormControl style={{width:"20%"}}>
        <InputLabel id="demo-simple-select-label" >المدينة</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={SelectCity}
          label="Age"
          onChange={handleCityChange}
        >
          {AvailableCities.map((city)=>{
            return(

          <MenuItem 
          value={city.ApiName}
          key={city.ApiName}

            >{city.displayName}
          </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Stack>



    </>
  )
}
$ git push
Username for 'https://github.com':ESRAA-SOFTWARE
Password for 'https://github.com/ESRAA-SOFTWARE':5793esraa