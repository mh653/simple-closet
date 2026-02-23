'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Note from "@/app/ui/Note";

export default function EditCoordinations() {
  // ルータ
  const router = useRouter();
  // パラメータ取得
  const { clothesId } = useParams();

  // 登録内容
  const [memo, setMemo] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imgPath, setImgPath] = useState(null);

  // ログイン判定
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };
  useEffect(() => {
    getUser()
  }, [])

  // 編集前状態を取得
  const fetchDefault = async () => {
    const { data } = await supabase
      .from('t_clothes')
      .select(`
        *
      `)
      .eq('id', clothesId)
      .single()

  const defaultMemo = data?.memo || ""
  setMemo(defaultMemo)
  const defaultCategories = data?.category || ""
  setCategoryId(defaultCategories)
  const defaultImgPath = data?.img_path || ""
  setImgPath(defaultImgPath)

  }

  // ストレージの画像URLを取得
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;
    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

  // 編集前状態をセット
  useEffect(() => {
    if (!clothesId) return;
    fetchDefault()
  }, [clothesId])

  // 変更内容を登録
  const changeClothes = async () => {
    if (!user) {
      alert("権限がありません（ログインしてください）");
      return;
    }
    if (!categoryId) {
      alert("カテゴリは登録必須です");
      return;
    }
    const { error: insertError } = await supabase
      .from("t_clothes")
      .update({
          category: categoryId,
          memo: memo,
        })
      .eq('id', clothesId);

    if (insertError) {
      console.log(insertError);
      alert("更新に失敗しました");
      return;
    }
    alert("更新完了しました！");
    // router.push(`/clothes-details/${clothesId}`);
    router.back();
    router.refresh()
  };

  return (
    <>
      {/* <button onClick={() => router.push(`/clothes-details/${clothesId}`)}>変更せず戻る</button> */}
      <button onClick={() => router.back()}>変更せず戻る</button>
      <h2>アイテム編集</h2>

        <p>ID:{clothesId}</p>

        {imgPath && (
          <Image
            src={getImageUrl(imgPath)}
            alt=""
            width={300}
            height={300}
          />
        )}

        <h3>メモ</h3>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}/>

        <h3>カテゴリ（必須）</h3>
        <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
          <option value={1}>トップス - 半袖/袖なし</option>
          <option value={2}>トップス - 長袖</option>
          <option value={3}>トップス - その他</option>
          <option value={4}>ボトムス</option>
          <option value={5}>オールインワン</option>
          <option value={6}>アウター</option>
          <option value={7}>靴</option>
          <option value={8}>靴下</option>
          <option value={9}>バッグ</option>
          <option value={10}>アクセサリー</option>
          <option value={11}>その他</option>
        </select>

        <br></br>
        <button onClick={() => changeClothes()}>変更</button>

        <Note />
    </>
  )
}

