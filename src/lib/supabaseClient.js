import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
  // ,
  // {
  //   auth: {
  //     persistSession: false, // ブラウザを閉じるとログアウト
  //   },
  // }
);

// ストレージの画像URLを取得する関数
export const getImageUrl = (imgPath) => {
  if(!imgPath) return null;

  const { data } = supabase.storage
    .from('clothes_image')
    .getPublicUrl(imgPath)

  return data.publicUrl
}
