'use client'

import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import FileResizer from "react-image-file-resizer";
import Note from "../ui/Note";

export default function AddClothes() {
  // ルータ
  const router = useRouter();

  // 登録内容
  const[file, setFile] = useState(null);
  const[categoryId, setCategoryId] = useState(null);
  const[memo, setMemo] = useState("");

  // ログイン判定
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };
  useEffect(() => {
    getUser()
  }, [])

  // ライブラリのリサイズ
  const resizeImage = (file) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,    // リサイズ対象のファイル
      500,     // 横500px固定
      3000,    // 縦は十分大きくして自動計算させる
      "JPEG",  // 出力形式
      90,      // 画質（JPEGの場合1〜100）
      0,       // 回転角度
      (resizedFile) => {
        resolve(resizedFile);
      },
      // リサイズ完了後に呼ばれる関数（コールバック関数）
      // 引数 resizedFile にリサイズ後の画像が入る
      // Promiseの resolve で返すことで await で使えるようにしています
      "file"
      // 出力タイプ（"file" or "base64"）
      // "file" → Blob/File オブジェクトとして出力。そのまま SupabaseやFormDataに送信可能
      // "base64" → Base64文字列として出力。imgタグの src にそのまま使える
    );
  });
  //  FileResizer.imageFileResizer は コールバック関数方式
  // 「リサイズが終わったら次の処理をしたい」とき、通常の async/await では扱えないので、
  // Promiseで包むことで、await resizeImage(file) のように非同期処理を待てるようにする
  // resolve(resizedFile) が呼ばれた時点で Promise が完了し、次の処理に進める

  const addClothes = async () => {
    if (!user) {
      alert("権限がありません（ログインしてください）");
      return;
    }
    if(!file) {
      alert("画像を選択してください")
      return
    }
    if (!["image/jpeg", "image/heic", "image/heif"].includes(file.type)) {
      alert("JPEGのみアップロード可能です");
      return;
    }
    if(!categoryId) {
      alert("カテゴリを選択してください")
      return
    }

    const resizedFile = await resizeImage(file);
    const fileName = `${Date.now()}.jpg`;

    // ストレージに追加
    const { error: uploadError } = await supabase.storage
      .from("clothes_image")
      .upload(fileName, resizedFile)
    if (uploadError) {
      console.log(uploadError);
      alert("画像アップロードに失敗しました")
      return;
    }

    // テーブルに追加
    const { error: insertError } = await supabase
      .from("t_clothes")
      .insert([
        {
          img_path: fileName,
          category: categoryId,
          memo: memo,
        },
      ]);
    if (insertError) {
      await supabase.storage.from("clothes_image").remove([fileName])
      console.log(insertError);
      alert("テーブル登録に失敗しました")
      return
    }

    router.push(`/add-clothes/result`);
  }

  return (
    <main>
      <h2>アイテム登録</h2>
      
      <section>
        <h3>アイテム画像（必須）</h3>
        <p>※JPEG推奨</p>
        <input type="file" accept="image/jpeg,image/heic,image/heif" onChange={(e) => setFile(e.target.files[0])}/>        
      </section>

      <section>
        <h3>カテゴリ（必須）</h3>
        <select onChange={(e) => setCategoryId(Number(e.target.value))}>
          <option value={""}>--選択してください--</option>
          <option value={1}>トップス - 半袖/袖なし</option>
          <option value={2}>トップス - 長袖</option>
          <option value={3}>トップス - その他</option>
          <option value={4}>ボトムス</option>
          <option value={5}>オールインワン</option>
          <option value={6}>アウター</option>
          <option value={7}>靴</option>
          <option value={8}>靴下</option>
          <option value={9}>バッグ</option>
          <option value={10}>アクセサリー</option>
          <option value={11}>その他</option>
        </select>        
      </section>

      <section>
        <h3>メモ</h3>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}/>        
      </section>

      <button onClick={() => addClothes()}>登録</button>
      
      <Note />

    </main>
  )
}