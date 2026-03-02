// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 60

import { supabase } from "@/lib/supabaseClient"
import Image from "next/image";
import Link from "next/link";

export default async function tagCoode(props) {
  // パラメータ受け取り
  const params = await props.params
  const tagId = params.tagId
  // このページのパス
  const currentPath = `/tag-coodes/${tagId}`

  // タグIDに紐づくタグ名を取得する関数
  // supabaseの.select()は必ず配列で返すので、1件だけ取得したいなら.single()をつける
  // 返り値{ name: "寒い日" }をtagDataに格納する
  const { data:tagData } = await supabase
    .from('t_tags')
    .select('name')
    .eq('id', tagId)
    .single()

  // タグIDに紐づくコーデを取得する関数
  const { data:coodes } = await supabase
    .from('t_coordinations')
    .select(`
      *,
      t_coode_tags!inner (
        tags_id
      ),
      t_coode_clothes (
        t_clothes (
          id,
          img_path
        )
      )
    `)
    .eq('t_coode_tags.tags_id', tagId)

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  return (
    <main>
      <Link href="/">
        <button>戻る</button>
      </Link>
      {/* <h2>タグでコーデを検索</h2> */}

      <section>
        <div className="tagResult">
          <div className="tag">{tagData.name}</div>
          <p>の検索結果</p>
        </div>

        {!coodes || coodes.length === 0 ? (
          <p>このタグに登録されているコーデはありません</p>
        ) : (


            <div className="coodeThumbArea">
              {coodes.map((c) => (
                <Link key={c.id} href={`/coode-details/${c.id}?from=${currentPath}`} className="coodeThumbWrapper">
                    <p className="idNum">ID:{c.id}</p>
                    <div className="coodeThumbImgWrapper">
                      {c.t_coode_clothes.map((item) => (
                          <Image key={item.t_clothes.id}
                          src={getImageUrl(item.t_clothes.img_path)} alt='アイテムサムネイル画像'
                          width={200} height={200} className="coodeThumbImg"
                          loading="lazy"
                          sizes="(max-width: 768px) 25vw, 200px"/>
                      ))}
                    </div>
                </Link>
              ))}
            </div>




          // coodes.map((c) => (

          //   <Link key={c.id} href={`/coode-details/${c.id}?from=${currentPath}`}>
          //     <div>
          //       <p className="idNum">ID:{c.id}</p>

          //       {c.t_coode_clothes.map((item) => (
          //           <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
          //       ))}

          //     </div>
          //   </Link>

          // ))




        )}
      </section>

    </main>
  )
}


// supabase返り値の例
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
