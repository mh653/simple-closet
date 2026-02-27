// サーバーコンポーネントのVercelのキャッシュ対策
export const revalidate = 0

import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation"
import Image from "next/image";
import Link from "next/link";
import FromBackButton from "@/app/ui/FromBackButton";
import { BsTrash3Fill } from "react-icons/bs";

export default async function CoodeDetail(props) {
  // パラメータ受け取り
  const params = await props.params
  const coodeId = params.coodeId
  // どこから来たかのパラメータを受け取る
  const searchParams = await props.searchParams
  const from = searchParams?.from
  // このページのパス
  const currentPath = `/coode-details/${coodeId}?from=${from}`

  // コーデを取得する
  // eqで絞る
  const { data:coode } = await supabase
    .from('t_coordinations')
    .select(`
      *,
      t_coode_clothes (
        t_clothes (
          id,
          img_path
        )
      ),
      t_coode_tags (
        t_tags (
          id,
          name
        )
      )
    `)
    .eq('id', coodeId)
    .maybeSingle()

  // コーデが削除されていたら、ホームに戻す
  if (!coode) {
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
    <main>
      <FromBackButton />

      <h2>コーデ詳細</h2>

      <div className="pcDetails">

        <div className="pcLeft">
          <section>
            {/* <h3>使用アイテム</h3> */}
            <p className="idNum">No.{coodeId}</p>
            {!coode.t_coode_clothes || coode.t_coode_clothes.length === 0 ? (
              <div>
                <p>アイテムが削除されたようです。</p>
                <p>「編集」ボタンからアイテムを選択し直すか、「削除」ボタンでコーデを削除してください。</p>
              </div>
            ) : (
              <div className="selectedClothes">

                {coode.t_coode_clothes.map((item) => (
                  <Link key={item.t_clothes.id} href={`/clothes-details/${item.t_clothes.id}?from=${currentPath}`}>
                    <Image src={getImageUrl(item.t_clothes.img_path)} alt='' width={250} height={250} className="selectedClothesImg"/>
                  </Link>
                ))}

              </div>

            )}
          </section>
        </div>

        <div className="pcRight">
          <section>
            <h3>メモ</h3>
            <div className="memoArea">{coode.memo}</div>
          </section>

          <section>
            <h3>タグ</h3>
            {!coode.t_coode_tags || coode.t_coode_tags.length === 0 ? (
              <div>
                <p>登録されているタグはありません</p>
              </div>
            ) : (
              <div className="tagArea">
                {coode.t_coode_tags.map((tag) => (
                    <p key={tag.t_tags.id} className="tag">{tag.t_tags.name}</p>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3>トップ画面にピン留めする？</h3>
              {coode.pin ? (
                  <p>はい</p>
                ) : (
                  <p>いいえ</p>
                )
              }
          </section>
        </div>

      </div>

      <div className="editDeleteButtons">
        <Link href={`/coode-details/${coodeId}/edit-coordinations/${coodeId}`}>
          <button>編集</button>
        </Link>
        <Link href={`/coode-details/${coodeId}/delete-coordinations/${coodeId}?from=${from}`}>
          <button>削除</button>
          {/* <button className="deleteButton"><BsTrash3Fill/></button> */}
        </Link>
      </div>

    </main>
  );
}

  // supabase返り値の例
  // [
  //   {
  //     id: 1,
  //     memo: "...",
  //     t_coode_clothes: [
  //       {
  //         t_clothes: {
  //           img_path: "1.jpg"
  //         }
  //       },
  //       {
  //         t_clothes: {
  //           id: "2"
  //           img_path: "2.jpg"
  //         }
  //       }
  //     ]
  //   }
  // ]
