import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Images from '../../Images'
import {
  OFFLINE_MODULES,
  PARTIAL_MODULES,
  PROFILE_CRM,
} from '../../config/navigation'

function getMenuIcon(item, isActive) {
  const iconKey = isActive ? item.iconSelect : item.icon
  return Images[iconKey] || Images.OfflineProfile
}

function NavSection({ title, items, expanded, onToggle, sidebarCollapsed }) {
  const location = useLocation()

  if (sidebarCollapsed) {
    return (
      <div className="mb-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.key}
              to={item.path}
              title={item.label}
              className={`mb-1 flex items-center justify-center rounded-md px-2 py-2.5 transition-colors ${
                isActive
                  ? 'bg-[#FFF5E9] text-[#F28B18]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <img src={getMenuIcon(item, isActive)} alt="" className="h-5 w-5 shrink-0" />
            </NavLink>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] font-bold text-slate-800"
      >
        <span>{title}</span>
        <img
          src={Images.LeftArrow}
          alt=""
          className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
            expanded ? '-rotate-90' : 'rotate-90'
          }`}
        />
      </button>

      {expanded && (
        <div className="pb-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={`relative mb-0.5 flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors ${
                  isActive
                    ? 'bg-[#FFF5E9] font-medium text-[#F28B18]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-[#F28B18]" />
                )}
                <img src={getMenuIcon(item, isActive)} alt="" className="h-5 w-5 shrink-0" />
                <span className="leading-snug">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const [expandedSections, setExpandedSections] = useState({
    offline: true,
    partial: true,
    profile: true,
  })

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
        collapsed ? 'w-[60px]' : 'w-[260px]'
      }`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className=""
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <img
          src={Images.LeftArrow}
          alt=""
          className={`absolute -right-3 top-4 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#F28B18] shadow-md transition-transform hover:opacity-90 ${
            collapsed ? 'rotate-180' : ''
          }`}
        />
      </button>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 pt-6">
        {!collapsed && (
          <>
            <NavSection
              title="Offline Modules"
              items={OFFLINE_MODULES}
              expanded={expandedSections.offline}
              onToggle={() => toggleSection('offline')}
              sidebarCollapsed={collapsed}
            />
            <NavSection
              title="Partial Module"
              items={PARTIAL_MODULES}
              expanded={expandedSections.partial}
              onToggle={() => toggleSection('partial')}
              sidebarCollapsed={collapsed}
            />
            <NavSection
              title="Profile CRM"
              items={PROFILE_CRM}
              expanded={expandedSections.profile}
              onToggle={() => toggleSection('profile')}
              sidebarCollapsed={collapsed}
            />
          </>
        )}

        {collapsed && (
          <>
            <NavSection
              title=""
              items={OFFLINE_MODULES}
              expanded
              onToggle={() => {}}
              sidebarCollapsed={collapsed}
            />
            <NavSection
              title=""
              items={PARTIAL_MODULES}
              expanded
              onToggle={() => {}}
              sidebarCollapsed={collapsed}
            />
            <NavSection
              title=""
              items={PROFILE_CRM}
              expanded
              onToggle={() => {}}
              sidebarCollapsed={collapsed}
            />
          </>
        )}
      </nav>
    </aside>
  )
}
