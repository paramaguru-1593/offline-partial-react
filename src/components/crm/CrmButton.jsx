export default function CrmButton({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  const base =
    'inline-flex cursor-pointer items-center justify-center rounded-md border-0 px-5 py-2 text-sm font-semibold text-white transition-opacity outline-none hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'

  const variants = {
    primary:
      'bg-gradient-to-b from-[#FFC586] to-[#F28B18] shadow-sm',
    secondary:
      'border border-slate-800 bg-white text-slate-800 shadow-none hover:bg-slate-50',
    outline:
      'border border-[#93C5FD] bg-white text-[#2563EB] shadow-none hover:bg-blue-50',
    green: 'bg-[#006d41] text-white shadow-sm',
    danger: 'bg-[#DC2626] text-white shadow-sm',
    dark: 'bg-[#475569] text-white shadow-sm',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
