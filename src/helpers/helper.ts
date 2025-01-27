import { generateClient } from 'aws-amplify/data'
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
