import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibGmail, cilContact, cilLineWeight, cilSpeedometer, cilStar } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { checkPermissionExist, getCats, getRoleStatusDownload } from './helpers/helper'
let records = JSON.parse(localStorage.getItem('cats'))
let permissions = JSON.parse(localStorage.getItem('permissions'))

let route = []

let add_contact = {
  component: CNavItem,
  name: 'Add Contact',
  to: '/add/client',
}
if (checkPermissionExist('add_contact', permissions) === true) {
  route.push(add_contact)
}
let all_contact = {
  component: CNavItem,
  name: 'All Contact',
  to: '/all/client',
}

if (checkPermissionExist('all_contact', permissions) === true) {
  route.push(all_contact)
}

records
  ?.sort((a, b) => a.name.localeCompare(b.name))
  .forEach((item) => {
    let name = item.name === 'Doctor MBS' ? 'Doctor MBBS' : item.name
    let c_name = item.name.replace(' ', '_').toLowerCase() + '_contact'
    let obj = {
      to: `/${item.name.replace(' ', '-').toLowerCase()}/client`,
      name: name,
      component: CNavItem,
    }
    if (checkPermissionExist(c_name, permissions) === true) {
      route.push(obj)
    }
  })
let obj_email = {
  component: CNavItem,
  name: 'Send Message',
  to: '/send/message',
}
if (checkPermissionExist('send_message_contact', permissions) === true) {
  route.push(obj_email)
}

let route_email = []

let add_email = {
  component: CNavItem,
  name: 'Add Email',
  to: '/add/email',
}
if (checkPermissionExist('add_email', permissions) === true) {
  route_email.push(add_email)
}
let all_email = {
  component: CNavItem,
  name: 'All Email',
  to: '/all/email',
}
if (checkPermissionExist('all_email', permissions) === true) {
  route_email.push(all_email)
}

records
  ?.sort((a, b) => a.name.localeCompare(b.name))
  .forEach((item) => {
    let name = item.name === 'Doctor MBS' ? 'Doctor MBBS' : item.name
    let p_name = item.name.replace(' ', '_').toLowerCase() + '_email'
    let obj = {
      to: `/${item.name.replace(' ', '-').toLowerCase()}/email`,
      name: name,
      component: CNavItem,
    }
    if (checkPermissionExist(p_name, permissions) === true) {
      route_email.push(obj)
    }
  })

let obj = {
  component: CNavItem,
  name: 'Send Email',
  to: '/send/email',
}
if (checkPermissionExist('send_message_email', permissions) === true) {
  route_email.push(obj)
}

const _nav = []
let dashboard = {
  component: CNavItem,
  name: 'Dashboard',
  to: '/dashboard',
  icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  badge: {
    color: 'info',
    text: '',
  },
}
if (checkPermissionExist('dashboard', permissions) === true) {
  _nav.push(dashboard)
}
let page = {
  component: CNavTitle,
  name: 'Pages',
}

_nav.push(page)

let category = {
  component: CNavItem,
  name: 'Category',
  to: '/category/list',
  icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
}

if (checkPermissionExist('view_category', permissions) === true) {
  _nav.push(category)
}
let user = {
  component: CNavItem,
  name: 'Users',
  to: '/all/users',
  icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
}

if (checkPermissionExist('view_users', permissions) === true) {
  _nav.push(user)
}
let contact = {
  component: CNavGroup,
  name: 'Contact List',
  to: '/base',
  icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  items: route,
}

if (checkPermissionExist('all_contact', permissions) === true) {
  _nav.push(contact)
}
let email = {
  component: CNavGroup,
  name: 'Email List',
  to: '/base',
  icon: <CIcon icon={cibGmail} customClassName="nav-icon" />,
  items: route_email,
}

if (checkPermissionExist('all_email', permissions) === true) {
  _nav.push(email)
}
let log = {
  component: CNavItem,
  name: 'Logs',
  to: '/logs/list',
  icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
}

if (checkPermissionExist('logs', permissions) === true) {
  _nav.push(log)
}

export default _nav
