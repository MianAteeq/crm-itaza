import { generateClient } from 'aws-amplify/data'
import {  Bounce, toast } from 'react-toastify';
const client = generateClient()




export const getCats = async () => {
  const { data: items, errors } = await client.models.Category.list()

  return items
};
export const savedLogs = async (type,obj) => {
  const { errors, data: newTodo } = await client.models.Log.create({
    category_id: 'Logs',
    email: localStorage.getItem('email'),
    date:new Date().toLocaleDateString(),
    time:new Date(new Date().getTime() + 4*60*60*1000).toLocaleTimeString(),
    logType:type,
    logObject:JSON.stringify(obj)
  })
};
export const getRoleStatusView = (role) => {
  if(role==='UPLOADER'){

    return false;

  }else{
    return true;
  }
};
export const getRoleStatusDownload = (role) => {
  if(role==='ADMIN'){

    return true;

  }else{
    return false;
  }
};
export const showSuccessMessage = (message) => {
 return(
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    })
 )
};
export const showErrorMessage = (message) => {
 return(
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    })
 )
};
