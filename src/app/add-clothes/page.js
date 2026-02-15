'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AddClothes() {

  const[file, setFile] = useState(null);
  const[memo, setMemo] = useState("");
  const[categoryId, setCategoryId] = useState(null);

  const handleUpload = async (e) => {
    console.log(file)
    console.log(typeof file)

    e.preventDefault()

    if(!file) {
      alert("画像を選択してください")
      return
    }

    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("clothes_image")
      .upload(fileName, file)

    if (uploadError) {
      console.log(uploadError);
      return;
    }

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
      console.log(insertError);
      return;
    }

    alert("登録完了！")
    setMemo("")
    setCategoryId(null)
    setFile(null)
  }

  return (
    <>
      <h2>服の登録</h2>

      <form onSubmit={handleUpload}>
        <p>服の写真</p>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <p>カテゴリー</p>
        <select onChange={(e) => setCategoryId(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>

        <p>メモ</p>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}/>

        <button type="submit">登録</button>

      </form>
    </>
  )
}