import { useEffect, useState } from 'react'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CloseOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import PageHeader from '../../components/crm/PageHeader'
import CrmButton from '../../components/crm/CrmButton'
import {
  editOfflineCallAccess,
  fetchOfflineCallAccess,
  fetchOfflineManagement,
} from '../../features/offlineProfile/offlineProfileApi'
import { setFallbackAccess } from '../../features/offlineProfile/offlineProfileSlice'

const tableHeadClass = 'border-b border-[#E5ECF3] px-6 py-4 text-left text-[10px] font-bold uppercase text-[#607086]'
const tableCellClass = 'border-b border-[#EEF2F6] px-6 py-4 align-middle text-[13px] text-[#16263B]'

function SortHeader({ label, sortKey, sortConfig, onSort, className = '' }) {
  const isActive = sortConfig.key === sortKey
  const isAscending = isActive && sortConfig.direction === 'asc'

  return (
    <th className={`${tableHeadClass} ${className}`}>
      <button
        type="button"
        className="inline-flex items-center gap-2 uppercase"
        onClick={() => onSort(sortKey)}
      >
        <span>{label}</span>
        <span className="flex flex-col text-[8px] leading-none text-[#607086]">
          <CaretUpOutlined className={isActive && isAscending ? 'text-[#F28B18]' : ''} />
          <CaretDownOutlined className={isActive && !isAscending ? 'text-[#F28B18]' : ''} />
        </span>
      </button>
    </th>
  )
}

