'use client'

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Note from "@/app/ui/Note";

export default function DeleteClothes() {
  // ルータ
  const router = useRouter();
  // パラメータ取得
  const { deleteId } = useParams();
  // from受け取り
  const searchParams = useSearchParams();
  const from = searchParams.get("from")

  // ログイン判定
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };
  useEffect(() => {
    getUser()
  }, [])

  // 削除関数
  const deleteClothes = async (id) => {
    if (!user) {
      alert("権限がありません（ログインしてください）");
      return;
    }

    const { data: imgPath, error } = await supabase
      .rpc("delete_clothes_with_image", {
        p_clothes_id: Number(id)
      })
    if (error) {
      console.error(error);
      alert('テーブルからの削除に失敗しました')
      return
    }

    console.log(imgPath)

    if (!imgPath) {
      console.log("imgなし")
      alert('画像パスがありません')
      return
    }

    const { error: storageError } = await supabase.storage
      .from("clothes_image")
      .remove([imgPath])

    if (storageError) {
      console.error(storageError)
      alert("ストレージからの削除に失敗しました")
      return
    }

    alert("アイテムを削除しました");
    if (from) {
      router.push(from)
    } else {
      router.push("/")
    }
  };

  return (
    <main>
      <h2>本当に削除しますか？</h2>
      <p>削除したアイテムは元に戻せません</p>
      <section>
        <div className="yesNo">
          <button onClick={() => deleteClothes(deleteId)}>削除する</button>
          <button onClick={() => router.back()}>削除しない</button>            
        </div>
      </section>

      <Note />
    </main>
  );
}
