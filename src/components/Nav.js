import Link from "next/link";

export default function Nav() {

  return (
    <nav>
      <ul>
        <li><Link href={"/clothes"}>アイテム一覧</Link></li>
        <li><Link href={"/coordinations"}>コーデ一覧</Link></li>
        <li><Link href={"/"}>Home</Link></li>
        <li><Link href={"/add-clothes"}>アイテム登録</Link></li>
        <li><Link href={"/add-coordinations"}>コーデ登録</Link></li>
      </ul>
    </nav>
  );
}

