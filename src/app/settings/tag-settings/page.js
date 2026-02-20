'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation";

export default function TagSettings() {

  // ルータ
  const router = useRouter();

  // タグ
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isNewTag, setIsNewTag] = useState(false);

  const [editingId, setEditingId] = useState(null)
  const [editTag, setEditTag] = useState("")


  // タグ一覧を取得
  const fetchTags = async () => {
    const {data} = await supabase
      .from('t_tags')
      .select(`
        *
      `)
      .order('id', {ascending: false})
    setTags(data || [])
  }

  // タグを新規作成
  const handleAddTag = async () => {
    if(!newTag) {
      alert("作成するタグ名を入力してください")
      return
    }
    const { error: insertError } = await supabase
      .from("t_tags")
      .insert([
        {
          name: newTag,
        },
      ]);
    if (insertError) {
      console.log(insertError);
      alert("タグの登録に失敗しました")
      return;
    }
    setNewTag("")
    setIsNewTag(!isNewTag)
  }

  // 新しいタグが作成されたらセット
  useEffect(() => {
    fetchTags()
  }, [isNewTag])

  // 変更を保存
  const handleUpdateTag = async () => {
    if (!editTag.trim()) {
      alert("タグ名を入力してください");
      return;
    }
    const { error } = await supabase
      .from("t_tags")
      .update({
          name: editTag,
        })
      .eq('id', editingId);
    if (error) {
      console.error(error);
      alert("登録に失敗しました");
      return;
    }
    alert("タグ名を変更しました");
    setEditingId(null)
    setEditTag("")
    fetchTags()
  };

  // タグを削除
  const handleDeleteTag = async (id) => {
    const { error } = await supabase
      .from("t_tags")
      .delete()
      .eq("id", id);
    if (error) {
      console.error(error);
      alert("削除失敗");
      return;
    }
    alert("タグを削除しました");
    fetchTags()
  };

  return (
    <>
      <button onClick={() => router.push("/settings")}>戻る</button>
      <h2>タグの編集</h2>
        <h3>タグを新規作成する</h3>
        <input type="text" placeholder="タグ名を入力" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
        <button onClick={() => handleAddTag()}>作成</button>

        <h3>タグを編集・削除する</h3>
        {
          tags.length > 0 ? (
            tags.map((tag) => (
              <div key={tag.id}>
                {tag.id === editingId ? (
                  <div>
                    <input type="text" value={editTag} onChange={(e => setEditTag(e.target.value))}></input>
                    <button onClick={() => handleUpdateTag(tag.id,editTag)}>保存</button>
                  </div>
                ) : (
                  <div>
                    <p>{tag.name}</p>
                    <button onClick={() => {
                      setEditingId(tag.id)
                      setEditTag(tag.name)
                      }}>編集</button>
                    <button onClick={() => handleDeleteTag(tag.id)}>削除</button>
                  </div>
                )}
              </div>
            ))
          ):(
            <p>作成されたタグがありません</p>
          )
        }
    </>
  )
}


