import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/crm/Header'
import Sidebar from '../components/crm/Sidebar'

export default function CrmLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F6F8]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
