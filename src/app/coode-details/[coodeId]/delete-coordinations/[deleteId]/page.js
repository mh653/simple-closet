'use client'

import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function DeleteCoordination() {

  const router = useRouter();
  const { deleteId } = useParams();

  // 削除関数
  const deleteCoordination = async (id) => {
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
      <button onClick={() => router.back()}>いいえ</button>
      <button onClick={() => deleteCoordination(deleteId)}>はい</button>
    </div>
  );
}
