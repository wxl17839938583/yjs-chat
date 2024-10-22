import axios,{AxiosError, AxiosResponse } from "axios";
import * as nProgress from "nprogress";
import 'nprogress/nprogress.css'

const request = axios.create({
  timeout: 50000,
  method: 'get'
});
request.interceptors.request.use(
  function (config) {
    nProgress.start()
    return config
  },
  function (error) {
    nProgress.done()
    return Promise.reject(error)
  }
)
request.interceptors.response.use(
  function (data: AxiosResponse<any>) {
    nProgress.done()
    return data.data
  },
  function (error: AxiosError<any>) {
    nProgress.done()
    return Promise.reject(error)
  }
)
export default request;