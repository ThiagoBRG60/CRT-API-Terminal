import { isJSON } from "./isJSON.js"

async function fetchData(fetchInfo, mimeType) {
   const config = {method: fetchInfo.method}
   const response = await fetch(`http://localhost:3000${fetchInfo.route}`, fetchInfo.body ? {...config, headers: {"content-type": mimeType}, body: isJSON(JSON.stringify(fetchInfo.body)) ? JSON.stringify(fetchInfo.body) : fetchInfo.body} : config)
   const contentType = response.headers.get("content-type")

   if (contentType.includes("text/plain")) return await response.text()

   return await response.json()
}

export { fetchData }