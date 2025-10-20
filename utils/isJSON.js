function isJSON(text) {
   try {
      const json = JSON.parse(text)
      return typeof json === "object" && json !== null
   } catch (error) {
      return false
   }
}

export { isJSON }