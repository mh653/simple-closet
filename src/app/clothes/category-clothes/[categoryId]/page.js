import { supabase } from "@/lib/supabaseClient"
import Image from "next/image";
import Link from "next/link";

export default async function tagCoode(props) {
  const params = await props.params
  const categoryId = params.categoryId

  // カテゴリIDに紐づくカテゴリ名と服データを取得
  const { data:categoryData } = await supabase
    .from('t_categories')
    .select(`
      name,
      t_clothes (
        id,
        img_path
      )
    `)
    .eq('id', categoryId)
    .single()

  // 返り値
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
      <h2>服から探す</h2>
      <Link href="/clothes">
        <button>戻る</button>
      </Link>

      <p>{categoryData.name}</p>
      {
      categoryData.t_clothes.length > 0 ? (
        categoryData.t_clothes.map((c) => (
          <Link key={c.id} href={`/clothes-details/${c.id}`}>
            <div>
              <p>ID:{c.id}</p>
              <Image src={getImageUrl(c.img_path)} alt='' width={100} height={100} />
            </div>
          </Link>
        ))
      ):(
        <p>このカテゴリに登録されている服がありません。</p>
      )
      }
    </>
  )
}
