import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import SkillsList from './pages/SkillsList'
import AddSkill from './pages/AddSkill'
import SkillDetail from './pages/SkillDetail'
import Timeline from './pages/Timeline'

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="container-page">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/skills" element={<SkillsList />} />
            <Route path="/skills/add" element={<AddSkill />} />
            <Route path="/skills/:id" element={<SkillDetail />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="*" element={<div className="text-sm text-slate-500">Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
