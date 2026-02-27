import Link from "next/link";
import { FiSettings } from "react-icons/fi";

export default function Header() {
  return (
    <header>
        <Link href={"/settings"} className="settingIcon"><FiSettings /></Link>
        <h1>Simple Closet</h1>
    </header>
  );
}

