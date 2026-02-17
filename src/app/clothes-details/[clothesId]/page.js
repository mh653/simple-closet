// 編集機能を付けるために、clothesをステートにしています

'use client'

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ClothesDetail() {

  const router = useRouter();
  const { clothesId } = useParams();
  const [clothes, setClothes] = useState(null);

  // const [editMode, setEditMode] = useState(false);
  // const [memo, setMemo] = useState(clothes.memo);

  useEffect(() => {
    if (!clothesId) return;

    fetchClothes()

  }, [clothesId])


  // 服の情報を取得する関数
  const fetchClothes = async () => {
    const { data } = await supabase
      .from('t_clothes')
      .select(`
        *,
        t_categories(name),
        t_coode_clothes(
          t_coordinations(
            id,
            memo,
            t_coode_clothes(
              t_clothes(
                id,
                img_path
              )
            )
          )
        )
      `)
      .eq('id', clothesId)
      .single()
    setClothes(data || null)
  }

  // 返り値
  // {
  //   id: 2,
  //   created_at: "（登録時刻）",
  //   img_path: "2.jpg",
  //   category: 4,
  //   memo: "家で洗ったら色落ちした。ウエストが苦しいので食べ放題には不向き。",

  //   t_categories: {
  //     name: "ボトムス"
  //   },

  //   t_code_clothes: [
  //     {
  //       t_coordinations: {
  //         id: 1,
  //         memo: "ヒートテックは紺がベスト。",
  //         t_code_clothes: [
  //           {
  //             t_clothes: { id: 1, img_path: "1.jpg" }
  //           },
  //           {
  //             t_clothes: { id: 2, img_path: "2.jpg" }
  //           },
  //           {
  //             t_clothes: { id: 3, img_path: "3.jpg" }
  //           }
  //         ]
  //       }
  //     },
  //     {
  //       t_coordinations: {
  //         id: 2,
  //         memo: "ポンチョが無いと地味。温度調節しにくい。",
  //         t_code_clothes: [
  //           {
  //             t_clothes: { id: 2, img_path: "2.jpg" }
  //           },
  //           {
  //             t_clothes: { id: 4, img_path: "4.jpg" }
  //           }
  //         ]
  //       }
  //     }
  //   ]
  // }

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  // 削除関数
  const deleteClothes = async (id) => {
    const { error } = await supabase
      .from("t_clothes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("削除失敗");
      return;
    }

    alert("削除成功");
  };

  // fechClothes成功前に本来のDOMを描画しようとするとエラーになるので
  if (!clothes) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      <button onClick={() => router.back()}>戻る</button>

      <h2>服の詳細</h2>

      <p>ID:{clothesId}</p>

      <Image src={getImageUrl(clothes.img_path)} alt='' width={100} height={100} />

      <h3>メモ</h3>
      <p>{clothes.memo}</p>


      <h3>カテゴリ</h3>
      <p>{clothes.t_categories.name}</p>

      <h3>使用コーデ</h3>
        {clothes.t_coode_clothes?.map((cc) => {
          const coode = cc.t_coordinations;
          if (!coode) return null;

          return (
            <Link key={coode.id} href={`/coode-details/${coode.id}`}>
              <div>
                {coode.t_coode_clothes?.map((cc2) => (
                  <Image
                    key={cc2.t_clothes.id}
                    src={getImageUrl(cc2.t_clothes.img_path)}
                    alt=""
                    width={100}
                    height={100}
                  />
                ))}
              </div>
            </Link>
          );
        })}

      <button>編集</button>
      <button onClick={() => deleteClothes(clothesId)}>削除</button>

    </>
  );
}




// 'use client'

// import { supabase } from "@/lib/supabaseClient";
// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";


// export default function ClothesDetail() {

//   const { clothesId } = useParams();

//   const [clothes, setClothes] = useState(null);
//   const [coodeIds, setCoodeIds] = useState([]);
//   const [coode, setCoode] = useState([]);
//   const router = useRouter();

//   // const [editMode, setEditMode] = useState(false);
//   // const [memo, setMemo] = useState(clothes.memo);

//   useEffect(() => {
//     if (!clothesId) return;

//     fetchClothes()
//     fetchCoodes()
//     // fetchCoode()

//   }, [clothesId])

//   useEffect(() => {
//   if (coodeIds.length === 0) return;

//   fetchCoode()
// }, [coodeIds])

//   // 服の情報を取得する関数
//   const fetchClothes = async () => {
//     const { data } = await supabase
//       .from('t_clothes')
//       .select(`
//         *,
//         t_categories (
//           name
//         )
//       `)
//       .eq('id', clothesId)
//       .single()
//     setClothes(data || null)
//   }

//   // ストレージの画像URLを取得する関数
//   const getImageUrl = (imgPath) => {
//     if(!imgPath) return null;

//     const { data } = supabase.storage
//       .from('clothes_image')
//       .getPublicUrl(imgPath)

//     return data.publicUrl
//   }


//   // その服に使われてるコーデIDを取得
//   const fetchCoodes = async () => {
//     const { data } = await supabase
//     .from('t_coode_clothes')
//     .select('coode_id')
//     .eq('clothes_id', clothesId)

//     // 返り値
//     // codes = [
//     //   { code_id: 1 },
//     //   { code_id: 2 }
//     // ]

//     // 配列だけ取り出す　[1, 2]
//     const ids = data?.map(c => c.coode_id) || []
//     setCoodeIds(ids)
//   }



//   // コーデを取得する関数
//   // IN句で、id が codeIds 配列のどれかに一致するものを取ってくる
//   const fetchCoode = async () => {
//     const { data } = await supabase
//       .from('t_coordinations')
//       .select(`
//         *,
//         t_coode_clothes (
//           t_clothes (
//             id,
//             img_path
//           )
//         )
//       `)
//       .in('id', coodeIds)
//     setCoode(data || [])
//   }


//   if (!clothes) {
//     return (
//       <>
//         <h1>Simple Closet</h1>
//         <p>Loading...</p>
//       </>
//     );
//   }

//   return (
//     <>
//       <h1>Simple Closet</h1>

//       <button onClick={() => router.back()}>戻る</button>

//       <h2>服の詳細</h2>

//       <p>ID:{clothesId}</p>

//       <Image src={getImageUrl(clothes.img_path)} alt='' width={100} height={100} />

//       <h3>メモ</h3>
//       <p>{clothes.memo}</p>


//       <h3>カテゴリー</h3>
//       <p>{clothes.t_categories.name}</p>

//       <h3>使用コーデ</h3>
//       <p>{coodeIds}</p>
//       {coode?.map((co) => (
//         <Link key={co.id} href={`/coode-details/${co.id}`}>
//           {co.t_coode_clothes.map((cp) => (
//             <Image
//               key={cp.t_clothes.id}
//               src={getImageUrl(cp.t_clothes.img_path)}
//               alt=""
//               width={100}
//               height={100}
//             />
//           ))}
//         </Link>
//       ))}

//       <h3>編集</h3>
//       <h3>削除</h3>

//     </>
//   );
// }
