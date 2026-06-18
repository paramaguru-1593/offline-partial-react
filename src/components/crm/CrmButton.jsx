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
      'bg-[linear-gradient(180deg,_#FFC586_0%,_#F28B18_100%)] shadow-sm',
    secondary:
      'border border-slate-800 bg-white text-slate-800 shadow-none hover:bg-slate-50',
    outline:
      'border border-[#93C5FD] bg-white text-[#2563EB] shadow-none hover:bg-blue-50',
    green: 'bg-[#006d41] text-white shadow-sm',
    danger: 'bg-[#DC2626] text-white shadow-sm',
    dark: 'bg-[#475569] text-white shadow-sm',
    // fetchbutton: 'box-border flex flex-col items-center justify-center px-[26.19px] py-0 w-[89.36px] h-[40px] border border-[#DAC2AE] rounded-lg flex-none order-1 grow-0',
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
