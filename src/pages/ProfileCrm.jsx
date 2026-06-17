import { FilterOutlined, DownloadOutlined, CaretRightOutlined } from '@ant-design/icons'
import PageHeader from '../components/crm/PageHeader'
import CrmButton from '../components/crm/CrmButton'

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

const callLogs = [
  {
    leadId: 'LD-10234', profileId: 'KM-9921', dateTime: '2026-05-27 14:32:18',
    numberType: 'Primary', dialer: 'Auto', status: 'Connected', agent: 'Deepak',
    duration: '3:42', recording: true, recordingTime: '0:18', totalTime: '4:00',
  },
  {
    leadId: 'LD-10235', profileId: 'KM-8842', dateTime: '2026-05-27 13:15:05',
    numberType: 'Alternate', dialer: 'Manual', status: 'Missed', agent: 'Deepak',
    duration: '0:00', recording: false, recordingTime: '', totalTime: '0:30',
  },
  {
    leadId: 'LD-10236', profileId: 'KM-7731', dateTime: '2026-05-27 11:48:22',
    numberType: 'Primary', dialer: 'Auto', status: 'Connected', agent: 'Deepak',
    duration: '5:12', recording: true, recordingTime: '0:45', totalTime: '5:30',
  },
]

export default function ProfileCrm() {
  return (
    <div>
      <PageHeader
        title="Profile CRM"
        subtitle="Configure and manage lead distribution prioritization for offline sessions."
      />

      <div className="mb-5 rounded-lg bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Select Mode</label>
            <select className={inputClass} defaultValue="offline">
              <option value="offline">Offline</option>
              <option value="partial">Partial</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Search Criteria</label>
            <select className={inputClass} defaultValue="email">
              <option value="email">Agent Email</option>
              <option value="profile">Profile ID</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">Select Agent</label>
            <select className={inputClass} defaultValue="mathankumar">
              <option value="mathankumar">mathankumar.b@kalyanmatrimony.com</option>
              <option value="porubselvi">porubselvi.m@kalyanmatrimony.com</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <CrmButton className="flex-1">Search</CrmButton>
            <CrmButton variant="dark" className="flex items-center gap-1 px-4">
              <DownloadOutlined /> Export
            </CrmButton>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Call Log Results</h2>
          <FilterOutlined className="cursor-pointer text-slate-400 hover:text-[#F28B18]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-400">
                {['Lead ID', 'Profile ID', 'Call Date & Time', 'Number Type', 'Dialer', 'Status', 'Agent Name', 'Duration', 'Recording', 'Total Time', 'Actions'].map((h) => (
                  <th key={h} className="pb-3 pr-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {callLogs.map((log) => (
                <tr key={log.leadId} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 pr-3">{log.leadId}</td>
                  <td className="py-3 pr-3">{log.profileId}</td>
                  <td className="py-3 pr-3 whitespace-nowrap">{log.dateTime}</td>
                  <td className="py-3 pr-3">{log.numberType}</td>
                  <td className="py-3 pr-3">{log.dialer}</td>
                  <td className="py-3 pr-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`inline-block h-2 w-2 rounded-full ${log.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 pr-3">{log.agent}</td>
                  <td className="py-3 pr-3">{log.duration}</td>
                  <td className="py-3 pr-3">
                    {log.recording ? (
                      <div className="flex items-center gap-1.5">
                        <CaretRightOutlined className="text-[#F28B18]" />
                        <div className="h-1.5 w-16 rounded-full bg-slate-200">
                          <div className="h-full w-1/3 rounded-full bg-[#F28B18]" />
                        </div>
                        <span className="text-xs text-slate-400">{log.recordingTime}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">no recording</span>
                    )}
                  </td>
                  <td className="py-3 pr-3">{log.totalTime}</td>
                  <td className="py-3">
                    <span className="cursor-pointer font-medium text-[#F28B18]">Call Log</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="rounded border border-slate-200 px-2 py-1 text-sm">
              <option>10</option>
              <option>25</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex gap-1">
            <button type="button" className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50">Previous</button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                className={`rounded-md px-3 py-1 ${p === 1 ? 'bg-gradient-to-b from-[#FFC586] to-[#F28B18] text-white' : 'border border-slate-200 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            ))}
            <button type="button" className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
