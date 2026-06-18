import { useState } from 'react'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  CheckOutlined,
  CloseOutlined,
  PhoneFilled,
  ReloadOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import CrmButton from '../../components/crm/CrmButton'
import Images from '../../Images/index'
import {
  checkLeadAvailableInProfile,
  fetchOfflineCustomer,
  fetchOfflineCustomerByLeadType,
  fetchOfflineCustomerByMobile,
  saveOfflineData,
} from '../../features/offlineCallingProcess/offlineCallingProcessSlice'

const inputClass =
  'h-10 w-full rounded-md border border-[#E5C1A6] bg-white px-3 text-sm text-[#0F1F35] outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

const modalInputClass =
  'h-[45px] w-full rounded-md border border-[#DDE3EA] bg-white px-4 text-[15px] text-[#111827] outline-none placeholder:text-[#667085] focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

const registerOutcome = 'click here to Register'
const changeLanguageOutcome = 'Change Language'
const languageOptions = ['Tamil', 'Malayalam', 'Telugu', 'Kannada', 'Hindi']

const outcomes = [
  registerOutcome,
  changeLanguageOutcome,
  'Not Interested',
  'Call Back',
  'Marriage Fixed',
  'Phone Number Wrong',
  'Already Registered',
  'Not eligible',
]

const notConnectedOutcomes = [
  'Ringing no response',
  'Call Busy',
  'Call waiting',
  'Switchedoff',
  'Call dropped',
  'Number not in use',
]

const leadTypeApiValues = {
  fresh: 'freshleads',
  callback: 'callback',
}

function getCustomerMotherTongue(customer) {
  return customer?.motherTongue || customer?.motherTongueName || customer?.mothertongueid || customer?.motherTongueId || '-'
}

