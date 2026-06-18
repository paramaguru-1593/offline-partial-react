import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/crm/Header'
import Sidebar from '../components/crm/Sidebar'

export default function CrmLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6F8]">
      <Header />
      <div className="flex flex-1">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
