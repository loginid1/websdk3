import { AuthInit } from '../../api/models/AuthInit'
import { CrossAuthMethodsResult } from '../types'

/**
 * Converts the fallback and cross-authentication methods into an object that represents
 * the availability of different authentication methods.
 */
export const convertFallbackMethodsToObj = (authInitRes: AuthInit): CrossAuthMethodsResult => {
  const obj: CrossAuthMethodsResult = {
    ciam: false,
    otp: false,
    'otp:email': false,
    'otp:sms': false,
  }

  const methods = [...authInitRes.crossAuthMethods, ...authInitRes.fallbackMethods]

  const result = methods.reduce((acc, method) => {
    acc[method] = true
    return acc
  }, obj)

  return result
}
