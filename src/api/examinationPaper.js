import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/examinationPaper',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/examinationPaper/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/examinationPaper',
    method: 'put',
    data
  })
}
export function listAllExaminationPaper() {
  return request({
    url: 'api/examinationPaper/all',
    method: 'get'
  })
}
export default { add, edit, del }
