'use client'

import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react"
import Note from "@/app/ui/Note";

export default function DeleteCoordination() {

  const router = useRouter();
  const { deleteId } = useParams();

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
    router.push("/coordinations")
  };

  return (
    <div>
      <h2>本当に削除しますか？</h2>
      <p>削除したコーディネートは元に戻せません</p>
      <br></br>
      <button onClick={() => router.push(`/coode-details/${deleteId}`)}>いいえ</button>
      <button onClick={() => deleteCoordination(deleteId)}>はい</button>

      <Note />
    </div>
  );
}
