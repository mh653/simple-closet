'use client'

import { supabase } from "@/lib/supabaseClient"
import { useState,useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function tagCode() {
  const { tagId } = useParams();
  const [codes, setCodes] = useState([]);
  const [tagName, setTagName] = useState('');

  // App Router の useParams() は最初 undefined になることがある
  useEffect(() => {
    if (!tagId) return
    fetchCodes()
    fetchTagName()
  }, [tagId]);

  // タグIDに紐づくタグ名を取得する関数
  // supabaseの.select()は必ず配列で返すので、1件だけ取得したいなら.single()をつける
  // 返り値は{ name: "寒い日" }
  const fetchTagName = async () => {
    const { data, error } = await supabase
      .from('t_tags')
      .select('name')
      .eq('id', tagId)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setTagName(data.name)
  }

  // タグIDに紐づくコーデを取得する関数
  // eqで指定されたIDだけに絞る
  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from('t_coordinations')
      .select(`
        *,
        t_code_tags!inner (
          tags_id
        ),
        t_code_clothes (
          t_clothes (
            id,
            img_path
          )
        )
      `)
      .eq('t_code_tags.tags_id', tagId)

    if (error) {
      console.error(error)
      return
    }

    setCodes(data || [])
  }

  // 返ってくるデータ構造
  // [
  //   {
  //     id: 1,
  //     memo: "...",
  //     t_code_clothes: [
  //       {
  //         t_clothes: {
  //           img_path: "1.jpg"
  //         }
  //       },
  //       {
  //         t_clothes: {
  //           id: "2"
  //           img_path: "2.jpg"
  //         }
  //       }
  //     ]
  //   }
  // ]

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
      <p>{tagName} の検索結果</p>
      {codes.map((c) => (
        <div key={c.id}>
          <p>コーデID:{c.id}</p>

          {c.t_code_clothes.map((item) => (
              <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={300} height={300} />
          ))}

          <hr></hr>
        </div>
      ))}
    </>
  )
}
