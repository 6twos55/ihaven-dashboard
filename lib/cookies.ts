// Client-side cookie management
export function setCookie(name: string, value: string, options: any = {}) {
  const cookieOptions = {
    path: "/",
    ...options,
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (cookieOptions.expires) {
    if (cookieOptions.expires instanceof Date) {
      cookieString += `; expires=${cookieOptions.expires.toUTCString()}`
    }
  }

  if (cookieOptions.path) {
    cookieString += `; path=${cookieOptions.path}`
  }

  if (cookieOptions.domain) {
    cookieString += `; domain=${cookieOptions.domain}`
  }

  if (cookieOptions.secure) {
    cookieString += "; secure"
  }

  if (cookieOptions.sameSite) {
    cookieString += `; samesite=${cookieOptions.sameSite}`
  }

  document.cookie = cookieString
}

export function getCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + "="
  const ca = document.cookie.split(";")

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
  }

  return null
}

export function deleteCookie(name: string, path = "/") {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}
