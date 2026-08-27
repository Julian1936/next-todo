import Navigation from "./navigation";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <>
      <header className="bg-gray-200 px-6 py-4 flex items-center justify-between">
        <Navigation />
        <div className="account-menu">
          <AuthButton />
        </div>
      </header>
    </>
  );
}