export default function OfflineCallingManagement({
  title = 'offline calling management',
  subtitle = 'Configure and manage lead distribution prioritization for offline sessions.',
}) {
  const dispatch = useDispatch()
  const {
    rows,
    recordsFiltered,
    status,
    access,
    accessStatus,
    editStatus,
  } = useSelector((state) => state.offlineProfile.management)
  const [editingRow, setEditingRow] = useState(null)
  const [selectedProcess, setSelectedProcess] = useState([])
  const [isLeadDropdownOpen, setIsLeadDropdownOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [search, setSearch] = useState('')
  const totalPages = Math.max(Math.ceil(recordsFiltered / pageSize), 1)

  useEffect(() => {
    dispatch(fetchOfflineManagement({
      page,
      pageSize,
      search,
      sortKey: sortConfig.key,
      sortDirection: sortConfig.direction,
    }))
  }, [dispatch, page, pageSize, search, sortConfig])

  const leadOrder = access.leadOrder || []
  const selectedLeadTypes = leadOrder.filter((leadType) =>
    selectedProcess.includes(leadType.id),
  )
  const remainingLeadTypes = leadOrder.filter((leadType) =>
    !selectedProcess.includes(leadType.id),
  )

  const handleSort = (key) => {
    setPage(1)
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const openEditModal = async (row) => {
    setEditingRow(row)
    setSelectedProcess([])
    setIsLeadDropdownOpen(false)

    try {
      const accessData = await dispatch(fetchOfflineCallAccess({
        admUsersId: row.id,
        email: row.email,
      })).unwrap()
      setSelectedProcess((accessData.selectedProcess || []).map(Number))
    } catch (error) {
      dispatch(setFallbackAccess({
        admUsersId: row.id,
        email: row.email,
        error,
      }))
      setSelectedProcess([5, 6])
    }
  }

  const closeEditModal = () => {
    setEditingRow(null)
    setSelectedProcess([])
    setIsLeadDropdownOpen(false)
  }

  const addLeadType = (leadType) => {
    setSelectedProcess((prev) => [...prev, leadType.id])
    setIsLeadDropdownOpen(false)
  }

  const removeLeadType = (leadTypeId) => {
    setSelectedProcess((prev) => prev.filter((item) => item !== leadTypeId))
  }

  const handleSubmit = async () => {
    if (!editingRow) return

    try {
      await dispatch(editOfflineCallAccess({
        admUsersId: editingRow.id,
        selectedProcess,
      })).unwrap()
      message.success('Offline call access updated successfully')
      closeEditModal()
      dispatch(fetchOfflineManagement({
        page,
        pageSize,
        search,
        sortKey: sortConfig.key,
        sortDirection: sortConfig.direction,
      }))
    } catch (error) {
      message.error(error || 'Unable to update call access')
    }
  }

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="overflow-hidden rounded-[10px] border border-[#E4EAF1] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Show</span>
            <select
              className="h-9 rounded-md border border-[#DEE7F1] px-3 text-sm outline-none focus:border-[#F28B18]"
              value={pageSize}
              onChange={(e) => {
                setPage(1)
                setPageSize(Number(e.target.value))
              }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setPage(1)
                setSearch(e.target.value)
              }}
              className="h-10 w-[230px] rounded-md border border-[#DEE7F1] py-2 pl-9 pr-4 text-sm outline-none focus:border-[#F28B18]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#F1F5F9]">
                <SortHeader label="Email" sortKey="email" sortConfig={sortConfig} onSort={handleSort} className="w-[31%]" />
                <SortHeader label="Active" sortKey="active" sortConfig={sortConfig} onSort={handleSort} className="w-[15%]" />
                <SortHeader label="Language" sortKey="language" sortConfig={sortConfig} onSort={handleSort} className="w-[24%]" />
                <SortHeader label="Leadtypes" sortKey="leadTypes" sortConfig={sortConfig} onSort={handleSort} className="w-[19%]" />
                <th className={`${tableHeadClass} w-[11%] text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id || row.email}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}`}
                >
                  <td className={tableCellClass}>{row.email}</td>
                  <td className={tableCellClass}>
                    <span>{row.active}</span>
                  </td>
                  <td className={`${tableCellClass} text-[#607086]`}>{row.language}</td>
                  <td className={`${tableCellClass} whitespace-pre-line text-[#607086]`}>
                    {row.leadTypes}
                  </td>
                  <td className={`${tableCellClass} text-right`}>
                    <CrmButton
                      className="h-[22px] rounded-md px-3 py-0 text-[10px] uppercase"
                      onClick={() => openEditModal(row)}
                    >
                      Edit
                    </CrmButton>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#607086]">
                    {status === 'loading' ? 'Loading...' : 'No records found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] px-5 py-4 text-sm text-slate-500">
          <span>
            Showing {rows.length ? (page - 1) * pageSize + 1 : 0} to {(page - 1) * pageSize + rows.length} of {recordsFiltered} entries
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`rounded-md px-3 py-1 ${
                  page === pageNumber
                    ? 'bg-[linear-gradient(180deg,_#FFC586_0%,_#F28B18_100%)] text-white'
                    : 'border border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            {page > 3 && (
              <button
                type="button"
                className="rounded-md bg-[linear-gradient(180deg,_#FFC586_0%,_#F28B18_100%)] px-3 py-1 text-white"
              >
                {page}
              </button>
            )}
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20">
          <div className="w-full max-w-[600px] bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
              <h2 className="text-[16px] font-medium text-[#333333]">Edit Lead Type Access</h2>
              <button
                type="button"
                aria-label="Close edit lead type popup"
                className="text-[18px] text-[#C0C4CC] hover:text-[#F28B18]"
                onClick={closeEditModal}
              >
                <CloseOutlined />
              </button>
            </div>

            <div className="space-y-3 px-7 py-4">
              <div className="grid grid-cols-[85px_1fr] items-center gap-3">
                <label className="text-[13px] font-bold text-[#333333]">Email</label>
                <input
                  className="h-[34px] w-full border border-[#C8CDD4] bg-[#EEEEEE] px-3 text-[13px] text-[#555555] outline-none"
                  value={editingRow.email}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-[85px_1fr] items-start gap-3">
                <label className="pt-2 text-[13px] font-bold text-[#333333]">Lead Type</label>
                <div className="relative">
                  <button
                    type="button"
                    className="flex min-h-[34px] w-full flex-wrap items-center gap-1 rounded-sm border border-[#B8B8B8] bg-white px-2 py-1 text-left outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]"
                    onClick={() => setIsLeadDropdownOpen((prev) => !prev)}
                    disabled={accessStatus === 'loading'}
                  >
                    {accessStatus === 'loading' ? (
                      <span className="text-[13px] text-slate-400">Loading...</span>
                    ) : selectedLeadTypes.length ? (
                      selectedLeadTypes.map((leadType) => (
                        <span
                          key={leadType.id}
                          className="inline-flex h-6 items-center gap-1 rounded-sm bg-[#E02020] px-2 text-[12px] font-medium text-white"
                        >
                          <span>{leadType.label}</span>
                          <span
                            role="button"
                            tabIndex={0}
                            className="text-[14px] leading-none"
                            onClick={(e) => {
                                e.stopPropagation()
                                removeLeadType(leadType.id)
                              }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                e.stopPropagation()
                                removeLeadType(leadType.id)
                              }
                            }}
                          >
                            ×
                          </span>
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] text-slate-400">Select Lead Type</span>
                    )}
                  </button>

                  {isLeadDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-sm border border-slate-200 bg-white py-1 text-[13px] shadow-lg">
                      {remainingLeadTypes.length ? (
                        remainingLeadTypes.map((leadType) => (
                          <button
                            key={leadType.id}
                            type="button"
                            className="block w-full px-3 py-2 text-left text-[#333333] hover:bg-[#FFF5E9]"
                            onClick={() => addLeadType(leadType)}
                          >
                            {leadType.label}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-slate-400">No lead types remaining</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pl-[98px] pt-3">
                <CrmButton
                  className="h-9 rounded-sm bg-[#D84A38] px-4 text-[12px] font-medium"
                  disabled={editStatus === 'loading'}
                  onClick={handleSubmit}
                >
                  {editStatus === 'loading' ? 'Submitting...' : 'Submit'}
                </CrmButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
