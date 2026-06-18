import { useMemo, useState } from 'react'
import { FilterOutlined, DownloadOutlined, CaretRightOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import PageHeader from '../components/crm/PageHeader'
import CrmButton from '../components/crm/CrmButton'

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

const callLogs = [
  {
    leadId: '14905405', profileId: '-', dateTime: '2025-09-02 15:20:19.0',
    numberType: 'Primary Number', dialer: 'Tata', status: 'Connected', agent: 'mathankumar.b@kalyanmatrimony.com',
    duration: '00:00:18', recording: true, recordingTime: '0:18', totalTime: '00:00:18',
  },
  {
    leadId: '14905406', profileId: '-', dateTime: '2025-09-02 15:20:19.0',
    numberType: 'Primary Number', dialer: 'Tata', status: 'Connected', agent: 'mathankumar.b@kalyanmatrimony.com',
    duration: '00:00:18', recording: true, recordingTime: '0:18', totalTime: '00:00:36',
  },
  {
    leadId: '14905407', profileId: '-', dateTime: '2025-09-02 15:20:19.0',
    numberType: 'Primary Number', dialer: 'Tata', status: 'Not Connected', agent: 'mathankumar.b@kalyanmatrimony.com',
    duration: '00:00:00', recording: false, recordingTime: '', totalTime: '00:00:54',
  },
  {
    leadId: '14905408', profileId: '-', dateTime: '2025-09-02 15:20:19.0',
    numberType: 'Primary Number', dialer: 'Tata', status: 'Connected', agent: 'mathankumar.b@kalyanmatrimony.com',
    duration: '00:00:18', recording: true, recordingTime: '0:18', totalTime: '00:01:12',
  },
  {
    leadId: '14905409', profileId: '-', dateTime: '2025-09-02 15:20:19.0',
    numberType: 'Primary Number', dialer: 'Tata', status: 'Connected', agent: 'mathankumar.b@kalyanmatrimony.com',
    duration: '00:00:18', recording: true, recordingTime: '0:18', totalTime: '00:01:30',
  },
]

export default function ProfileCrm() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    callStatus: '',
    fromDate: '',
    toDate: '',
  })
  const [appliedFilters, setAppliedFilters] = useState({
    callStatus: '',
    fromDate: '',
    toDate: '',
  })

  const filteredCallLogs = useMemo(() => {
    return callLogs.filter((log) => {
      const logDate = log.dateTime.slice(0, 10)
      const matchesStatus = !appliedFilters.callStatus || log.status === appliedFilters.callStatus
      const matchesFromDate = !appliedFilters.fromDate || logDate >= appliedFilters.fromDate
      const matchesToDate = !appliedFilters.toDate || logDate <= appliedFilters.toDate

      return matchesStatus && matchesFromDate && matchesToDate
    })
  }, [appliedFilters])

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const resetFilters = () => {
    const emptyFilters = { callStatus: '', fromDate: '', toDate: '' }
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setIsFilterOpen(false)
  }

  const applyFilters = () => {
    setAppliedFilters(filters)
    setIsFilterOpen(false)
  }

  const handleExport = () => {
    const exportRows = filteredCallLogs.map((log) => ({
      'Lead ID': log.leadId,
      'Profile ID': log.profileId,
      'Call Date & Time': log.dateTime,
      'Number Type': log.numberType,
      Dialer: log.dialer,
      Status: log.status,
      'Agent Name': log.agent,
      Duration: log.duration,
      Recording: log.recording ? log.recordingTime : 'No recording',
      'Total Time': log.totalTime,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportRows)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Call Logs')
    XLSX.writeFile(workbook, 'profile-crm-call-logs.xlsx')
  }

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
            <CrmButton variant="dark" className="flex items-center gap-1 px-4" onClick={handleExport}>
              <DownloadOutlined /> Export
            </CrmButton>
          </div>
        </div>
      </div>

      <div className="overflow-visible rounded-lg border border-[#DDE5EE] bg-white shadow-sm">
        <div className="relative flex h-[62px] items-center justify-between border-b border-[#EEF2F6] px-5">
          <h2 className="text-[18px] font-extrabold text-[#344155]">Call Log Results</h2>
          <button
            type="button"
            aria-label="Filter call logs"
            className="flex h-8 w-8 items-center justify-center text-[#71819A] hover:text-[#F28B18]"
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <FilterOutlined className="text-[18px]" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-4 top-12 z-20 w-[220px] rounded-md border border-[#D4D4D4] bg-white p-4 shadow-xl">
              <span className="absolute -right-[8px] top-[18px] h-4 w-4 rotate-45 border-r border-t border-[#D4D4D4] bg-white" />
              <div className="relative space-y-3">
                <div>
                  <label className="mb-2 block text-[14px] font-bold text-[#222222]">Call Status:</label>
                  <select
                    className="h-[26px] w-full rounded-sm border border-[#7DB3FF] bg-white px-2 text-[13px] text-[#333333] outline-none shadow-[0_0_4px_rgba(37,99,235,0.45)]"
                    value={filters.callStatus}
                    onChange={(e) => updateFilter('callStatus', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Connected">Connected</option>
                    <option value="Not Connected">Not Connected</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-bold text-[#222222]">From Date:</label>
                  <input
                    type="date"
                    className="h-[26px] w-full border border-[#B8B8B8] px-2 text-[13px] text-[#333333] outline-none focus:border-[#F28B18]"
                    value={filters.fromDate}
                    onChange={(e) => updateFilter('fromDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-bold text-[#222222]">To Date:</label>
                  <input
                    type="date"
                    className="h-[26px] w-full border border-[#D0D0D0] px-2 text-[13px] text-[#333333] outline-none focus:border-[#F28B18]"
                    value={filters.toDate}
                    onChange={(e) => updateFilter('toDate', e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    className="rounded bg-[#0D7EF2] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#0B70D8]"
                    onClick={applyFilters}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    className="rounded bg-[#6C757D] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#5D656C]"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] text-left text-[10px] uppercase tracking-[0.4px] text-[#61708A]">
                {['Lead ID', 'Profile ID', 'Call Date & Time', 'Number Type', 'Dialer', 'Status', 'Agent Name', 'Duration', 'Recording', 'Total Time', 'Actions'].map((h) => (
                  <th key={h} className="border-b border-[#EEF2F6] px-5 py-4 font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCallLogs.map((log) => (
                <tr key={log.leadId} className="border-b border-[#EEF2F6] hover:bg-[#FBFCFE]">
                  <td className="px-5 py-5 font-extrabold text-[#344155]">{log.leadId}</td>
                  <td className="px-5 py-5 text-[#72819A]">{log.profileId}</td>
                  <td className="whitespace-nowrap px-5 py-5 text-[#344155]">{log.dateTime}</td>
                  <td className="px-5 py-5 text-[#132238]">{log.numberType}</td>
                  <td className="px-5 py-5 text-[#344155]">{log.dialer}</td>
                  <td className="px-5 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${
                        log.status === 'Connected'
                          ? 'bg-[#D5F8DF] text-[#00873E]'
                          : 'bg-[#FFE0E0] text-[#D71920]'
                      }`}
                    >
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${log.status === 'Connected' ? 'bg-[#00A84F]' : 'bg-[#F05252]'}`} />
                      {log.status}
                    </span>
                  </td>
                  <td className="max-w-[150px] truncate px-5 py-5 text-[#61708A]">{log.agent}</td>
                  <td className="px-5 py-5 text-[#132238]">{log.duration}</td>
                  <td className="px-5 py-5">
                    {log.recording ? (
                      <div className="inline-flex h-6 items-center gap-2 rounded-full bg-[#F1F5F9] px-3">
                        <CaretRightOutlined className="text-[10px] text-[#132238]" />
                        <div className="h-1.5 w-14 rounded-full bg-[#D9E2EC]">
                          <div className="h-full w-1/2 rounded-full bg-[#F28B18]" />
                        </div>
                        <span className="text-[10px] text-[#7B8BA3]">{log.recordingTime}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] italic text-[#9AA8B8]">No recording</span>
                    )}
                  </td>
                  <td className="px-5 py-5 text-[#61708A]">{log.totalTime}</td>
                  <td className="px-5 py-5">
                    <span className="cursor-pointer font-extrabold leading-tight text-[#F28B18]">Call Log</span>
                  </td>
                </tr>
              ))}
              {!filteredCallLogs.length && (
                <tr>
                  <td colSpan={11} className="px-5 py-10 text-center text-sm text-[#61708A]">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] px-5 py-4 text-sm text-[#61708A]">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="h-8 rounded-md border border-[#DEE7F1] px-3 text-sm outline-none">
              <option>10</option>
              <option>25</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex gap-1">
            <button type="button" className="rounded-md px-3 py-1 font-bold text-[#9AA8B8] hover:bg-slate-50">Previous</button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                type="button"
                className={`h-8 w-8 rounded-full text-sm font-bold ${p === 1 ? 'bg-[#F28B18] text-white' : 'text-[#344155] hover:bg-slate-50'}`}
              >
                {p}
              </button>
            ))}
            <button type="button" className="rounded-md px-3 py-1 font-bold text-[#9AA8B8] hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
