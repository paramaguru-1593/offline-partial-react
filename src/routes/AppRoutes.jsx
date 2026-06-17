import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import CrmLayout from '../layouts/CrmLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../pages/Login'
import { DEFAULT_CRM_PATH } from '../config/navigation'

import OfflineProfiles from '../pages/offline/OfflineProfiles'
import OfflineCallingProcess from '../pages/offline/OfflineCallingProcess'
import OfflineCallReport from '../pages/offline/OfflineCallReport'
import OfflineCallLeadOrder from '../pages/offline/OfflineCallLeadOrder'
import OfflineCallingManagement from '../pages/offline/OfflineCallingManagement'
import OfflineBucket from '../pages/offline/OfflineBucket'
import DataTeamReport from '../pages/offline/DataTeamReport'

import PartialRegistrationCalling from '../pages/partial/PartialRegistrationCalling'
import PartialCallReport from '../pages/partial/PartialCallReport'
import PartialBucket from '../pages/partial/PartialBucket'
import PartialCallLeadOrder from '../pages/partial/PartialCallLeadOrder'
import PartialCallingManagement from '../pages/partial/PartialCallingManagement'

import ProfileCrm from '../pages/ProfileCrm'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<CrmLayout />}>
            <Route path="/crm/offline-profiles" element={<OfflineProfiles />} />
            <Route path="/crm/offline-calling-process" element={<OfflineCallingProcess />} />
            <Route path="/crm/offline-call-report" element={<OfflineCallReport />} />
            <Route path="/crm/offline-call-lead-order" element={<OfflineCallLeadOrder />} />
            <Route path="/crm/offline-calling-management" element={<OfflineCallingManagement />} />
            <Route path="/crm/offline-bucket" element={<OfflineBucket />} />
            <Route path="/crm/data-team-report" element={<DataTeamReport />} />
            <Route path="/crm/partial-registration-calling" element={<PartialRegistrationCalling />} />
            <Route path="/crm/partial-call-report" element={<PartialCallReport />} />
            <Route path="/crm/partial-bucket" element={<PartialBucket />} />
            <Route path="/crm/partial-call-lead-order" element={<PartialCallLeadOrder />} />
            <Route path="/crm/partial-calling-management" element={<PartialCallingManagement />} />
            <Route path="/crm/profile-crm" element={<ProfileCrm />} />
            <Route path="/dashboard" element={<Navigate to={DEFAULT_CRM_PATH} replace />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
