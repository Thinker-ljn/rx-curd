import Tree from 'src/tree';
import Axios, { AxiosError, AxiosResponse } from 'axios'
import Root from 'src/root';
import { Packet } from 'src/http';
import { Method } from 'src/branch';
const tree = new Tree({
  http: Axios,
})

const ROUTE_PREFIX = '/api/'
function isError (response: AxiosError | AxiosResponse): response is AxiosError {
  return !Reflect.get(response, 'status')
}

function generatePacket<T> (response: AxiosResponse<T>): Packet<T> {
  if (isError(response)) {
    response = response.response as AxiosResponse<T>
  }
  const {data, config, status} = response
  const {url = '', params} = config
  const api = url.replace(/^\/?api\//, '')
  const namespace = api.replace(/([^\/\?]+)([\/\?\#\:]?.*)/, '$1')
  const packet: Packet<T> = {
    namespace,
    api,
    data,
    method: config.method as Method,
    status,
  }

  if (params && params.__key__) { packet.__key__ = params.__key__ }
  return packet
}

function useInterceptor (root: Root) {
  const axios = root.tree.http
  axios.defaults.baseURL = ROUTE_PREFIX
  axios.interceptors.response.use((response: AxiosResponse) => {
    root.next(generatePacket(response))
    return response
  }, (error: AxiosResponse) => {
    root.next(generatePacket(error))
    return Promise.reject(error)
  })
}

useInterceptor(tree.root)