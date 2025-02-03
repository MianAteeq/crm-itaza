import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { signOut } from 'aws-amplify/auth'
import { checkUserLogin, getCurrentUser, signInGoogle } from '../../helpers/GoogleAuth'
import axios from 'axios'
import { showSuccessMessage } from '../../helpers/helper'
const avatar8 = 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'
// const wa_status = localStorage.getItem('wa_status')

const AppHeaderDropdown = () => {
  const [name, setName] = useState(null)
  const [wa_status, setWA] = useState(null)
  const logout = async () => {
    await signOut({ global: true })
  }
  const whatsAppLogout = async () => {
    const response = await axios.get('https://cms.fissionmonster.com/api/wa/logout')

    if (response.data.status === true) {
      localStorage.setItem('wa_status', false)
      showSuccessMessage('WhatsApp Logout Successfully!')
    }
  }
  const GoogleSigIn = async () => {
    await signInGoogle()
    let user = await getCurrentUser()
    setName(user.wt.Ad)
  }
  useEffect(() => {
    getName()
  }, [])
  useEffect(() => {
    getWA()
    const interval = setInterval(() => getWA(), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const getWA = () => {
    setWA(JSON.parse(localStorage.getItem('wa_status')))
  }

  const getName = async () => {
    let loginCheck = await checkUserLogin()
    console.log(loginCheck)
    if (loginCheck === true) {
      let user = await getCurrentUser()
      setName(user.wt.Ad)
    }
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>

        {name === null ? (
          <CDropdownItem onClick={() => GoogleSigIn()} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilUser} className="me-2" />
            Google signIn
          </CDropdownItem>
        ) : (
          <CDropdownItem onClick={() => GoogleSigIn()} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilUser} className="me-2" />
            {name}
          </CDropdownItem>
        )}
        <CDropdownItem onClick={() => logout()} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
        {wa_status === true ? (
          <CDropdownItem onClick={() => whatsAppLogout()} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilLockLocked} className="me-2" />
          WhatsApp Logout
          </CDropdownItem>
        ) : null}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
