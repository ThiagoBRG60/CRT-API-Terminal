import {uptime} from "node:os"

function showUptimeInHours() {
   const uptimeMilliseconds = new Date(uptime() * 1000)
   const hours = uptimeMilliseconds.getUTCHours()
   const minutes = uptimeMilliseconds.getUTCMinutes()
   const seconds = uptimeMilliseconds.getUTCSeconds()

   return `${hours} hours, ${minutes} minutes and ${seconds} seconds`
}

export { showUptimeInHours }