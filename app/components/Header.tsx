import Image from "next/image"
import Logo from "./../assets/images/GS_IMGICON_2026.svg"

export default function Header() {
  return (
    <header className="relative">
      <nav className="sticky top-0 flex items-center justify-between gap-4 p-4 text-xl">
        <a href="#top" className="flex items-center gap-2">
          <Image src={Logo} alt="GraceSoft Logo" height={16} />
          <span className="text-indigo-900 font-semibold">GraceSoft</span>
        </a>

        <ul className="flex justify-end gap-4 font-medium">
          <li>
            <a href="#services" className="text-indigo-900 hover:text-indigo-700">
              Services
            </a>
          </li>
          <li>
            <a href="#about" className="text-indigo-900 hover:text-indigo-700">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="text-indigo-900 hover:text-indigo-700">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
