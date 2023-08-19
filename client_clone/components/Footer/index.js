import { generateURL } from "@/utils/common";
import Link from "next/link";

export default function Header() {
  const redirects = [
    { name: "About Us", key: "about" },
    { name: "Privacy Policy", key: "privacyPolicy" },
    { name: "Terms", key: "terms" },
    { name: "Contact", key: "contact" },
  ];
  return (
    <footer className="bg-[#292929] p-4 lg:px-8 text-white">
      <div className="grid grid-cols-3 items-center">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Right Diversion</span>
          <img className="h-16 w-auto" src="/images/logo_rd_white.png" alt="" />
        </Link>

        <ul>
          {redirects.map((item, index) => (
            <li key={index}>
              <Link
                href={generateURL({ key: item.key })}
                className="text-sm hover:underline leading-6"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="text-sm leading-6">
          <p>© Right Diversion - All Right Reserved</p>
        </div>
      </div>
    </footer>
  );
}