function getCustomerDetailRows(customer) {
  return [
    ['Name', customer?.name || '-'],
    ['Phone Number', customer?.mobileNumber1 || '-'],
    ['Alternate Phone Number', customer?.mobileNumber2 || '-'],
    ['Email', customer?.email || '-'],
    ['Mother Tongue', getCustomerMotherTongue(customer)],
  ]
}

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
  const dispatch = useDispatch()
  const {
    customer,
    status: customerStatus,
    saveStatus,
  } = useSelector((state) => state.offlineCallingProcess)
  const [isInsertOpen, setIsInsertOpen] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('')
  const [leadType, setLeadType] = useState('fresh')
  const [callStatus, setCallStatus] = useState('')
  const [selectedOutcome, setSelectedOutcome] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [profileId, setProfileId] = useState('')
  const [isGoldSchemeOpen, setIsGoldSchemeOpen] = useState(false)
  const [isGoldSchemeChecked, setIsGoldSchemeChecked] = useState(false)
  const [goldSchemeForm, setGoldSchemeForm] = useState({ name: '', phoneNumber: '' })
  const [goldSchemeErrors, setGoldSchemeErrors] = useState({})
  const [insertForm, setInsertForm] = useState({
    name: '',
    mobileNumber1: '',
    mobileNumber2: '',
    source: '',
    motherTongue: '',
  })
  const [insertErrors, setInsertErrors] = useState({})

  const handleGoldSchemeSubmit = () => {
    const errors = {}

    if (!goldSchemeForm.name.trim()) {
      errors.name = 'please enter your name'
    }

    if (goldSchemeForm.phoneNumber.length !== 10) {
      errors.phoneNumber = 'please check the mobile number'
    }

    setGoldSchemeErrors(errors)

    if (Object.keys(errors).length) return

    setIsGoldSchemeChecked(true)
    setIsGoldSchemeOpen(false)
  }

  const updateInsertField = (field, value) => {
    setInsertForm((prev) => ({ ...prev, [field]: value }))
    setInsertErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleInsertSubmit = async () => {
    const errors = {}

    if (!insertForm.name.trim()) {
      errors.name = 'please enter your name'
    }

    if (insertForm.mobileNumber1.length !== 10) {
      errors.mobileNumber1 = 'please check the mobile number'
    }

    if (insertForm.mobileNumber2 && insertForm.mobileNumber2.length !== 10) {
      errors.mobileNumber2 = 'please check the mobile number'
    }

    if (!insertForm.source.trim()) {
      errors.source = 'please enter source'
    }

    if (!insertForm.motherTongue) {
      errors.motherTongue = 'please select mother tongue'
    }

    setInsertErrors(errors)

    if (Object.keys(errors).length) return

    const payload = {
      admUsersId: 1,
      motherTongueId: insertForm.motherTongue,
      mobileNumber1: insertForm.mobileNumber1,
      mobileNumber2: insertForm.mobileNumber2 || '',
      name: insertForm.name,
      source: insertForm.source,
      offlineprofile: 'N',
    }

    try {
      const checkResult = await dispatch(checkLeadAvailableInProfile(payload)).unwrap()

      if (checkResult.isDndMobile1 === 'Yes') {
        message.error('DND - Unable to add Mobile Number 1')
        return
      }

      if (checkResult.isDndMobile2 === 'Yes') {
        message.error('DND - Unable to add Mobile Number 2')
        return
      }

      if (checkResult.status !== 'N') {
        message.error('profile already available in site')
        return
      }

      if (checkResult.leadstatus !== 'N') {
        message.error('Lead already exist')
        return
      }

      await dispatch(saveOfflineData({
        ...payload,
        mobileNumber2: insertForm.mobileNumber2 || null,
      })).unwrap()

      message.success('Offline data saved successfully')
      setInsertForm({
        name: '',
        mobileNumber1: '',
        mobileNumber2: '',
        source: '',
        motherTongue: '',
      })
      setInsertErrors({})
      setIsInsertOpen(false)
    } catch (error) {
      message.error(error || 'Unable to save offline data')
    }
  }

  const handleCallStatusClick = (status) => {
    setCallStatus(status)
    setSelectedOutcome('')
    setSelectedLanguage('')
    setProfileId('')
  }

  const showCustomerDetails = () => {
    setCallStatus('')
    setSelectedOutcome('')
    setSelectedLanguage('')
    setProfileId('')
  }

  const handleSearchByMobile = async () => {
    if (mobileNumber.length !== 10) {
      message.error('Please enter a valid 10-digit mobile number')
      return
    }

    await dispatch(fetchOfflineCustomerByMobile({
      mobilenumber: mobileNumber,
      admUsersId: 1,
    }))
    showCustomerDetails()
  }

  const handleShowResults = async () => {
    await dispatch(fetchOfflineCustomerByLeadType({
      typecategory: leadTypeApiValues[leadType] || leadType,
      languagechoosen: 'Tamil',
      admUsersId: 1,
    }))
    showCustomerDetails()
  }

  const handleFetchCustomer = async () => {
    await dispatch(fetchOfflineCustomer(1))
    showCustomerDetails()
  }

  const summaryRows = [
    { id: 'CRM_9921', verification: 'PENDING', photo: false, appLogin: false, call: 'Initiate' },
    { id: 'CRM_8842', verification: 'VERIFIED', photo: true, appLogin: true, call: 'Completed' },
  ]

  const getRegistrationMobile = () => customer?.mobileNumber1 || mobileNumber

  const handleSubmitResponse = () => {
    message.success('Response submitted successfully.')
  }

  const handleOutcomeSelect = (item) => {
    if (item === REGISTER_OUTCOME) {
      const registrationMobile = getRegistrationMobile()
      if (registrationMobile.length !== 10) {
        message.error('Please enter a valid 10-digit mobile number before registering')
        return
      }
      setSelectedOutcome(REGISTER_OUTCOME)
      openRegisterOfflineTab(registrationMobile)
      return
    }

    setSelectedOutcome(item)
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[10px] bg-white shadow-sm">
        <div className="bg-[linear-gradient(180deg,_#FFC586_0%,_#F28B18_100%)] px-6 py-3">
          <h1 className="text-[28px] font-extrabold leading-9 text-white">{heading}</h1>
        </div>

        <div className="px-4 py-6 sm:px-6">
          <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[minmax(170px,1fr)_minmax(150px,1.25fr)_minmax(72px,0.36fr)_minmax(72px,0.36fr)_minmax(72px,0.36fr)] xl:gap-6">
            <div className="min-w-0">
              <label className="mb-2 block text-xs font-bold text-[#4E3C32]">Search Mobile Number</label>
              <div className="flex items-center gap-4">
                <input
                  className={inputClass}
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                <button
                  type="button"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white transition-colors bg-[#00a65a] ${
                    mobileNumber ? '' : 'opacity-50'
                  }`}
                  onClick={handleSearchByMobile}
                  disabled={customerStatus === 'loading'}
                >
                  <CheckOutlined className="text-[17px] font-bold" />
                </button>
              </div>
            </div>
            <div className="min-w-0">
              <label className="mb-2 block text-xs font-bold text-[#4E3C32]">Lead Type</label>
              <select
                className={`${inputClass} appearance-auto`}
                value={leadType}
                onChange={(e) => setLeadType(e.target.value)}
              >
                <option value="fresh">Fresh-leads</option>
                <option value="callback">Call Back</option>
              </select>
            </div>
            <CrmButton
              className="h-10 min-w-0 px-2 text-xs leading-tight whitespace-nowrap"
              disabled={customerStatus === 'loading'}
              onClick={handleShowResults}
            >
              Show Results
            </CrmButton>
            <button
              className="box-border flex h-10 min-w-0 items-center justify-center rounded-lg border border-[#DAC2AE] px-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              disabled={customerStatus === 'loading'}
              onClick={handleFetchCustomer}
            >
              {customerStatus === 'loading' ? 'Fetching...' : 'Fetch'}
            </button>
            <button
              className="box-border flex h-10 min-w-0 items-center justify-center rounded-lg border border-[#DAC2AE] px-2 text-sm font-medium"
              onClick={() => setIsInsertOpen(true)}
            >
              Insert
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[10px] bg-white shadow-sm">
        <div className="flex h-[61px] items-center justify-between border-b border-[#DAC2AE] bg-[#EFF4FF] px-6">
          <h2 className="text-[21px] font-extrabold text-[#122033]">Today registration summary</h2>
          <ReloadOutlined className="cursor-pointer text-[20px] text-[#4E3C32] hover:text-[#F28B18]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="h-8 bg-[#E9E8E6] text-left text-[11px] uppercase tracking-[0.7px] text-[#4E3C32]">
                <th className="px-16 font-extrabold">Profile ID</th>
                <th className="px-8 font-extrabold">Verification</th>
                <th className="px-8 font-extrabold">Photo</th>
                <th className="px-8 font-extrabold">App Login</th>
                <th className="px-8 font-extrabold">Call</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row) => (
                <tr key={row.id} className="h-[58px] border-b border-[#DAC2AE] last:border-b-0">
                  <td className="px-16 font-medium text-[#0F1F35]">{row.id}</td>
                  <td className="px-8">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                        row.verification === 'VERIFIED'
                          ? 'bg-[#C6F7DF] text-[#007A4D]'
                          : 'bg-[#FFE7D2] text-[#9B4D00]'
                      }`}
                    >
                      {row.verification}
                    </span>
                  </td>
                  <td className="px-8 text-center">
                    {row.photo ? (
                       <img src={Images.VerifyIconAdded} alt="" className="" />
                    ) : (
                       <img src={Images.PhotoNotAdd} alt="" className="" />
                    )}
                  </td>
                  <td className="px-8 text-center">
                    {row.appLogin ? (
                     <img src={Images.AppLogin} alt="" className="" />
                    ) : (
                      <img src={Images.VerifyIconAdded} alt="" className="" />
                    )}
                  </td>
                  <td className="px-8">
                    {row.call === 'Initiate' ? (
                      <span className="cursor-pointer font-extrabold text-[#8A4B00]">{row.call}</span>
                    ) : (
                      <span className="font-extrabold text-[#A9A29B]">{row.call}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {customer && (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-[10px] border border-[#E5C1A6] bg-white shadow-sm">
          <div className="bg-[linear-gradient(180deg,_#FFC586_0%,_#F28B18_100%)] px-6 py-4">
            <h3 className="text-[21px] font-extrabold text-white">Customer Details</h3>
          </div>
          <div className="min-h-[570px] px-6 py-6">
            {getCustomerDetailRows(customer).map(([label, value]) => (
              <div
                key={label}
                className="grid min-h-[57px] grid-cols-[140px_24px_1fr] items-center border-b border-[#EFE2D8] text-[15px] last:border-b-0"
              >
                <span className="text-[#4E3C32]">{label}</span>
                <span className="text-[#4E3C32]">:</span>
                <span className="font-medium text-[#0F1F35]">
                  {label === 'Phone Number' ? (
                    <span className="inline-flex items-center gap-2">
                      {/* <PhoneFilled className="text-[18px] text-[#007A4D]" /> */}
                      <img src={Images.PhoneIcon} alt="" className="" />
                      {value}
                    </span>
                  ) : (
                    value
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-4 bg-[#EFF4FF] px-6 py-6">
            <CrmButton
              variant="green"
              className={`h-14 w-full rounded-md text-[16px] font-medium shadow-lg ${
                callStatus === 'connected' ? 'ring-2 ring-[#F28B18] ring-offset-2' : ''
              }`}
              onClick={() => handleCallStatusClick('connected')}
            >
              <PhoneFilled className="mr-3" /> Call Connected
            </CrmButton>
            <CrmButton
              variant="danger"
              className={`h-14 w-full rounded-md text-[16px] font-medium shadow-lg ${
                callStatus === 'notConnected' ? 'ring-2 ring-[#F28B18] ring-offset-2' : ''
              }`}
              onClick={() => handleCallStatusClick('notConnected')}
            >
              <PhoneFilled className="mr-3" /> Not Connected
            </CrmButton>
          </div>
        </section>

        {callStatus && (
        <section className="overflow-hidden rounded-[10px] border border-[#E5C1A6] bg-white shadow-sm">
          <div className="bg-[linear-gradient(180deg,_#FFC586_0%,_#F28B18_100%)] px-6 py-4">
            <h3 className="text-[21px] font-extrabold text-white">
              {callStatus === 'connected' ? 'Call Connected Outcome' : 'Not Connected Outcome'}
            </h3>
          </div>
          <div className="min-h-[642px] px-6 py-6">
            {(callStatus === 'connected' ? outcomes : notConnectedOutcomes).map((item) => (
              <div key={item} className="flex min-h-16 flex-wrap items-center gap-4 text-[16px]">
                <label className="flex cursor-pointer items-center gap-4">
                  <input
                    type="radio"
                    name="outcome"
                    checked={selectedOutcome === item}
                    className="peer sr-only"
                    onChange={() => handleOutcomeSelect(item)}
                  />
                  <span className="h-5 w-5 rounded-full border border-[#E5C1A6] peer-checked:border-[#F28B18] peer-checked:shadow-[inset_0_0_0_5px_white] peer-checked:bg-[#F28B18]" />
                  <span className={selectedOutcome === item ? 'font-medium text-[#8A4B00]' : 'font-medium text-[#0F1F35]'}>
                    {item}
                  </span>
                </label>
                {selectedOutcome === changeLanguageOutcome && item === changeLanguageOutcome && (
                  <select
                    className="h-9 w-[130px] rounded-md border border-[#C8CDD4] bg-white px-2 text-[13px] text-[#333333] outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {languageOptions.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            {callStatus === 'connected' && (
            <div className="mt-3 border-t border-[#DDBFA7] pt-6">
              <label className="flex h-[58px] cursor-pointer items-center gap-4 rounded-md border border-[#D5C2B2] bg-[#EFF4FF] px-4 text-[16px] font-medium text-[#0F1F35]">
                <input
                  type="checkbox"
                  checked={isGoldSchemeChecked}
                  className="h-5 w-5 rounded border-[#E5C1A6] accent-[#F28B18]"
                  onChange={() => setIsGoldSchemeOpen(true)}
                />
                <span>Interested for Kalyan Jewellers Gold Scheme</span>
              </label>
              {selectedOutcome === registerOutcome && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                  <input
                    className={`${inputClass} max-w-[260px]`}
                    placeholder="profileId"
                    value={profileId}
                    onChange={(e) => setProfileId(e.target.value)}
                  />
                  <CrmButton className="h-10 w-fit rounded-md px-8 text-[14px] font-medium">
                    Check
                  </CrmButton>
                </div>
              )}
            </div>
            )}
          </div>
          <div className="bg-[#EFF4FF] px-6 py-6">
            <CrmButton
              variant="green"
              className="h-14 w-full rounded-md text-[16px] font-medium shadow-lg"
              onClick={handleSubmitResponse}
            >
              <SaveOutlined className="mr-3" /> Submit Response
            </CrmButton>
          </div>
        </section>
        )}
      </div>
      )}

      {isInsertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[3px]">
          <div className="w-full max-w-[512px] overflow-hidden rounded-md bg-white shadow-2xl">
            <div className="flex h-[62px] items-center justify-between border-b border-[#EEF0F3] px-6">
              <h2 className="text-[18px] font-extrabold text-[#1F2937]">Suspension Reason</h2>
              <button
                type="button"
                aria-label="Close insert popup"
                className="text-[22px] text-[#98A2B3] hover:text-[#F28B18]"
                onClick={() => setIsInsertOpen(false)}
              >
                <CloseOutlined />
              </button>
            </div>
            <div className="space-y-4 px-6 py-6">
              <div>
                <input
                  className={modalInputClass}
                  placeholder="name"
                  value={insertForm.name}
                  onChange={(e) => updateInsertField('name', e.target.value)}
                />
                {insertErrors.name && (
                  <p className="mt-1 text-[12px] text-[#D71920]">{insertErrors.name}</p>
                )}
              </div>
              <div>
                <input
                  className={modalInputClass}
                  placeholder="mobileNumber1"
                  value={insertForm.mobileNumber1}
                  onChange={(e) => updateInsertField('mobileNumber1', e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                {insertErrors.mobileNumber1 && (
                  <p className="mt-1 text-[12px] text-[#D71920]">{insertErrors.mobileNumber1}</p>
                )}
              </div>
              <div>
                <input
                  className={modalInputClass}
                  placeholder="mobileNumber2"
                  value={insertForm.mobileNumber2}
                  onChange={(e) => updateInsertField('mobileNumber2', e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                {insertErrors.mobileNumber2 && (
                  <p className="mt-1 text-[12px] text-[#D71920]">{insertErrors.mobileNumber2}</p>
                )}
              </div>
              <div>
                <input
                  className={modalInputClass}
                  placeholder="source"
                  value={insertForm.source}
                  onChange={(e) => updateInsertField('source', e.target.value)}
                />
                {insertErrors.source && (
                  <p className="mt-1 text-[12px] text-[#D71920]">{insertErrors.source}</p>
                )}
              </div>
              <div>
                <select
                  className={`${modalInputClass} appearance-auto ${insertForm.motherTongue ? 'text-[#111827]' : 'text-[#667085]'}`}
                  value={insertForm.motherTongue}
                  onChange={(e) => updateInsertField('motherTongue', e.target.value)}
                >
                  <option value="" disabled>
                    Select Mother Tongue
                  </option>
                  <option value="Tamil">Tamil</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Hindi">Hindi</option>
                </select>
                {insertErrors.motherTongue && (
                  <p className="mt-1 text-[12px] text-[#D71920]">{insertErrors.motherTongue}</p>
                )}
              </div>
              <div className="flex justify-end pt-4">
                <CrmButton
                  className="h-10 rounded-md bg-[#E88900] px-8 text-[16px] font-medium"
                  disabled={saveStatus === 'loading'}
                  onClick={handleInsertSubmit}
                >
                  {saveStatus === 'loading' ? 'Submitting...' : 'Submit'}
                </CrmButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {isGoldSchemeOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-8">
          <div className="w-full max-w-[600px] overflow-hidden rounded-sm bg-white shadow-2xl">
            <div className="flex h-14 items-center justify-between border-b border-[#EEF0F3] px-4">
              <h2 className="text-[16px] font-medium text-[#333333]">
                Interested for Kalyan Jewellers Gold Scheme
              </h2>
              <button
                type="button"
                aria-label="Close gold scheme popup"
                className="text-[22px] font-bold leading-none text-[#C0C4CC] hover:text-[#F28B18]"
                onClick={() => setIsGoldSchemeOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="space-y-6 px-4 py-5">
              <div className="grid grid-cols-[130px_24px_1fr] items-start gap-2">
                <label htmlFor="gold-scheme-name" className="pt-2 text-[13px] text-[#333333]">
                  Name
                </label>
                <span className="pt-2 text-[13px] text-[#333333]">:</span>
                <div>
                  <input
                    id="gold-scheme-name"
                    className="h-[34px] w-full max-w-[263px] border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F1F35] outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]"
                    value={goldSchemeForm.name}
                    onChange={(e) => {
                      setGoldSchemeForm((prev) => ({ ...prev, name: e.target.value }))
                      setGoldSchemeErrors((prev) => ({ ...prev, name: '' }))
                    }}
                  />
                  {goldSchemeErrors.name && (
                    <p className="mt-1 text-[12px] text-[#D71920]">{goldSchemeErrors.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[130px_24px_1fr] items-start gap-2">
                <label htmlFor="gold-scheme-phone" className="pt-2 text-[13px] text-[#333333]">
                  Phone Number
                </label>
                <span className="pt-2 text-[13px] text-[#333333]">:</span>
                <div>
                  <input
                    id="gold-scheme-phone"
                    className="h-[34px] w-full max-w-[263px] border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F1F35] outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]"
                    value={goldSchemeForm.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setGoldSchemeForm((prev) => ({ ...prev, phoneNumber: value }))
                      setGoldSchemeErrors((prev) => ({ ...prev, phoneNumber: '' }))
                    }}
                  />
                  {goldSchemeErrors.phoneNumber && (
                    <p className="mt-1 text-[12px] text-[#D71920]">{goldSchemeErrors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <CrmButton className="h-9 rounded-md px-5 text-[14px] font-medium" onClick={handleGoldSchemeSubmit}>
                  Ok
                </CrmButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
