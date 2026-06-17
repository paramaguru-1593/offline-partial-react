import { useRef, useState } from 'react'
import { message } from 'antd'
import * as XLSX from 'xlsx'
import CrmButton from '../../components/crm/CrmButton'

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-800'
const errorClass = 'mt-1 text-xs text-[#D71920]'

const ALLOWED_EXTENSIONS = ['.csv', '.xls', '.xlsx']
const LEAD_TYPE_OPTIONS = ['Fresh Leads', 'Call Back', 'Other Leads']
const CASTE_OPTIONS = ['Brahmin', 'Other']
const MOTHER_TONGUE_OPTIONS = ['Tamil', 'Malayalam', 'Telugu', 'Kannada', 'Hindi']

const INITIAL_FORM = {
  mobile: '',
  name: '',
  alternateMobile: '',
  email: '',
  caste: '',
  source: '',
  motherTongue: '',
}



function getFileExtension(fileName) {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex === -1 ? '' : fileName.slice(dotIndex).toLowerCase()
}

function validateProfileForm(form) {
  const errors = {}

  if (!form.mobile.trim()) {
    errors.mobile = 'Mobile number is required'
  } else if (!/^\d{10}$/.test(form.mobile.trim())) {
    errors.mobile = 'Enter a valid 10-digit mobile number'
  }

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!form.caste) {
    errors.caste = 'Caste is required'
  }

  if (!form.source.trim()) {
    errors.source = 'Source is required'
  }

  if (!form.motherTongue) {
    errors.motherTongue = 'Mother tongue is required'
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }

  if (form.alternateMobile.trim() && !/^\d{10}$/.test(form.alternateMobile.trim())) {
    errors.alternateMobile = 'Enter a valid 10-digit alternate mobile number'
  }

  return errors
}

function parseCsvContent(text) {
  const trimmed = text.trim()
  if (!trimmed) {
    throw new Error('File is empty. Please upload a valid file.')
  }

  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim())
  if (lines.length < 2) {
    throw new Error('File must contain a header row and at least one data row.')
  }

  const headerCells = lines[0].split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''))
  if (headerCells.every((cell) => !cell)) {
    throw new Error('Invalid CSV header row.')
  }

  const dataRows = lines.slice(1).filter((line) => line.trim())
  if (!dataRows.length) {
    throw new Error('No data rows found in the uploaded file.')
  }

  return { headerCells, rowCount: dataRows.length }
}

function parseExcelContent(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array' })
  if (!workbook.SheetNames.length) {
    throw new Error('Excel file does not contain any sheets.')
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

  if (!rows.length || rows.length < 2) {
    throw new Error('Excel file must contain a header row and at least one data row.')
  }

  const headerCells = rows[0].map((cell) => String(cell).trim())
  if (headerCells.every((cell) => !cell)) {
    throw new Error('Invalid Excel header row.')
  }

  const dataRows = rows.slice(1).filter((row) => row.some((cell) => String(cell).trim()))
  if (!dataRows.length) {
    throw new Error('No data rows found in the uploaded file.')
  }

  return { headerCells, rowCount: dataRows.length }
}

async function validateBulkFile(file) {
  const extension = getFileExtension(file.name)

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error('Invalid file format. Only .csv, .xls, and .xlsx files are allowed.')
  }

  if (file.size === 0) {
    throw new Error('File is empty. Please upload a valid file.')
  }

  if (extension === '.csv') {
    const text = await file.text()
    return parseCsvContent(text)
  }

  const buffer = await file.arrayBuffer()
  return parseExcelContent(buffer)
}

