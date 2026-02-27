import Link from "next/link";
import { FaTshirt } from "react-icons/fa";
import { GiClothes } from "react-icons/gi";
import { BiHome } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";

export default function Nav() {
  return (
    <nav>

      <ul>

        <Link href={"/clothes"}>
          <li>
              <div className="navIconWrappwer">
                <FaTshirt className="navIcon"/>
              </div>
              <p>アイテム一覧</p>
          </li>
        </Link>

        <Link href={"/coordinations"}>
          <li>
            <div className="navIconWrappwer">
              <GiClothes className="navIcon"/>
            </div>
            <p>コーデ一覧</p>
          </li>
        </Link>

        <Link href={"/"}>
          <li className="homeBtn">
            <BiHome className="navHomeIcon"/>
          </li>
        </Link>

        <Link href={"/add-clothes"}>
          <li>
            <div className="navIconWrappwer">
              <FaTshirt className="navIcon"/>
              <CgAdd className="navPlusIcon"/>
            </div>
            <p>アイテム登録</p>
          </li>
        </Link>

        <Link href={"/add-coordinations"}>
          <li>
            <div className="navIconWrappwer">
              <GiClothes className="navIcon"/>
              <CgAdd className="navPlusIcon"/>
            </div>
            <p>コーデ登録</p>
          </li>
        </Link>

      </ul>
    </nav>
  );
}

