import React, { useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CButton,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import DataTable from 'react-data-table-component'
import * as XLSX from 'xlsx'
// import styled from 'styled-components'
import { NavLink, useNavigate } from 'react-router-dom'
import { addContact } from '../../helpers/GoogleAuth'
import {
  checkPermissionExist,
  getRoleStatusDownload,
  getRoleStatusView,
  savedLogs,
  showSuccessMessage,
} from '../../helpers/helper'
import { getCurrentUser } from 'aws-amplify/auth'
import axios from 'axios'
const client = generateClient()
const AllUser = () => {
  const [categories, setCategory] = useState([])
  const [filteredItems, setFilterItem] = useState([])
  const [visible, setVisible] = useState(false)
  const [file, setFile] = useState(null)
  const [loadingTable, setLoadingActive] = useState(true)
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputFile = useRef(null)
  const [showNumber, setNumber] = useState(false)
  const [totalRecord, setTotalRecord] = useState(0)
  const [savedRecord, setSavedReocrd] = useState(0)
  const [failedRecord, setFailedRecord] = useState(0)
  const [name, setName] = useState('')
  const role = localStorage.getItem('role')
  const [g_login, setGLogin] = useState(false)
  let permissions = JSON.parse(localStorage.getItem('permissions'))
  let navigate = useNavigate()
  const routeChange = () => {
    let path = `/add/user`
    navigate(path)
  }

  console.log(role)

  const fetchTodos = async () => {
    await axios.get('https://iadsr.fissionmonster.com/api/get/users').then(async (response) => {
      const data = response.data
      setCategory(data.data)
      setFilterItem(data.data)
    })
    setLoadingActive(false)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  useEffect(() => {}, [])

  useEffect(() => {
    if (failedRecord + savedRecord === totalRecord) {
      setLoading(false)
    }
  }, [savedRecord, failedRecord])

  useEffect(() => {
    const filteredData = categories.filter((sheet) => {
      return (
        sheet?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        sheet?.name
          ?.replace(' ', '')
          ?.toLowerCase()
          .includes(filterText.replace(' ', '')?.toLowerCase()) ||
        sheet?.email?.toLowerCase().includes(filterText.toLowerCase())
      )
    })
    setFilterItem(filteredData)
  }, [filterText])

  const saveDate = async () => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json(sheet)
      setTotalRecord(sheetData.length)
      let exists = Object.keys(sheetData[0]).filter((record) => record === 'contact')
      console.log(exists, 'exists')
      if (exists.length === 0) {
        setError('Invalid File Format')
        inputFile.current.value = null
        setFile(null)
        return
      }
      setLoading(true)
      setNumber(true)
      let isSaved = await SaveRecord(sheetData)

      if (isSaved === true) {
        setFile(null)
        inputFile.current.value = null
        setError('')
      }
    }

    reader.readAsBinaryString(file)
  }

  const columns = [
    {
      name: 'ID',
      selector: (row, i) => i + 1,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
    },
  ]
  let actions = {
    name: 'Action',
    selector: (row) => {
      return (
        <>
          <NavLink to={{ pathname: '/edit/user' }} state={JSON.stringify(row)}>
            Edit
          </NavLink>{' '}
        </>
      )
    },
  }
  if (checkPermissionExist('edit_users', permissions) === true) {
    columns.push(actions)
  }
  // const columnsUploader = [
  //   {
  //     name: 'ID',
  //     selector: (row, i) => i + 1,
  //   },
  //   {
  //     name: 'Name',
  //     selector: (row) => row.name,
  //   },
  //   {
  //     name: 'Email',
  //     selector: (row) => row.name,
  //   },
  // ]

  function convertArrayOfObjectsToCSV(array) {
    let result

    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(categories[0])
    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter

    array.forEach((item) => {
      let ctr = 0
      keys.forEach((key) => {
        if (key !== 'category') {
          if (ctr > 0) result += columnDelimiter

          result += item[key]

          ctr++
        }
      })
      result += lineDelimiter
    })

    return result
  }
  async function downloadCSV(array) {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (csv == null) return

    const filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
    let obj = {
      message: 'Download Contact',
    }
    await savedLogs('DOWNLOAD CONTACT', obj)
  }
  const Export = ({ onExport }) => (
    <CButton color="primary" onClick={(e) => onExport(e.target.value)}>
      Export
    </CButton>
  )

  // const actionsMemo =

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Users List</strong>{' '}
            <CButton color="primary" style={{ float: 'right' }} onClick={() => routeChange()}>
              Add User
            </CButton>
          </CCardHeader>
          <CCardBody>
            <div className="overflow-x-auto">
              <CFormInput
                id="search"
                type="text"
                placeholder="Filter Table"
                aria-label="Search Input"
                style={{ marginBottom: 10 }}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              {categories.length > 0 ? (
                <DataTable
                  columns={getRoleStatusView(role) === false ? columns : columns}
                  data={filteredItems}
                  progressPending={loadingTable}
                  pagination
                  actions={
                    getRoleStatusDownload(role) === true ? (
                      <Export onExport={() => downloadCSV(categories)} />
                    ) : null
                  }
                  paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                />
              ) : (
                <DataTable
                  columns={getRoleStatusView(role) === false ? columns : columns}
                  data={filteredItems}
                  progressPending={loadingTable}
                  pagination
                  // actions={actionsMemo}
                />
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AllUser
