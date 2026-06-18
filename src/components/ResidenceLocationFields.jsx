import { useEffect, useState } from 'react'
import { Field, ErrorMessage } from 'formik'
import { Spin } from 'antd'
import { fetchCityOptions, fetchStateOptions } from '../services/locationService'
import { normalizeCountryId } from '../data/registerOfflineOptions'

const inputClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#F28B18] focus:ring-1 focus:ring-[#F28B18]'
const selectClass = `${inputClass} cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-800'
const errorClass = 'mt-1 text-xs text-[#D71920]'

function FormRow({ label, required, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-[220px_1fr] md:items-start">
      <label className={`${labelClass} md:pt-2`}>
        {label}
        {required && <span className="text-[#D71920]"> *</span>}
      </label>
      <div>{children}</div>
    </div>
  )
}

function ErrorText({ name }) {
  return <ErrorMessage name={name} component="p" className={errorClass} data-form-error="" />
}

function LocationSelect({ name, placeholder, options, disabled, isLoading, onChange }) {
  return (
    <div className="relative">
      <Field name={name}>
        {({ field, form }) => (
          <select
            {...field}
            disabled={disabled || isLoading}
            className={selectClass}
            onChange={(event) => {
              field.onChange(event)
              onChange?.(event, form)
            }}
          >
            <option value="">{isLoading ? 'Loading...' : placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Field>
      {isLoading && (
        <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center">
          <Spin size="small" />
        </div>
      )}
    </div>
  )
}

export default function ResidenceLocationFields({ countryOptions, countryId, stateId, setFieldValue }) {
  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [isLoadingStates, setIsLoadingStates] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  useEffect(() => {
    if (!countryId) {
      setStateOptions([])
      setIsLoadingStates(false)
      return undefined
    }

    const controller = new AbortController()

    async function loadStates() {
      setIsLoadingStates(true)

      try {
        const results = await fetchStateOptions(countryId, { signal: controller.signal })
        setStateOptions(results)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setStateOptions([])
        }
      } finally {
        setIsLoadingStates(false)
      }
    }

    loadStates()

    return () => controller.abort()
  }, [countryId])

  useEffect(() => {
    if (!stateId) {
      setCityOptions([])
      setIsLoadingCities(false)
      return undefined
    }

    const controller = new AbortController()

    async function loadCities() {
      setIsLoadingCities(true)

      try {
        const results = await fetchCityOptions(stateId, { signal: controller.signal })
        setCityOptions(results)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCityOptions([])
        }
      } finally {
        setIsLoadingCities(false)
      }
    }

    loadCities()

    return () => controller.abort()
  }, [stateId])

  return (
    <>
      <FormRow label="Country of Residence" required>
        <LocationSelect
          name="countryId"
          placeholder="Select Country"
          options={countryOptions}
          onChange={(event) => {
            const nextCountryId = normalizeCountryId(event.target.value)
            setFieldValue('countryId', nextCountryId)
            setFieldValue('stateId', '')
            setFieldValue('cityId', '')
          }}
        />
        <ErrorText name="countryId" />
      </FormRow>

      <FormRow label="State of Residence" required>
        <LocationSelect
          name="stateId"
          placeholder={countryId ? 'Select State' : 'Select Country first'}
          options={stateOptions}
          disabled={!countryId}
          isLoading={isLoadingStates}
          onChange={(event) => {
            setFieldValue('stateId', event.target.value)
            setFieldValue('cityId', '')
          }}
        />
        <ErrorText name="stateId" />
      </FormRow>

      <FormRow label="City of Residence" required>
        <LocationSelect
          name="cityId"
          placeholder={stateId ? 'Select City' : 'Select State first'}
          options={cityOptions}
          disabled={!stateId}
          isLoading={isLoadingCities}
        />
        <ErrorText name="cityId" />
      </FormRow>
    </>
  )
}
