import { logout } from "./auth"

let timeout: any

export function startSessionTimeout() {

  const resetTimer = () => {

    clearTimeout(timeout)

    timeout = setTimeout(async () => {
      await logout()
      window.location.href = "/login"
    }, 60 * 60 * 1000) // 10 minutos

  }

  const events=
  ["mousemove","keydown","click","touchstart"]
   events.forEach(event => window.addEventListener(event,resetTimer))

  resetTimer()

}