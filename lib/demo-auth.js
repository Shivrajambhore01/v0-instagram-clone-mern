// Demo authentication using localStorage
export function setDemoAuth(user) {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "demo-auth",
      JSON.stringify({
        user,
        timestamp: Date.now(),
      }),
    )
  }
}

export function getDemoAuth() {
  if (typeof window !== "undefined") {
    const auth = localStorage.getItem("demo-auth")
    if (auth) {
      const parsed = JSON.parse(auth)
      // Check if auth is less than 7 days old
      if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return parsed.user
      } else {
        localStorage.removeItem("demo-auth")
      }
    }
  }
  return null
}

export function clearDemoAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("demo-auth")
  }
}

export function generateDemoId() {
  return "demo_" + Math.random().toString(36).substr(2, 9)
}
