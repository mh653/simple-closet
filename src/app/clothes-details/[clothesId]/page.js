// クライアント化して編集機能を追加予定

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default async function coodeDetail(props) {

  const params = await props.params
  const clothesId = params.clothesId

  // const [editMode, setEditMode] = useState(false);
  // const [memo, setMemo] = useState(clothes.memo);

  // 服の情報を取得する関数
  const { data:clothes } = await supabase
    .from('t_clothes')
    .select(`
      *,
      t_categories (
        name
      )
    `)
    .eq('id', clothesId)
    .single()

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }


  // その服に使われてるコーデIDを取得
  const { data: coodes } = await supabase
    .from('t_coode_clothes')
    .select('coode_id')
    .eq('clothes_id', clothesId)
  // 返り値
  // codes = [
  //   { code_id: 1 },
  //   { code_id: 2 }
  // ]

  // 配列だけ取り出す　[1, 2]
  const coodeIds = coodes.map(c => c.coode_id)

  // コーデを取得する関数
  // IN句で、id が codeIds 配列のどれかに一致するものを取ってくる
  const { data: coode } = await supabase
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
    .in('id', coodeIds)


  return (
    <>
      <h1>Simple Closet</h1>

      <h2>服の詳細</h2>

      <p>ID:{clothesId}</p>

      <Image src={getImageUrl(clothes.img_path)} alt='' width={100} height={100} />

      <h3>メモ</h3>
      <p>{clothes.memo}</p>


      <h3>カテゴリー</h3>
      <p>{clothes.t_categories.name}</p>

      <h3>使用コーデ</h3>
      {coode?.map((co) => (
        <Link key={co.id} href={`/coode-details/${co.id}`}>
          {co.t_coode_clothes.map((cp) => (
            <Image
              key={cp.t_clothes.id}
              src={getImageUrl(cp.t_clothes.img_path)}
              alt=""
              width={100}
              height={100}
            />
          ))}
        </Link>
      ))}

      <h3>編集</h3>
      <h3>削除</h3>

    </>
  );
}

