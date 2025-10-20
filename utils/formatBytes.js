function formatBytes(bytesSize) {
   let sizeResult

   if (bytesSize < 1024) {
      sizeResult = {size: 1, type: "KB"}
   } else if (bytesSize >= 1024 && bytesSize < 1024**2) {
      sizeResult = {size: bytesSize / 1024, type: "KB"}
   } else if (bytesSize >= 1024**2 && bytesSize < 1024**3) {
      sizeResult = {size: bytesSize / 1024**2, type: "MB"}
   } else {
      sizeResult = {size: bytesSize / 1024**3, type: "GB"}
   }

   return `${sizeResult.size.toLocaleString("pt-BR").slice(0, 4)} ${sizeResult.type}`
}

export { formatBytes }