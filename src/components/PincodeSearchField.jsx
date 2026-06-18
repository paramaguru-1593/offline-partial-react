import { useEffect, useRef, useState } from 'react'
import { Field } from 'formik'
import { Spin } from 'antd'
import { fetchPincodeOptions } from '../services/pincodeService'

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'

const MIN_SEARCH_LENGTH = 3
const SEARCH_DEBOUNCE_MS = 300

function PincodeSearchInput({ value, onChange, placeholder }) {
  const containerRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLabel, setSelectedLabel] = useState('')
  const [options, setOptions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!value) {
      setSelectedLabel('')
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length < MIN_SEARCH_LENGTH) {
      setOptions([])
      setIsLoading(false)
      return undefined
    }

    const controller = new AbortController()

    const timer = window.setTimeout(async () => {
      setIsLoading(true)

      try {
        const results = await fetchPincodeOptions(searchQuery, { signal: controller.signal })
        setOptions(results)
        setIsOpen(true)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setOptions([])
        }
      } finally {
        setIsLoading(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [searchQuery])

  const handleInputChange = (event) => {
    const nextQuery = event.target.value.replace(/\D/g, '')
    setSearchQuery(nextQuery)
    setSelectedLabel('')
    onChange('')

    if (nextQuery.length < MIN_SEARCH_LENGTH) {
      setOptions([])
      setIsOpen(false)
    }
  }

  const handleSelect = (option) => {
    onChange(option.value)
    setSelectedLabel(option.label)
    setSearchQuery('')
    setOptions([])
    setIsOpen(false)
  }

  const displayValue = selectedLabel || searchQuery
  const showDropdown = isOpen && searchQuery.length >= MIN_SEARCH_LENGTH

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchQuery.length >= MIN_SEARCH_LENGTH && options.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        {isLoading && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <Spin size="small" />
          </div>
        )}
      </div>

      {showDropdown && (
        <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {options.length > 0 ? (
            options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50 ${
                    value === option.value ? 'bg-[#FFF5F5] font-medium' : ''
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </button>
              </li>
            ))
          ) : (
            !isLoading && (
              <li className="px-3 py-2 text-sm text-slate-500">No pincode found</li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

export default function PincodeSearchField({ name, placeholder }) {
  return (
    <Field name={name}>
      {({ field, form }) => (
        <PincodeSearchInput
          value={field.value}
          placeholder={placeholder}
          onChange={(nextValue) => form.setFieldValue(name, nextValue)}
        />
      )}
    </Field>
  )
}
