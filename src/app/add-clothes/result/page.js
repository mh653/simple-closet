import Link from "next/link";

export default function AddClothesResult() {

  return (
    <main>
      <h2>登録完了しました！</h2>
      <section className="resultButtons">
        <Link href={"/"}><button>ホームに戻る</button></Link>
        <Link href={"/add-clothes"}><button>続けて登録する</button></Link>
      </section>
    </main>
  );
}
