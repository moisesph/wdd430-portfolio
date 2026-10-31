"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <ul className="flex gap-6 font-medium">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`transition-colors ${
                isActive
                  ? "text-white font-bold underline underline-offset-4"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
