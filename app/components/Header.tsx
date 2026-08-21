import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <>
      <header className="bg-gray-200 px-6 py-4 flex items-center justify-between">
        <nav>
          <ul className="flex items-center gap-3">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/todos">ToDos</Link>
            </li>
          </ul>
        </nav>
        <div className="account-menu">
          <AuthButton />
        </div>
      </header>
    </>
  );
}
