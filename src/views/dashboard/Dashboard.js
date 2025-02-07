import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CLink,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilChartPie,
  cilArrowRight,
  cilContact,
  cibGmail,
  cibMessenger,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { generateClient } from 'aws-amplify/data'
import GoogleLogin from 'react-google-login'
import axios from 'axios'

const client = generateClient()
const Dashboard = () => {
  const [categories, setCategory] = useState([])
  const [emails, setEmail] = useState([])
  const [state, setState] = useState({
    iadsr_monthly_email: 0,
    iadsr_weekly_email: 0,
    iadsr_daily_email: 0,
    iadsr_monthly_sms: 0,
    iadsr_weekly_sms: 0,
    iadsr_daily_sms: 0,

    fm_monthly_email: 0,
    fm_weekly_email: 0,
    fm_daily_email: 0,
    fm_monthly_sms: 0,
    fm_weekly_sms: 0,
    fm_daily_sms: 0,

    dental_services_monthly_email: 0,
    dental_services_weekly_email: 0,
    dental_services_daily_email: 0,
    dental_services_monthly_sms: 0,
    dental_services_weekly_sms: 0,
    dental_services_daily_sms: 0,
  })
  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Client.list(
      {
        limit: 20000,
      },
      {
        authMode: 'userPool',
      },
    )

    setCategory(items)
  }
  useEffect(() => {
    const sub = client.models.EmailList.observeQuery({ limit: 50000 }).subscribe({
      next: ({ items }) => {
        setEmail([...items])
        // setFilterItem([...items])
      },
    })

    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    fetchTodos()
    getRecord()
  }, [])

  const getRecord = async () => {
    const sentWeatherData = await axios
      .get('https://cms.fissionmonster.com/api/get/stats')
      .then(async (response) => {
        const data = response.data
        setState(data)
      })
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h2>Iadsr Stats</h2>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={30} />}
            title="Total Email Send (Monthly)"
            value={state?.iadsr_monthly_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email Send (Weekly)"
            value={state?.iadsr_weekly_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email Send (Today)"
            value={state?.iadsr_daily_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={30} />}
            title="Total Message Send (Monthly)"
            value={state?.iadsr_monthly_sms}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={24} />}
            title="Total Message Send (Weekly)"
            value={state?.iadsr_weekly_sms}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={24} />}
            title="Total Message Send (Today)"
            value={state?.iadsr_daily_sms}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <h2>FM Stats</h2>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={30} />}
            title="Total Email Send (Monthly)"
            value={state?.fm_monthly_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email Send (Weekly)"
            value={state?.fm_weekly_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email Send (Today)"
            value={state?.fm_daily_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={30} />}
            title="Total Message Send (Monthly)"
            value={state?.fm_monthly_sms}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={24} />}
            title="Total Message Send (Weekly)"
            value={state?.fm_weekly_sms}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={24} />}
            title="Total Message Send (Today)"
            value={state?.fm_daily_sms}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <h2>Dental Services Stats</h2>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={30} />}
            title="Total Email Send (Monthly)"
            value={state?.dental_services_monthly_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email Send (Weekly)"
            value={state?.dental_services_weekly_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email Send (Today)"
            value={state?.dental_services_daily_email}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={30} />}
            title="Total Message Send (Monthly)"
            value={state?.dental_services_monthly_sms}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={24} />}
            title="Total Message Send (Weekly)"
            value={state?.dental_services_weekly_sms}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibMessenger} height={24} />}
            title="Total Message Send (Today)"
            value={state?.dental_services_daily_sms}
          />
        </CCol>
      </CRow>

      <CCol xs={12}>
        <h2>Records</h2>
      </CCol>

      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={30} />}
            title="Total Contact"
            value={categories.length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={24} />}
            title="Contact (MBS)"
            value={categories.filter((item) => item.category_id === 'Doctor MBS').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={24} />}
            title="Total Contact (BDS)"
            value={categories.filter((item) => item.category_id === 'Doctor BDS').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={24} />}
            title="Total Contact (Patient)"
            value={categories.filter((item) => item.category_id === 'Patient').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilContact} height={24} />}
            title="Total Contact (Nursing)"
            value={categories.filter((item) => item.category_id === 'Nursing').length}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={30} />}
            title="Total Email"
            value={emails.length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Email (MBS)"
            value={emails.filter((item) => item.category_id === 'Doctor MBS').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email (BDS)"
            value={emails.filter((item) => item.category_id === 'Doctor BDS').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email (Patient)"
            value={emails.filter((item) => item.category_id === 'Patient').length}
          />
        </CCol>
        <CCol xs={4}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cibGmail} height={24} />}
            title="Total Email (Nursing)"
            value={emails.filter((item) => item.category_id === 'Nursing').length}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
