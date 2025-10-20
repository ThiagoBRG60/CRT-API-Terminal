function formatUserInput(input) {
   try {
      if (input.includes("&") && input.includes("=")) {
         const splitInput = input.split("&").map(item => item.includes("?") ? item.split("?") : item).flat().map(value => !value.includes("path") ? value.split("=") : ["query", `?${value}`])
         const inputObj = Object.fromEntries(splitInput)
   
         if (inputObj.method.toUpperCase() === "GET" || inputObj.method.toUpperCase() === "POST") {
            if (!inputObj.route.includes(".") && inputObj.route.includes("/")) {
               const responseObj = {method: inputObj.method.toUpperCase(), route: inputObj.query ? inputObj.route + inputObj.query : inputObj.route}

               if (inputObj.route !== "/" && inputObj.route !== "") return inputObj.body ? {...responseObj, body: inputObj.body} : responseObj
            }
         }
      }
   
      return 
   } catch (error) {
      return 
   }
}

export { formatUserInput }