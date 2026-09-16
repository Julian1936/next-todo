import Navigation from "./navigation";
import AuthButton from "./AuthButton";
import LangSwitcher from "./LangSwitcher";

export default function Header() {
  return (
    <>
      <header className="bg-gray-200 px-6 py-4 flex items-center justify-between">
        <Navigation />
        <div className="account-menu flex gap-2">
          <AuthButton />
          <LangSwitcher />
        </div>
      </header>
    </>
  );
}
