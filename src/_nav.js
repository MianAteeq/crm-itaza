import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibGmail,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilContact,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilLineWeight,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { getCats, getRoleStatusDownload } from './helpers/helper'
let records = JSON.parse(localStorage.getItem('cats'))

let route = [
  {
    component: CNavItem,
    name: 'Add Contact',
    to: '/add/client',
  },
  {
    component: CNavItem,
    name: 'All Contact',
    to: '/all/client',
  },
]
records
  ?.sort((a, b) => a.name.localeCompare(b.name))
  .forEach((item) => {
    let name = item.name === 'Doctor MBS' ? 'Doctor MBBS' : item.name

    let obj = {
      to: `/${item.name.replace(' ', '-').toLowerCase()}/client`,
      name: name,
      component: CNavItem,
    }

    route.push(obj)
  })

let route_email = [
  {
    component: CNavItem,
    name: 'Add Email',
    to: '/add/email',
  },
  {
    component: CNavItem,
    name: 'All Email',
    to: '/all/email',
  },
]
records
  ?.sort((a, b) => a.name.localeCompare(b.name))
  .forEach((item) => {
    let name = item.name === 'Doctor MBS' ? 'Doctor MBBS' : item.name
    let obj = {
      to: `/${item.name.replace(' ', '-').toLowerCase()}/email`,
      name: name,
      component: CNavItem,
    }

    route_email.push(obj)
  })
let obj = {
  component: CNavItem,
  name: 'Send Email',
  to: '/send/email',
}
route_email.push(obj)

const _nav = getRoleStatusDownload('ADMIN')
  ? [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: '',
        },
      },
      {
        component: CNavTitle,
        name: 'Pages',
      },
      {
        component: CNavItem,
        name: 'Category',
        to: '/category/list',
        icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Contact List',
        to: '/base',
        icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
        items: route,
      },
      {
        component: CNavGroup,
        name: 'Email List',
        to: '/base',
        icon: <CIcon icon={cibGmail} customClassName="nav-icon" />,
        items: route_email,
      },
      {
        component: CNavItem,
        name: 'Logs',
        to: '/logs/list',
        icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
      },
    ]
  : [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: '',
        },
      },
      {
        component: CNavTitle,
        name: 'Pages',
      },
      {
        component: CNavItem,
        name: 'Category',
        to: '/category/list',
        icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Contact List',
        to: '/base',
        icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
        items: route,
      },
      {
        component: CNavGroup,
        name: 'Email List',
        to: '/base',
        icon: <CIcon icon={cibGmail} customClassName="nav-icon" />,
        items: route_email,
      },
    ]

export default _nav
