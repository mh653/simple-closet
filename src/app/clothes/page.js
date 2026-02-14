// 戻ってきたときに一覧表示にならないのでなんとかする

'use client'

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Clothes() {
  const [showAll, setShowAll] = useState(false);
  const [clothes, setClothes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchClothes()
    fetchCategories()
  }, [])

  // t_clothesのデータを取得する関数
  const fetchClothes = async () => {
    const { data } = await supabase
      .from('t_clothes')
      .select(`
        *
      `)
      .order('created_at', {ascending: false})
    setClothes(data || [])
  }

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  // t_categoriesのデータを取得する関数
  const fetchCategories = async () => {
    const { data } = await supabase
      .from('t_categories')
      .select(`
        *
      `)
      .order('created_at', {ascending: false})
    setCategories(data || [])
  }

  return (
    <>
      <h1>Simple Closet</h1>

      <p onClick={() => setShowAll(false)}>カテゴリ別</p>
      <p onClick={() => setShowAll(true)}>一覧表示</p>
      
      {showAll ? (
        <div>
          <h2>服の一覧</h2>
          {clothes.map((c) => (
            <Link key={c.id} href={`/clothes-details/${c.id}`}>
              <div>
                <p>服ID:{c.id}</p>
                <Image src={getImageUrl(c.img_path)} alt='' width={100} height={100} />
              </div>
            </Link>
          ))}          
        </div>
      ) : (
        <div>
          <h2>カテゴリ別</h2>
          {categories.map((category) => (
            <div key={category.id}>
              <p>ID:{category.id}</p>
              <Link href={`/category-clothes/${category.id}`}>{category.name}</Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}