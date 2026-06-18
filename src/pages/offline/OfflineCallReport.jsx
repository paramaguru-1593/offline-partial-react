import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from '../../components/crm/PageHeader'
import { fetchOfflineCallReport } from '../../features/offlineCallReport/offlineCallReportSlice'

function Th({ children, className = '', colSpan = 1, rowSpan = 1 }) {
  return (
    <th colSpan={colSpan} rowSpan={rowSpan} className={`border border-slate-300 px-2 py-1.5 text-[10px] font-semibold uppercase ${className}`}>
      {children}
    </th>
  )
}

function Td({ children, className = '' }) {
  return <td className={`border border-slate-200 px-2 py-1.5 text-xs ${className}`}>{children}</td>
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
    uniqueCalls: row.totalDialout || 0,
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

export default function OfflineCallReport({
  title = 'Offline Call Report',
  subtitle,
}) {
  const dispatch = useDispatch()
  const { report, totalresult, status, isFallback } = useSelector((state) => state.offlineCallReport)
  const reportData = report.map(mapReportRow)
  const totals = mapTotals(totalresult[0])

  useEffect(() => {
    dispatch(fetchOfflineCallReport({ admUsersId: 1, panel: 'offlinecalling' }))
  }, [dispatch])

  return (
    <div className="min-w-0 overflow-x-hidden">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="max-w-full overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[1400px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-600 text-white">
              <Th rowSpan={2}>Telecaller Name</Th>
              <Th rowSpan={2}>Language</Th>
              <Th colSpan={2} className="text-center">Leads Loaded in Morning</Th>
              <Th colSpan={4} className="text-center">Leads Called Till Now</Th>
              <Th colSpan={4} className="bg-green-700 text-center">Connected Calls</Th>
              <Th rowSpan={2}>Total Registration</Th>
              <Th rowSpan={2}>Not Connected Calls</Th>
              <Th rowSpan={2}>Verified</Th>
              <Th rowSpan={2}>Parents Num</Th>
              <Th rowSpan={2}>App Login</Th>
              <Th rowSpan={2}>Photo</Th>
              <Th rowSpan={2}>Consent to Pay</Th>
              <Th rowSpan={2}>Jewellery Leads</Th>
              <Th rowSpan={2}>GSS Leads</Th>
              <Th rowSpan={2}>Sale Count</Th>
              <Th rowSpan={2}>Profile ID</Th>
              <Th rowSpan={2}>Unique Call Count</Th>
            </tr>
            <tr className="bg-slate-500 text-white">
              <Th>Fresh Leads</Th>
              <Th>Call Back</Th>
              <Th>Fresh Leads</Th>
              <Th>Call Back</Th>
              <Th>Other Leads</Th>
              <Th>Total Calls</Th>
              <Th className="bg-green-600">Fresh Leads</Th>
              <Th className="bg-green-600">Call Back</Th>
              <Th className="bg-green-600">Other Leads</Th>
              <Th className="bg-green-600">Total Calls</Th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row) => (
              <tr key={row.id || row.email} className="hover:bg-slate-50">
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D3E4FE] text-[10px] font-semibold uppercase text-[#8A4B00]">
                      {getEmailInitial(row.email)}
                    </span>
                    <span className="font-semibold text-[#0F1F35]">{row.email}</span>
                  </div>
                </Td>
                <Td>{row.language}</Td>
                <Td className="text-center">{row.loadedFresh}</Td>
                <Td className="text-center">{row.loadedCallback}</Td>
                <Td className="text-center">{row.calledFresh}</Td>
                <Td className="text-center">{row.calledCallback}</Td>
                <Td className="text-center">{row.calledOther}</Td>
                <Td className="text-center">{row.calledTotal}</Td>
                <Td className="bg-green-50 text-center">{row.connectedFresh}</Td>
                <Td className="bg-green-50 text-center">{row.connectedCallback}</Td>
                <Td className="bg-green-50 text-center">{row.connectedOther}</Td>
                <Td className="bg-green-50 text-center font-semibold text-green-700">{row.connectedTotal}</Td>
                <Td className="text-center">{row.registration}</Td>
                <Td className="text-center">{row.notConnected}</Td>
                <Td className="text-center">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    {row.verified}
                  </span>
                </Td>
                <Td className="text-center">{row.parentsNum}</Td>
                <Td className="text-center">{row.appLogin}</Td>
                <Td className="text-center">{row.photo}</Td>
                <Td className="text-center">{row.consent}</Td>
                <Td className="text-center">{row.jewellery}</Td>
                <Td className="text-center">{row.gss}</Td>
                <Td className="text-center font-semibold text-[#F28B18]">{row.saleCount}</Td>
                <Td>{row.profileId}</Td>
                <Td className="text-center">{row.uniqueCalls}</Td>
              </tr>
            ))}
            <tr className="bg-slate-100 font-semibold">
              <Td colSpan={2}>System Totals</Td>
              <Td className="text-center">{totals.loadedFresh}</Td>
              <Td className="text-center">{totals.loadedCallback}</Td>
              <Td className="text-center">{totals.calledFresh}</Td>
              <Td className="text-center">{totals.calledCallback}</Td>
              <Td className="text-center">{totals.calledOther}</Td>
              <Td className="text-center">{totals.calledTotal}</Td>
              <Td className="bg-green-50 text-center">{totals.connectedFresh}</Td>
              <Td className="bg-green-50 text-center">{totals.connectedCallback}</Td>
              <Td className="bg-green-50 text-center">{totals.connectedOther}</Td>
              <Td className="bg-green-50 text-center text-green-700">{totals.connectedTotal}</Td>
              <Td className="text-center">{totals.registration}</Td>
              <Td className="text-center">{totals.notConnected}</Td>
              <Td />
              <Td className="text-center">{totals.parentsNum}</Td>
              <Td className="text-center">{totals.appLogin}</Td>
              <Td className="text-center">{totals.photo}</Td>
              <Td className="text-center">{totals.consent}</Td>
              <Td className="text-center">{totals.jewellery}</Td>
              <Td className="text-center">{totals.gss}</Td>
              <Td className="text-center text-[#F28B18]">{totals.saleCount}</Td>
              <Td />
              <Td className="text-center">{totals.uniqueCalls}</Td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <span>
          {status === 'loading'
            ? 'Loading offline call report...'
            : isFallback
              ? `Showing 1 to ${reportData.length} static entries`
              : `Showing 1 to ${reportData.length} entries`}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                page === 1
                  ? 'bg-[linear-gradient(180deg,_#FFC586_0%,_#F28B18_100%)] text-white'
                  : 'border border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
