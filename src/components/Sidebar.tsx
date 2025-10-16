import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiList, FiPlusCircle } from 'react-icons/fi'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
    isActive ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : 'text-slate-700 dark:text-slate-200'
  }`

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-60 shrink-0 border-r border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900">
      <div className="p-4">
        <nav className="space-y-1">
          <NavLink to="/dashboard" className={linkClass}>
            <FiHome /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/skills" end className={linkClass}>
            <FiList /> <span>Skills</span>
          </NavLink>
          <NavLink to="/skills/add" className={linkClass}>
            <FiPlusCircle /> <span>Add Skill</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
