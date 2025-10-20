function convertToBase64(data) {
   const base64 = new Uint8Array(data).toBase64()
   return base64
}

export { convertToBase64 }