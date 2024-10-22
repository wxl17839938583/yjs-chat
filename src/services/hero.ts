import request from './request'
import { Hero } from '@/types'

export default {
  getList():Promise<Hero[]>{
    return request('/herolist')
  },
}