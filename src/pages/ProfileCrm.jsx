import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CaretRightOutlined,
  DownloadOutlined,
  FilterOutlined,
  MoreOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { message } from 'antd'
import * as XLSX from 'xlsx'
import PageHeader from '../components/crm/PageHeader'
import CrmButton from '../components/crm/CrmButton'

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

const profileCrmRecordingUrl =
  'https://crm-v2-live.s3.us-west-2.amazonaws.com/crmv2-live-audio/uploads/pulse/wav/1767867617.25135.wav_695f85b31b051.wav'

const playbackRates = [1, 1.5, 2]

function formatAudioTime(seconds = 0) {
  if (!Number.isFinite(seconds)) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function parseAudioTime(value = '0:00') {
  const [minutes = '0', seconds = '0'] = value.split(':')

  return Number(minutes) * 60 + Number(seconds)
}

const callLogs = [
  {
    leadId: '14905405', profileId: '-', dateTime: '2025-09-02 15:20:19.0',
    numberType: 'Primary Number', dialer: 'Tata', status: 'Connected', agent: 'mathankumar.b@kalyanmatrimony.com',
    duration: '00:00:18', recording: true, recordingTime: '0:18', totalTime: '00:00:18',
    recordingUrl: profileCrmRecordingUrl,
  },
  {
    leadId: '14905406', profileId: '-', dateTime: '2025-09-02 15:20:19.0',
    numberType: 'Primary Number', dialer: 'Tata', status: 'Connected', agent: 'mathankumar.b@kalyanmatrimony.com',
    duration: '00:00:18', recording: true, recordingTime: '0:18', totalTime: '00:00:36',
    recordingUrl: profileCrmRecordingUrl,
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
    recordingUrl: profileCrmRecordingUrl,
  },
  {
    leadId: '14905409', profileId: '-', dateTime: '2025-09-02 15:20:19.0',
    numberType: 'Primary Number', dialer: 'Tata', status: 'Connected', agent: 'mathankumar.b@kalyanmatrimony.com',
    duration: '00:00:18', recording: true, recordingTime: '0:18', totalTime: '00:01:30',
    recordingUrl: profileCrmRecordingUrl,
  },
]

export default function ProfileCrm() {
  const audioRef = useRef(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [playingLeadId, setPlayingLeadId] = useState('')
  const [activeMenuLeadId, setActiveMenuLeadId] = useState('')
  const [activeSpeedLeadId, setActiveSpeedLeadId] = useState('')
  const [audioTime, setAudioTime] = useState({
    currentTime: 0,
    duration: 0,
  })
  const [playbackRate, setPlaybackRate] = useState(1)
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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.playbackRate = playbackRate
  }, [playbackRate])

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

  const stopRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlayingLeadId('')
    setAudioTime((prev) => ({ ...prev, currentTime: 0 }))
  }

  const toggleRecording = async (log) => {
    if (!log.recordingUrl) return

    if (playingLeadId === log.leadId) {
      stopRecording()
      return
    }

    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    audioRef.current.pause()
    audioRef.current.currentTime = 0
    audioRef.current.src = log.recordingUrl
    audioRef.current.playbackRate = playbackRate
    audioRef.current.onloadedmetadata = () => {
      setAudioTime({
        currentTime: audioRef.current.currentTime || 0,
        duration: audioRef.current.duration || 0,
      })
    }
    audioRef.current.ontimeupdate = () => {
      setAudioTime({
        currentTime: audioRef.current.currentTime || 0,
        duration: audioRef.current.duration || 0,
      })
    }
    audioRef.current.onended = () => {
      setPlayingLeadId('')
      setAudioTime((prev) => ({ ...prev, currentTime: 0 }))
    }

    try {
      await audioRef.current.play()
      setPlayingLeadId(log.leadId)
    } catch {
      setPlayingLeadId('')
    }
  }

  const copyRecordingLink = async (recordingUrl) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(recordingUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = recordingUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      message.success('Recording link copied')
    } catch {
      message.error('Unable to copy recording link')
    }
    setActiveMenuLeadId('')
  }

  const downloadRecording = (log) => {
    const link = document.createElement('a')
    link.href = log.recordingUrl
    link.download = `recording-${log.leadId}.wav`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setActiveMenuLeadId('')
  }

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
    setActiveSpeedLeadId('')
  }

  const seekRecording = (value) => {
    if (!audioRef.current) return

    audioRef.current.currentTime = Number(value)
    setAudioTime((prev) => ({ ...prev, currentTime: Number(value) }))
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
                      <div className="relative w-[138px]">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={playingLeadId === log.leadId ? 'Stop recording' : 'Play recording'}
                            className="flex h-5 w-5 items-center justify-center text-[#111827] hover:text-[#F28B18]"
                            onClick={() => toggleRecording(log)}
                          >
                            {playingLeadId === log.leadId ? (
                              <StopOutlined className="text-[12px]" />
                            ) : (
                              <CaretRightOutlined className="text-[13px]" />
                            )}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max={
                              playingLeadId === log.leadId && audioTime.duration
                                ? audioTime.duration
                                : parseAudioTime(log.recordingTime) || 18
                            }
                            value={playingLeadId === log.leadId ? audioTime.currentTime : 0}
                            className="h-1 w-[68px] accent-[#3B82F6]"
                            disabled={playingLeadId !== log.leadId}
                            onChange={(e) => seekRecording(e.target.value)}
                          />
                          <button
                            type="button"
                            aria-label="Recording options"
                            className="flex h-5 w-5 items-center justify-center text-[#111827] hover:text-[#F28B18]"
                            onClick={() =>
                              setActiveMenuLeadId((prev) => (prev === log.leadId ? '' : log.leadId))
                            }
                          >
                            <MoreOutlined className="rotate-90 text-[15px]" />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-[#111827]">
                          <span>
                            {playingLeadId === log.leadId
                              ? formatAudioTime(audioTime.currentTime)
                              : '0:00'}
                          </span>
                          <button
                            type="button"
                            className="rounded px-1 text-[11px] hover:bg-[#F1F5F9]"
                            onClick={() =>
                              setActiveSpeedLeadId((prev) => (prev === log.leadId ? '' : log.leadId))
                            }
                          >
                            {playbackRate}x
                          </button>
                        </div>

                        {activeSpeedLeadId === log.leadId && (
                          <div className="absolute right-0 top-[42px] z-30 w-16 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                            {playbackRates.map((rate) => (
                              <button
                                key={rate}
                                type="button"
                                className={`block w-full px-2 py-1 text-left text-[12px] hover:bg-[#FFF5E9] ${
                                  playbackRate === rate ? 'font-bold text-[#F28B18]' : 'text-slate-700'
                                }`}
                                onClick={() => changePlaybackRate(rate)}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        )}

                        {activeMenuLeadId === log.leadId && (
                          <div className="absolute right-4 top-6 z-30 w-24 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                            <button
                              type="button"
                              className="block w-full px-3 py-1.5 text-left text-[12px] text-slate-700 hover:bg-[#FFF5E9]"
                              onClick={() => copyRecordingLink(log.recordingUrl)}
                            >
                              Copy link
                            </button>
                            <button
                              type="button"
                              className="block w-full px-3 py-1.5 text-left text-[12px] text-slate-700 hover:bg-[#FFF5E9]"
                              onClick={() => downloadRecording(log)}
                            >
                              Download
                            </button>
                          </div>
                        )}
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
