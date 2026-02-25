'use client'

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  // ログイン情報
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // 位置情報取得中
  const [loading, setLoading] = useState(false);

  // ログイン判定
  const [user, setUser] = useState(undefined);
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
        localStorage.setItem("weatherQuery", `${latitude},${longitude}`);
        alert("天気の場所を変更しました！")
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

  if (user === undefined) {
    return <p>読み込み中...</p>;
  }

  return (
    <main className="settings">
      <h2>設定</h2>

      <section>
        <h3>・ログイン</h3>
        <p>デフォルトでは閲覧のみ可能です。</p>
        <p>ポートフォリオサイトに記載のIDとパスワードでログインして頂くと、登録や削除が可能になります。</p>
        <p>定期的にDBをリセットしていますので、お気軽にお試しください。</p>
        <div className="loginSec">
          {user ? (
            <button onClick={() => logout()}>ログアウトする</button>
          ) : (
            <>
              <label><p>ID</p><input type="text" onChange={(e) => setEmail(e.target.value)} value={email}></input></label>
              <label><p>パスワード</p><input type="password" onChange={(e) => setPassword(e.target.value)} value={password}></input></label>
              <br></br>
              <div>

              </div>
              <button onClick={() => login()}>ログイン</button>
            </>
          )}
        </div>
      </section>

      <section>
        <h3>・天気の場所</h3>
        <p>デフォルトで東京の天気を表示しています。</p>
        <p>下記ボタンで位置情報を取得し、現在地に変更頂けます。</p>
        <p>（位置情報はローカルストレージに保存されます）</p>

        {loading ? (
          <button disabled>取得中…</button>
        ) : (
          <button onClick={() => fetchLocation()}>位置情報を取得する</button>
        )}
      </section>

      <section>
        <h3>・タグの編集</h3>
        <p>下記ボタンからタグを新規作成・編集・削除して頂けます。</p>
        <Link href={"settings/tag-settings"}>
          <button>タグを編集する</button>
        </Link>
      </section>


    </main>
  );
}

