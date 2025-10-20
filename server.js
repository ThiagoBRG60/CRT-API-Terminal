import {createServer} from "node:http"
import {createReadStream, existsSync} from "node:fs"
import {pipeline} from "node:stream/promises"
import {extname, join} from "node:path"
import {routes} from "./data/apiRoutes.js"
import {mimeTypes} from "./data/mimeTypes.js"
import {transformResponseData} from "./utils/transformResponseData.js"
import {isJSON} from "./utils/isJSON.js"

function returnResponse(res, statusCode, mimeType, content) {
   const json = mimeType === "application/json"

   res.writeHead(statusCode, {"content-type": `${mimeType};charset=utf-8`})
   content ? res.end(json ? JSON.stringify(content) : content) : res.end()
}

function responseMiddleware(res) {
   const originalResponse = res.end

   res.end = async function(chunk, encoding, callback) {
      const parsedChunk = isJSON(chunk) ? JSON.parse(chunk) : chunk
      const transformedData = await transformResponseData(parsedChunk)
      return originalResponse.call(res, transformedData, encoding, callback)
   }
}

const server = createServer(async (req, res) => {
   try {
      const url = new URL(`http://${req.headers.host + req.url}`)
      const route = routes[req.method][url.pathname]
      let paramsObj = null
      
      if (url.search) paramsObj = Object.fromEntries(url.searchParams)
         
      if (route) {
         responseMiddleware(res)
         route(req, res, paramsObj)
      } else {
         const file = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname)

         if (extname(file)) {
            let rootPath = join(import.meta.dirname, "/public")
            const fileExtension = extname(file)
   
            if (!existsSync(rootPath + file)) rootPath = import.meta.dirname
   
            if (file.startsWith("/.well-known")) {
               returnResponse(res, 204)
               return
            }
   
            const readStream = createReadStream(rootPath + file)
            readStream.on("open", () => res.writeHead(200, {"content-type": `${mimeTypes[fileExtension]};charset=utf-8`}))
            await pipeline(readStream, res)
         } else {
            throw Error
         }
      }
   } catch (error) {
      responseMiddleware(res)
      returnResponse(res, 404, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "Route not found or method not allowed, please try again."}]}]})
   }
})

server.listen(3000)

export {returnResponse}