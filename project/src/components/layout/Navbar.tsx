import { Menu, Moon, Sun, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/levels': 'Levels',
  '/stations': 'Stations',
  '/attendance': 'Attendance',
  '/manpower': 'Manpower Requirement',
  '/buffer': 'Buffer Manpower',
  '/attrition': 'Attrition',
  '/reports': 'Reports',
};

interface Props {
  onMenuClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Navbar({ onMenuClick, theme, onToggleTheme }: Props) {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'Workforce Management';

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 shadow-sm flex-shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-gray-800 dark:text-gray-100 font-semibold text-base lg:text-lg">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-200 hidden sm:block font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
