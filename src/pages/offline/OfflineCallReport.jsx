import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DownloadOutlined } from '@ant-design/icons'
import PageHeader from '../../components/crm/PageHeader'
import { fetchOfflineCallReport } from '../../features/offlineProfile/offlineProfileApi'

function Th({ children, className = '', colSpan = 1, rowSpan = 1 }) {
  return (
    <th
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={`border border-[#E4EAF3] px-2 py-2 text-[10px] font-bold uppercase leading-tight tracking-[0.02em] text-[#313846] ${className}`}
    >
      {children}
    </th>
  )
}

function Td({ children, className = '', colSpan = 1 }) {
  return (
    <td
      colSpan={colSpan}
      className={`border border-[#EDF1F6] px-2 py-2 text-[11px] leading-5 text-[#16263B] ${className}`}
    >
      {children}
    </td>
  )
}

function getEmailInitial(email) {
  return email.trim().charAt(0).toUpperCase()
}

function mapReportRow(row) {
  return {
    id: row.id,
    email: row.name || '',
    language: row.language || '-',
    loadedFresh: row.leadsLoadedfreshleads || 0,
    loadedCallback: row.leadsLoadedCallBack || 0,
    calledFresh: row.leadsCalledInFreshLeads || 0,
    calledCallback: row.leadsCalledInCallBack || 0,
    calledOther: row.leadsCalledInOtherLeads || 0,
    calledTotal: row.totalDialout || 0,
    connectedFresh: row.connectedCallFreshLeads || 0,
    connectedCallback: row.connectedCallCallBack || 0,
    connectedOther: row.connectedCallOtherLeads || 0,
    connectedTotal: row.connectedCallTotal || 0,
    registration: row.registered || 0,
    notConnected: row.notConnectedCall || 0,
    verified: row.phoneVerifiedCount || 0,
    parentsNum: row.parentNumberCount || 0,
    appLogin: row.appLoginCount || 0,
    photo: row.photoCount || 0,
    consent: row.consentToPay || 0,
    jewellery: row.jewelleryLeads || 0,
    gss: row.gpsLeads || 0,
    saleCount: row.salecount || 0,
    profileId: row.SaleProfileId || '-',
    uniqueCalls: row.uniqueCallCount || 0,
  }
}

function mapTotals(totalRow = {}) {
  return {
    loadedFresh: totalRow.totalLeadsLoadedfreshleads || 0,
    loadedCallback: totalRow.totalLeadsLoadedCallBack || 0,
    calledFresh: totalRow.totalLeadsCalledInFreshLeads || 0,
    calledCallback: totalRow.totalLeadsCalledInCallBack || 0,
    calledOther: totalRow.totalLeadsCalledInOtherLeads || 0,
    calledTotal: totalRow.totalTotalDialout || 0,
    connectedFresh: totalRow.totalConnectedCallFreshLeads || 0,
    connectedCallback: totalRow.totalConnectedCallcallback || 0,
    connectedOther: totalRow.totalConnectedCallOtherLeads || 0,
    connectedTotal: totalRow.connectedcalltotal || 0,
    registration: totalRow.totalRegistered || 0,
    notConnected: totalRow.totalNotConnectedcall || 0,
    saleCount: totalRow.totalSale || 0,
    uniqueCalls: totalRow.totalTotalDialout || 0,
    parentsNum: totalRow.totalparentNumberCount || 0,
    appLogin: totalRow.totalappLoginCount || 0,
    photo: totalRow.totalphotoCount || 0,
    consent: totalRow.totalConsentTopay || 0,
    jewellery: totalRow.totalJewelleryleads || 0,
    gss: totalRow.totalGpsleads || 0,
  }
}

