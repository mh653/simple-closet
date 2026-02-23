'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image";
import SelectClothesModal from "@/app/ui/SelectClothesModal";
import { useRouter, useParams } from "next/navigation";
import Note from "@/app/ui/Note";

export default function EditCoordinations() {

  // ルータ
  const router = useRouter();
  // パラメータ取得
  const { coodeId } = useParams();
  // 登録内容
  const [clothesId, setClothesId] = useState([]);
  const [memo, setMemo] = useState("");
  const [tagsId, setTagsId] = useState([]);
  const [isPin, setIsPin] = useState(false);
  // 服
  const [isOpen, setIsOpen] = useState(false)
  const [selectedClothes, setSelectedClothes] = useState([]);
  // タグ
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isNewTag, setIsNewTag] = useState(false);

  // ログイン判定
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };
  useEffect(() => {
    getUser()
  }, [])

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

  // 編集前状態を取得
  const fetchDefault = async () => {
    const { data } = await supabase
      .from('t_coordinations')
      .select(`
        *,
        t_coode_clothes (
          t_clothes (
            id,
            img_path
          )
        ),
        t_coode_tags (
          t_tags (
            id,
            name
          )
        )
      `)
      .eq('id', coodeId)
      .single()

  const defaultClothes = data?.t_coode_clothes?.map(c => c.t_clothes?.id) || []
  setClothesId(defaultClothes)
  const defaultTags = data?.t_coode_tags?.map(c => c.t_tags?.id) || []
  setTagsId(defaultTags)
  const defaultMemo = data?.memo || ""
  setMemo(defaultMemo)
  const defaultIsPin = data?.pin ?? false
  setIsPin(defaultIsPin)
  }

  // タグを新規作成
  const handleAddTag = async () => {
    if (!user) {
      alert("権限がありません（ログインしてください）");
      return;
    }
    if(!newTag.trim()) {
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

  // タグをトグル
  const toggleTag = (id) => {
    setTagsId((prev) => {
      if (prev.includes(id)) {
        return prev.filter((t) => t !== id) // 外す
      } else {
        return [...prev, id] // 追加
      }
    })
  }

  // 選択した服のデータを取得
  const fetchSelectedClothes = async () => {
    const {data}  = await supabase
      .from('t_clothes')
      .select(`
          id,
          img_path
      `)
      .in('id', clothesId)
    setSelectedClothes(data || [])
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
    if (!coodeId) return;
    fetchDefault()
  }, [coodeId])

  // 新しいタグが作成されたらセット
  useEffect(() => {
    fetchTags()
  }, [isNewTag])

  // 選択された服のプレビューをセット
  useEffect(() => {
    if (clothesId.length === 0) {
      setSelectedClothes([])
      return
    }
    fetchSelectedClothes()
  }, [clothesId])


  // コーデ変更内容を登録
  const changeCoordination = async () => {
    if (!user) {
      alert("権限がありません（ログインしてください）");
      return;
    }
    if (clothesId.length < 2) {
      alert("アイテムを2点以上選んでください");
      return;
    }
    if (clothesId.length > 6) {
      alert("使用できるアイテムは6点までです");
      return;
    }

    const { error } = await supabase.rpc("update_coordination", {
      p_coode_id: coodeId,
      p_memo: memo,
      p_pin: isPin,
      p_clothes: clothesId,
      p_tags: tagsId
    });
    if (error) {
      console.error(error);
      alert("更新に失敗しました");
      return;
    }
    alert("更新完了しました！");
    // router.push(`/coode-details/${coodeId}`);
    router.back();
    router.refresh()
  };

  return (
    <>
      {/* <button onClick={() => router.push(`/coode-details/${coodeId}`)}>変更せず戻る</button> */}
      <button onClick={() => router.back()}>変更せず戻る</button>
      <h2>コーデ編集</h2>

        <h3>使用アイテム(6点まで)</h3>
        <button onClick={() => setIsOpen(true)}>アイテムを選択</button>

        {isOpen && (
          <div className="modal">
            <SelectClothesModal
              clothes={clothesId}
              setClothes={setClothesId}
              onClose={() => setIsOpen(false)}
            />
          </div>
        )}

        {
          selectedClothes.length > 0 ? (
            selectedClothes.map((s) => (
              <Image key={s.id} src={getImageUrl(s.img_path)} alt='' width={100} height={100} />
            ))
          ):(
            null
          )
        }

        <h3>メモ</h3>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}/>

        <h3>タグ</h3>
        {
          tags.length > 0 ? (
            tags.map((tag) => (
              <span key={tag.id}>
                <input type="checkbox" id={tag.id} name="istag" value={tag.id}
                  checked={tagsId.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                <label htmlFor={tag.id}>{tag.name}</label>
              </span>
            ))
          ):(
            <p>作成されたタグがありません</p>
          )
        }
        <br></br>
        <input type="text" placeholder="タグ名を入力" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
        <button onClick={() => handleAddTag()}>タグを作成</button>

        <h3>トップ画面にピン留めする？</h3>
        <input type="radio" id="yes" name="ispin" checked={isPin === true} onChange={() => setIsPin(true)}/>
        <label htmlFor="yes">する</label>
        <input type="radio" id="no" name="ispin" checked={isPin === false} onChange={() => setIsPin(false)}/>
        <label htmlFor="no">しない</label>

        <br></br>
        {/* <button onClick={() => {
          console.log(clothesId)
          console.log(memo)
          console.log(tagsId)
          console.log(isPin)
        }}>確認</button> */}

        <br></br>
        <button onClick={() => changeCoordination()}>変更</button>

        <Note />

    </>
  )
}

