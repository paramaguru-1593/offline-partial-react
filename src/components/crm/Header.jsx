import { useState } from 'react'
import { LogoutOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { selectUser } from '../../features/auth/authSelectors'
import Images from '../../Images'

export default function Header() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const displayName = user?.name || 'Deepak'
  const initial = displayName.charAt(0).toUpperCase()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
        <div className="flex items-center gap-2">
          <img src={Images.FaviconIcon} alt="Kalyan Offline" className="h-9 w-auto" />
          <span className="text-sm font-bold tracking-wide text-[#F39023]">
            KALYAN <br />
            OFFLINE
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-3 rounded-md px-2 py-1 text-left transition-colors hover:bg-[#FFF4E8] focus:outline-none focus:ring-2 focus:ring-[#F28B18] focus:ring-offset-2"
          onClick={() => setIsLogoutOpen(true)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6366F1] text-sm font-bold text-white">
            {initial}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-500">Agent</p>
          </div>
        </button>
      </header>

      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[3px]">
          <div className="w-full max-w-[380px] overflow-hidden rounded-md bg-white shadow-2xl">
            <div className="px-6 pt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF4E8] text-[#F28B18]">
                <LogoutOutlined className="text-[22px]" />
              </div>
              <h2 className="mt-4 text-[20px] font-extrabold text-[#122033]">Logout?</h2>
              <p className="mt-2 text-sm text-slate-500">Are you sure you want to logout?</p>
            </div>
            <div className="mt-6 flex gap-3 border-t border-slate-100 bg-[#F8FAFC] px-6 py-4">
              <button
                type="button"
                className="h-10 flex-1 rounded-md border border-[#D0D5DD] bg-white text-sm font-semibold text-[#344054] hover:bg-slate-50"
                onClick={() => setIsLogoutOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-10 flex-1 rounded-md bg-[#E02424] text-sm font-semibold text-white hover:bg-[#C81E1E]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
