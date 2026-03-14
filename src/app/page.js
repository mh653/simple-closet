// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 0

import { supabase, getImageUrl } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import Weather from "@/components/Weather";

export default async function Home() {
  // ピン留めコーデを取得
  const { data:coodes } = await supabase
    .from('t_coordinations')
    .select(`
      id,
      t_coode_clothes (
        t_clothes (
          id,
          img_path
        )
      )
    `)
    .order('id', {ascending: true})
    .eq('pin', true)

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
    .order('id', {ascending: false})

  return (
    <>
      <main>
        <Weather />

        <section>
          <h3>タグでコーデを検索</h3>
          <div className="tagArea">
            {tags ? (
              tags.map((t) => (
                  <Link key={t.id} href={`/tag-coodes/${t.id}`}>
                    <div className="tag clickableTag">{t.name}</div>
                  </Link>
              ))
            ):(
              <p>登録されているタグはありません</p>
            )
            }
          </div>

        </section>

        <section>
          <h3>ピン留めしたコーデ</h3>

          {
          coodes ? (
              <div className="coodeThumbArea">
              {coodes.map((c) => (
                <Link key={c.id} href={`/coode-details/${c.id}?from=/`} className="coodeThumbWrapper">
                    <p className="idNum">No.{c.id}</p>
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
          ):(
              <p>ピン留めされているコーデはありません</p>
          )
          }
        </section>

      </main>

    </>
  );
}
