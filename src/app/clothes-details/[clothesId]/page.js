// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 0

import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation"
import Image from "next/image";
import Link from "next/link";
import FromBackButton from "@/app/ui/FromBackButton";

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
    <>
      <FromBackButton />

      <h2>アイテム詳細</h2>

      <p>ID:{clothesId}</p>
      <Image src={getImageUrl(clothes.img_path)} alt='' width={300} height={300} />

      <h3>メモ</h3>
      <p>{clothes.memo}</p>

      <h3>カテゴリ</h3>
      <p>{clothes.t_categories.name}</p>

      <h3>使用コーデ</h3>

      {!clothes.t_coode_clothes || clothes.t_coode_clothes.length === 0 ? (
        <p>使用コーデはありません</p>
      ) : (

        clothes.t_coode_clothes?.map((cc) => {
          const coode = cc.t_coordinations;
          return (
            <Link key={coode.id} href={`/coode-details/${coode.id}?from=${currentPath}`}>
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
        })
      )
    }

      <Link href={`/clothes-details/${clothesId}/edit-clothes/${clothesId}`}>
        <button>編集</button>
      </Link>
      <Link href={`/clothes-details/${clothesId}/delete-clothes/${clothesId}?from=${from}`}>
        <button>削除</button>
      </Link>

    </>
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
