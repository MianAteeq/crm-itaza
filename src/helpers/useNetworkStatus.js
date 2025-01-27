import * as React from 'react'

const getOnLineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true

const useNetworkStatus = () => {
  const [status, setStatus] = React.useState(getOnLineStatus())

  const setOnline = () => setStatus(true)
  const setOffline = () => setStatus(false)
  console.log(status)
  React.useEffect(() => {
    window.addEventListener('online', setOnline)
    window.addEventListener('offline', setOffline)

    return () => {
      window.removeEventListener('online', setOnline)
      window.removeEventListener('offline', setOffline)
    }
  }, [])

  return status
}
export default useNetworkStatus
