// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 0

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  // このページのパス
  const currentPath = `/coordinations`

  // コーデを取得する関数
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
      <h2>コーデ一覧</h2>
      {
      coodes ? (
        coodes.map((c) => (
          <Link key={c.id} href={`/coode-details/${c.id}?from=${currentPath}`}>
            <div>
              <p>コーデID:{c.id}</p>

              {c.t_coode_clothes.map((item) => (
                  <Image key={item.t_clothes.id} src={getImageUrl(item.t_clothes.img_path)} alt='' width={100} height={100} />
              ))}

            </div>
          </Link>
        ))
      ):(
        <p>登録されたコーデはありません</p>
      )
      }

    </>
  );
}
