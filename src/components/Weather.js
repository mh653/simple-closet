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

  const latitude = "34.6913";
  const longitude = "135.183";


  const getWeather = async () => {
    setWeather(null);
    try {
        const res = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`,
        );
        if(!res.ok) {
            throw new Error("天気の取得に失敗しました");//Errorオブジェクトを返す
        }
        const data = await res.json();
        setWeather(data);
    } catch(e) {
        console.error(e.message);
    } finally {
    }
  };

  useEffect(() => {
    getWeather()
  }, [])

  if(!weather) return null;

  const WeatherIcon7 = weatherIconMap[weather.forecast.forecastday[0].hour[7].condition.code] || BsQuestionCircle;

  return (
    <div className="weather">
      <p>Weather</p>
      <p>場所：{weather.location.name}</p>
      <p>日付：{weather.location.localtime}</p>
      <p>{weather.forecast.forecastday[0].hour[7].time}時</p>
      <p>天気：{weather.forecast.forecastday[0].hour[7].condition.code}</p>
      <p>気温：{weather.forecast.forecastday[0].hour[7].temp_c}℃</p>
      <WeatherIcon7 />
    </div>
  );
}
