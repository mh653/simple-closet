// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 0

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import Weather from "@/components/Weather";

export default async function Home() {
  // ピン留めコーデを取得
  const { data:coodes } = await supabase
    .from('t_coordinations')
    .select(`
      *,
      t_coode_clothes (
        t_clothes (
          id,
          img_path
        )
      )
    `)
    .eq('pin', true)

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  // t_tagsのデータを取得する関数（コーデと紐づいてるものだけ）
  // ascending: falseで新しいものが上に来る
  // created_atは取得しなくて大丈夫
  const { data: tags } = await supabase
    .from('t_tags')
    .select(`
      id,
      name,
      t_coode_tags!inner (
        id
      )
    `)
    .order('created_at', {ascending: false})

  return (
    <>
      <Weather />
      
      <h2>ピン留めしたコーデ</h2>
      {
      coodes ? (
        coodes.map((c) => (
          <Link key={c.id} href={`/coode-details/${c.id}`}>
            <div>
              <p>コーデID:{c.id}</p>

              {c.t_coode_clothes.map((item) => (
                  <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
              ))}

            </div>
          </Link>
        ))
      ):(
        <p>ピン留めされているコーデはありません</p>
      )
      }

      <h2>タグでコーデを検索</h2>
      {tags ? (
        tags.map((t) => (
          <div key={t.id}>
            <Link href={`/tag-coodes/${t.id}`}>{t.name}</Link>
            <hr></hr>
          </div>
        ))
      ):(
        <p>登録されているタグはありません</p>
      )
      }
      
    </>
  );
}
