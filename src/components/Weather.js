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

// 天気コード→アイコン変換表
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

// 時刻
const times = [7,12,18];

// 変換用
const formatDate = (dateStr) => {
const d = new Date(dateStr);
return `${d.getMonth() + 1}月${d.getDate()}日`;
};
const formatHour = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getHours()}時`;
};

export default function Weather() {
  // 天気情報
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);


  // useEffect内で関数を定義（Reactの推奨パターン）
  useEffect(() => {
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
          setError(true);
      }
    };

    getWeather()
  }, [])

  if (error) return (
    <div className="weather">
      <p>天気を取得できませんでした</p>
    </div>
  );

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
            const hourData = weather.forecast.forecastday[0].hour[t];
            const Icon = weatherIconMap[hourData.condition.code] ?? WiCloud;
            return(
                <div key={t} className="weatherEach">
                  <Icon size={30} className="weatherIcon"/>
                  <div className="timeTemp">
                    <p className="time">{formatHour(hourData.time)}</p>
                    <p className="temp">{hourData.temp_c}℃</p>
                  </div>
                </div>
            )
          })}
        </div>

    </div>
  );
}

