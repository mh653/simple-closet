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

      <main>
        <section>
          <h3>ピン留めしたコーデ</h3>

          {
          coodes ? (
            <div className="coodeThumbArea">
              {coodes.map((c) => (
                <Link key={c.id} href={`/coode-details/${c.id}`}>
                  <div className="coodeThumbWrapper">
                    <p className="idNum">ID:{c.id}</p>
                    <div className="coodeThumbImgWrapper">
                      {c.t_coode_clothes.map((item) => (
                          <Image key={item.t_clothes.id}
                          src={getImageUrl(item.t_clothes.img_path)} alt='アイテムサムネイル画像'
                          width={70} height={70} className="coodeThumbImg"/>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ):(
              <p>ピン留めされているコーデはありません</p>
          )
          }
        </section>

        <section>
          <h3>タグでコーデを検索</h3>
          <div className="tagArea">
            {tags ? (
              tags.map((t) => (
                  <Link key={t.id} href={`/tag-coodes/${t.id}`}>
                    <div className="tag">{t.name}</div>
                  </Link>
              ))
            ):(
              <p>登録されているタグはありません</p>
            )
            }
          </div>

        </section>

      </main>

    </>
  );
}