export default function OfflineProfiles() {
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [bulkFile, setBulkFile] = useState(null)
  const [bulkLeadType, setBulkLeadType] = useState('')
  const [bulkError, setBulkError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const inputWithError = (field) =>
    `${inputClass} ${formErrors[field] ? 'border-[#D71920] focus:border-[#D71920] focus:ring-[#D71920]' : ''}`

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const errors = validateProfileForm(form)
    setFormErrors(errors)

    if (Object.keys(errors).length) return

    message.success('Profile saved successfully!')
    setForm(INITIAL_FORM)
    setFormErrors({})
  }

  const assignBulkFile = (file) => {
    if (!file) return
    setBulkFile(file)
    setBulkError('')
  }

  const handleFileChange = (e) => {
    assignBulkFile(e.target.files?.[0] || null)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    assignBulkFile(e.dataTransfer.files?.[0] || null)
  }

  const handleBulkUpload = async () => {
    setBulkError('')

    if (!bulkFile) {
      setBulkError('Please choose a file to upload.')
      return
    }

    if (!bulkLeadType) {
      setBulkError('Please select a lead type.')
      return
    }

    try {
      const result = await validateBulkFile(bulkFile)
      message.success(
        `Successfully validated ${result.rowCount} record(s) for ${bulkLeadType}.`,
      )
      setBulkFile(null)
      setBulkLeadType('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setBulkError(err.message || 'Unable to process the uploaded file.')
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#F28B18]">Offline Profile</h1>
        <CrmButton variant="outline" className="px-4 py-1.5 text-xs uppercase tracking-wide">
          User Details
        </CrmButton>
      </div>

      <form onSubmit={handleSaveProfile} className="rounded-lg bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <div>
            <label htmlFor="mobile" className={labelClass}>
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="mobile"
              className={inputWithError('mobile')}
              placeholder="Enter mobile number"
              value={form.mobile}
              onChange={(e) => updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            {formErrors.mobile && <p className={errorClass}>{formErrors.mobile}</p>}
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              className={inputWithError('name')}
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            {formErrors.name && <p className={errorClass}>{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="alternateMobile" className={labelClass}>Alternate Mobile</label>
            <input
              id="alternateMobile"
              className={inputWithError('alternateMobile')}
              placeholder="Optional alternate number"
              value={form.alternateMobile}
              onChange={(e) => updateField('alternateMobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            {formErrors.alternateMobile && <p className={errorClass}>{formErrors.alternateMobile}</p>}
          </div>

          <div>
            <label htmlFor="caste" className={labelClass}>
              Caste <span className="text-red-500">*</span>
            </label>
            <select
              id="caste"
              className={inputWithError('caste')}
              value={form.caste}
              onChange={(e) => updateField('caste', e.target.value)}
            >
              <option value="" disabled>Select Caste</option>
              {CASTE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {formErrors.caste && <p className={errorClass}>{formErrors.caste}</p>}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              className={inputWithError('email')}
              placeholder="example@domain.com"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            {formErrors.email && <p className={errorClass}>{formErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="source" className={labelClass}>
              Source <span className="text-red-500">*</span>
            </label>
            <input
              id="source"
              className={inputWithError('source')}
              placeholder="Lead source"
              value={form.source}
              onChange={(e) => updateField('source', e.target.value)}
            />
            {formErrors.source && <p className={errorClass}>{formErrors.source}</p>}
          </div>

          <div>
            <label htmlFor="motherTongue" className={labelClass}>
              Mother Tongue <span className="text-red-500">*</span>
            </label>
            <select
              id="motherTongue"
              className={inputWithError('motherTongue')}
              value={form.motherTongue}
              onChange={(e) => updateField('motherTongue', e.target.value)}
            >
              <option value="" disabled>Select Mother Tongue</option>
              {MOTHER_TONGUE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {formErrors.motherTongue && <p className={errorClass}>{formErrors.motherTongue}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <CrmButton type="submit" className="min-w-[160px] px-8 py-2.5">
            Save Profile
          </CrmButton>
        </div>
      </form>

      <div className="mt-5 rounded-lg bg-[#F0F1F3] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
          <div className="min-w-0 flex-1">
            <label className={labelClass}>Bulk Import (.csv / .xls / .xlsx)</label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-md border-2 border-dashed bg-white px-4 py-5 text-center text-sm transition-colors ${
                isDragOver
                  ? 'border-[#F28B18] bg-[#FFF5E9] text-[#F28B18]'
                  : bulkError
                    ? 'border-[#D71920] text-slate-500'
                    : 'border-slate-300 text-slate-500'
              }`}
            >
              {bulkFile ? (
                <span className="font-medium text-slate-700">{bulkFile.name}</span>
              ) : (
                'Choose file or drag & drop'
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="mt-1 text-xs text-slate-400">
              Supported formats: .csv, .xls, .xlsx
            </p>
          </div>
          <div className="flex shrink-0 lg:self-center">
          <CrmButton type="button" className="shrink-0 px-8 py-2.5 lg:mb-0" onClick={handleBulkUpload}>
            Upload
          </CrmButton>
          </div>

          <div className="w-full shrink-0 lg:w-[220px]">
            <label htmlFor="bulkLeadType" className={labelClass}>Lead Type</label>
            <select
              id="bulkLeadType"
              className={`${inputClass} ${bulkError && !bulkLeadType ? 'border-[#D71920]' : ''}`}
              value={bulkLeadType}
              onChange={(e) => {
                setBulkLeadType(e.target.value)
                if (bulkError) setBulkError('')
              }}
            >
              <option value="" disabled>Select Lead Type</option>
              {LEAD_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {bulkError && <p className={`${errorClass} mt-3`}>{bulkError}</p>}
      </div>
    </div>
  )
}
