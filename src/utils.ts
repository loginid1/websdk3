/**
 * The `base64EncodeUrl` method converts `base64` to `base64url`
 * */
const base64EncodeUrl = (str: string) => {
  return str
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * The `btoa` method encodes a string in base-64.
 * This method uses the "A-Z", "a-z", "0-9", "+", "/" and "=" characters to encode the string.
 * */
const b2a = (input: string): string => {
  // If input is empty or undefined, return it as is.
  if (!input) return input

  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  const encodedArray = [] // Array to store encoded characters.
  let inputIndex = 0 // Index for tracking the current position in the input string.

  // Process input string in chunks of 3 characters.
  while (inputIndex < input.length) {
    const char1 = input.charCodeAt(inputIndex++)
    const char2 = input.charCodeAt(inputIndex++)
    const char3 = input.charCodeAt(inputIndex++)

    // Combine three characters into a single 24-bit value.
    const combined = (char1 << 16) | (char2 << 8) | char3

    // Extract individual 6-bit values and map to base64 characters.
    encodedArray.push(
      base64Chars[(combined >> 18) & 63] +
			base64Chars[(combined >> 12) & 63] +
			base64Chars[(combined >> 6) & 63] +
			base64Chars[combined & 63]
    )
  }

  // Join the array of encoded characters into a single string.
  const result = encodedArray.join('')

  // Calculate padding based on the input length.
  const padding = input.length % 3

  // Add appropriate padding characters (if needed) to meet base64 requirements.
  return padding ? result.slice(0, padding - 3) + '==='.slice(padding || 3) : result
}

/**
 * The `atob` method decodes a base-64 encoded string.
 * This method decodes a string of data which has been encoded by the `btoa` method.
 * */
const a2b = (input: string): string => {
  // Define the base64 character set and create a lookup table.
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  const charToValueMap: {[char: string]: number} = {}
  const fromCharCode = String.fromCharCode

  // Create a lookup table that maps base64 characters to their numeric values.
  for (let i = 0; i < 64; i++) {
    charToValueMap[base64Chars.charAt(i)] = i
  }

  let accumulator = 0 // Accumulator for storing bits.
  let accumulatorBits = 0 // Number of bits in the accumulator.
  let decodedString = '' // The resulting decoded string.

  // Iterate through each character in the input base64 string.
  for (const char of input) {
    const charValue = charToValueMap[char]

    // Check if the character is a valid base64 character.
    if (charValue !== undefined) {
      accumulator = (accumulator << 6) + charValue // Add the value to the accumulator.
      accumulatorBits += 6 // Increase the bit count.

      // When there are 8 or more bits in the accumulator, convert to a character.
      while (accumulatorBits >= 8) {
        // Extract the lowest 8 bits from the accumulator, convert to a character, and append to the result.
        decodedString += fromCharCode((accumulator >> (accumulatorBits -= 8)) & 255)
      }
    }
  }

  // Return the decoded string.
  return decodedString
}

/**
 * Convert `string` into `base64` checking if the `btoa` method
 * is available for HTML+JS implementation compatibility.
 * */
const bufferToBase64Url = (data: ArrayBuffer) => {
  let binary = ''
  const bytes = new Uint8Array(data)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  const base64 = b2a(binary)
  return base64EncodeUrl(base64)
}

/**
 * Convert `base64` into `Uint8Array`
 * */
const base64UrlToBuffer = (data: string): ArrayBuffer => {
  data = data.replace(/-/g, '+').replace(/_/g, '/')
  const binary = a2b(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes.buffer
}

/**
 * Generate a UUID using the `crypto.randomUUID` method if available,
 * otherwise use the `window.crypto.getRandomValues` method.
 * */
const createUUID = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Technically, this is not a UUID, but it's good enough for our purposes
  // This goes back to 2010's so it's safe to use
  return window.crypto.getRandomValues(new Uint32Array(4)).join('-')
}

/**
 * Along with traditional OO hierarchies, another popular way of building up classes from 
 * reusable components is to build them by combining simpler partial classes.
 * https://www.typescriptlang.org/docs/handbook/mixins.html
 * */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyMixins = (derivedCtor: any, constructors: any[]) => {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
      )
    })
  })
}

/**
 * Parse JWT to decode and access its variables
 * @param {string} token The jwt token that will be parsed
 * @returns 
 */
const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}

/**
 * Used to access a specific cookie
 * @param {string} name The name of the targetted cookie
 * @returns 
 */
const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts && parts.length === 2) {
    return parts.pop()!.split(';').shift()
  }
}

/**
 * Used to set a cookie on the browser
 * @param {string} cookie The full cookie string
 */
const setCookie = (cookie: string) => {
  document.cookie = cookie
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=${new Date()}`
}

export {
  a2b,
  applyMixins,
  b2a,
  bufferToBase64Url,
  base64UrlToBuffer,
  createUUID,
  deleteCookie,
  getCookie,
  parseJwt,
  setCookie,
}
