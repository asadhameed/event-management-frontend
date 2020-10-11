import Axios from 'axios';

 const api= Axios.create({
     baseURL:'https://sport-event-api.herokuapp.com/'
     //baseURL:'http://192.168.10.3:8000'
 })

 export default api