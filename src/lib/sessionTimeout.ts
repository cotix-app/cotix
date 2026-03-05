import { logout } from "./auth"

let timeout: any

export function startSessionTimeout() {

  const resetTimer = () => {

    clearTimeout(timeout)

    timeout = setTimeout(async () => {
      await logout()
      window.location.href = "/login"
    }, 1 * 60 * 1000) // 10 minutos

  }

  window.addEventListener("mousemove", resetTimer)
  window.addEventListener("keydown", resetTimer)
  window.addEventListener("click", resetTimer)

  resetTimer()

}