const paperText = `
   <p class="paper-title">Project:</p>
   <p>CRT API Terminal</p>
   <p class="paper-title">Description:</p>
   <p>A CRT styled terminal where you can search for API routes and run commands.</p>
   <p class="paper-title">Available Terminal Commands:</p>
   <p>● <span class="paper-code"><span class="code-purple">cls</span></span> or <span class="paper-code"><span class="code-purple">clear</span></span> ⇒ Clears the terminal screen</p>
   <p>● <span class="paper-code"><span class="code-blue">theme</span><span class="code-light-blue">=</span><span class="code-blue">themeName</span></span> ⇒ Changes the computer current theme (green, amber, cyan)</p>
   <p>● <span class="paper-code"><span class="code-green">ctrl</span><span class="code-light-blue"> + </span><span class="code-green">c</span></span> ⇒ Stops the currently running code</p>
   <p class="paper-title">Available API Routes:</p>
   <p class="paper-subtitle">GET:</p>
   <p>● <span class="paper-code"><span class="code-purple">/files?path</span><span class="code-light-blue">=</span><span class="code-purple">pathName</span></span> <span>⇒</span> Show all the folders and files from a folder path</p>
   <p>● <span class="paper-code"><span class="code-blue">/file?path</span><span class="code-light-blue">=</span><span class="code-blue">pathName</span></span> <span>⇒</span> Show the content of a file from a file path</p>
   <p>● <span class="paper-code"><span class="code-green">/hash?path</span><span class="code-light-blue">=</span><span class="code-green">pathName</span></span> <span>⇒</span> Get the hash of a file content from a path</p>
   <p>● <span class="paper-code"><span class="code-orange">/system</span></span> <span>⇒</span> Show the user's system information</p>
   <p class="paper-subtitle">POST:</p>
   <p>● <span class="paper-code"><span class="code-purple">/compress</span></span> <span>⇒</span> Compress a file</p>
   <p>● <span class="paper-code"><span class="code-blue">/decompress</span></span> <span>⇒</span> Decompress a file</p>
   <p>● <span class="paper-code"><span class="code-green">/figlet</span></span> <span>⇒</span> Get an ASCII text art from a text</p>
   <p class="paper-title">How To Use:</p>
   <p>Syntax: <span class="paper-code"><span class="code-purple">method</span><span class="code-light-blue">=</span><span class="code-purple">methodName</span><span class="code-light-blue">&</span><span class="code-blue">route</span><span class="code-light-blue">=</span><span class="code-blue">routeName</span><span class="code-light-blue">&</span><span class="code-light-green">body</span><span class="code-light-blue">=</span><span class="code-light-green">bodyContent</span></p>
   <p>GET example: <span class="paper-code"><span class="code-purple">method</span><span class="code-light-blue">=</span><span class="code-purple">GET</span><span class="code-light-blue">&</span><span class="code-blue">route</span><span class="code-light-blue">=</span><span class="code-blue">/files?path</span><span class="code-light-blue">=</span><span class="code-blue">./public</span></span></p>
   <p>POST example: <span class="paper-code"><span class="code-purple">method</span><span class="code-light-blue">=</span><span class="code-purple">POST</span><span class="code-light-blue">&</span><span class="code-blue">route</span><span class="code-light-blue">=</span><span class="code-blue">/figlet</span><span class="code-light-blue">&</span><span class="code-light-green">body</span><span class="code-light-blue">=</span><span class="code-light-green">testing</span></span></p>
   <p class="paper-title">Important:</p>
   <p>● Routes must start with "/"</p>
   <p>● Some routes require a path param</p>
   <p>● Paths must start with "./"</p>
   <p>● The body param must be included in POST requests (figlet only)</p>
`

export { paperText }