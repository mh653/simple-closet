import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  // ピン留めコーデを取得する関数
  // eqで絞る
  const { data:coodes } = await supabase
    .from('t_coordinations')
    .select(`
      *,
      t_coode_clothes (
        t_clothes (
          id,
          img_path
        )
      )
    `)
    .eq('pin', true)

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  // t_tagsのデータを取得する関数（コーデと紐づいてるものだけ）
  const { data: tags } = await supabase
    .from('t_tags')
    .select(`
      *,
      t_coode_tags!inner (
        id
      )
    `)
    .order('created_at', {ascending: false})

  return (
    <>
      <h2>ピン留めしたコーデ</h2>
      {
      coodes ? (
        coodes.map((c) => (
          <Link key={c.id} href={`/coode-details/${c.id}`}>
            <div>
              <p>コーデID:{c.id}</p>

              {c.t_coode_clothes.map((item) => (
                  <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
              ))}

            </div>
          </Link>
        ))
      ):(
        <p>ピン留めされているコーデはありません</p>
      )
      }

      <h2>タグでコーデを検索</h2>
      {tags ? (
        tags.map((t) => (
          <div key={t.id}>
            <p>ID:{t.id}</p>
            <p>作成日:{t.created_at}</p>
            <Link href={`/tag-coodes/${t.id}`}>{t.name}</Link>
            <hr></hr>
          </div>
        ))
      ):(
        <p>登録されているタグはありません</p>        
      )
      }
    </>
  );
}





// 'use client'

// import { supabase } from "@/lib/supabaseClient";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   const [clothes, setClothes] = useState([]);
//   const [tags, setTags] = useState([]);

//   useEffect(() => {
//     fetchClothes()
//     fetchTags()
//   }, [])

//   // t_clothesのデータを取得する関数
//   const fetchClothes = async () => {
//     const { data } = await supabase
//       .from('t_clothes')
//       .select(`
//         *,
//         t_categories (
//           name
//         )
//       `)
//       .order('created_at', {ascending: false})
//     setClothes(data  || [])
//   }

//   // ストレージの画像URLを取得する関数
//   const getImageUrl = (imgPath) => {
//     if(!imgPath) return null;

//     const { data } = supabase.storage
//       .from('clothes_image')
//       .getPublicUrl(imgPath)

//     return data.publicUrl
//   }

//   // t_tagsのデータを取得する関数（コーデと紐づいてるものだけ）
//   const fetchTags = async () => {
//     const { data } = await supabase
//       .from('t_tags')
//       .select(`
//         *,
//         t_coode_tags!inner (
//           id
//         )
//       `)
//       .order('created_at', {ascending: false})
//     setTags(data  || [])
//   }

//   return (
//     <>
//       <h1>Simple Closet</h1>

//       {clothes.map((c) => (
//         <div key={c.id}>
//           <Image src={getImageUrl(c.img_path)} alt='' width={300} height={300} />
//           <p>ID:{c.id}</p>
//           <p>作成日:{c.created_at}</p>
//           <p>画像パス:{c.img_path}</p>
//           <p>カテゴリ名:{c.t_categories?.name}</p>
//           <p>メモ:{c.memo}</p>
//           <hr></hr>
//         </div>
//       ))}

//       {tags.map((t) => (
//         <div key={t.id}>
//           <p>ID:{t.id}</p>
//           <p>作成日:{t.created_at}</p>
//           <p>タグ名:{t.name}</p>
//           <Link href={`/tag-coodes/${t.id}`}>{t.name}</Link>
//           <hr></hr>
//         </div>
//       ))}


//     </>

//   );
// }
