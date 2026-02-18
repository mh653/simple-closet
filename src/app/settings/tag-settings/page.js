'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation";

export default function TagSettings() {

  // ルータ
  const router = useRouter();
  // 登録内容
  const [clothesId, setClothesId] = useState([]);
  const [memo, setMemo] = useState("");
  const [tagsId, setTagsId] = useState([]);
  const [isPin, setIsPin] = useState(false);

  // タグ
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isNewTag, setIsNewTag] = useState(false);


  // タグ一覧を取得
  const fetchTags = async () => {
    const {data} = await supabase
      .from('t_tags')
      .select(`
        *
      `)
      .order('created_at', {ascending: false})
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



  // 変更を登録
  const addCoordination = async () => {
    if (!tagName) {
      alert("タグ名を入力してください");
      return;
    }

    const { error } = await supabase

    if (error) {
      console.error(error);
      alert("登録に失敗しました");
      return;
    }
    router.push(`/`);
  };

  // タグを削除





  return (
    <>
      <h2>タグの編集</h2>
        <h3>タグを新規作成する</h3>
        <input type="text" placeholder="タグ名を入力" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
        <button onClick={() => handleAddTag()}>作成</button>

        <h3>タグを編集・削除する</h3>
        {
          tags.length > 0 ? (
            tags.map((tag) => (
              <div key={tag.id}>
                <p>{tag.id}</p>
                <p>{tag.name}</p>
                <button>編集</button>
                <button>削除</button>

                {/* <input type="text" id={tag.id} name="istag" value={tag.id}
                  onChange={(e) => setTagName(e.target.value)}
                /> */}
              </div>
            ))
          ):(
            <p>作成されたタグがありません</p>
          )
        }




{/*
        <button onClick={() => {
          console.log(clothesId)
          console.log(memo)
          console.log(tagsId)
          console.log(isPin)
        }}>確認</button>

        <br></br>
        <button onClick={() => addCoordination()}>登録</button>
        <br></br> */}

    </>
  )
}


