import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/language',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/language/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/language',
    method: 'put',
    data
  })
}

export function listAllLanguage() {
  return request({
    url: 'api/language/all',
    method: 'get'
  })
}

export default { add, edit, del }
