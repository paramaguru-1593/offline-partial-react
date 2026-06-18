import {
  BODY_TYPE_OPTIONS,
  CASTE_OPTIONS,
  CITY_OPTIONS,
  COMPLEXION_OPTIONS,
  COUNTRY_OPTIONS,
  DOMAIN_OPTIONS,
  DOSHAM_OPTIONS,
  DRINKING_OPTIONS,
  EDUCATION_OPTIONS,
  EMPLOYMENT_OPTIONS,
  FAMILY_RELATION_OPTIONS,
  FAMILY_STATUS_OPTIONS,
  FAMILY_TYPE_OPTIONS,
  FAMILY_VALUES_OPTIONS,
  FOOD_OPTIONS,
  GOTHRA_OPTIONS,
  HEIGHT_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  MOTHER_TONGUE_OPTIONS,
  OCCUPATION_OPTIONS,
  PARENT_RELATION_OPTIONS,
  PHYSICAL_STATUS_OPTIONS,
  PINCODE_OPTIONS,
  PROFILE_FOR_OPTIONS,
  RAASI_OPTIONS,
  RELIGION_OPTIONS,
  SMOKING_OPTIONS,
  STAR_OPTIONS,
  STATE_OPTIONS,
  SUB_CASTE_OPTIONS,
} from '../data/registerOfflineOptions'

function mapSelectOptions(items, { labelKey = 'name', valueKey = 'id', transform } = {}) {
  if (!Array.isArray(items)) return []

  return items.map((item) => {
    const option = {
      value: String(item[valueKey]),
      label: item[labelKey],
    }
    return transform ? transform(item, option) : option
  })
}

function mapGroupedSelectOptions(items) {
  if (!Array.isArray(items)) return []
  return items
    .filter((item) => item.heading !== 'Y')
    .map((item) => ({
      value: String(item.id),
      label: item.name,
    }))
}

function mapCountryOptions(isdcodeItems) {
  if (!Array.isArray(isdcodeItems)) return COUNTRY_OPTIONS

  return isdcodeItems.map((item) => ({
    value: String(item.countryId || item.id),
    label: item.country,
    isdcode: item.isdcode,
    currency: item.currency || item.name,
  }))
}

function mapHeightOptions(heightItems) {
  if (!Array.isArray(heightItems)) return HEIGHT_OPTIONS

  return heightItems.map((item) => ({
    value: String(item.id),
    label: item.cms ? `${item.name} - ${item.cms} cms` : item.name,
  }))
}

function getSelectedId(items) {
  if (!Array.isArray(items)) return ''
  const selected = items.find((item) => item.selected === 'Y')
  return selected ? String(selected.id) : ''
}

function getSelectedArrayId(items) {
  if (!Array.isArray(items) || !items.length) return ''
  return String(items[0].id)
}

export function mapBasicDataToFormOptions(data = {}) {
  return {
    profileForOptions: mapSelectOptions(data.profileFor, { labelKey: 'name', valueKey: 'id' }),
    motherTongueOptions: mapSelectOptions(data.motherTongue, { labelKey: 'name', valueKey: 'id' }),
    religionOptions: mapSelectOptions(data.religion, { labelKey: 'name', valueKey: 'id' }),
    domainOptions: mapSelectOptions(data.domain, { labelKey: 'name', valueKey: 'id' }),
    casteOptions: mapSelectOptions(data.caste, { labelKey: 'name', valueKey: 'id' }),
    gothraOptions: mapSelectOptions(data.gothra, { labelKey: 'name', valueKey: 'id' }),
    maritalStatusOptions: mapSelectOptions(data.maritalStatus, { labelKey: 'name', valueKey: 'id' }),
    countryOptions: mapCountryOptions(data.isdcode),
    heightOptions: mapHeightOptions(data.heightInchesData),
    bodyTypeOptions: mapSelectOptions(data.bodyTypeData, { labelKey: 'name', valueKey: 'id' }),
    complexionOptions: mapSelectOptions(data.complexionData, { labelKey: 'name', valueKey: 'id' }),
    physicalStatusOptions: mapSelectOptions(data.physicalStatusData, { labelKey: 'name', valueKey: 'id' }),
    educationOptions: mapGroupedSelectOptions(data.educationData),
    employmentOptions: mapSelectOptions(data.employedInData, { labelKey: 'name', valueKey: 'id' }),
    occupationOptions: mapGroupedSelectOptions(data.occupationData),
    starOptions: mapSelectOptions(data.starData, { labelKey: 'name', valueKey: 'id' }),
    doshamOptions: mapSelectOptions(data.DoshamData, { labelKey: 'name', valueKey: 'id' }),
    foodOptions: mapSelectOptions(data.FoodData, { labelKey: 'name', valueKey: 'id' }),
    smokingOptions: mapSelectOptions(data.SmokingData, { labelKey: 'name', valueKey: 'id' }),
    drinkingOptions: mapSelectOptions(data.DrinkingData, { labelKey: 'name', valueKey: 'id' }),
    familyStatusOptions: mapSelectOptions(data.FamilyStatusData, { labelKey: 'name', valueKey: 'id' }),
    familyTypeOptions: mapSelectOptions(data.FamilyTypeData, { labelKey: 'name', valueKey: 'id' }),
    familyValuesOptions: mapSelectOptions(data.FamilyValuesData, { labelKey: 'name', valueKey: 'id' }),
    stateOptions: STATE_OPTIONS,
    cityOptions: CITY_OPTIONS,
    pincodeOptions: PINCODE_OPTIONS,
    subCasteOptions: SUB_CASTE_OPTIONS,
    raasiOptions: RAASI_OPTIONS,
    parentRelationOptions: PARENT_RELATION_OPTIONS,
    familyRelationOptions: FAMILY_RELATION_OPTIONS,
  }
}

