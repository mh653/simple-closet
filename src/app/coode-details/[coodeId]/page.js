'use client'

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CoodeDetail() {

  const router = useRouter();
  const { coodeId } = useParams();
  const [coode, setCoode] = useState(null);

  useEffect(() => {
    if (!coodeId) return;

    fetchCoode()

  }, [coodeId])

  // コーデを取得する関数
  // eqで絞る
  const fetchCoode = async () => {
    const { data } = await supabase
      .from('t_coordinations')
      .select(`
        *,
        t_coode_clothes (
          t_clothes (
            id,
            img_path
          )
        ),
        t_coode_tags (
          t_tags (
            id,
            name
          )
        )
      `)
      .eq('id', coodeId)
      .single()
    setCoode(data || null)
  }

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  // 返ってくるデータ構造
  // [
  //   {
  //     id: 1,
  //     memo: "...",
  //     t_coode_clothes: [
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

  // 削除関数
  const deleteCoordination = async (id) => {
    const { error } = await supabase
      .from("t_coordinations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("削除失敗");
      return;
    }

    alert("削除成功");
  };


  // fechCoode成功前に本来のDOMを描画しようとするとエラーになるので
  if (!coode) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <>
      <button onClick={() => router.back()}>戻る</button>

      <h2>コーデ詳細</h2>

      <p>ID:{coodeId}</p>

      {coode.t_coode_clothes.map((item) => (
        <Link key={item.t_clothes.id} href={`/clothes-details/${item.t_clothes.id}`}>
          <Image src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
        </Link>
      ))}

      <h3>メモ</h3>
      <p>{coode.memo}</p>


      <h3>タグ</h3>
      {coode.t_coode_tags.map((tag) => (
          <p key={tag.t_tags.id}>{tag.t_tags.name}</p>
      ))}

      <h3>トップ画面にピン留めする</h3>
      <p>{String(coode.pin)}</p>

      <button>編集</button>
      <button onClick={() => deleteCoordination(coodeId)}>削除</button>

    </>
  );
}





// // クライアント化して編集機能を追加予定

// import { supabase } from "@/lib/supabaseClient";
// import Image from "next/image";
// import Link from "next/link";

// export default async function coodeDetail(props) {

//   const params = await props.params
//   const coodeId = params.coodeId

//   // コーデを取得する関数
//   // eqで絞る
//   const { data:coode } = await supabase
//     .from('t_coordinations')
//     .select(`
//       *,
//       t_coode_clothes (
//         t_clothes (
//           id,
//           img_path
//         )
//       ),
//       t_coode_tags (
//         t_tags (
//           id,
//           name
//         )
//       )
//     `)
//     .eq('id', coodeId)
//     .single()

//   // ストレージの画像URLを取得する関数
//   const getImageUrl = (imgPath) => {
//     if(!imgPath) return null;

//     const { data } = supabase.storage
//       .from('clothes_image')
//       .getPublicUrl(imgPath)

//     return data.publicUrl
//   }


//   // 返ってくるデータ構造
//   // [
//   //   {
//   //     id: 1,
//   //     memo: "...",
//   //     t_coode_clothes: [
//   //       {
//   //         t_clothes: {
//   //           img_path: "1.jpg"
//   //         }
//   //       },
//   //       {
//   //         t_clothes: {
//   //           id: "2"
//   //           img_path: "2.jpg"
//   //         }
//   //       }
//   //     ]
//   //   }
//   // ]

//   return (
//     <>
//       <h2>コーデ詳細</h2>

//       <p>ID:{coode.id}</p>

//       {coode.t_coode_clothes.map((item) => (
//           <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
//       ))}

//       <h3>メモ</h3>
//       <p>{coode.memo}</p>


//       <h3>タグ</h3>
//       {coode.t_coode_tags.map((tag) => (
//           <p key={tag.t_tags.id}>{tag.t_tags.name}</p>
//       ))}
//       {/* {tags.map((t) => (
//         <div key={t.id}>
//           <p>ID:{t.id}</p>
//           <p>作成日:{t.created_at}</p>
//           <Link href={`/tag-coodes/${t.id}`}>{t.name}</Link>
//           <hr></hr>
//         </div>
//       ))} */}

//       <h3>トップ画面にピン留めする</h3>
//       <p>{String(coode.pin)}</p>

//       <h3>編集</h3>
//       <h3>削除</h3>

//     </>
//   );
// }

