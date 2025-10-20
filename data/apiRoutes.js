import {readdirSync, statSync, createReadStream, createWriteStream, existsSync} from "node:fs"
import {rm} from "node:fs/promises"
import {basename, dirname, extname, join, resolve} from "node:path"
import {createHash} from "node:crypto"
import {cpus, totalmem, freemem, version} from "node:os"
import {pipeline} from "node:stream/promises"
import {createGzip, createGunzip} from "node:zlib"
import {returnResponse} from "../server.js"
import {formatBytes} from "../utils/formatBytes.js"
import {showUptimeInHours} from "../utils/showUptimeInHours.js"
import figlet from "figlet"

const routes = {
   "GET": {
      "/files": (req, res, params) => {
         const paramsObj = params

         if (paramsObj !== null && paramsObj.path && paramsObj.path.startsWith("./")) {
            try {
               const fullPath = extname(paramsObj.path) ? resolve(dirname(paramsObj.path)) : resolve(paramsObj.path)
               const directory = basename(fullPath)
               const files = readdirSync(fullPath)

               const filesInfo = files.reduce((acc, cur, index) => {
                  const filePath = join(fullPath, cur)
                  const fileStats = statSync(filePath)
                  const symbol = index !== files.length - 1 ? "├─" : "└─"

                  if (fileStats.isFile()) {
                     return acc = {...acc, fileCount: acc.fileCount += 1, data: [...acc.data, {label: `${symbol} ${cur}`, value: formatBytes(fileStats.size)}]}
                  } else {
                     const folderFiles = readdirSync(filePath, {recursive: true})
                     const folderSize = folderFiles.reduce((innerAcc, innerCur) => {
                        const folderStats = statSync(join(filePath, innerCur))
                        return innerAcc += folderStats.size
                     }, 0)

                     return acc = {...acc, folderCount: acc.folderCount += 1, data: [...acc.data, {label: `${symbol} ${cur}`, value: formatBytes(folderSize)}]}
                  }
               }, {folderCount: 0, fileCount: 0, data: []})

               const responseObj = {route: "files", data: [{title: directory, titleSuffix: `${filesInfo.folderCount === 0 ? "" : filesInfo.folderCount} ${filesInfo.folderCount === 0 ? "" : filesInfo.folderCount > 1 ? "folders" : "folder"} ${filesInfo.folderCount > 0 ? "and" : ""} ${filesInfo.fileCount === 0 ? "" : filesInfo.fileCount} ${filesInfo.fileCount === 0 ? "" : filesInfo.fileCount > 1 ? "files" : "file"}`.trim(), hasColon: false, body: filesInfo.data}]}
               returnResponse(res, 200, "application/json", responseObj)
            } catch (error) {
               returnResponse(res, 404, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "File or folder not found, please try again."}]}]})
            }
         } else {
            returnResponse(res, 400, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "Please include a valid 'path' param on your GET request."}]}]})
         }
      },
      "/file": async (req, res, params) => {
         const paramsObj = params

         if (paramsObj !== null && paramsObj.path && paramsObj.path.startsWith("./")) {
            try {
               const fullPath = resolve(paramsObj.path)

               if (existsSync(fullPath) && Boolean(extname(fullPath))) {
                  const fileInfo = [{label: "name", value: basename(fullPath)}, {label: "path", value: join(basename(dirname(fullPath)), basename(fullPath))}]
   
                  const contentPromise = new Promise((resolve, reject) => {
                     const readStream = createReadStream(fullPath)
                     let content = ""
                     readStream.on("open", () => res.writeHead(200, {"content-type": `${extname(fullPath) === ".txt" ? "text/plain" : "application/octet-stream"};charset=utf-8`}))
                     readStream.on("data", (chunk) => content += chunk.toString())
                     readStream.on("end", () => resolve(content))
                     readStream.on("error", (err) => reject(err))
                  })
   
                  const fileContent = await contentPromise
                  const responseObj = {route: "file", data: [{title: "info", hasColon: true, body: fileInfo}, {title: "content", hasColon: false, body: fileContent}]}
                  res.end(JSON.stringify(responseObj))
               } else {
                  throw Error
               }
            } catch (error) {
               returnResponse(res, 404, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "File not found, please try again."}]}]})
            }
         } else {
            returnResponse(res, 400, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "Please include a valid 'path' param on your GET request."}]}]})
         }
      },
      "/hash": async (req, res, params) => {
         const paramsObj = params

         if (paramsObj !== null && paramsObj.path && paramsObj.path.startsWith("./")) {
            try {
               const fullPath = resolve(paramsObj.path)
               const hashInfo = [{label: "file", value: basename(fullPath)}, {label: "path", value: join(basename(dirname(fullPath)), basename(fullPath))}, {label: "algorithm", value: "SHA-256"}]
               const hash = createHash("sha256")

               await pipeline(createReadStream(fullPath), hash)
               const responseObj = {route: "hash", data: [{title: "info", hasColon: true, body: hashInfo}, {title: "content", hasColon: true, body: [{label: "hash", value: hash.digest("hex")}]}]}
               returnResponse(res, 200, "application/json", responseObj)
            } catch (error) {
               returnResponse(res, 404, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "File not found, please try again."}]}]})
            }
         } else {
            returnResponse(res, 400, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "Please include a valid 'path' param on your GET request."}]}]})
         }
      },
      "/system": (req, res, params) => {
         const cpuInfo = [{label: "threads", value: cpus().length}, {label: "model", value: cpus()[0].model.trim()}]
         const memoryInfo = [{label: "total", value: formatBytes(totalmem())}, {label: "free", value: formatBytes(freemem())}]
         const osInfo = [{label: "version", value: version()}, {label: "uptime", value: showUptimeInHours()}]
         const responseObj = {route: "system", data: [{title: "cpu", hasColon: true, body: cpuInfo}, {title: "memory", hasColon: true, body: memoryInfo}, {title: "os", hasColon: true, body: osInfo}]}

         returnResponse(res, 200, "application/json", responseObj)
      }
   },
   "POST": {
      "/compress": async (req, res, params) => {
         try {
            let body = []

            req.on("data", (chunk) => body.push(chunk))
            req.on("end", () => {
               const {name, size, content} = JSON.parse(body)
               const fileContent = Buffer.from(content, "base64")
               const startTime = Date.now()
               const fileInfo = [{label: "file", value: name}, {label: "original size", value: formatBytes(size)}]
               const gzip = createGzip()
               let compressedChunks = []

               gzip.on("data", (chunk) => compressedChunks.push(chunk))
               gzip.on("error", () => {
                  returnResponse(res, 500, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "There was an error during the compression of the file."}]}]})
                  return
               })
               gzip.on("end", () => {
                  const compressedContent = Buffer.concat(compressedChunks)
                  const filePath = resolve(join("./temp", `${name}.gz`))
                  const writeStream = createWriteStream(filePath)
                  const endTime = Date.now()
                  const algorithmInfo = [{label: "format", value: "GZIP"}, {label: "algorithm", value: "DEFLATE"}, {label: "time", value: `${(endTime - startTime) / 1000} seconds`}]
                  const responseObj = {route: "compress", data: [{title: "compression", hasColon: true, body: [...fileInfo, {label: "compressed size", value: formatBytes(compressedContent.byteLength)}, ...algorithmInfo]}, {title: "status", hasColon: true, body: [{label: "message", value: "The file was successfully compressed!"}]}]}

                  writeStream.write(compressedContent)
                  writeStream.end()

                  setTimeout(async () => {if (existsSync(filePath)) await rm(filePath)}, 30000)
                  returnResponse(res, 200, "application/json", responseObj)
               })

               gzip.write(fileContent)
               gzip.end()
            })
         } catch (error) {
            returnResponse(res, 500, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "There was an error during the compression of the file."}]}]})
         }
      },
      "/decompress": async (req, res, params) => {
         try {
            let body = []

            req.on("data", (chunk) => body.push(chunk))
            req.on("end", () => {
               const {name, size, content} = JSON.parse(body)
               const fileContent = Buffer.from(content, "base64")
               const startTime = Date.now()
               const fileInfo = [{label: "file", value: name}, {label: "original size", value: formatBytes(size)}]
               const gunzip = createGunzip()
               let compressedChunks = []

               gunzip.on("data", (chunk) => compressedChunks.push(chunk))
               gunzip.on("error", () => {
                  returnResponse(res, 500, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "There was an error during the decompression of the file."}]}]})
                  return
               })
               gunzip.on("end", () => {
                  const compressedContent = Buffer.concat(compressedChunks)
                  const filePath = resolve(join("./temp", `${name.split(".gz")[0]}`))
                  const writeStream = createWriteStream(filePath)
                  const endTime = Date.now()
                  const algorithmInfo = [{label: "format", value: "GZIP"}, {label: "algorithm", value: "INFLATE"}, {label: "time", value: `${(endTime - startTime) / 1000} seconds`}]
                  const responseObj = {route: "decompress", data: [{title: "decompression", hasColon: true, body: [...fileInfo, {label: "decompressed size", value: formatBytes(compressedContent.byteLength)}, ...algorithmInfo]}, {title: "status", hasColon: true, body: [{label: "message", value: "The file was successfully decompressed!"}]}]}
                  
                  writeStream.write(compressedContent)
                  writeStream.end()
                  
                  setTimeout(async () => {if (existsSync(filePath)) await rm(filePath)}, 30000)
                  returnResponse(res, 200, "application/json", responseObj)
               })

               gunzip.write(fileContent)
               gunzip.end()
            })
         } catch (error) {
            returnResponse(res, 500, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "There was an error during the decompression of the file."}]}]})
         }
      },
      "/figlet": async (req, res, params) => {
         let body = ""

         req.on("data", (chunk) => body += chunk.toString())

         req.on("end", async () => {
            if (body === "") {
               returnResponse(res, 400, "application/json", {route: "error", data: [{title: "info", hasColon: true, body: [{label: "message", value: "Please include a valid body on your POST request."}]}]})
               return
            }

            if (body.length > 12) {
               const splitBody = body.split("")
               for (let i = 12; i <= body.length; i += 12) splitBody.splice(i - 1, 0, "\n")
               body = splitBody.join("")
            }

            const text = await figlet.text(body, {font: "standard"})
            
            if (text) returnResponse(res, 200, "text/plain", `${text}\n\n`)
         })
      }
   }
}

export {routes}