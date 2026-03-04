import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect} from "react";

export default function Note() {
  // ログイン判定
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setLoading(false);
  };
  useEffect(() => {
    getUser()
  }, [])

  if (loading) return null;

  if (user) return null;

  return (
    <div className="note">
      <p>※デモ用のIDとパスワードでログインして頂くと、登録・編集・削除が可能になります。</p>
      <p>現在準備中ですので、もうしばらくお待ちください。</p>
      {/* <p>※登録・編集・削除はログイン時のみ可能です。</p>
      <p>※アプリ左上の歯車マークから、ポートフォリオに記載のIDとパスワードでログインしてぜひお試しください。</p> */}
    </div>
  )
}
