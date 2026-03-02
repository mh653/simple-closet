'use client'

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react"
import Image from "next/image";

export default function SelectClothesModal({ clothes, setClothes, onClose }) {
  // カテゴリと紐づく服（アイテム）
  const[categoryClothes, setCategoryClothes] = useState([]);

  // t_clothesのデータを取得する関数
  const fetcCategoryClothes = async () => {
    const {data}  = await supabase
      .from('t_categories')
      .select(`
        id,
        name,
        t_clothes (
          id,
          img_path
        )
      `)
    setCategoryClothes(data || [])
  }

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  useEffect(() => {
    fetcCategoryClothes()
  }, [])


  // 服をトグルする関数
  const toggleClothes = (id) => {
    setClothes((prev) => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id)
      } else {
        if(prev.length >= 6) return prev
        return [...prev, id]
      }
    })
  }

  return (
    <div className="modalContent">
      <button onClick={onClose} className="grayBtn">選択して閉じる</button>
      {/* <p>アイテムを選択してください</p> */}
      <div className="modalClothes">

        {
        categoryClothes.map((ca) => (
          <section key={ca.id} className="itemsList">
            <h3>{ca.name}</h3>

            {
            ca.t_clothes.length > 0 ? (

              <div className="categoryItems categoryItemsModal">

                {ca.t_clothes.map((cl) => (
                  <div key={cl.id} onClick={() => toggleClothes(cl.id)} className="modalSelectWrapper">

                    <Image src={getImageUrl(cl.img_path)} width={100} height={100} alt="アイテム画像"
                    loading="lazy"
                    sizes="100px"/>

                    {clothes.includes(cl.id) && (
                      <div className="modalSelected">
                        <p>選択中</p>
                      </div>

                    )}

                  </div>
                ))}

              </div>

              ):(
                <p>アイテムはありません</p>
              )
              }

          </section>
        ))
        }

      </div>
    </div>
  );
}
