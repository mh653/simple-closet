// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 0

import { supabase } from "@/lib/supabaseClient"
import Image from "next/image";
import Link from "next/link";

export default async function Clothes() {
  // このページのパス
  const currentPath = `/clothes`

  // カテゴリIDに紐づくカテゴリ名と服データを取得
  const { data:categoryClothes } = await supabase
    .from('t_categories')
    .select(`
      id,
      name,
      t_clothes (
        id,
        img_path
      )
    `)

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
      <h2>アイテム一覧</h2>

        {
        categoryClothes.map((ca) => (
          <section key={ca.id} className="itemsList">
            <h3>{ca.name}</h3>

            {
            ca.t_clothes.length > 0 ? (

            <div className="categoryItems">

              {ca.t_clothes.map((cl) => (
                <Link key={cl.id} href={`/clothes-details/${cl.id}?from=${currentPath}`}>
                  <div>
                    <Image src={getImageUrl(cl.img_path)} alt='' width={100} height={100} />
                  </div>
                </Link>
              ))}

            </div>

            ):(
              <p>アイテムはありません</p>
            )
            }

          </section>
        ))
        }

    </main>
  )
}

// supabase返り値の例
// {
//   "name": "ボトムス",
//   "t_clothes": [
//     {
//       "id": 2,
//       "img_path": "2.jpg"
//     },
//     {
//       "id": 4,
//       "img_path": "4.jpg"
//     }
//   ]
// }
