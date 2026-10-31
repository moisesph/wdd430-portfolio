import Link from "next/link";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link
          href="/"
          className="text-2xl font-bold hover:text-blue-200 transition-colors"
        >
          Moises Pleytez
        </Link>

        <nav>
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
