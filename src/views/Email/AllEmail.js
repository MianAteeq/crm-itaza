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

import { NavLink } from 'react-router-dom'
import {
  checkPermissionExist,
  getRoleStatusDownload,
  getRoleStatusView,
  savedLogs,
  showSuccessMessage,
} from '../../helpers/helper'
const client = generateClient()
const AllEmail = () => {
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
  const role = localStorage.getItem('role')
  let permissions = JSON.parse(localStorage.getItem('permissions'))
  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.EmailList.list({
      limit: 50000,
    })
    setCategory(items)
    setFilterItem(items.sort((a, b) => a.name.localeCompare(b.name)))
    setLoadingActive(false)
  }

  useEffect(() => {
    fetchTodos()
  }, [])
  useEffect(() => {
    const sub = client.models.EmailList.observeQuery({ limit: 50000 }).subscribe({
      next: ({ items }) => {
        setCategory([...items])
        setFilterItem([...items])
      },
    })

    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    if (failedRecord + savedRecord === totalRecord) {
      setLoading(false)
    }
  }, [savedRecord, failedRecord])

  useEffect(() => {
    const filteredData = categories.filter((sheet) => {
      return (
        sheet?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        sheet?.email?.toLowerCase().includes(filterText.toLowerCase()) ||
        sheet?.cnic?.toLowerCase().includes(filterText.toLowerCase()) ||
        sheet?.working_at?.toLowerCase().includes(filterText.toLowerCase()) ||
        sheet?.address?.toLowerCase().includes(filterText.toLowerCase()) ||
        sheet?.hospital?.toLowerCase().includes(filterText.toLowerCase()) ||
        sheet?.Designation?.toLowerCase().includes(filterText.toLowerCase())
      )
    })
    setFilterItem(filteredData)
  }, [filterText])

  const editRecord = (record) => {
    setVisible(true)
    setID(record.toID)
    setName(record.name)
  }

  const saveDate = async () => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json(sheet)
      setTotalRecord(sheetData.length)
      let exists = Object.keys(sheetData[0]).filter((record) => record === 'email')
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
  const deleteRow = async (row) => {
    const shouldRemove = confirm('are you sure you want to delete?')
    if (shouldRemove) {
      const toBeDeletedTodo = {
        email: row.email,
      }

      const { data: deletedTodo, error } = await client.models.EmailList.delete(toBeDeletedTodo)
      showSuccessMessage('Email Delete Successfully!')
    }
  }

  const columns = [
    {
      name: 'ID',
      selector: (row, i) => i + 1,
    },
    {
      name: 'Category',
      selector: (row) => row.category_id,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Email',
      selector: (row) => row.email.toLowerCase().replace('<', '').replace('>', ''),
    },
    {
      name: 'CNIC',
      selector: (row) => (row.cnic ? row.cnic : 'N.A'),
    },
    {
      name: 'Action',
      selector: (row) => {
        return (
          <>
            <>
              {checkPermissionExist('view_email', permissions) === true ? (
                <>
                  <NavLink to={{ pathname: '/view/email' }} state={JSON.stringify(row)}>
                    View
                  </NavLink>
                  <span style={{ color: 'black', marginRight: 5, marginLeft: 5 }}>|</span>
                </>
              ) : null}
            </>{' '}
            {checkPermissionExist('edit_email', permissions) === true ? (
              <>
                <NavLink to={{ pathname: '/edit/email' }} state={JSON.stringify(row)}>
                  Edit
                </NavLink>
                <span style={{ color: 'black', marginRight: 5, marginLeft: 5 }}>|</span>
              </>
            ) : null}
            {checkPermissionExist('delete_email', permissions) === true ? (
              <a
                onClick={() => deleteRow(row)}
                style={{ color: 'red', marginLeft: 5, cursor: 'pointer' }}
              >
                Delete
              </a>
            ) : null}
          </>
        )
      },
    },


  ]
  const uploaderColumns = [
    {
      name: 'ID',
      selector: (row, i) => i + 1,
    },
    {
      name: 'Category',
      selector: (row) => row.category_id,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
    },
    {
      name: 'Email',
      selector: (row) => row.email.toLowerCase().replace('<', '').replace('>', ''),
    },
    {
      name: 'CNIC',
      selector: (row) => (row.cnic ? row.cnic : 'N.A'),
    },
  ]

  const getNumber = (phone_number) => {
    if (phone_number === undefined) {
      return
    }
    var regex = /(9|04)\d{8}/g
    var regexThree = /(3)\d{8}/g
    var regExpZero = /^0[0-9].*$/

    if (regex.test(phone_number) === true) {
      return `+${phone_number}`
    }
    if (phone_number.toString()[0] === '0') {
      // Convert number into a string
      let numberStr = phone_number.toString()

      // Replace the 0 with empty string
      const res = numberStr.replace(numberStr[3], '')

      return `+92${Number(res)}`
    }
    if (phone_number.toString()[0] === '3') {
      return `+92${Number(phone_number)}`
    } else {
      return 0
    }
  }
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const SaveRecord = async (records) => {
    var failed = 0
    var saved = 0
    records.forEach(async (item) => {
      let email = item?.email?.replace('<', '').replace('>', '')
      if (validateEmail(email) === true) {
        if (item.email !== undefined) {
          const { errors, data: newTodo } = await client.models.EmailList.create({
            category_id: item['category'] ?? 'Generic',
            email: email,
            name: item.name ? item.name : 'No Name',
            designation: item.designation ? item.designation : '',
            cnic: item.cnic ? item.cnic : '',
            hospital: item.hospital ? item.hospital : '',
            working_at: item.working_at ? item.working_at : '',
            address: item.address ? item.address : '',
          })
          if (newTodo !== null) {
            saved++
            setSavedReocrd(saved)
          } else {
            if (errors.length > 0) {
              if (errors[0].errorType === 'DynamoDB:ConditionalCheckFailedException') {
                const toBeDeletedTodo = {
                  email: email,
                }

                await client.models.EmailList.delete(toBeDeletedTodo)

                await client.models.EmailList.create({
                  category_id: item['category'] ?? 'Generic',
                  email: email,
                  name: item.name ? item.name.concat(' ', item.father_name) : 'No Name',
                  designation: item.designation ? item.designation : '',
                  cnic: item.cnic ? item.cnic : '',
                  hospital: item.hospital ? item.hospital : '',
                  working_at: item.working_at ? item.working_at : '',
                  address: item.address ? item.address : '',
                })
                saved++
                setSavedReocrd(saved)
              }
            } else {
              failed++

              setFailedRecord(failed)
            }
          }
        }
      } else {
        failed++
        setFailedRecord(failed)
      }
    })

    return true
  }
  const createForm = () => {
    return (
      <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
        <CCardHeader>
          <strong>Import Data</strong>{' '}
          <CButton
            color="primary"
            style={{ float: 'right' }}
            onClick={() => {
              setVisible(false)
              setNumber(false)
              setTotalRecord(0)
              setSavedReocrd(0)
              setFailedRecord(0)
            }}
          >
            Close Model
          </CButton>
        </CCardHeader>

        <CForm>
          <div className="m-3">
            {showNumber === true ? (
              <p>
                <span>
                  <strong>Total Record</strong>: {totalRecord}
                </span>{' '}
                <br />
                <span>
                  <strong>Total Saved Record</strong>: {savedRecord}
                </span>
                <br />
                <span>
                  <strong>Total Record Failed</strong>: {failedRecord}
                </span>
              </p>
            ) : (
              ''
            )}

            <CFormLabel htmlFor="exampleFormControlInput1">File</CFormLabel>
            <CFormInput
              type="file"
              id="exampleFormControlInput1"
              name="file"
              ref={inputFile}
              onChange={(e) => setFile(e.target.files[0])}
              placeholder="Add File"
            />
            <p style={{ color: 'red' }}>{error}</p>
            <div className="d-grid gap-2 col-6 mx-auto">
              <CButton color="primary" style={{ marginTop: '4%' }} onClick={() => saveDate()}>
                {loading === true ? 'Saving Data ...' : 'Import Data'}
              </CButton>
            </div>
          </div>
        </CForm>
      </CCard>
    )
  }
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
      message: 'Download Email',
    }
    await savedLogs('DOWNLOAD EMAIL', obj)
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
        {visible == true ? createForm() : null}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>All Email List</strong>{' '}
            <CButton
              color="primary"
              style={{ float: 'right' }}
              onClick={() => {
                setVisible(!visible)
              }}
            >
              Import Data
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

export default AllEmail
