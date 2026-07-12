// import ThemeToggle from "@/components/theme-toggle/theme-toggle";
import { Link } from "@tanstack/react-router";

const Header = () => {
  return (
    <nav className="flex-none h-16 overflow-hidden border-b flex items-center justify-between px-4">
      <Link className="text-xl font-bold" to="/">
        React Template
      </Link>
      <div>
        {/* <ThemeToggle /> */}
      </div>
    </nav>
  );
};

export default Header;
