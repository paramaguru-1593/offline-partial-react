import { useSelector } from 'react-redux'
import { selectUser } from '../../features/auth/authSelectors'
import Images from '../../Images'

export default function Header() {
  const user = useSelector(selectUser)
  const displayName = user?.name || 'Deepak'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
      <div className="flex items-center gap-2">
        <img src={Images.FaviconIcon} alt="Kalyan Offline" className="h-9 w-auto" />
        <span className="text-sm font-bold tracking-wide text-[#F39023]">
          KALYAN <br />
          OFFLINE
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6366F1] text-sm font-bold text-white">
          {initial}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-slate-800">{displayName}</p>
          <p className="text-xs text-slate-500">Agent</p>
        </div>
      </div>
    </header>
  )
}
