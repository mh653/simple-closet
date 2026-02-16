import Link from "next/link";

export default function Nav() {

  return (
    <nav>
      <ul>
        <li><Link href={"/clothes"}>服から探す</Link></li>
        <li><Link href={"/"}>コーデ一覧</Link></li>
        <li><Link href={"/"}>Home</Link></li>
        <li><Link href={"/add-clothes"}>服の登録</Link></li>
        <li><Link href={"/add-coodinations"}>コーデ登録</Link></li>
      </ul>
    </nav>
  );
}

