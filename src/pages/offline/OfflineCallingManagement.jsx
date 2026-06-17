import { SearchOutlined } from '@ant-design/icons'
import PageHeader from '../../components/crm/PageHeader'
import CrmButton from '../../components/crm/CrmButton'

const managementData = [
  { email: 'porubselvi.m@kalyanmatrimony.com', active: 'Active', language: 'Tamil', leadTypes: 'Fresh-leads, Call Back' },
  { email: 'mathankumar.b@kalyanmatrimony.com', active: 'Active', language: 'Telugu', leadTypes: 'Fresh-leads' },
  { email: 'sangeetha.r@kalyanmatrimony.com', active: 'Active', language: 'Malayalam', leadTypes: 'Call Back, Other Leads' },
  { email: 'priya.k@kalyanmatrimony.com', active: 'Active', language: 'Kannada', leadTypes: 'Fresh-leads, Call Back' },
  { email: 'anitha.s@kalyanmatrimony.com', active: 'Active', language: 'Hindi', leadTypes: 'Fresh-leads' },
  { email: 'deepa.v@kalyanmatrimony.com', active: 'Active', language: 'Tamil', leadTypes: 'Call Back' },
  { email: 'kavitha.m@kalyanmatrimony.com', active: 'Active', language: 'Mixed', leadTypes: 'Fresh-leads, Other Leads' },
]

export default function OfflineCallingManagement({
  title = 'offline calling management',
  subtitle = 'Configure and manage lead distribution prioritization for offline sessions.',
}) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Show</span>
            <select className="rounded border border-slate-200 px-2 py-1 text-sm outline-none">
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            <span>entries</span>
          </div>
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search..."
              className="rounded-md border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-[#F28B18]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Email</th>
                <th className="pb-3 pr-4 font-semibold">Active</th>
                <th className="pb-3 pr-4 font-semibold">Language</th>
                <th className="pb-3 pr-4 font-semibold">Leadtypes</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managementData.map((row) => (
                <tr key={row.email} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-4">{row.email}</td>
                  <td className="py-3 pr-4">
                    <span className="text-green-600">{row.active}</span>
                  </td>
                  <td className="py-3 pr-4">{row.language}</td>
                  <td className="py-3 pr-4">{row.leadTypes}</td>
                  <td className="py-3">
                    <CrmButton className="px-5 py-1 text-xs uppercase">Edit</CrmButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>Showing 1 to 7 of 25 entries</span>
          <div className="flex gap-1">
            <button type="button" className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50">Previous</button>
            <button type="button" className="rounded-md bg-gradient-to-b from-[#FFC586] to-[#F28B18] px-3 py-1 text-white">1</button>
            <button type="button" className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50">2</button>
            <button type="button" className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
