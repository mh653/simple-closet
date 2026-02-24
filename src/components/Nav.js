import Link from "next/link";
import { FaTshirt } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { BiHome } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";

export default function Nav() {
  return (
    <nav>

      <ul>
        <li><Link href={"/clothes"}>
          <div className="navIconWrappwer">
            <FaTshirt className="navIcon"/>
          </div>
          <p>アイテム一覧</p>
        </Link></li>

        <li><Link href={"/coordinations"}>
          <div className="navIconWrappwer">
            <GiClothes className="navIcon"/>
          </div>
          <p>コーデ一覧</p>
        </Link></li>


        <li className="homeBtn"><Link href={"/"}>
          <BiHome className="navHomeIcon"/>
        </Link></li>

        <li><Link href={"/add-clothes"}>
          <div className="navIconWrappwer">
            <FaTshirt className="navIcon"/>
            <CgAdd className="navPlusIcon"/>
          </div>
          <p>アイテム登録</p>
        </Link></li>

        <li><Link href={"/add-coordinations"}>
          <div className="navIconWrappwer">
            <GiClothes className="navIcon"/>
            <CgAdd className="navPlusIcon"/>
          </div>
          <p>コーデ登録</p>
        </Link></li>

      </ul>
    </nav>
  );
}

