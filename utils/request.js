/**
 * 统一网络请求封装（uni.request / uni.uploadFile）
 *
 * 后端地址优先取环境变量 VITE_API_BASE_URL，未配置时默认本机 8080。
 */

const BASE_URL = (import.meta.env && import.meta.env.VITE_API_BASE_URL) || 'http://localhost:8080'

/** 带 HTTP 状态码的错误，便于调用方区分 404 等场景 */
export class HttpError extends Error {
  constructor(message, statusCode = 0, data = null) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.data = data
  }
}

/** uploadFile 返回的 data 是字符串，这里统一解析成对象 */
const parseBody = (raw) => {
  if (typeof raw !== 'string') return raw
  try {
    return JSON.parse(raw)
  } catch (e) {
    return raw
  }
}

const errorMessageOf = (body, fallback) => {
  if (body && typeof body === 'object' && body.message) return body.message
  return fallback
}

const networkErrorOf = (err) => {
  const msg = (err && err.errMsg) || ''
  if (msg.includes('timeout')) return '请求超时，请稍后重试'
  return '无法连接后端服务，请确认后端已在 8080 端口启动'
}

export function request({ url, method = 'GET', data, header = {}, timeout = 30000 }) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      timeout,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        const body = parseBody(res.data)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body)
          return
        }
        reject(new HttpError(
          errorMessageOf(body, `请求失败（HTTP ${res.statusCode}）`),
          res.statusCode,
          body
        ))
      },
      fail: (err) => reject(new HttpError(networkErrorOf(err)))
    })
  })
}

export const get = (url, data) => request({ url, method: 'GET', data })
export const post = (url, data) => request({ url, method: 'POST', data })

/**
 * 文件上传（H5 下 filePath 可传 uni.chooseFile 返回的 tempFilePaths[i]）
 */
export function uploadFile(url, filePath, { name = 'file', formData = {} } = {}) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      formData,
      success: (res) => {
        const body = parseBody(res.data)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body)
          return
        }
        reject(new HttpError(
          errorMessageOf(body, `上传失败（HTTP ${res.statusCode}）`),
          res.statusCode,
          body
        ))
      },
      fail: (err) => reject(new HttpError(networkErrorOf(err)))
    })
  })
}

export { BASE_URL }
export default request
