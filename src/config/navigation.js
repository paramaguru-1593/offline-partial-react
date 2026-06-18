export const OFFLINE_MODULES = [
  {
    key: 'offline-profiles',
    label: 'Offline Profile',
    path: '/crm/offline-profiles',
    processUrls: ['offlineprofile'],
    icon: 'OfflineProfile',
    iconSelect: 'OfflineProfileSelect',
  },
  {
    key: 'offline-calling-process',
    label: 'Offline Registration Calling Process',
    path: '/crm/offline-calling-process',
    processUrls: ['offlinecalling'],
    icon: 'OfflineCalling',
    iconSelect: 'OfflineCallingSelect',
  },
  {
    key: 'offline-call-report',
    label: 'Offline Call Report',
    path: '/crm/offline-call-report',
    processUrls: ['getofflinecallreport'],
    icon: 'OfflineCallReport',
    iconSelect: 'OfflineCallReportSelect',
  },
  // {
  //   key: 'offline-call-lead-order',
  //   label: 'Offline Call Lead Order',
  //   path: '/crm/offline-call-lead-order',
  //   icon: 'OfflineCallOrder',
  //   iconSelect: 'OfflineCallOrderSelect',
  // },
  {
    key: 'offline-calling-management',
    label: 'Offline Calling Management',
    path: '/crm/offline-calling-management',
    processUrls: ['getofflinemanagement'],
    icon: 'OfflineManage',
    iconSelect: 'OfflineManageSelect',
  },
  // {
  //   key: 'offline-bucket',
  //   label: 'Offline Bucket',
  //   path: '/crm/offline-bucket',
  //   icon: 'OfflineBucket',
  //   iconSelect: 'OfflineBucketSelect',
  // },
  {
    key: 'data-team-report',
    label: 'Data Team Report',
    path: '/crm/data-team-report',
    processUrls: ['datateamreport'],
    icon: 'DataTeam',
    iconSelect: 'DataTeamSelect',
  },
]

export const PARTIAL_MODULES = [
  {
    key: 'partial-registration-calling',
    label: 'Partial Registration Calling',
    path: '/crm/partial-registration-calling',
    processUrls: ['partialRegistrationCalling'],
    icon: 'OfflineCalling',
    iconSelect: 'OfflineCallingSelect',
  },
  {
    key: 'partial-call-report',
    label: 'Partial Call Report',
    path: '/crm/partial-call-report',
    processUrls: ['getpartialcallreport'],
    icon: 'OfflineCallReport',
    iconSelect: 'OfflineCallReportSelect',
  },
  {
    key: 'partial-bucket',
    label: 'Partial Bucket',
    path: '/crm/partial-bucket',
    processUrls: ['partialbucket'],
    icon: 'OfflineBucket',
    iconSelect: 'OfflineBucketSelect',
  },
  {
    key: 'partial-call-lead-order',
    label: 'Partial Call Lead Order',
    path: '/crm/partial-call-lead-order',
    processUrls: ['partialcallleadorder'],
    icon: 'OfflineCallOrder',
    iconSelect: 'OfflineCallOrderSelect',
  },
  {
    key: 'partial-calling-management',
    label: 'Partial Calling Management',
    path: '/crm/partial-calling-management',
    processUrls: ['partialcallingmanagement'],
    icon: 'OfflineManage',
    iconSelect: 'OfflineManageSelect',
  },
]

export const PROFILE_CRM = [
  {
    key: 'profile-crm',
    label: 'Profile CRM',
    path: '/crm/profile-crm',
    processUrls: ['profilecrm'],
    icon: 'OfflineProfile',
    iconSelect: 'OfflineProfileSelect',
  },
]

export const DEFAULT_CRM_PATH = OFFLINE_MODULES[0].path

function normalizeProcessText(value = '') {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function filterModulesByProcesses(modules, processes = []) {
  if (!processes.length) return []

  const processUrls = new Set(processes.map((process) => process.url).filter(Boolean))
  const processLabels = new Set(processes.map((process) => normalizeProcessText(process.label)))

  return modules.filter((module) =>
    module.processUrls?.some((processUrl) => processUrls.has(processUrl)) ||
    processLabels.has(normalizeProcessText(module.label)),
  )
}

export function getFirstAllowedPath(processes = []) {
  const sections = [OFFLINE_MODULES, PROFILE_CRM]
  const firstAllowed = sections
    .flatMap((section) => filterModulesByProcesses(section, processes))
    .find(Boolean)

  return firstAllowed?.path || DEFAULT_CRM_PATH
}
