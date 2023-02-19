import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/executeResult',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/executeResult/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/executeResult',
    method: 'put',
    data
  })
}

export function listAllExecuteResult() {
  return request({
    url: 'api/executeResult/all',
    method: 'get'
  })
}
export default { add, edit, del }
