import ThemeToggle from "@/components/theme-toggle/theme-toggle"
import { Link } from "@tanstack/react-router"

const Header = () => {
  return (
    <nav className="flex h-16 flex-none items-center justify-between overflow-hidden border-b px-4">
      <Link className="text-xl font-bold" to="/">
        React Template
      </Link>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Header
