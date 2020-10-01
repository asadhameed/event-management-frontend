import Axios from 'axios';

 const api= Axios.create({
     baseURL:'http://localhost:8000'
     //baseURL:'http://192.168.10.3:8000'
 })

 export default api