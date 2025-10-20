import { fetchData } from "./fetchData.js"
import {isJSON} from "./isJSON.js"

async function getFigletText(text) {
   const data = await fetchData({method: "POST", route: "/figlet", body: text}, "text/plain")
   return data
}

async function transformResponseData(response) {
   const finalText = {routeName: "", text: ""}

   if (response.route) {
      const text = await getFigletText(response.route)
      finalText.routeName = text
   }

   if (!response.data) return isJSON(response) ? JSON.stringify(response) : response
   
   for (const object of response.data) {
      const isArray = Array.isArray(object.body)
      let body = ""

      if (object.title) {
         const title = object.titleSuffix ? `[${object.title.toUpperCase()}] (${object.titleSuffix})\n` : `[${object.title.toUpperCase()}]\n`
         finalText.text += title
      }

      if (isArray) {
         const longestLabel = Math.max(...response.data.reduce((acc, cur) => Array.isArray(cur.body) ? acc = [...acc, ...cur.body] : acc, []).map(item => item.label.length))

         for (let i = 0; i < object.body.length; i++) {
            body = ` ${object.body[i].label.charAt(0).toUpperCase() + object.body[i].label.slice(1).padEnd(longestLabel, " ")}${object.hasColon ? ":" : ""} ${object.body[i].value + (i !== object.body.length - 1 ? "\n" : "\n\n")}`            
            finalText.text += body
         }
      } else {
         body = object.body
         finalText.text += body
      }
   }

   return JSON.stringify(finalText)
}

export { transformResponseData }