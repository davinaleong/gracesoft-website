import Image from "next/image"
import Logo from "../assets/images/GS_IMGLOGO_2026.svg"

export default function Wordmark({ height = 40 }: { height?: number }) {
  return <Image src={Logo} alt="GraceSoft Logo" height={height} className="mx-auto" />;
}