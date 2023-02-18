import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/knowledge',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/knowledge/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/knowledge',
    method: 'put',
    data
  })
}

export function listAllKnowledge() {
  return request({
    url: 'api/knowledge/all',
    method: 'get'
  })
}
export default { add, edit, del }
