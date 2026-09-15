import Navigation from "./navigation";
import AuthButton from "./AuthButton";
import LangSwitcher from "./LangSwitcher";

export default function Header() {
  return (
    <>
      <header className="bg-gray-200 px-6 py-4 flex items-center justify-between">
        <Navigation />
        <LangSwitcher />
        <div className="account-menu">
          <AuthButton />
        </div>
      </header>
    </>
  );
}
