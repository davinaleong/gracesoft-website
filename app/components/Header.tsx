import Image from "next/image"
import Link from "next/link"
import Logo from "./../assets/images/GS_IMGICON_2026.svg"
import contentHelper from "../db/content-helper";

export default function Header() {
  const navigation = contentHelper.getNavigation();

  return (
    <header className="relative">
      <nav className="sticky top-0 flex items-center justify-between gap-4 p-4 text-xl">
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="GraceSoft Logo" height={16} />
          <span className="text-indigo-900 font-semibold">GraceSoft</span>
        </Link>

        <ul className="flex justify-end gap-4 font-medium">
          {navigation.map(({ label, href }, index) => (
            <li key={index}>
              <Link href={href} className="text-indigo-900 hover:text-indigo-700">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
