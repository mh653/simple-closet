'use client'

import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useState, useEffect } from "react"

export default function DeleteCoordinationModal({ deleteId, onClose }) {

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

    alert("削除成功");

  };


  return (
    <div className="modalContent">
      <div className="modalClothes">
        <button onClick={() => deleteCoordination(coodeId)}>削除する</button>
        <button onClick={() => deleteCoordination(coodeId)}>削除する</button>

        <h2>本当に削除しますか？</h2>
        <p>削除したコーディネートは元に戻せません</p>
        <p>{deleteId}</p>
        <br></br>
        <button onClick={() => onClose()}>いいえ</button>
        <button onClick={() => deleteCoordination(deleteId)}>はい</button>
      </div>
    </div>
  );
}
