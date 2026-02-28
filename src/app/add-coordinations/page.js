'use client'

import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import Image from "next/image";
import SelectClothesModal from "../ui/SelectClothesModal";
import Note from "../ui/Note";

export default function AddCoodinations() {
  // ルータ
  const router = useRouter();

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

  // 選択した服のデータを取得する関数
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

  // ストレージの画像URLを取得する関数
  const getImageUrl = (imgPath) => {
    if(!imgPath) return null;

    const { data } = supabase.storage
      .from('clothes_image')
      .getPublicUrl(imgPath)

    return data.publicUrl
  }

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
  }, [isOpen])


  // コーデを登録
  const addCoordination = async () => {
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

    const { error } = await supabase.rpc("insert_coordination", {
      p_memo: memo,
      p_pin: isPin,
      p_clothes: clothesId,
      p_tags: tagsId
    });
    if (error) {
      console.error(error);
      alert("登録に失敗しました");
      return;
    }
    router.push(`/add-coordinations/result`);
  };

  return (
    <main>
      <h2>コーデ登録</h2>

      <section>
        <h3>使用アイテム(6点まで)</h3>
        <button onClick={() => setIsOpen(true)} className="selectItemBtn grayBtn">アイテムを選択</button>
        {isOpen && (
          <div className="modal">
            <SelectClothesModal
              clothes={clothesId}
              setClothes={setClothesId}
              onClose={() => setIsOpen(false)}
            />
          </div>
        )}

        {selectedClothes.length > 0 ? (
          <div className="selectedClothes">
            {selectedClothes.map((s) => (
              <Image key={s.id} src={getImageUrl(s.img_path)} alt='' width={250} height={250} className="selectedClothesImg"/>
            ))}
          </div>
          ):(
            null
        )}

      </section>

      <section>
        <h3>メモ</h3>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}/>
      </section>

      <section>
        <h3>タグ</h3>
        <div className="tagArea">
          {
            tags.length > 0 ? (
              tags.map((tag) => (
                <span key={tag.id}>
                  <input type="checkbox" id={tag.id} name="istag" value={tag.id}
                    checked={tagsId.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                  />
                  <label htmlFor={tag.id}><span className="checkboxRadioText">{tag.name}</span></label>
                </span>
              ))
            ):(
              <p>作成されたタグがありません</p>
            )
          }
        </div>

        <div className="tagCreateWrapper">
          <input type="text" placeholder="タグ名を入力" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
          <button onClick={() => handleAddTag()} className="grayBtn">タグ作成</button>
        </div>
      </section>

      <section>
        <h3>トップ画面にピン留めする？</h3>
        <input type="radio" id="yes" name="ispin" value={true} onChange={(e) => setIsPin(e.target.value)}/>
        <label htmlFor="yes"><span className="checkboxRadioText">する</span></label>
        <input type="radio" id="no" name="ispin" value={false} defaultChecked onChange={(e) => setIsPin(e.target.value)}/>
        <label htmlFor="no"><span className="checkboxRadioText">しない</span></label>
      </section>

      <div className="btnArea">
        <button onClick={() => addCoordination()}>登録</button>
        <Note />
      </div>

    </main>
  )
}
