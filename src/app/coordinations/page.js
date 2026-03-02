// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 60

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
      *,
      t_coode_clothes (
        t_clothes (
          id,
          img_path
        )
      )
    `)

  // // ストレージの画像URLを取得する関数
  // const getImageUrl = (imgPath) => {
  //   if(!imgPath) return null;

  //   const { data } = supabase.storage
  //     .from('clothes_image')
  //     .getPublicUrl(imgPath)

  //   return data.publicUrl
  // }

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

        {/* {
        coodes ? (
          coodes.map((c) => (
            <Link key={c.id} href={`/coode-details/${c.id}?from=${currentPath}`}>
              <div>
                <p>ID:{c.id}</p>

                {c.t_coode_clothes.map((item) => (
                    <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
                ))}

              </div>
            </Link>
          ))
        ):(
          <p>登録されたコーデはありません</p>
        )

        } */}

      </section>
    </main>
  );
}
