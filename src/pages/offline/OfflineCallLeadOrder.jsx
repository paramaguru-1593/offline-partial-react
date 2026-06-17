import { useState } from 'react'
import PageHeader from '../../components/crm/PageHeader'
import CrmButton from '../../components/crm/CrmButton'

const LEAD_CRITERIA = [
  'New leads',
  're-entry leads',
  'Yesterday Callback & notconnected leads',
  '>60 Callback & notconnected leads',
  '>1 to <7 Callback & notconnected leads',
  '>20 to <60 Callback & notconnected leads',
  '>7 to <20 Callback & notconnected leads',
]

export default function OfflineCallLeadOrder({
  title = 'Offline call Lead Order',
  subtitle = 'Configure and manage lead distribution prioritization for offline sessions.',
}) {
  const [orders, setOrders] = useState(LEAD_CRITERIA.map((_, i) => i + 1))

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
                <th className="pb-3 pr-4 font-semibold">Lead Criteria</th>
                <th className="pb-3 font-semibold">Input Order</th>
              </tr>
            </thead>
            <tbody>
              {LEAD_CRITERIA.map((criteria, idx) => (
                <tr key={criteria} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">Order {idx + 1}</td>
                  <td className="py-3 pr-4 capitalize text-slate-700">{criteria}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={orders[idx]}
                      onChange={(e) => {
                        const next = [...orders]
                        next[idx] = Number(e.target.value)
                        setOrders(next)
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
