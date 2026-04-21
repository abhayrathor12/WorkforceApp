import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Layers, Radio, CalendarCheck,
  ClipboardList, Shield, TrendingDown, BarChart2, Zap,
  BookOpen, CheckSquare, X, ChevronLeft, ChevronRight
} from 'lucide-react';

import fullLogo from '../../public/logo.png';
import smallLogo from '../../public/logo-.png';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/levels', icon: Layers, label: 'Levels' },
  { to: '/stations', icon: Radio, label: 'Stations' },
  { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
  { to: '/manpower', icon: ClipboardList, label: 'Manpower Req.' },
  { to: '/buffer', icon: Shield, label: 'Buffer Manpower' },
  { to: '/attrition', icon: TrendingDown, label: 'Attrition' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
  { label: 'Analytics', divider: true },
  { to: '/skill-matrix', icon: Zap, label: 'Skill Matrix' },
  { to: '/training', icon: BookOpen, label: 'Training' },
  { to: '/action-plans', icon: CheckSquare, label: 'Action Plans' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ open, onClose, collapsed = false, onToggleCollapse }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── DESKTOP ── */}
      <div
        className={`relative flex-shrink-0 hidden lg:block
          transition-[width] duration-300 ease-in-out
          ${collapsed ? 'w-[68px]' : 'w-64'}`}
      >
        <aside
          className={`fixed top-0 left-0 h-full
            bg-gradient-to-b from-[#071833] via-[#06334b] to-[#045a4f]
            z-30 flex flex-col shadow-2xl
            will-change-transform
            transition-[width,transform] duration-300 ease-in-out
            ${collapsed ? 'w-[68px]' : 'w-64'}`}
        >
          {/* Header */}
          <div className="relative flex items-center justify-center px-3 border-b border-cyan-900/60 min-h-[72px] overflow-hidden">

            {/* Full logo — slides/fades out when collapsed */}
            <div
              className={`transition-[opacity,width] duration-300 ease-in-out overflow-hidden
                ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
            >
              <img
                src={fullLogo}
                alt="TechnoViz Automation"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Small icon logo — fades in when collapsed */}
            <div
              className={`absolute left-1/2 -translate-x-1/2
                transition-opacity duration-300 ease-in-out
                ${collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <img
                src={smallLogo}
                alt="Logo"
                className="h-9 w-9 object-contain"
              />
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden hide-scrollbar">
            {navItems.map(({ to, icon: Icon, label, divider }: any) => {
              if (divider) {
                return collapsed ? (
                  <div
                    key={label}
                    className="mx-3 my-3 border-t border-cyan-900/50"
                  />
                ) : (
                  <div
                    key={label}
                    className="px-6 py-3 mt-4 mb-2 text-xs font-semibold text-emerald-200/80 uppercase tracking-wider whitespace-nowrap"
                  >
                    {label}
                  </div>
                );
              }

              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    `flex items-center text-sm
  transition-colors duration-150 rounded-lg mb-0.5
  ${collapsed ? 'gap-1 justify-center w-10 h-10 mx-auto p-0' : 'gap-3 mx-2 px-4 py-3'}
  ${isActive
                      ? 'bg-slate-200/15 text-white font-semibold'
                      : 'text-emerald-100 hover:bg-slate-200/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap overflow-hidden
                      transition-[width,opacity] duration-300 ease-in-out
                      ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}
                  >
                    {label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Collapse toggle — floats on right edge of sidebar */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-5 -right-3 z-40
            hidden lg:flex items-center justify-center
            w-6 h-6 rounded-full
            bg-[#06334b] border border-cyan-700
            text-emerald-200 hover:text-white hover:bg-cyan-700
            shadow-md transition-colors duration-150"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* ── MOBILE ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64
          bg-gradient-to-b from-[#071833] via-[#06334b] to-[#045a4f]
          z-30 flex flex-col shadow-2xl lg:hidden
          will-change-transform
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-cyan-900/60 min-h-[72px]">
          <img
            src={fullLogo}
            alt="TechnoViz Automation"
            className="h-10 w-auto object-contain"
          />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md
              text-emerald-200 hover:text-white hover:bg-white/10
              transition-colors duration-150 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden hide-scrollbar">
          {navItems.map(({ to, icon: Icon, label, divider }: any) => {
            if (divider) {
              return (
                <div
                  key={label}
                  className="px-6 py-3 mt-4 mb-2 text-xs font-semibold text-emerald-200/80 uppercase tracking-wider"
                >
                  {label}
                </div>
              );
            }
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm
                  transition-colors duration-150
                  mx-2 rounded-lg mb-0.5
                  ${isActive
                    ? 'bg-slate-200/15 text-white font-semibold'
                    : 'text-emerald-100 hover:bg-slate-200/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}