import Link from "next/link";

export default function Header() {
  const redirects = [
    { name: "About Us", redirect: "/about" },
    { name: "Privacy Policy", redirect: "/privacy-policy" },
    { name: "Terms", redirect: "/terms" },
    { name: "Contact", redirect: "/contact" },
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
                href={item.redirect}
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
