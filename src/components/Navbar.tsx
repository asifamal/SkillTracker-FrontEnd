import React from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <Link to="/dashboard" className="font-semibold text-slate-800 dark:text-slate-100">
          SkillStack
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9 w-64" placeholder="Search (placeholder)" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