export function getDefaultFormOptions() {
  return {
    profileForOptions: PROFILE_FOR_OPTIONS,
    motherTongueOptions: MOTHER_TONGUE_OPTIONS,
    religionOptions: RELIGION_OPTIONS,
    domainOptions: DOMAIN_OPTIONS,
    casteOptions: CASTE_OPTIONS,
    gothraOptions: GOTHRA_OPTIONS,
    maritalStatusOptions: MARITAL_STATUS_OPTIONS,
    countryOptions: COUNTRY_OPTIONS,
    heightOptions: HEIGHT_OPTIONS,
    bodyTypeOptions: BODY_TYPE_OPTIONS,
    complexionOptions: COMPLEXION_OPTIONS,
    physicalStatusOptions: PHYSICAL_STATUS_OPTIONS,
    educationOptions: EDUCATION_OPTIONS,
    employmentOptions: EMPLOYMENT_OPTIONS,
    occupationOptions: OCCUPATION_OPTIONS,
    starOptions: STAR_OPTIONS,
    doshamOptions: DOSHAM_OPTIONS,
    foodOptions: FOOD_OPTIONS,
    smokingOptions: SMOKING_OPTIONS,
    drinkingOptions: DRINKING_OPTIONS,
    familyStatusOptions: FAMILY_STATUS_OPTIONS,
    familyTypeOptions: FAMILY_TYPE_OPTIONS,
    familyValuesOptions: FAMILY_VALUES_OPTIONS,
    stateOptions: STATE_OPTIONS,
    cityOptions: CITY_OPTIONS,
    pincodeOptions: PINCODE_OPTIONS,
    subCasteOptions: SUB_CASTE_OPTIONS,
    raasiOptions: RAASI_OPTIONS,
    parentRelationOptions: PARENT_RELATION_OPTIONS,
    familyRelationOptions: FAMILY_RELATION_OPTIONS,
  }
}

export function mapBasicDataToInitialValues(data = {}, baseValues = {}) {
  const countryId = data.selectedcountryId ? String(data.selectedcountryId) : getSelectedId(data.country)
  const casteId =
    getSelectedArrayId(data.selectedcasteId) ||
    getSelectedId(data.caste) ||
    (data.selectedcasteValue
      ? String(data.caste?.find((item) => item.name === data.selectedcasteValue)?.id || '')
      : '')

  const domainId =
    getSelectedArrayId(data.selectedDomainId) || getSelectedId(data.domain)

  return {
    ...baseValues,
    groomName: data.groomName || baseValues.groomName || '',
    email: data.email || baseValues.email || '',
    gender: data.gender || baseValues.gender || '',
    mobileNumber: data.mobilenumber || baseValues.mobileNumber || '',
    profileForId: data.selectedprofileForId
      ? String(data.selectedprofileForId)
      : getSelectedId(data.profileFor) || baseValues.profileForId,
    motherTongueId: data.selectedmotherTongueId
      ? String(data.selectedmotherTongueId)
      : getSelectedId(data.motherTongue) || baseValues.motherTongueId,
    religionId: data.selectedreligionId
      ? String(data.selectedreligionId)
      : getSelectedId(data.religion) || baseValues.religionId,
    domainId: domainId || baseValues.domainId,
    casteId: casteId || baseValues.casteId,
    countryId: countryId || baseValues.countryId,
    parentsIsdcode: data.selectedisdcode || baseValues.parentsIsdcode,
    currency: countryId || baseValues.currency,
    parentsCurrency: countryId || baseValues.parentsCurrency,
  }
}
