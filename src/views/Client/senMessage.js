import React, { useRef } from 'react'
import {
  CCard,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { Alert, Spinner, Table } from 'flowbite-react'
import { generateClient } from 'aws-amplify/data'
import { useEffect } from 'react'
import { useState } from 'react'
import { IMaskMixin } from 'react-imask'
import { useNavigate } from 'react-router-dom'
import { savedLogs, showErrorMessage, showSuccessMessage } from '../../helpers/helper'
import Select from 'react-select'
import axios from 'axios'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput {...props} ref={inputRef} />
))
const client = generateClient()
const SendMessage = () => {
  const [categories, setCategory] = useState([])
  const [companyList, setCompanyList] = useState([
    { label: 'IADSR', value: 'IADSR' },
    { label: 'Dental Services', value: 'Dental Services' },
    { label: 'Fission Monster', value: 'Fission Monster' },
  ])
  const [phoneList, setPhoneList] = useState([])
  const [state, setSate] = useState({
    emails: [],
    company: '',
    batch: '',
    subject: 'hi',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [id, setID] = useState('')
  const [error, setError] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([])
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  // Function to handle file upload reset
  const handleReset = () => {
    // Reset the input field by setting its value to an empty string
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  useEffect(() => {
    const sub = client.models.Client.observeQuery({ limit: 50000 }).subscribe({
      next: ({ items }) => {
        setCategory([...items])
        // setFilterItem([...items])
      },
    })

    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    let EmailArray = []
    let records = JSON.parse(localStorage.getItem('cats')).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    console.log(records)

    records.forEach((item, j) => {
      const chunkSize = 50
      let catValue = categories.filter((rec) => rec.category_id === item.name)
      let no = 0
      for (let i = 0; i < catValue.length; i += chunkSize) {
        no++
        console.log(catValue.length, item.name)
        const chunk = catValue.slice(i, i + chunkSize)
        let obj = {
          value: `${item.name} Batch ${no}`,
          label: `${item.name} Batch ${no}`,
          phone_numbers: chunk,
        }
        EmailArray.push(obj)
      }
    })
    setPhoneList(EmailArray)
    console.log(EmailArray, 'EmailArray')
  }, [categories])

  const removeItem = () => {
    const uniqueArray = selectedOptions.filter((value, index) => {
      const _value = JSON.stringify(value)
      return (
        index ===
        selectedOptions.findIndex((obj) => {
          return JSON.stringify(obj) === _value
        })
      )
    })

    return uniqueArray
  }

  const editRecord = (record) => {
    setVisible(true)
    setID(record.toID)
    setName(record.name)
  }
  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const updateState = () => {
    setSate({
      emails: [],
      company: '',
      batch: '',
      subject: '',
      message: '',
    })
  }

  const saveDate = async () => {
    if (selectedOptions.length === 0) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }

    if (!state.message.trim()) {
      setError('This field is required.')
      return
    } else {
      setError('')
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    let obj = {
      ...state,
      phone_numbers: JSON.stringify(selectedOptions),
      file: file,
    }

    console.log(formData)
    // return
    updateState()
    try {
      await axios
        .post('https://cms.fissionmonster.com/api/send/message', obj)
        .then(async (response) => {
          if (response.data.status === true) {
            setSelectedOptions([])
            setLoading(false)
            showSuccessMessage('Message Send Successfully!')
          }
          let object = {
            message: `WhatsApp Message Send to ${obj.batch}`,
          }

          await savedLogs('WhatsApp Message EMAIL', object)

          updateState()
          setFile(null)
          handleReset()
        })
    } catch {
      console.log('error')
      setLoading(false)
      showErrorMessage('Message Not Send!')
    }
  }
  const onChangeCompany = (e) => {
    // let email = e.clipboardData.getData('Text')

    setSate({
      ...state,
      company: e.value,
    })
  }

  const onChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions.phone_numbers)
    console.log(selectedOptions.value)
    setSate({
      ...state,
      batch: selectedOptions.label,
    })
  }

  const handleModelChange = (e) => {
    setSate({ ...state, message: e })
  }
  const handleFileChange = (e) => {
    if (e.target.files) {
      // setFile(e.target.files[0])
      convertToBase64(e.target.files[0])
    }
  }
  const convertToBase64 = (selectedFile) => {
    const reader = new FileReader()

    reader.readAsDataURL(selectedFile)

    reader.onload = () => {
      console.log('called: ', reader.result)
      setFile(reader.result)
    }
  }
  const createForm = () => {
    return (
      <>
        <CCard className="mb-4" style={{ width: '60%', margin: '0 auto' }}>
          <CCardHeader>
            <strong>Send WhatsApp Message</strong>
          </CCardHeader>
          <CForm>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInputCompany" style={{ width: '100%' }}>
                Select Company
              </CFormLabel>
              <Select
                onChange={onChangeCompany}
                value={{ label: state.company }}
                options={companyList}
              />
              <p style={{ color: 'red' }}>{!state.company ? error : ''}</p>
            </div>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInputBatch" style={{ width: '100%' }}>
                Select Contact Batch
              </CFormLabel>
              <Select onChange={onChange} value={{ label: state.batch }} options={phoneList} />
              <p style={{ color: 'red' }}>{!state.batch ? error : ''}</p>
            </div>
            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInput1">Add File</CFormLabel>
              <CFormInput
                type="file"
                id="exampleFormControlInput1"
                name="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                placeholder="Add File"
              />
              {/* <p style={{ color: 'red' }}>{!state.address ? error : ''}</p> */}
            </div>

            <div className="m-3">
              <CFormLabel htmlFor="exampleFormControlInput1">Message</CFormLabel>
              {/* <ReactQuill theme="snow" value={state.message} onChange={handleModelChange} /> */}
              <CFormTextarea
                id="exampleFormControlTextarea1"
                // label="Example textarea"
                rows={3}
                value={state.message}
                onChange={(e) => setSate({ ...state, message: e.target.value })}
                text="Must be 8-20 words long."
              ></CFormTextarea>
            </div>
            <div className="m-3">
              <div className="d-grid gap-2 col-6 mx-auto">
                <CButton color="primary" style={{ marginTop: '4%' }} onClick={() => saveDate()}>
                  {loading === true ?? <Spinner as="span" animation="grow" />}
                  {loading ? ' ...Saving Record' : id ? 'Update' : 'Submit'}
                </CButton>
              </div>
            </div>
          </CForm>
        </CCard>
      </>
    )
  }
  return (
    <CRow>
      <CCol xs={12}>{createForm()}</CCol>
    </CRow>
  )
}

export default SendMessage
