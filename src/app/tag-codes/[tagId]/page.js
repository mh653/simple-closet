import { supabase } from "@/lib/supabaseClient"
import Image from "next/image";
import Link from "next/link";

export default async function tagCode(props) {
  const params = await props.params
  const tagId = params.tagId

  // タグIDに紐づくタグ名を取得する関数
  // supabaseの.select()は必ず配列で返すので、1件だけ取得したいなら.single()をつける
  // 返り値{ name: "寒い日" }をtagDataに格納する
  const { data:tagData } = await supabase
    .from('t_tags')
    .select('name')
    .eq('id', tagId)
    .single()

  // タグIDに紐づくコーデを取得する関数
  const { data:codes } = await supabase
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
      <h2>タグでコーデを検索</h2>
      <p>{tagData.name} の検索結果</p>
      {codes.map((c) => (

        <Link key={c.id} href={`/code-details/${c.id}`}>
          <div>
            <p>コーデID:{c.id}</p>

            {c.t_code_clothes.map((item) => (
                <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
            ))}

          </div>
        </Link>

      ))}
    </>
  )
}
