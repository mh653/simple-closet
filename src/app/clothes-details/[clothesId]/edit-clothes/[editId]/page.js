'use client'

import { useState, useEffect } from "react"
import { supabase, getImageUrl } from "@/lib/supabaseClient"
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import FileResizer from "react-image-file-resizer";
import Note from "@/app/ui/Note";

export default function EditClothes() {
  // ルータ
  const router = useRouter();
  // パラメータ取得
  const { clothesId } = useParams();

  // 登録内容
  const [memo, setMemo] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imgPath, setImgPath] = useState(null);
  const[file, setFile] = useState(null);

  // 連打防止
  const[isUploading, setIsUploading] = useState(false);

  // ログイン判定
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };
  useEffect(() => {
    getUser()
  }, [])

  // ライブラリのリサイズ
  const resizeImage = (file) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,    // リサイズ対象のファイル
      800,     // 横1000px固定
      4000,    // 縦は十分大きくして自動計算させる
      "JPEG",  // 出力形式
      90,      // 画質（JPEGの場合1〜100）
      0,       // 回転角度
      (resizedFile) => {
        resolve(resizedFile);
      },
      // リサイズ完了後に呼ばれる関数（コールバック関数）
      // 引数 resizedFile にリサイズ後の画像が入る
      // Promiseの resolve で返すことで await で使えるようにしている
      "file"
      // 出力タイプ（"file" or "base64"）
      // "file" → Blob/File オブジェクトとして出力。そのまま SupabaseやFormDataに送信可能
      // "base64" → Base64文字列として出力。imgタグの src にそのまま使える
    );
  });
  //  FileResizer.imageFileResizer は コールバック関数方式
  // 「リサイズが終わったら次の処理をしたい」とき、通常の async/await では扱えないので、
  // Promiseで包むことで、await resizeImage(file) のように非同期処理を待てるようにする
  // resolve(resizedFile) が呼ばれた時点で Promise が完了し、次の処理に進める


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

  // 編集前状態をセット
  useEffect(() => {
    if (!clothesId) return;
    fetchDefault()
  }, [clothesId])

  // 変更内容を登録
  const changeClothes = async () => {
    if (isUploading) {
      return;
    }
    setIsUploading(true);

    try {
      if (!user) {
        alert("権限がありません（ログインしてください）");
        return;
      }
      if (!categoryId) {
        alert("カテゴリは登録必須です");
        return;
      }

      if (file) {
      // 画像を変更する場合        
        if (!["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
          alert("アップロード不可なファイル形式です");
          return;
        }
        const resizedFile = await resizeImage(file);
        const fileName = `${Date.now()}.jpg`;

        // ストレージに新画像追加
        const { error: uploadError } = await supabase.storage
          .from("clothes_image")
          .upload(fileName, resizedFile)
        if (uploadError) {
          console.log(uploadError);
          alert("画像アップロードに失敗しました")
          return;
        }
        // テーブル更新
        const { error: insertError } = await supabase
          .from("t_clothes")
          .update({
              category: categoryId,
              memo: memo,
              img_path: fileName,
            })
          .eq('id', clothesId);
        if (insertError) {
          await supabase.storage.from("clothes_image").remove([fileName])
          console.log(insertError);
          alert("テーブル登録に失敗しました")
          return
        }
        // ストレージの旧画像削除
        const { error: deleteError } = await supabase.storage
          .from("clothes_image")
          .remove([imgPath])
        if (deleteError) {
          console.log(deleteError);
          alert("画像削除に失敗しました")
          return;
        }

      } else {
      // 画像を変更しない場合
        // テーブル更新
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
      }

      alert("更新完了しました！");
      router.back();
      router.refresh()

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main>
      <button onClick={() => router.back()}>変更せず戻る</button>
      <h2>アイテム編集</h2>
        <p>ID:{clothesId}</p>

        <section>
          <h3>アイテム画像</h3>
          <p>※画像を変更する場合はファイルを選択してください</p>
          <p>※正方形、JPEG推奨</p>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
          <div className="preview">
            {
              file ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt=""
                  width={500}
                  height={500}
                  className="image"
                />
              ) : (
                imgPath && (
                  <Image
                    src={getImageUrl(imgPath)}
                    alt=""
                    width={500}
                    height={500}
                    className="image"
                  />
                )
              )
            }
          </div>
        </section>

        <section>
          <h3>メモ</h3>
          <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}/>
        </section>

        <section>
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
        </section>

        <div className="btnArea">
          <button onClick={() => changeClothes()} disabled={isUploading}>{isUploading ? "変更中..." : "変更"}</button>
          <Note />
        </div>

    </main>
  )
}

