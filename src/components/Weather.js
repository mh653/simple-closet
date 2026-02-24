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
  // 天気情報
  const [weather, setWeather] = useState(null);
  // 時刻
  const times = [7,12,18];

  // 天気を取得
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

  // 変換用
  const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
  };
  const formatHour = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getHours()}時`;
  };

  if(!weather) return (
    <div className="weather">
      <div className="weatherLoading">
        <p>天気を取得しています…</p>
      </div>
    </div>
  );

  return (
    <div className="weather">
        <div className="dateSec">
          <p>{formatDate(weather.location.localtime)}</p>
          <p>{weather.location.name}</p>
        </div>

        <div className="weatherSec">
          {times.map((t) => {
            const Icon = weatherIconMap[weather.forecast.forecastday[0].hour[t].condition.code];
            const officialIcon = "https:" + weatherIconMap[weather.forecast.forecastday[0].hour[t].condition.icon];
            return(
                <div key={t} className="weatherEach">
                  <Icon size={30} className="weatherIcon"/>
                  <div className="timeTemp">
                    <p className="time">{formatHour(weather.forecast.forecastday[0].hour[t].time)}</p>
                    <p className="temp">{weather.forecast.forecastday[0].hour[t].temp_c}℃</p>
                  </div>
                </div>
            )
          })}
        </div>

    </div>
  );
}

  //  <div className="weather">
  //     <p>Weather</p>
  //       <p>日付：{weather.location.localtime}</p>
  //       <p>場所：{weather.location.name}</p>

  //       {times.map((t) => {
  //         const Icon = weatherIconMap[weather.forecast.forecastday[0].hour[t].condition.code];
  //         const officialIcon = "https:" + weatherIconMap[weather.forecast.forecastday[0].hour[t].condition.icon];
  //         return(
  //             <div key={t}>
  //               <p>時刻：{weather.forecast.forecastday[0].hour[t].time}</p>
  //               <p>天気：{weather.forecast.forecastday[0].hour[t].condition.text}</p>
  //               <p>天気コード：{weather.forecast.forecastday[0].hour[t].condition.code}</p>
  //               <p>気温：{weather.forecast.forecastday[0].hour[t].temp_c}℃</p>
  //               <Icon size={40} />
  //             </div>
  //         )
  //       })}
  //   </div>
