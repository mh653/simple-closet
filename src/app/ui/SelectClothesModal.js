'use client'

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useState, useEffect } from "react"

export default function SelectClothesModal({ clothes, setClothes, onClose }) {

  const[allClothes, setAllClothes] = useState([]);

  // t_clothesのデータを取得する関数
  const fetchAllClothes = async () => {
    const {data}  = await supabase
      .from('t_clothes')
      .select(`
          id,
          img_path
      `)
      .order('created_at', {ascending: false})
    setAllClothes(data || [])
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
    fetchAllClothes()
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
      <button onClick={onClose}>閉じる</button>
      <p>服を選択してください</p>

      {allClothes.map((c) => (
        <div key={c.id} onClick={() => toggleClothes(c.id)}>

          <Image src={getImageUrl(c.img_path)} width={100} height={100} alt=""/>

          {clothes.includes(c.id) && (
            <p>選択中</p>
          )}

        </div>
      ))}

    </div>
  );
}




// import { supabase } from "@/lib/supabaseClient";
// import Image from "next/image";

// export default async function SelectClothesModal({ clothes, setClothes, onClose }) {

//   // t_clothesのデータを取得する関数
//   const { data:allClothes } = await supabase
//     .from('t_clothes')
//     .select(`
//         id,
//         img_path
//     `)
//     .order('created_at', {ascending: false})

//   // ストレージの画像URLを取得する関数
//   const getImageUrl = (imgPath) => {
//     if(!imgPath) return null;

//     const { data } = supabase.storage
//       .from('clothes_image')
//       .getPublicUrl(imgPath)

//     return data.publicUrl
//   }

//   // 服をトグルする関数
//   const toggleClothes = (id) => {
//     setClothes((prev) => {
//       if (prev.includes(id)) {
//         return prev.filter(c => c !== id)
//       } else {
//         if(prev.length >= 6) return prev
//         return [...prev, id]
//       }
//     })
//   }

//   return (
//     <div className="modalContent">
//       <button onClick={onClose}>閉じる</button>
//       <p>服を選択してください</p>

//       {allClothes.map((c) => (
//         <div key={c.id} onClick={() => toggleClothes(c.id)}>

//           <Image src={getImageUrl(c.img_path)} width={100} height={100} alt=""/>

//           {clothes.includes(c.id) && (
//             <p>選択中</p>
//           )}

//         </div>
//       ))}

//     </div>
//   );
// }
