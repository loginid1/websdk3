import {
  doesDeviceSupportPasskeys,
  isConditionalUIAvailable,
  isPlatformAuthenticatorAvailable
} from '.'

const mockedPublicKey = (result = false) => {
  const mocked = {
    isUserVerifyingPlatformAuthenticatorAvailable: jest.fn().mockResolvedValue(result),
  }
  Object.defineProperty(
    window,
    'PublicKeyCredential',
    {value: mocked, writable: true, configurable: true}
  )
}

describe('doesDeviceSupportPasskeys', () => {
  it('should return a message to upgrade the browser if PublicKeyCredential is not available', async () => {
    const result = await doesDeviceSupportPasskeys()
    expect(result.solution).toBe('Your browser seems to be outdated. Please upgrade to the latest version.')
    expect(result.deviceSupported).toBe(false)
  })

  it('should return no needed suggestion and deviceSupported as true if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable returns true', async () => {
    mockedPublicKey(true)
    const result = await doesDeviceSupportPasskeys()
    expect(result.solution).toBe('')
    expect(result.deviceSupported).toBe(true)
  })

  const testCases = [
    [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:70.0) Gecko/20100101 Firefox/70.0',
      'Please update your Firefox browser to the latest version.'
    ],
    [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Please update your Firefox browser to the latest version.'
    ],
    [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.3; rv:122.0) Gecko/20100101 Firefox/122.0',
      'Enable Touch ID on your device.'
    ],
    [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      'Enable Face ID or Touch ID on your device.'
    ],
    [
      'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
      'Enable Face ID or Touch ID on your device.'
    ],
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/120.0.2210.160',
      'Enable Windows Hello on your device. See here: https://support.microsoft.com/en-us/windows/learn-about-windows-hello-and-set-it-up-dae28983-8242-bb2a-d3d1-87c9d265a5f0.'
    ],
    [
      'Mozilla/5.0 (Android 14; Mobile; LG-M255; rv:122.0) Gecko/122.0 Firefox/122.0',
      'Passkeys may not be supported on your Firefox browser. Please switch to a Chromium browser.'
    ],
    [
      'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.101 Mobile Safari/537.36',
      'Enable device unlock via fingerprint, PIN, or facial recognition on your device.'
    ],
    [
      'Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 1320) like Gecko',
      'Enable device unlock features such as fingerprint, PIN, or facial recognition.'
    ],
  ]

  describe.each(testCases)('platform authenticator is not available', (userAgent, expected) => {
    const originalNavigator = window.navigator

    beforeEach(() => {
      Object.defineProperty(
        window,
        'navigator',
        {value: {userAgent}, writable: true, configurable: true}
      )
    })

    afterEach(() => {
      //reset the navigator
      Object.defineProperty(
        window,
        'navigator',
        {value: originalNavigator, configurable: true}
      )
    })

    it(`should return a message to ${expected}`, async () => {
      mockedPublicKey()

      const result = await doesDeviceSupportPasskeys()
      expect(result.solution).toBe(expected)
      expect(result.deviceSupported).toBe(false)
    })
  })
})

describe('isPlatformAuthenticatorAvailable', () => {
  it('should return false if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable does not exist', async () => {
    Object.defineProperty(
      window,
      'PublicKeyCredential',
      {value: {}, writable: true, configurable: true}
    )
    const result = await isPlatformAuthenticatorAvailable()
    expect(result).toBe(false)
  })

  it('should return false if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable returns false', async () => {
    mockedPublicKey(false)
    const result = await isPlatformAuthenticatorAvailable()
    expect(result).toBe(false)
  })

  it('should return true if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable returns true', async () => {
    mockedPublicKey(true)
    const result = await isPlatformAuthenticatorAvailable()
    expect(result).toBe(true)
  })

  it('should return false if PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable throws an error', async () => {
    const mocked = {
      isUserVerifyingPlatformAuthenticatorAvailable: jest.fn().mockRejectedValue(new Error('error')),
    }
    Object.defineProperty(
      window,
      'PublicKeyCredential',
      {value: mocked, writable: true, configurable: true}
    )
    const result = await isPlatformAuthenticatorAvailable()
    expect(result).toBe(false)
  })
})

describe('isConditionalUIAvailable', () => {
  const mockedPublicKey = (result = false) => {
    const mocked = {
      isConditionalMediationAvailable: jest.fn().mockResolvedValue(result),
    }
    Object.defineProperty(
      window,
      'PublicKeyCredential',
      {value: mocked, writable: true, configurable: true}
    )
  }

  it('should return false if PublicKeyCredential.isConditionalUIAvailable does not exist', async () => {
    Object.defineProperty(
      window,
      'PublicKeyCredential',
      {value: {}, writable: true, configurable: true}
    )
    const result = await isConditionalUIAvailable()
    expect(result).toBe(false)
  })

  it('should return false if PublicKeyCredential.isConditionalUIAvailable returns false', async () => {
    mockedPublicKey(false)
    const result = await isConditionalUIAvailable()
    expect(result).toBe(false)
  })

  it('should return true if PublicKeyCredential.isConditionalUIAvailable returns true', async () => {
    mockedPublicKey(true)
    const result = await isConditionalUIAvailable()
    expect(result).toBe(true)
  })

  it('should return false if PublicKeyCredential.isConditionalUIAvailable throws an error', async () => {
    const mocked = {
      isConditionalMediationAvailable: jest.fn().mockRejectedValue(new Error('error')),
    }
    Object.defineProperty(
      window,
      'PublicKeyCredential',
      {value: mocked, writable: true, configurable: true}
    )
    const result = await isConditionalUIAvailable()
    expect(result).toBe(false)
  })
})
