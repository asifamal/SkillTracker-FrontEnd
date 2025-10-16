import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <Link to="/dashboard" className="font-semibold text-slate-800 dark:text-slate-100 ml-12 md:ml-0">
          SkillStack
        </Link>
        <div />
      </div>
    </header>
  )
}

export default Navbar
