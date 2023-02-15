import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/problem',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/problem/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/problem',
    method: 'put',
    data
  })
}
export function listAllProblem() {
  return request({
    url: 'api/problem/all',
    method: 'get'
  })
}

export default { add, edit, del }
