'use client'

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    fetchClothes()
  }, [])

  // t_clothesのデータを取得する関数
  const fetchClothes = async () => {
    const { data } = await supabase
      .from('t_clothes')
      .select(`
        *,
        t_categories (
          name
        )
      `)
      .order('created_at', {ascending: false})
    setClothes(data  || [])
  }

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  return (
    <>
      <h1>Simple Closet</h1>
      {clothes.map((c) => (
        <div key={c.id}>
          <Image src={getImageUrl(c.img_path)} alt='' width={300} height={300} />
          <p>ID:{c.id}</p>
          <p>作成日:{c.created_at}</p>
          <p>画像パス:{c.img_path}</p>
          <p>カテゴリ名:{c.t_categories?.name}</p>
          <p>メモ:{c.memo}</p>
          <hr></hr>
        </div>
      ))}
    </>

  );
}
