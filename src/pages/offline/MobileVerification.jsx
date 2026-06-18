import { useState } from 'react'
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { message } from 'antd'
import CrmButton from '../../components/crm/CrmButton'
import { maskMobileNumber } from '../../data/registerOfflineOptions'

const inputClass =
  'w-full max-w-[200px] rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-sm text-slate-800 outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

export default function MobileVerification({ mobileNumber }) {
  const [pin, setPin] = useState('')
  const [showChangeNumber, setShowChangeNumber] = useState(false)
  const [newMobile, setNewMobile] = useState('')
  const [whatsappStatus, setWhatsappStatus] = useState('Processing')
  const [pinError, setPinError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const maskedMobile = maskMobileNumber(mobileNumber)

  const handleRefreshWhatsappStatus = () => {
    setWhatsappStatus('Processing')
    message.info('Checking WhatsApp delivery status...')
  }

  const handleVerifyMobile = async () => {
    if (!pin.trim()) {
      setPinError('Please enter a valid PIN no.')
      return
    }

    if (!/^\d{4,6}$/.test(pin.trim())) {
      setPinError('Please enter a valid PIN no.')
      return
    }

    setPinError('')
    setIsVerifying(true)
    try {
      message.success('Mobile verified successfully!')
    } catch {
      setPinError('OTP MisMatch')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRequestAgain = () => {
    message.info('Verification PIN resent successfully.')
  }

  const handleSubmitNumberChange = () => {
    if (!newMobile.trim()) {
      message.error('Mobile number required')
      return
    }
    if (!/^\d{10}$/.test(newMobile.trim())) {
      message.error('Mobile number should have 10 digits')
      return
    }
    message.success('Mobile number updated.')
    setShowChangeNumber(false)
    setNewMobile('')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pt-6 text-center">
      <div className="space-y-2 text-base text-slate-800">
        <p>A SMS with verification PIN has been sent to Registered</p>
        <p>
          mobile number - <span className="font-semibold">{maskedMobile}</span>{' '}
          <button
            type="button"
            className="cursor-pointer text-[#2563EB] underline"
            onClick={() => setShowChangeNumber((prev) => !prev)}
          >
            Change number
          </button>
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-base text-slate-800">
        <span>
          Welcome Text Whatsapp Message Delivery Status - <strong>{whatsappStatus}</strong>
        </span>
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-xl text-slate-600"
          onClick={handleRefreshWhatsappStatus}
          aria-label="Refresh WhatsApp status"
        >
          <ReloadOutlined />
        </button>
      </div>

      {showChangeNumber && (
        <div className="mx-auto flex max-w-md flex-wrap items-center justify-center gap-3">
          <input
            type="text"
            maxLength={10}
            value={newMobile}
            onChange={(event) => setNewMobile(event.target.value.replace(/\D/g, ''))}
            placeholder="Enter Mobile No."
            className={`${inputClass} max-w-none flex-1`}
          />
          <CrmButton type="button" onClick={handleSubmitNumberChange}>
            Submit
          </CrmButton>
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          id="txtOTP"
          autoComplete="off"
          maxLength={6}
          value={pin}
          onChange={(event) => {
            setPin(event.target.value.replace(/\D/g, ''))
            setPinError('')
          }}
          placeholder="Enter PIN"
          className={`${inputClass} mx-auto block`}
        />

        {pinError && <p className="text-sm text-[#D71920]">{pinError}</p>}

        <CrmButton
          type="button"
          variant="dark"
          className="min-w-[160px] bg-[#9CA3AF] px-6 py-2.5 text-base hover:opacity-100"
          onClick={handleVerifyMobile}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Mobile'}
        </CrmButton>
      </div>

      <div className="space-y-3 text-lg text-slate-800">
        <p>SMS will reach you shortly.</p>
        <p>
          If you have not received it yet please{' '}
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-bold text-[#2563EB]"
            onClick={handleRequestAgain}
          >
            Request Again <CheckCircleOutlined className="text-[#2563EB]" />
          </button>
        </p>
      </div>

      <button
        type="button"
        className="cursor-pointer border-0 bg-transparent p-0 text-lg text-[#2563EB] underline"
        onClick={() => message.info('Mobile verification link copied.')}
      >
        Mobile Verification Link
      </button>
    </div>
  )
}
