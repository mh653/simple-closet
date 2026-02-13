import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default async function codeDetail(props) {

  const params = await props.params
  const codeId = params.codeId

  // コーデを取得する関数
  // eqで絞る
  const { data:code } = await supabase
    .from('t_coordinations')
    .select(`
      *,
      t_code_clothes (
        t_clothes (
          id,
          img_path
        )
      ),
      t_code_tags (
        t_tags (
          id,
          name
        )
      )
    `)
    .eq('id', codeId)
    .single()

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

  return (
    <>
      <h1>Simple Closet</h1>

      <h2>コーデ詳細</h2>

      <p>ID:{code.id}</p>

      {code.t_code_clothes.map((item) => (
          <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
      ))}

      <h3>メモ</h3>
      <p>{code.memo}</p>


      <h3>タグ</h3>
      {code.t_code_tags.map((tag) => (
          <p key={tag.t_tags.id}>{tag.t_tags.name}</p>
      ))}
      {/* {tags.map((t) => (
        <div key={t.id}>
          <p>ID:{t.id}</p>
          <p>作成日:{t.created_at}</p>
          <Link href={`/tag-codes/${t.id}`}>{t.name}</Link>
          <hr></hr>
        </div>
      ))} */}

      <h3>トップ画面にピン留めする</h3>
      <p>{String(code.pin)}</p>

      <h3>編集</h3>
      <h3>削除</h3>

    </>
  );
}

