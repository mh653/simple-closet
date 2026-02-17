'use client'

import { useState, useRef, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image";
import SelectClothesModal from "../ui/SelectClothesModal";

export default function AddCoodinations() {
  const[tags, setTags] = useState([]);
  const[newTag, setNewTag] = useState("");
  const[isNewTag, setIsNewTag] = useState(false);

  const[clothes, setClothes] = useState([]);
  const[memo, setMemo] = useState("");
  const[tagsId, setTagsId] = useState([]);
  const[isPin, setIsPin] = useState(false);

  const [isOpen, setIsOpen] = useState(false)

  const[selectedClothes, setSelectedClothes] = useState([]);

  // const[clothes, setClothes] = useState([4,3,2]);
  // const[memo, setMemo] = useState("追加テスト");
  // const[tagsId, setTagsId] = useState([4,1]);
  // const[isPin, setIsPin] = useState(true);

  // setClothes([4,3,2])
  // setMemo("追加テスト")
  // setTagsId([4,1])
  // setIsPin(true)

  // const fileInputRef = useRef(null);
  // const categoryInputRef = useRef(null);


  // タグを取得
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
      return;
    }
    alert("タグを作成しました！")
    setNewTag("")
    setIsNewTag(!isNewTag)
  }

  // タグをトグルする関数
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
      .in('id', clothes)
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

  useEffect(() => {
    fetchTags()
  }, [isNewTag])

  useEffect(() => {
    if (clothes.length === 0) {
      setSelectedClothes([])
      return
    }
    fetchSelectedClothes()
  }, [isOpen])


  // コーデを登録する関数
  const addCoordination = async () => {
    const { error } = await supabase.rpc("insert_coordination", {
      p_memo: memo,
      p_pin: isPin,
      p_clothes: clothes,
      p_tags: tagsId
    });
    if (error) {
      console.error(error);
      alert("失敗");
      return;
    }
    alert("成功");
  };

  return (
    <>
      <h2>コーデ登録</h2>

        <p>使用する服(6枚まで追加可能です)</p>
        <button onClick={() => setIsOpen(true)}>服を選択</button>

        {isOpen && (
          <div className="modal">
            <SelectClothesModal
              clothes={clothes}
              setClothes={setClothes}
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
            <p>選択された服がありません</p>
          )
        }

        <p>メモ</p>
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}/>

        <p>タグ</p>
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

        <p>トップ画面にピン留めする？</p>
        <input type="radio" id="yes" name="ispin" value={true} onChange={(e) => setIsPin(e.target.value)}/>
        <label htmlFor="yes">する</label>
        <input type="radio" id="no" name="ispin" value={false} defaultChecked onChange={(e) => setIsPin(e.target.value)}/>
        <label htmlFor="no">しない</label>

        <br></br>
        <button onClick={() => {
          console.log(clothes)
          console.log(memo)
          console.log(tagsId)
          console.log(isPin)
        }}>確認</button>

        <br></br>
        <button onClick={() => addCoordination()}>登録</button>
        <br></br>

    </>
  )
}






// 'use client'

// import { useState, useRef, useEffect } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import Image from "next/image";

// export default function AddCoodinations() {
//   const[tags, setTags] = useState([]);
//   const[newTag, setNewTag] = useState("");
//   const[isNewTag, setIsNewTag] = useState(false);

//   const[clothes, setClothes] = useState([]);
//   const[memo, setMemo] = useState("");
//   const[tagsId, setTagsId] = useState([]);
//   const[isPin, setIsPin] = useState(false);

//   // setClothes([4,3,2])
//   // setMemo("追加テスト")
//   // setTagsId([4,1])
//   // setIsPin(true)



//   // const fileInputRef = useRef(null);
//   // const categoryInputRef = useRef(null);


