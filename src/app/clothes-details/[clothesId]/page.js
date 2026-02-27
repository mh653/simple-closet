// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 0

import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation"
import Image from "next/image";
import Link from "next/link";
import FromBackButton from "@/app/ui/FromBackButton";
import { BsTrash3Fill } from "react-icons/bs";

export default async function ClothesDetail(props) {
  // パラメータ受け取り
  const params = await props.params
  const clothesId = params.clothesId
  // どこから来たかのパラメータを受け取る
  const searchParams = await props.searchParams
  const from = searchParams?.from
  // このページのパス
  const currentPath = `/clothes-details/${clothesId}?from=${from}`

  // 服の情報を取得する
  const { data:clothes } = await supabase
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
    .maybeSingle()

  // 服が削除されていたら、ホームに戻す
  if (!clothes) {
    redirect("/")
  }

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
      <FromBackButton />

      <h2>アイテム詳細</h2>

      <div className="pcDetails">

        <div className="pcLeft">
          <section>
            <p className="idNum">Item:{clothesId}</p>
            <Image src={getImageUrl(clothes.img_path)} alt='アイテム画像' width={500} height={500} className="image" />
          </section>
        </div>

        <div className="pcRight">
          <section>
            <h3>カテゴリ</h3>
            <p>{clothes.t_categories.name}</p>
          </section>

          <section>
            <h3>メモ</h3>
            <div className="memoArea">{clothes.memo}</div>
          </section>
        </div>

      </div>

      <section>
        <h3>使用コーデ</h3>

        {!clothes.t_coode_clothes || clothes.t_coode_clothes.length === 0 ? (
          <p>使用コーデはありません</p>
        ) : (

          <div className="coodeThumbArea">

            {clothes.t_coode_clothes?.map((cc) => {
              const coode = cc.t_coordinations;
              return (
                <Link key={coode.id} href={`/coode-details/${coode.id}?from=${currentPath}`}>
                  <div className="coodeThumbWrapper">
                    <p className="idNum">No.{coode.id}</p>
                    <div className="coodeThumbImgWrapper">
                      {coode.t_coode_clothes?.map((cc2) => (
                        <Image key={cc2.t_clothes.id}
                          src={getImageUrl(cc2.t_clothes.img_path)} alt="アイテムサムネイル画像"
                          width={70} height={70} className="coodeThumbImg"
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}

          </div>

        )
        }
      </section>

      <div className="editDeleteButtons">
        <Link href={`/clothes-details/${clothesId}/edit-clothes/${clothesId}`}>
          <button>編集</button>
        </Link>
        <Link href={`/clothes-details/${clothesId}/delete-clothes/${clothesId}?from=${from}`}>
          <button>削除</button>
          {/* <button className="deleteButton"><BsTrash3Fill/></button> */}
        </Link>
      </div>

    </main>
  );
}


// supabase返り値の例
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
