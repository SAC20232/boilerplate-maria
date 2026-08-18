import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reservas', label: 'Reservas' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/contratos', label: 'Contratos' },
];

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow-sm z-20">
        <div>
          <h1 className="text-xl font-bold text-blue-600">MarIA</h1>
          <p className="text-[10px] text-gray-500">Hotel Boutique del Mar</p>
        </div>
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Menu</title>
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <aside
        className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-white shadow-md flex-shrink-0 md:min-h-screen border-b md:border-none`}
      >
        <div className="hidden md:block p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">MarIA</h1>
          <p className="text-xs text-gray-500 mt-1">Hotel Boutique del Mar</p>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