//   // タグを取得
//   const fetchTags = async () => {
//     const {data} = await supabase
//       .from('t_tags')
//       .select(`
//         *
//       `)
//       .order('created_at', {ascending: false})
//     setTags(data || [])
//   }
//   // タグを新規作成
//   const handleAddTag = async () => {
//     if(!newTag) {
//       alert("作成するタグ名を入力してください")
//       return
//     }
//     const { error: insertError } = await supabase
//       .from("t_tags")
//       .insert([
//         {
//           name: newTag,
//         },
//       ]);
//     if (insertError) {
//       console.log(insertError);
//       return;
//     }
//     alert("登録完了！")
//     setNewTag("")
//     setIsNewTag(!isNewTag)
//   }


//   useEffect(() => {
//     fetchTags()
//   }, [isNewTag])


//   // ストレージの画像URLを取得する関数
//   const getImageUrl = (imgPath) => {
//     if(!imgPath) return null;

//     const { data } = supabase.storage
//       .from('clothes_image')
//       .getPublicUrl(imgPath)

//     return data.publicUrl
//   }


//   const handleAddCoode = async () => {

//     if(imgIds.length < 2) {
//       alert("画像を2枚以上選択してください")
//       return
//     }

//     const { error: t_coodinations_insertError } = await supabase
//       .from("t_coodinations")
//       .insert([
//         {
//           memo: memo,
//           pin: isPin,
//         },
//       ]);
//     if (insertError) {
//       console.log(t_coodinations_insertError);
//       return;
//     }

//     const { error: t_coode_clothes_insertError } = await supabase
//       .from("t_coode_clothes")
//       .insert([
//         {
//           // coode_id: 今作成したコーデのIDをセット,
//           // clothes_id: clothesの配列の中身をセット,
//         },
//       ]);
//     if (insertError) {
//       console.log(t_coode_clothes_insertError);
//       return;
//     }

//     const { error: t_coode_tags_insertError } = await supabase
//       .from("t_coode_tags")
//       .insert([
//         {
//           // coode_id: 今作成したコーデのIDをセット,
//           // clothes_id: tagsIdの配列の中身をセット,
//         },
//       ]);
//     if (insertError) {
//       console.log(t_coode_tags_insertError);
//       return;
//     }

//     alert("登録完了！")
//     setClothes([])
//     setTagsId([])
//     setMemo("")
//     setIsPin(false)
//   }

//   return (
//     <>
//       <h2>コーデ登録</h2>

//         <p>使用する服(6枚まで追加可能です)</p>
//         <button>服を追加</button>

//         {
//           clothes.length > 0 ? (
//             clothes.map((c) => (
//               <div key={c.id}>
//                 <p>{c.id}</p>
//                 <button>コーデから削除</button>
//               </div>

//                 // <Image key={c.id} src={getImageUrl(c.img_path)} alt='' width={100} height={100} />
//             ))
//           ):(
//             <p>選択された服がありません</p>
//           )
//         }

//         <p>メモ</p>
//         <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3}/>

//         <p>タグ</p>
//         {
//           tags.length > 0 ? (
//             tags.map((tag) => (
//               <span key={tag.id}>
//                 <input type="checkbox" id={tag.id} name="istag" value={tag.id} onChange={(e) => setTagsId(tagsId.push(e.target.value))}/>
//                 <label htmlFor={tag.id}>{tag.name}</label>
//               </span>
//             ))
//           ):(
//             <p>作成されたタグがありません</p>
//           )
//         }
//         <br></br>
//         <input type="text" placeholder="タグ名を入力" value={newTag} onChange={(e) => setNewTag(e.target.value)}/>
//         <button onClick={() => handleAddTag()}>タグを作成</button>

//         <p>トップ画面にピン留めする？</p>
//         <input type="radio" id="yes" name="ispin" value={true} onChange={(e) => setIsPin(e.target.value)}/>
//         <label htmlFor="yes">する</label>
//         <input type="radio" id="no" name="ispin" value={false} defaultChecked onChange={(e) => setIsPin(e.target.value)}/>
//         <label htmlFor="no">しない</label>


//         <br></br>
//         <button onClick={() => handleAddCoode()}>登録</button>
//         <br></br>

//     </>
//   )
// }
