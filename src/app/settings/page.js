'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);

  // ログイン判定
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };
  useEffect(() => {
    getUser()
  }, [])

  // ログイン
  const login = async () => {
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      alert("ログイン失敗")
      return;
    }
    alert("ログインしました")
    getUser()
    setEmail("")
    setPassword("")
  }

  // ログアウト
  const logout = async () => {
    const {error} = await supabase.auth.signOut()
    if (error) {
      alert("ログアウト失敗")
      return;
    }
    alert("ログアウトしました")
    getUser()
  }

  // 位置情報を取得
  const fetchLocation = async () => {
    if(!navigator.geolocation) {
      alert("このブラウザは位置情報に対応していません");
      return;
    };
    // 連打防止
    if(loading) {
      return;
    };
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // 位置情報の取得に成功した時
        const { latitude, longitude } = pos.coords;
        // console.log( latitude, longitude );
        localStorage.setItem("weatherQuery", `${latitude},${longitude}`);
        alert("天気の地点を変更しました！")
        setLoading(false)
      },
      (error) => {
        // 位置情報の取得に失敗した時
        console.log(error);
        alert("位置情報の取得に失敗しました")
        setLoading(false)
      }
    )
  }

  return (
    <div>
      <h2>設定</h2>

      <h3>ログイン</h3>
      <p>デフォルトでは閲覧のみ可能です。</p>
      <p>ポートフォリオサイトに記載のIDとパスワードでログインして頂くと、登録・削除のアクションが可能になります。</p>
      <p>定期的にデータベースをリセットしていますので、お気軽にお試しください。</p>

      {user ? (
        <button onClick={() => logout()}>ログアウトする</button>
      ) : (
        <>
          <label><p>ID：</p><input type="text" onChange={(e) => setEmail(e.target.value)} value={email}></input></label>
          <label><p>パスワード：</p><input type="password" onChange={(e) => setPassword(e.target.value)} value={password}></input></label>
          <br></br>
          <button onClick={() => login()}>ログイン</button>        
        </>
      )}

      <h3>天気の地点</h3>
      <p>初期設定で東京の天気を表示しています。</p>
      <p>下記ボタンで位置情報を取得し、現在地に変更頂けます。</p>
      <p>（位置情報はローカルストレージに保存されます）</p>

      {loading ? (
        <button disabled>取得中…</button>
      ) : (
        <button onClick={() => fetchLocation()}>位置情報を取得する</button>
      )}

      <h3>タグの編集</h3>
      <p>下記ボタンからタグを新規作成・編集・削除して頂けます。</p>
      <Link href={"settings/tag-settings"}>
        <button>タグを編集する</button>
      </Link>

    </div>
  );
}






// 'use client'

// import Link from "next/link";
// import { useState, useEffect } from "react";

// export default function Header() {

//   const [weather, setWeather] = useState(null);
//   const [locationName, setLocationName] = useState("Tokyo")

//   useEffect(() => {
//     console.log(weather);
//   }, [weather]);

//   const fetchWeather = async () => {
//     if(!navigator.geolocation) {
//       alert("このブラウザは位置情報に対応していません");
//       return;
//     };

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         try {
//           const { latitude, longitude } = pos.coords;
//           console.log( latitude, longitude );

//           const weatherRes = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`)
//           const weatherData = await weatherRes.json();
//           setWeather(weatherData)

//           setLocationName(weatherData.location.name)

//         } catch(err) {
//             console.error('天気情報取得エラー', err);
//         }
//         },
//       (error) => {
//         console.log("位置情報取得エラー", error);
//       }
//     )
//   }

//   return (
//     <div>
//       <h2>設定</h2>

//       <h3>天気の地点</h3>
//       <p>設定地点：{locationName}</p>

//       <p>初期設定は東京です。</p>
//       <p>下記ボタンで位置情報を取得し、現在地に変更頂けます。</p>
//       <p>（位置情報はローカルストレージに保存されます）</p>
//       <button onClick={() => fetchWeather()}>位置情報を取得する</button>

//       <h3>タグの編集</h3>
//       <p>下記ボタンからタグを新規作成・編集・削除して頂けます。</p>
//       <Link href={"settings/tag-settings"}>
//         <button>タグを編集する</button>
//       </Link>

//     </div>
//   );
// }
