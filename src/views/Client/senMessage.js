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
  CSpinner,
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
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from 'mdb-react-ui-kit'

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
  const [pageLoading, setPageLoading] = useState(true)
  const [id, setID] = useState('')
  const [error, setError] = useState('')
  const [selectedOptions, setSelectedOptions] = useState([])
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [waInstance, setWaInstance] = useState({
    instanceId: '',
    displayName: '',
    contactId: '',
    formattedNumber: '',
  })

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

    getWaData()
    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    let EmailArray = []
    let records = JSON.parse(localStorage.getItem('cats')).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    // console.log(records)

    records.forEach((item, j) => {
      const chunkSize = 100
      let catValue = categories.filter((rec) => rec.category_id === item.name)
      console.log(catValue, 'catValue', item.name)
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

  const updateState = () => {
    setSate({
      emails: [],
      company: '',
      batch: '',
      subject: '',
      message: '',
    })
  }

  const getWaData = async () => {
    await axios.get('https://iadsr.fissionmonster.com/api/get/wa/status').then(async (response) => {
      if (response.data.status === true) {
        let res = response.data
        setWaInstance({
         instanceId: res.me.instanceId,
          displayName: res.me.displayName,
          contactId: res.me.contactId,
          formattedNumber: res.me.formattedNumber,
        })
        setPageLoading(false)
      }else{
          setPageLoading(false)
      }
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
        .post('https://iadsr.fissionmonster.com/api/send/message', obj)
        .then(async (response) => {
          if (response.data.status === true) {
            setSelectedOptions([])
            setLoading(false)
            showSuccessMessage('Message Send Successfully!')
            let object = {
              message: `WhatsApp Message Send to ${obj.batch}`,
            }

            await savedLogs('WhatsApp Message', object)

            updateState()
            setFile(null)
            handleReset()
          }

          if (response.data.status === false) {
            // setSelectedOptions([])
            setLoading(false)
            showSuccessMessage(response.data.message)
          }
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
        <CCard className="mb-4" style={{ width: '100%', margin: '0 auto' }}>
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
  const whatsAppLogout = async () => {
    setPageLoading(true)
    // return
    const response = await axios.get('https://iadsr.fissionmonster.com/api/wa/logout')

    if (response.data.status === true) {
      showSuccessMessage('WhatsApp Logout Successfully!')
      localStorage.setItem('wa_status', false)
      setPageLoading(false)
    }
  }
  return (
    <CRow>
      {pageLoading === true ? (
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      ) : (
        <CCol xs={12}>
          {' '}
          <section style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="py-5">
              <MDBRow>
                <MDBCol lg="4">
                  <MDBCard className="mb-4">
                    <MDBCardBody className="text-center">
                      <MDBCardImage
                        src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                        alt="avatar"
                        className="rounded-circle"
                        style={{ width: '150px', margin: '0 auto' }}
                        fluid
                      />
                      <h5
                        className="text-muted mb-1 my-3"
                        style={{ color: 'black !important', fontSize: '1.3rem' }}
                      >
                        {waInstance?.displayName}
                      </h5>
                      <div className="d-flex justify-content-center mb-2">
                        <CButton
                          color="primary"
                          style={{ backgroundColor: 'red', border: 'red' }}
                          onClick={() => whatsAppLogout()}
                        >
                          Logout
                        </CButton>
                      </div>
                    </MDBCardBody>
                  </MDBCard>

                  <MDBCard className="mb-4">
                    <MDBCardBody>
                      <MDBRow>
                        <MDBCol sm="5">
                          <MDBCardText>Display Name</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="7">
                          <MDBCardText className="text-muted">
                            {waInstance?.displayName}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="5">
                          <MDBCardText>Status</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="7">
                          <MDBCardText className="text-muted">
                            <span className="success">Active</span>
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="5">
                          <MDBCardText>Phone</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="7">
                          <MDBCardText className="text-muted">
                            {waInstance?.formattedNumber}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="5">
                          <MDBCardText>instance ID</MDBCardText>
                        </MDBCol>
                        <MDBCol sm="7">
                          <MDBCardText className="text-muted">{waInstance?.instanceId}</MDBCardText>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
                <MDBCol lg="8">
                  <MDBRow>
                    <MDBCol md="12">{createForm()}</MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </section>
        </CCol>
      )}
    </CRow>
  )
}

export default SendMessage
