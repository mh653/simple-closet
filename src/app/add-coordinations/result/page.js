import Link from "next/link";

export default function AddCoodinationsResult() {

  return (
    <main>
      <h2>登録完了しました！</h2>
      <section>
        <Link href={"/"}><button>ホームに戻る</button></Link>
        <br></br>
        <Link href={"/add-coordinations"}><button>続けて登録する</button></Link>
      </section>
    </main>
  );
}

