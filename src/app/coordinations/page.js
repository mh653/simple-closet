// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 0

import { supabase, getImageUrl } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  // このページのパス
  const currentPath = `/coordinations`

  // コーデを取得
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
    .order('id', {ascending: false})

  return (
    <main>

      <h2>コーデ一覧</h2>

      <section>
          {
          coodes ? (
            <div className="coodeThumbArea">
              {coodes.map((c) => (
                <Link key={c.id} href={`/coode-details/${c.id}?from=${currentPath}`}>
                  <div className="coodeThumbWrapper">
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
                  </div>
                </Link>
              ))}
            </div>
          ):(
            <div className="coodeThumbNone">
              <p>登録されたコーデがありません</p>
            </div>
          )
          }
      </section>
    </main>
  );
}
