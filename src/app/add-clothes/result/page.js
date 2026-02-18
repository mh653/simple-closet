import Link from "next/link";

export default function AddClothesResult() {

  return (
    <div>
      <h2>登録完了しました！</h2>
      <Link href={"/"}>ホームに戻る</Link>
      <br></br>
      <Link href={"/add-clothes"}>続けて登録する</Link>
    </div>
  );
}
