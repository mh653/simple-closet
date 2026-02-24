'use client'

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Note from "@/app/ui/Note";

export default function DeleteCoordination() {
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
  const deleteCoordination = async (id) => {
    if (!user) {
      alert("権限がありません（ログインしてください）");
      return;
    }
    const { error } = await supabase
      .from("t_coordinations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("削除失敗");
      return;
    }

    alert("コーディネートを削除しました");
    if (from) {
      router.push(from)
    } else {
      router.push("/")
    }
  };

  return (
    <main>
      <h2>本当に削除しますか？</h2>
      <p>削除したコーディネートは元に戻せません</p>
      <section>
        <div className="yesNo">
          <button onClick={() => deleteCoordination(deleteId)}>削除する</button>   
          <button onClick={() => router.back()}>削除しない</button>
        </div>        
      </section>

      <Note />
    </main>
  );
}
