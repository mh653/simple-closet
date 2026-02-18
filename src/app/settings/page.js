import Link from "next/link";

export default function Header() {

  return (
    <div>
      <h2>設定</h2>

      <h3>天気の地点</h3>
      <p>初期設定で東京の天気を表示しています。</p>
      <p>現在地の天気に変更頂けます。</p>
      <button>位置情報を取得する</button>

      <h3>タグの編集・削除</h3>
      <p>下記ボタンからタグの編集・削除が可能です。</p>
      <p>タグの新規作成もできます。</p>
      <Link href={"settings/tag-settings"}>
        <button>タグを編集する</button>
      </Link>

    </div>
  );
}
