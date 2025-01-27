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
const avatar8 = 'https://cdn-icons-png.flaticon.com/512/9187/9187604.png'

const AppHeaderDropdown = () => {
  const [name, setName] = useState(null)
  const logout = async () => {
    await signOut({ global: true })
  }
  const GoogleSigIn = async () => {
    await signInGoogle()
    let user = await getCurrentUser()
    setName(user.wt.Ad)
  }
  useEffect(() => {
    getName()
  }, [])

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
        <CDropdownItem onClick={() => logout()}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
