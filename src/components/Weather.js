'use client'

import { useState, useEffect } from "react";

import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiCloud,
  WiFog,
  WiRain,
  WiSprinkle,
  WiRainWind,
  WiSnow,
  WiThunderstorm
} from 'react-icons/wi';

const weatherIconMap = {
  1000: WiDaySunny,
  1003: WiDayCloudy,
  1006: WiCloudy,
  1009: WiCloud,
  1030: WiFog,
  1063: WiRain,
  1183: WiSprinkle,
  1189: WiRain,
  1195: WiRainWind,
  1210: WiSnow,
  1213: WiSnow,
  1273: WiThunderstorm
};

export default function Weather() {

  const [weather, setWeather] = useState(null);
  const times = [7,12,18];

  const getWeather = async () => {
    setWeather(null);
    const position = localStorage.getItem("weatherQuery") || "Tokyo";
    try {
        const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${position}&days=1&aqi=no&alerts=no`,
        );
        if(!res.ok) {
            throw new Error("天気の取得に失敗しました");//Errorオブジェクトを返す
        }
        const data = await res.json();
        setWeather(data);
    } catch(e) {
        console.error(e.message);
    }
  };

  useEffect(() => {
    getWeather()
  }, [])

  if(!weather) return (
    <div className="weather">
      <p>天気を取得しています…</p>
    </div>
  );

  return (
   <div className="weather">
      <p>Weather</p>
        <p>日付：{weather.location.localtime}</p>
        <p>場所：{weather.location.name}</p>

        {times.map((t) => {
          const Icon = weatherIconMap[weather.forecast.forecastday[0].hour[t].condition.code];
          const officialIcon = "https:" + weatherIconMap[weather.forecast.forecastday[0].hour[t].condition.icon];
          return(
              <div key={t}>
                <p>時刻：{weather.forecast.forecastday[0].hour[t].time}</p>
                <p>天気：{weather.forecast.forecastday[0].hour[t].condition.text}</p>
                <p>天気コード：{weather.forecast.forecastday[0].hour[t].condition.code}</p>
                <p>気温：{weather.forecast.forecastday[0].hour[t].temp_c}℃</p>
                <Icon size={40} />
              </div>
          )
        })}
    </div>
  );
}












// 'use client'

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import {
//   WiDaySunny,
//   WiDayCloudy,
//   WiCloudy,
//   WiCloud,
//   WiFog,
//   WiRain,
//   WiSprinkle,
//   WiRainWind,
//   WiSnow,
//   WiThunderstorm
// } from 'react-icons/wi';

// const weatherIconMap = {
//   1000: WiDaySunny,
//   1003: WiDayCloudy,
//   1006: WiCloudy,
//   1009: WiCloud,
//   1030: WiFog,
//   1063: WiRain,
//   1183: WiSprinkle,
//   1189: WiRain,
//   1195: WiRainWind,
//   1210: WiSnow,
//   1213: WiSnow,
//   1273: WiThunderstorm
// };

// export default function Weather() {

//   const [weather, setWeather] = useState(null);
//   const times = [7,12,18];

//   // const latitude = "34.6913";
//   // const longitude = "135.183";

//   // const getWeather = async () => {
//   //   setWeather(null);
//   //   try {
//   //       const res = await fetch(
//   //           `http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`,
//   //       );
//   //       if(!res.ok) {
//   //           throw new Error("天気の取得に失敗しました");//Errorオブジェクトを返す
//   //       }
//   //       const data = await res.json();
//   //       setWeather(data);
//   //   } catch(e) {
//   //       console.error(e.message);
//   //   } finally {
//   //   }
//   // };

//   const place = "大阪"
//   const getWeather = async () => {
//     setWeather(null);
//     try {
//         const res = await fetch(
//             `http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${place}&days=1&aqi=no&alerts=no`,
//         );
//         if(!res.ok) {
//             throw new Error("天気の取得に失敗しました");//Errorオブジェクトを返す
//         }
//         const data = await res.json();
//         setWeather(data);
//     } catch(e) {
//         console.error(e.message);
//     } finally {
//     }
//   };

//   useEffect(() => {
//     getWeather()
//   }, [])

//   if(!weather) return null;

//   // const WeatherIcon7 = weatherIconMap[weather.forecast.forecastday[0].hour[7].condition.code];
//   // const WeatherIcon12 = weatherIconMap[weather.forecast.forecastday[0].hour[12].condition.code];
//   // const WeatherIcon18 = weatherIconMap[weather.forecast.forecastday[0].hour[18].condition.code];

//   return (
//     <div className="weather">
//       <p>Weather</p>
//         <p>場所：{weather.location.name}</p>
//         <p>日付：{weather.location.localtime}</p>
//         {times.map((t) => {
//           const Icon = weatherIconMap[weather.forecast.forecastday[0].hour[t].condition.code];
//           const officialIcon = "https:" + weatherIconMap[weather.forecast.forecastday[0].hour[t].condition.icon];
//           return(
//               <div key={t}>
//                 <p>時刻：{weather.forecast.forecastday[0].hour[t].time}</p>
//                 <p>天気：{weather.forecast.forecastday[0].hour[t].condition.text}</p>
//                 <p>天気コード：{weather.forecast.forecastday[0].hour[t].condition.code}</p>
//                 <p>気温：{weather.forecast.forecastday[0].hour[t].temp_c}℃</p>
//                 {/* <Image src={officialIcon} alt='' width={100} height={100} /> */}
//                 <Icon size={40} />
//               </div>
//           )
//         })}
//         {/* <WeatherIcon7 />
//         <WeatherIcon12 />
//         <WeatherIcon18 /> */}
//     </div>
//   );
// }
