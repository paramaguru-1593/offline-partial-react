import PageHeader from '../../components/crm/PageHeader'

const reportData = [
  {
    name: 'porubselvi.m',
    email: 'porubselvi.m@kalyanmatrimony.com',
    language: 'Tamil, Eng',
    loadedFresh: 50, loadedCallback: 10,
    calledFresh: 45, calledCallback: 8, calledOther: 2, calledTotal: 55,
    connectedFresh: 30, connectedCallback: 5, connectedOther: 1, connectedTotal: 36,
    registration: 12, notConnected: 19,
    verified: 'VERIFIED', parentsNum: 8, appLogin: 10, photo: 9, consent: 5, jewellery: 3, gss: 2,
    saleCount: 4, profileId: 'KM-9921', uniqueCalls: 48,
  },
  {
    name: 'mathankumar.b',
    email: 'mathankumar.b@kalyanmatrimony.com',
    language: 'Mixed',
    loadedFresh: 40, loadedCallback: 15,
    calledFresh: 38, calledCallback: 12, calledOther: 3, calledTotal: 53,
    connectedFresh: 25, connectedCallback: 8, connectedOther: 2, connectedTotal: 35,
    registration: 10, notConnected: 18,
    verified: 'PENDING', parentsNum: 6, appLogin: 7, photo: 6, consent: 4, jewellery: 2, gss: 1,
    saleCount: 3, profileId: 'KM-8842', uniqueCalls: 42,
  },
]

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

export default function OfflineCallReport({
  title = 'Offline Call Report',
  subtitle,
}) {
  const totals = reportData.reduce(
    (acc, row) => ({
      loadedFresh: acc.loadedFresh + row.loadedFresh,
      loadedCallback: acc.loadedCallback + row.loadedCallback,
      calledFresh: acc.calledFresh + row.calledFresh,
      calledCallback: acc.calledCallback + row.calledCallback,
      calledOther: acc.calledOther + row.calledOther,
      calledTotal: acc.calledTotal + row.calledTotal,
      connectedFresh: acc.connectedFresh + row.connectedFresh,
      connectedCallback: acc.connectedCallback + row.connectedCallback,
      connectedOther: acc.connectedOther + row.connectedOther,
      connectedTotal: acc.connectedTotal + row.connectedTotal,
      registration: acc.registration + row.registration,
      notConnected: acc.notConnected + row.notConnected,
      saleCount: acc.saleCount + row.saleCount,
      uniqueCalls: acc.uniqueCalls + row.uniqueCalls,
    }),
    {
      loadedFresh: 0, loadedCallback: 0, calledFresh: 0, calledCallback: 0, calledOther: 0,
      calledTotal: 0, connectedFresh: 0, connectedCallback: 0, connectedOther: 0,
      connectedTotal: 0, registration: 0, notConnected: 0, saleCount: 0, uniqueCalls: 0,
    },
  )

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
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
              <tr key={row.email} className="hover:bg-slate-50">
                <Td>
                  <div className="font-medium">{row.name}</div>
                  <div className="text-[10px] text-slate-400">{row.email}</div>
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
                <Td>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.verified === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'}`}>
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
              <Td colSpan={7} />
              <Td className="text-center text-[#F28B18]">{totals.saleCount}</Td>
              <Td />
              <Td className="text-center">{totals.uniqueCalls}</Td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <span>Showing 1 to {reportData.length} of 62 entries</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                page === 1
                  ? 'bg-gradient-to-b from-[#FFC586] to-[#F28B18] text-white'
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
