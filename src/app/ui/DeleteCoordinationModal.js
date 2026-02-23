'use client'

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Note from "./Note";

export default function DeleteCoordinationModal({ deleteId }) {
  const router = useRouter();
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

  const [open, setOpen] = useState(false)

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
    // router.push("/coordinations")
    // router.push(searchParams)
    if (from) {
      router.push(decodeURIComponent(from))
      router.replace(from)
    } else {
      router.push("/")
    }

  };


  return (
    open && (

      <div className="modalContent">
        <div className="modalClothes">

          <h2>本当に削除しますか？</h2>
          <p>削除したコーディネートは元に戻せません</p>
          <p>{deleteId}</p>
          <br></br>
          <button onClick={() => setOpen(false)}>いいえ</button>
          <button onClick={() => deleteCoordination(deleteId)}>はい</button>

          <Note />
        </div>
      </div>

    )

  );
}