const csvColumns = [
  ['Telecaller Name', 'email'],
  ['Language', 'language'],
  ['Fresh Leads Loaded', 'loadedFresh'],
  ['Call Back Loaded', 'loadedCallback'],
  ['Fresh Leads Called', 'calledFresh'],
  ['Call Back Called', 'calledCallback'],
  ['Other Leads Called', 'calledOther'],
  ['Total Calls', 'calledTotal'],
  ['Connected Fresh Leads', 'connectedFresh'],
  ['Connected Call Back', 'connectedCallback'],
  ['Connected Other Leads', 'connectedOther'],
  ['Connected Total Calls', 'connectedTotal'],
  ['Total Registration', 'registration'],
  ['Not Connected Calls', 'notConnected'],
  ['Verified', 'verified'],
  ['Parents Num', 'parentsNum'],
  ['App Login', 'appLogin'],
  ['Photo', 'photo'],
  ['Consent To Pay', 'consent'],
  ['Jewellery Leads', 'jewellery'],
  ['GSS Leads', 'gss'],
  ['Sale Count', 'saleCount'],
  ['Profile ID', 'profileId'],
  ['Unique Call Count', 'uniqueCalls'],
]

function escapeCsv(value) {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function downloadCsv(rows) {
  const csvRows = [
    csvColumns.map(([label]) => escapeCsv(label)).join(','),
    ...rows.map((row) => csvColumns.map(([, key]) => escapeCsv(row[key])).join(',')),
  ]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'offline-call-report.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function OfflineCallReport({
  title = 'Offline Call Report',
  subtitle,
}) {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.auth.user)
  const admUsersId = authUser?.admUsersId || authUser?.id
  const { report, totalresult, status, isFallback } = useSelector((state) => state.offlineProfile.callReport)
  const reportData = report.map(mapReportRow)
  const totals = totalresult.length ? mapTotals(totalresult[0]) : null

  useEffect(() => {
    if (admUsersId) {
      dispatch(fetchOfflineCallReport({ admUsersId, panel: 'offlinecalling' }))
    }
  }, [admUsersId, dispatch])

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={(
          <button
            type="button"
            disabled={!reportData.length}
            onClick={() => downloadCsv(reportData)}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-[#F28B18] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadOutlined />
            Download
          </button>
        )}
      />
      <div className="max-w-full overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <table className="w-full min-w-[1500px] border-collapse text-left">
          <thead>
            <tr className="bg-[#EEF3FB]">
              <Th rowSpan={2} className="min-w-[190px]">Telecaller Name</Th>
              <Th rowSpan={2} className="min-w-[90px]">Language</Th>
              <Th colSpan={2} className="bg-[#E9EFF8] text-center">Leads Loaded In Morning</Th>
              <Th colSpan={4} className="bg-[#EEF3FB] text-center">Leads Called Till Now</Th>
              <Th colSpan={4} className="bg-[#E5F7EF] text-center text-[#04613F]">Connected Calls</Th>
              <Th rowSpan={2} className="min-w-[80px] text-center">Total Registration</Th>
              <Th rowSpan={2} className="min-w-[90px] text-center">Not Connected Calls</Th>
              <Th rowSpan={2} className="min-w-[72px] text-center">Verified</Th>
              <Th rowSpan={2} className="min-w-[74px] text-center">Parents Num</Th>
              <Th rowSpan={2} className="min-w-[62px] text-center">App Login</Th>
              <Th rowSpan={2} className="min-w-[58px] text-center">Photo</Th>
              <Th rowSpan={2} className="min-w-[74px] text-center">Consent To Pay</Th>
              <Th rowSpan={2} className="min-w-[74px] text-center">Jewellery Leads</Th>
              <Th rowSpan={2} className="min-w-[58px] text-center">GSS Leads</Th>
              <Th rowSpan={2} className="min-w-[62px] text-center">Sale Count</Th>
              <Th rowSpan={2} className="min-w-[72px] text-center">Profile ID</Th>
              <Th rowSpan={2} className="min-w-[72px] text-center">Unique Call Count</Th>
            </tr>
            <tr className="bg-[#F7FAFE]">
              <Th className="text-center text-[#B26500]">Fresh Leads</Th>
              <Th className="text-center text-[#B26500]">Call Back</Th>
              <Th className="text-center">Fresh Leads</Th>
              <Th className="text-center">Call Back</Th>
              <Th className="text-center">Other Leads</Th>
              <Th className="text-center">Total Calls</Th>
              <Th className="bg-[#E8FAF1] text-center text-[#008F5A]">Fresh Leads</Th>
              <Th className="bg-[#E8FAF1] text-center text-[#008F5A]">Call Back</Th>
              <Th className="bg-[#E8FAF1] text-center text-[#008F5A]">Other Leads</Th>
              <Th className="bg-[#E8FAF1] text-center text-[#008F5A]">Total Calls</Th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row) => (
              <tr key={row.id || row.email} className="bg-white hover:bg-[#F8FBFF]">
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D8E9FF] text-[9px] font-bold uppercase text-[#A26600]">
                      {getEmailInitial(row.email)}
                    </span>
                    <span className="font-bold text-[#0F1F35]">{row.email}</span>
                  </div>
                </Td>
                <Td>{row.language}</Td>
                <Td className="text-center">{row.loadedFresh}</Td>
                <Td className="text-center">{row.loadedCallback}</Td>
                <Td className="text-center">{row.calledFresh}</Td>
                <Td className="text-center">{row.calledCallback}</Td>
                <Td className="text-center">{row.calledOther}</Td>
                <Td className="text-center">{row.calledTotal}</Td>
                <Td className="bg-[#EAFBF3] text-center">{row.connectedFresh}</Td>
                <Td className="bg-[#EAFBF3] text-center">{row.connectedCallback}</Td>
                <Td className="bg-[#EAFBF3] text-center">{row.connectedOther}</Td>
                <Td className="bg-[#DDF8EB] text-center font-bold text-[#008F5A]">{row.connectedTotal}</Td>
                <Td className="text-center">{row.registration}</Td>
                <Td className="text-center">{row.notConnected}</Td>
                <Td className="text-center">{row.verified}</Td>
                <Td className="text-center">{row.parentsNum}</Td>
                <Td className="text-center">{row.appLogin}</Td>
                <Td className="text-center">{row.photo}</Td>
                <Td className="text-center">{row.consent}</Td>
                <Td className="text-center">{row.jewellery}</Td>
                <Td className="text-center">{row.gss}</Td>
                <Td className="text-center font-bold text-[#F28B18]">{row.saleCount}</Td>
                <Td className="text-center text-[#4B5563]">{row.profileId}</Td>
                <Td className="text-center">{row.uniqueCalls}</Td>
              </tr>
            ))}
            {totals && (
              <tr className="bg-[#F3F6FC] font-bold">
                <Td colSpan={2} className="text-[#0F1F35]">System Totals (Aggregate)</Td>
                <Td className="text-center font-bold">{totals.loadedFresh}</Td>
                <Td className="text-center font-bold">{totals.loadedCallback}</Td>
                <Td className="text-center font-bold">{totals.calledFresh}</Td>
                <Td className="text-center font-bold">{totals.calledCallback}</Td>
                <Td className="text-center font-bold">{totals.calledOther}</Td>
                <Td className="text-center font-bold">{totals.calledTotal}</Td>
                <Td className="bg-[#EAFBF3] text-center font-bold">{totals.connectedFresh}</Td>
                <Td className="bg-[#EAFBF3] text-center font-bold">{totals.connectedCallback}</Td>
                <Td className="bg-[#EAFBF3] text-center font-bold">{totals.connectedOther}</Td>
                <Td className="bg-[#DDF8EB] text-center font-bold text-[#008F5A]">{totals.connectedTotal}</Td>
                <Td className="text-center">{totals.registration}</Td>
                <Td className="text-center">{totals.notConnected}</Td>
                <Td className="text-center">-</Td>
                <Td className="text-center">{totals.parentsNum}</Td>
                <Td className="text-center">{totals.appLogin}</Td>
                <Td className="text-center">{totals.photo}</Td>
                <Td className="text-center">{totals.consent}</Td>
                <Td className="text-center">{totals.jewellery}</Td>
                <Td className="text-center">{totals.gss}</Td>
                <Td className="text-center font-bold text-[#F28B18]">{totals.saleCount}</Td>
                <Td />
                <Td className="text-center">{totals.uniqueCalls}</Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#4B5563]">
        <span>
          {status === 'loading'
            ? 'Loading offline call report...'
            : isFallback
              ? 'No API records available'
              : `Showing 1 to ${reportData.length} entries`}
        </span>
      </div>
    </div>
  )
}
