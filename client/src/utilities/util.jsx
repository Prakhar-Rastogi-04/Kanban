
const dateFormatter = (date, type) => {
    let formattedDate;
    let formatter ;
      const dateLength = type | 'long'
      if(type === 'short') {
        formattedDate = new Intl.DateTimeFormat('en-IN').format(date)
      } else if(type=== 'medium') {
          formatter = new Intl.DateTimeFormat('en-IN', { year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric"
                  })
          formattedDate = formatter.format(date)
      } else {
        formatter = new Intl.DateTimeFormat('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour:'numeric',
          minute: 'numeric'
        });
        formattedDate =formatter.format(date);
      }
      
      console.log(formattedDate);
      return formattedDate
}

const pageReload = () => {
  window.location.reload();
}

const getAccessTokenFromSession = () => {
  console.log('window.sessionStorage.getItem  ',window.sessionStorage.getItem('accessToken'))
  return window.sessionStorage.getItem('accessToken')
}

const removeAccessToken = () =>{
  window.sessionStorage.removeItem('accessToken')
}

const addSessionVariable = (res, isLoggedin) => {
  window.sessionStorage.setItem('userId', res.data._id);
  window.sessionStorage.setItem('fname', res.data.firstName);
  window.sessionStorage.setItem('lname', res.data.lastName);
  window.sessionStorage.setItem('permission', res.data.permission);
  window.sessionStorage.setItem('accessToken', res.data.accessToken);
  window.sessionStorage.setItem('isLoggedin', isLoggedin);
}

const getValFromSession = (prop) => {
  return window.sessionStorage.getItem(prop);
}

const clearSessionStorage = () => {
  window.sessionStorage.clear();
}



export { dateFormatter, pageReload , getAccessTokenFromSession ,removeAccessToken , addSessionVariable, getValFromSession, clearSessionStorage};
