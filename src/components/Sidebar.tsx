import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiList, FiPlusCircle, FiMenu, FiX } from 'react-icons/fi'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
    isActive ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : 'text-slate-700 dark:text-slate-200'
  }`

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-60 shrink-0 border-r border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 pt-16 md:pt-4">
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={linkClass} onClick={() => setIsOpen(false)}>
              <FiHome /> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/skills" end className={linkClass} onClick={() => setIsOpen(false)}>
              <FiList /> <span>Skills</span>
            </NavLink>
            <NavLink to="/skills/add" className={linkClass} onClick={() => setIsOpen(false)}>
              <FiPlusCircle /> <span>Add Skill</span>
            </NavLink>
            <NavLink to="/timeline" className={linkClass} onClick={() => setIsOpen(false)}>
              <span className="w-4 h-4 rounded bg-slate-300 dark:bg-slate-600 inline-block" /> <span>Timeline</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
