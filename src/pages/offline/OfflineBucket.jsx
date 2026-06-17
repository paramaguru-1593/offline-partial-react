import { useState } from 'react'
import PageHeader from '../../components/crm/PageHeader'
import CrmButton from '../../components/crm/CrmButton'

const BUCKET_DATA = [
  { language: 'Tamil' },
  { language: 'Malayalam' },
  { language: 'Kannada' },
  { language: 'Hindi' },
  { language: 'Tamil' },
  { language: 'Tamil' },
  { language: 'Kannada' },
]

export default function OfflineBucket({
  title = 'Offline Bucket Lead',
  subtitle = 'Configure and manage lead distribution prioritization for offline sessions.',
}) {
  const [limits, setLimits] = useState(BUCKET_DATA.map((_, i) => i + 1))

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Lead Criteria Priority</h2>
          <span className="cursor-pointer text-sm font-medium text-blue-600">Input Order</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Order</th>
                <th className="pb-3 pr-4 font-semibold">Language</th>
                <th className="pb-3 font-semibold">Lead Limit</th>
              </tr>
            </thead>
            <tbody>
              {BUCKET_DATA.map((row, idx) => (
                <tr key={`${row.language}-${idx}`} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">{idx + 1}</td>
                  <td className="py-3 pr-4 text-slate-700">{row.language}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={limits[idx]}
                      onChange={(e) => {
                        const next = [...limits]
                        next[idx] = Number(e.target.value)
                        setLimits(next)
                      }}
                      className="w-16 rounded border border-slate-200 px-2 py-1 text-center text-sm outline-none focus:border-[#F28B18]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex justify-end">
          <CrmButton className="px-10">Submit</CrmButton>
        </div>
      </div>
    </div>
  )
}
