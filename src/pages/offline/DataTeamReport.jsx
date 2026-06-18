import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from '../../components/crm/PageHeader'
import { fetchDataTeamReport } from '../../features/dataTeamReport/dataTeamReportSlice'

const LANGUAGES = ['Total', 'Tamil', 'Malayalam', 'Telugu', 'Kannada', 'Hindi']
const LANG_COLORS = {
  Total: 'bg-[#F1F5F9]',
  Tamil: 'bg-[#FFF7ED]',
  Malayalam: 'bg-[#EFF6FF]',
  Telugu: 'bg-[#F0FDF4]',
  Kannada: 'bg-[#FAF5FF]',
  Hindi: 'bg-[#FEF2F2]',
}

const FIELD_PREFIX = {
  Total: 'total',
  Tamil: 'tamil',
  Malayalam: 'malayalam',
  Telugu: 'telugu',
  Kannada: 'kannada',
  Hindi: 'hindi',
}

function getLanguageData(row, language) {
  const prefix = FIELD_PREFIX[language]

  return {
    insert: row[`${prefix}LeadInserted`] || 0,
    exit: row[`${prefix}LeadExisted`] || 0,
    profileExit: row[`${prefix}ProfileIdAlreadyExisted`] || 0,
    crmUploaded: row[`${prefix}CrmUploaded`] || 0,
  }
}

export default function DataTeamReport() {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.auth.user)
  const admusersId = authUser?.admUsersId || authUser?.id
  const { rows, status, isFallback } = useSelector((state) => state.dataTeamReport)

  useEffect(() => {
    if (admusersId) {
      dispatch(fetchDataTeamReport(admusersId))
    }
  }, [admusersId, dispatch])

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
              <th rowSpan={2} className="border border-slate-200 bg-[rgba(203, 219, 245, 0.2)] px-3 py-2 text-left text-xs font-semibold uppercase">
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
            {rows.map((agent) => (
              <tr key={agent.admUsersId || agent.name} className="hover:bg-slate-50">
                <td className="border border-slate-200 px-3 py-2 font-medium">{agent.name}</td>
                {LANGUAGES.flatMap((lang) => {
                  const d = getLanguageData(agent, lang)
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

        <p className="px-4 py-3 text-sm text-slate-400">
          {status === 'loading'
            ? 'Loading data team report...'
            : isFallback
              ? 'No API records available.'
              : `Showing ${rows.length} data team record${rows.length === 1 ? '' : 's'}.`}
        </p>

        {/* <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            Live Updating
            <span className="text-slate-400">Last updated: May 27, 16:59:22</span>
          </div>
          
        </div> */}
      </div>
    </div>
  )
}
