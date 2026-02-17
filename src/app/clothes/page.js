import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function Clothes() {

  // t_categoriesのデータを取得する関数
  const { data:categories } = await supabase
      .from('t_categories')
      .select(`
        *
      `)
      .order('created_at', {ascending: false})

  return (
    <>
          <h2>服から探す</h2>
          {categories.map((category) => (
            <div key={category.id}>
              <p>ID:{category.id}</p>
              <Link href={`clothes/category-clothes/${category.id}`}>{category.name}</Link>
            </div>
          ))}
    </>
  );
}





// // クライアントコンポーネントでは async fetch が直接できないので useState でデータを保持？

// 'use client'

// import { supabase } from "@/lib/supabaseClient";
// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// export default function Clothes() {
//   const [clothes, setClothes] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const router = useRouter();

//   // 今のURLのクエリパラメータを取得するフック（URLが変わると値を更新する）
//   // /clothes?view=all だと、?view=allの部分がクエリパラメータ
//   // Reactはフックが内部的に値を更新した時、再レンダリングする
//   const searchParams = useSearchParams();
//   // viewの先が何かを取得する
//   const view = searchParams.get("view");
//   // allならtrueが入る
//   const showAll = view === "all";

//   useEffect(() => {
//     if (showAll) {
//       fetchClothes();
//     } else {
//       fetchCategories();
//     }
//   }, [view])

//   // t_clothesのデータを取得する関数
//   const fetchClothes = async () => {
//     const { data } = await supabase
//       .from('t_clothes')
//       .select(`
//         *
//       `)
//       .order('created_at', {ascending: false})
//     setClothes(data || [])
//   }

//   // ストレージの画像URLを取得する関数
//   const getImageUrl = (imgPath) => {
//     if(!imgPath) return null;

//     const { data } = supabase.storage
//       .from('clothes_image')
//       .getPublicUrl(imgPath)

//     return data.publicUrl
//   }

//   // t_categoriesのデータを取得する関数
//   const fetchCategories = async () => {
//     const { data } = await supabase
//       .from('t_categories')
//       .select(`
//         *
//       `)
//       .order('created_at', {ascending: false})
//     setCategories(data || [])
//   }

//   return (
//     <>
//       {/* 一覧表示を押すと、クエリパラメータが付く */}
//       <button onClick={() => router.push("/clothes")}>カテゴリ別</button>
//       <button onClick={() => router.push("/clothes?view=all")}>一覧表示</button>

//       {showAll ? (
//         <div>
//           <h2>服の一覧</h2>
//           {clothes.map((c) => (
//             <Link key={c.id} href={`/clothes-details/${c.id}`}>
//               <div>
//                 <p>服ID:{c.id}</p>
//                 <Image src={getImageUrl(c.img_path)} alt='' width={100} height={100} />
//               </div>
//             </Link>
//           ))}
//         </div>
//       ) : (
//         <div>
//           <h2>カテゴリ別</h2>
//           {categories.map((category) => (
//             <div key={category.id}>
//               <p>ID:{category.id}</p>
//               <Link href={`clothes/category-clothes/${category.id}`}>{category.name}</Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }
