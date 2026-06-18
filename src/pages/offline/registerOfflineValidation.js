import * as Yup from 'yup'
import {
  CASTE_OPTIONS,
  NUMBER_WORDS,
  SUB_CASTE_OPTIONS,
  getCasteLabel,
  getSubCasteLabel,
} from '../../data/registerOfflineOptions'

const familyMemberSchema = Yup.object({
  isdCodeFamily: Yup.string(),
  familyMobileNumber: Yup.string().matches(/^\d{10}$|^$/, 'Family number should have 10 digits'),
  matRelationshipId: Yup.string(),
}).test('family-member-complete', 'Please fill in all fields', function validateMember(member) {
  const hasAny = Boolean(member.familyMobileNumber || member.matRelationshipId)
  if (!hasAny) return true
  return Boolean(member.familyMobileNumber && member.matRelationshipId)
})

export const registerOfflineInitialValues = {
  callingdetails: 'offlinecalling',
  groomName: '',
  gender: '',
  profileForId: '',
  motherTongueId: '',
  religionId: '',
  domainId: '',
  casteId: '',
  othercaste: '',
  subcaste: '',
  othersubcaste: '',
  othersubcaste_new: '',
  gothraId: '',
  mobileNumber: '9876543210',
  isWhatsapp: false,
  parentsIsdcode: '+91',
  parentsMobileNumber: '',
  parentRelationId: '',
  email: '',
  password: '',
  maritialStatusId: '',
  noOfChildren: '',
  noOfChildrenLiving: '',
  selYear: '',
  selMonth: '',
  seldate: '',
  countryId: '',
  stateId: '',
  cityId: '',
  pincodeId: '',
  address: '',
  heightInInchesId: '',
  weight: '',
  bodyTypeId: '',
  complexionId: '',
  physicalStatusId: '',
  education: '',
  employedInId: '',
  occupationId: '',
  currency: '1',
  monthly: '',
  starId: '',
  raasiId: '',
  doshamId: '',
  foodId: '',
  smokingId: '',
  drinkingId: '',
  FamilyStatusId: '',
  familyTypeId: '',
  familyValuesId: '',
  parentsCurrency: '1',
  parentsMonthlyIncome: '',
  familyMembers: [
    { isdCodeFamily: '+91', familyMobileNumber: '', matRelationshipId: '' },
  ],
  more_info: '',
}

export function createRegisterOfflineSchema({
  casteOptions = CASTE_OPTIONS,
  subCasteOptions = SUB_CASTE_OPTIONS,
} = {}) {
  return Yup.object({
  groomName: Yup.string()
    .trim()
    .required('Please enter name')
    .test('valid-name', 'Please enter the valid name', (value) => {
      if (!value) return true
      const words = value.toLowerCase().split(/\s+/)
      return !words.some((word) => NUMBER_WORDS.includes(word))
    }),
  gender: Yup.string().required('Please Select Gender'),
  profileForId: Yup.string().required('Please Select Profile Created For'),
  motherTongueId: Yup.string().required('Please Select MotherTongue'),
  religionId: Yup.string().required('Please Select Religion'),
  domainId: Yup.string().when('religionId', {
    is: '18',
    then: (schema) => schema.required('Please Select Domain'),
    otherwise: (schema) => schema,
  }),
  casteId: Yup.string().required('Please Select Caste'),
  othercaste: Yup.string().when('casteId', {
    is: (casteId) => getCasteLabel(casteId, casteOptions) === 'Others',
    then: (schema) => schema.required('Please Enter Other Caste'),
    otherwise: (schema) => schema,
  }),
  othersubcaste_new: Yup.string().when('subcaste', {
    is: (subcaste) => getSubCasteLabel(subcaste, subCasteOptions).toLowerCase().includes('others'),
    then: (schema) => schema.required('Please Enter Other Subcaste'),
    otherwise: (schema) => schema,
  }),
  gothraId: Yup.string().when('casteId', {
    is: (casteId) => getCasteLabel(casteId, casteOptions).includes('Brahmin'),
    then: (schema) => schema.required('Select Gothra'),
    otherwise: (schema) => schema,
  }),
  isWhatsapp: Yup.boolean(),
  parentsMobileNumber: Yup.string()
    .test('parent-mobile', 'Parent number should have 10 digits', (value) => {
      if (!value) return true
      return /^\d{10}$/.test(value)
    })
    .test('parent-same', "Profile Mobile Number and Parent's Number should not same", function validateParent(value) {
      if (!value) return true
      return value !== this.parent.mobileNumber
    }),
  parentRelationId: Yup.string().when('parentsMobileNumber', {
    is: (value) => Boolean(value),
    then: (schema) => schema.required('Select Relation'),
    otherwise: (schema) => schema,
  }),
  email: Yup.string().email('Enter a valid domain'),
  password: Yup.string()
    .required('Please Enter Password')
    .min(6, 'Password should be between 6 and 15 characters.')
    .max(15, 'Password should be between 6 and 15 characters.'),
  maritialStatusId: Yup.string().required('Please Select Marital'),
  noOfChildren: Yup.string().when('maritialStatusId', {
    is: (value) => value && value !== '1',
    then: (schema) => schema.required('Please Select No. of Children'),
    otherwise: (schema) => schema,
  }),
  noOfChildrenLiving: Yup.string().when(['maritialStatusId', 'noOfChildren'], {
    is: (marital, children) => marital && marital !== '1' && children && children !== '0',
    then: (schema) => schema.required('Please Select Children Living With You'),
    otherwise: (schema) => schema,
  }),
  selYear: Yup.string().required('Please Select DOB'),
  selMonth: Yup.string().required('Please Select DOB'),
  seldate: Yup.string().required('Please Select DOB'),
  countryId: Yup.string().required('Please Select Country'),
  stateId: Yup.string().required('Please Select State'),
  cityId: Yup.string().required('Please Select City'),
  pincodeId: Yup.string().required('Please Select Pincode'),
  address: Yup.string(),
  heightInInchesId: Yup.string().required('Select Height'),
  weight: Yup.number()
    .typeError('Weight should not be empty')
    .required('Weight should not be empty')
    .min(30, 'Weight should be greater than 30.')
    .max(200, 'Weight should be less than 200.'),
  bodyTypeId: Yup.string().required('Select Body Type'),
  complexionId: Yup.string().required('Select Complexion'),
  physicalStatusId: Yup.string().required('Select Physical Status'),
  education: Yup.string().required('Select Education'),
  employedInId: Yup.string().required('Select Employment Type'),
  occupationId: Yup.string().required('Select Occupation'),
  monthly: Yup.string().test('monthly-income', 'Please enter valid monthly income.', (value) => {
    if (!value) return true
    return value.length >= 4
  }),
  more_info: Yup.string().test('description-length', 'A valid description should have 50 characters', (value) => {
    if (!value) return true
    return value.trim().length >= 50
  }),
  familyMembers: Yup.array().of(familyMemberSchema).max(5),
  })
}

export const registerOfflineSchema = createRegisterOfflineSchema()
