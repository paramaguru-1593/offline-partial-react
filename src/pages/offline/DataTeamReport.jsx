import PageHeader from '../../components/crm/PageHeader'

const LANGUAGES = ['Total', 'Tamil', 'Malayalam', 'Telugu', 'Kannada', 'Hindi']
const LANG_COLORS = {
  Total: 'bg-slate-200',
  Tamil: 'bg-orange-100',
  Malayalam: 'bg-blue-100',
  Telugu: 'bg-green-100',
  Kannada: 'bg-pink-100',
  Hindi: 'bg-red-100',
}

const agents = [
  {
    name: 'John Doe',
    data: {
      Total: { insert: 120, exit: 45, profileExit: 30, crmUploaded: 250 },
      Tamil: { insert: 40, exit: 15, profileExit: 10, crmUploaded: 80 },
      Malayalam: { insert: 20, exit: 8, profileExit: 5, crmUploaded: 40 },
      Telugu: { insert: 25, exit: 10, profileExit: 6, crmUploaded: 50 },
      Kannada: { insert: 18, exit: 6, profileExit: 4, crmUploaded: 35 },
      Hindi: { insert: 17, exit: 6, profileExit: 5, crmUploaded: 45 },
    },
  },
  {
    name: 'Sarah Smith',
    data: {
      Total: { insert: 100, exit: 38, profileExit: 25, crmUploaded: 208 },
      Tamil: { insert: 35, exit: 12, profileExit: 8, crmUploaded: 70 },
      Malayalam: { insert: 18, exit: 7, profileExit: 4, crmUploaded: 35 },
      Telugu: { insert: 22, exit: 9, profileExit: 5, crmUploaded: 45 },
      Kannada: { insert: 15, exit: 5, profileExit: 4, crmUploaded: 30 },
      Hindi: { insert: 10, exit: 5, profileExit: 4, crmUploaded: 28 },
    },
  },
]

export default function DataTeamReport() {
  return (
    <div>
      <PageHeader
        title="Profile - Data team LIVE Report"
        subtitle="Real-time performance tracking across all language streams"
      />

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[1200px] border-collapse text-sm">
          <thead>
            <tr>
              <th rowSpan={2} className="border border-slate-200 bg-blue-100 px-3 py-2 text-left text-xs font-semibold uppercase">
                Agent Name
              </th>
              {LANGUAGES.map((lang) => (
                <th
                  key={lang}
                  colSpan={4}
                  className={`border border-slate-200 px-2 py-2 text-center text-xs font-semibold uppercase ${LANG_COLORS[lang]}`}
                >
                  {lang}
                </th>
              ))}
            </tr>
            <tr>
              {LANGUAGES.map((lang) => (
                ['Lead Insert', 'Lead Exit', 'Profile ID Exit', 'CRM Uploaded'].map((col) => (
                  <th
                    key={`${lang}-${col}`}
                    className={`border border-slate-200 px-2 py-1.5 text-[10px] font-semibold uppercase text-slate-500 ${LANG_COLORS[lang]}`}
                  >
                    {col}
                  </th>
                ))
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.name} className="hover:bg-slate-50">
                <td className="border border-slate-200 px-3 py-2 font-medium">{agent.name}</td>
                {LANGUAGES.flatMap((lang) => {
                  const d = agent.data[lang]
                  return [
                    <td key={`${agent.name}-${lang}-insert`} className="border border-slate-200 px-2 py-2 text-center text-xs">{d.insert}</td>,
                    <td key={`${agent.name}-${lang}-exit`} className="border border-slate-200 px-2 py-2 text-center text-xs">{d.exit}</td>,
                    <td key={`${agent.name}-${lang}-profile`} className="border border-slate-200 px-2 py-2 text-center text-xs">{d.profileExit}</td>,
                    <td key={`${agent.name}-${lang}-crm`} className={`border border-slate-200 px-2 py-2 text-center text-xs font-semibold ${lang === 'Total' ? 'text-[#F28B18]' : ''}`}>{d.crmUploaded}</td>,
                  ]
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="px-4 py-3 text-sm text-slate-400">No additional agent records found for this period.</p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            Live Updating
            <span className="text-slate-400">Last updated: May 27, 16:59:22</span>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">V</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">B</span>
            </div>
            <div className="flex gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">V</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
