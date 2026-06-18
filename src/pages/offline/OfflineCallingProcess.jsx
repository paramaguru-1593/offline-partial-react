import { useState } from 'react'
import { ReloadOutlined, PhoneOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { message } from 'antd'
import CrmButton from '../../components/crm/CrmButton'

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

const REGISTER_OUTCOME = 'click here to Register'

function openRegisterOfflineTab(mobileNumber) {
  const params = new URLSearchParams({
    mobile: mobileNumber,
    fromCallingProcess: '1',
  })
  const url = `${window.location.origin}/crm/register-offline?${params.toString()}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export default function OfflineCallingProcess({
  heading = 'Offline Registration Calling Process',
}) {
  const [selectedOutcome, setSelectedOutcome] = useState(REGISTER_OUTCOME)
  const [mobileNumber, setMobileNumber] = useState('1231411111')

  const outcomes = [
    REGISTER_OUTCOME,
    'Change Language',
    'Not Interested',
    'Call Back',
    'Marriage Fixed',
    'Phone Number Wrong',
    'Already Registered',
    'Not eligible',
  ]

  const summaryRows = [
    { id: 'CRM_9921', verification: 'PENDING', photo: false, appLogin: false, call: 'Initiate' },
    { id: 'CRM_8842', verification: 'VERIFIED', photo: true, appLogin: true, call: 'Completed' },
  ]

  const handleSubmitResponse = () => {
    if (selectedOutcome === REGISTER_OUTCOME) {
      openRegisterOfflineTab(mobileNumber)
      message.success('Offline registration opened in a new tab.')
      return
    }

    message.success('Response submitted successfully.')
  }

  const handleRegisterSelect = () => {
    setSelectedOutcome(REGISTER_OUTCOME)
    openRegisterOfflineTab(mobileNumber)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-gradient-to-r from-[#F28B18] to-[#FFC586] px-5 py-3">
        <h1 className="text-lg font-bold text-white">{heading}</h1>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-sm font-semibold">Search Mobile Number</label>
            <input
              className={inputClass}
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>
          <div className="min-w-[160px]">
            <label className="mb-1 block text-sm font-semibold">Lead Type</label>
            <select className={inputClass} defaultValue="fresh">
              <option value="fresh">Fresh-leads</option>
              <option value="callback">Call Back</option>
            </select>
          </div>
          <CrmButton>Show Results</CrmButton>
          <CrmButton variant="secondary">Fetch</CrmButton>
          <CrmButton variant="secondary">Insert</CrmButton>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Today registration summary</h2>
          <ReloadOutlined className="cursor-pointer text-slate-500 hover:text-[#F28B18]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                <th className="pb-2 pr-4 font-semibold">Profile ID</th>
                <th className="pb-2 pr-4 font-semibold">Verification</th>
                <th className="pb-2 pr-4 font-semibold">Photo</th>
                <th className="pb-2 pr-4 font-semibold">App Login</th>
                <th className="pb-2 font-semibold">Call</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium">{row.id}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.verification === 'VERIFIED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {row.verification}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {row.photo ? (
                      <CheckOutlined className="text-green-600" />
                    ) : (
                      <CloseOutlined className="text-red-500" />
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {row.appLogin ? (
                      <CheckOutlined className="text-green-600" />
                    ) : (
                      <CloseOutlined className="text-red-500" />
                    )}
                  </td>
                  <td className="py-3">
                    {row.call === 'Initiate' ? (
                      <span className="cursor-pointer font-medium text-[#F28B18]">{row.call}</span>
                    ) : (
                      <span className="text-slate-400">{row.call}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#F28B18] to-[#FFC586] px-4 py-2.5">
            <h3 className="font-bold text-white">Customer Details</h3>
          </div>
          <div className="space-y-3 p-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Name</span><span>—</span></div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone Number</span>
              <span className="flex items-center gap-1">
                <PhoneOutlined className="text-green-600" /> {mobileNumber || '—'}
              </span>
            </div>
            <div className="flex justify-between"><span className="text-slate-500">Alternate Phone Number</span><span>—</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Email</span><span>—</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Mother Tongue</span><span>Tamil</span></div>
          </div>
          <div className="space-y-2 p-4 pt-0">
            <CrmButton variant="green" className="w-full py-2.5">
              <PhoneOutlined className="mr-2" /> Call Connected
            </CrmButton>
            <CrmButton variant="danger" className="w-full py-2.5">
              <PhoneOutlined className="mr-2" /> Not Connected
            </CrmButton>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#F28B18] to-[#FFC586] px-4 py-2.5">
            <h3 className="font-bold text-white">Call Connected Outcome</h3>
          </div>
          <div className="space-y-2.5 p-4">
            {outcomes.map((item) => (
              <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="outcome"
                  value={item}
                  checked={selectedOutcome === item}
                  onChange={() => {
                    if (item === REGISTER_OUTCOME) {
                      handleRegisterSelect()
                      return
                    }
                    setSelectedOutcome(item)
                  }}
                  className="accent-[#F28B18]"
                />
                <span className={selectedOutcome === item ? 'font-medium text-[#F28B18]' : 'text-slate-700'}>
                  {item}
                </span>
              </label>
            ))}
            <div className="mt-3 rounded-md bg-blue-50 p-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="accent-[#F28B18]" />
                Interested for Kalyan Jewellers Gold Scheme
              </label>
            </div>
          </div>
          <div className="p-4 pt-0">
            <CrmButton variant="green" className="w-full py-2.5" onClick={handleSubmitResponse}>
              Submit Response
            </CrmButton>
          </div>
        </div>
      </div>
    </div>
  )
}
