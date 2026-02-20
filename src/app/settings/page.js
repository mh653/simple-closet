'use client'

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {

  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("Tokyo")

  useEffect(() => {
    console.log(weather);
  }, [weather]);

  const fetchWeather = async () => {
    if(!navigator.geolocation) {
      alert("このブラウザは位置情報に対応していません");
      return;
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          console.log( latitude, longitude );

          const weatherRes = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`)
          const weatherData = await weatherRes.json();
          setWeather(weatherData)

          setLocationName(weatherData.location.name)

        } catch(err) {
            console.error('天気情報取得エラー', err);
        }
        },
      (error) => {
        console.log("位置情報取得エラー", error);
      }
    )
  }

  return (
    <div>
      <h2>設定</h2>

      <h3>天気の地点</h3>
      <p>設定地点：{locationName}</p>

      <p>初期設定は東京です。</p>
      <p>下記ボタンで位置情報を取得し、現在地に変更頂けます。</p>
      <button onClick={() => fetchWeather()}>位置情報を取得する</button>

      <h3>タグの編集</h3>
      <p>下記ボタンからタグを新規作成・編集・削除して頂けます。</p>
      <Link href={"settings/tag-settings"}>
        <button>タグを編集する</button>
      </Link>

    </div>
  );
}
