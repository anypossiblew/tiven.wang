---
layout: post
theme: Josefin-Sans
title: Angular - Debugging
excerpt: ""
modified: 2018-03-22T18:00:00-00:00
categories: articles
tags: [Debugging, Angular, TypeScript, JavaScript]
image:
  vendor: twitter
  feature: /media/DY5_tv9WkAIKoC6.jpg:large
  credit: Nat Geo Photography
  creditlink: https://twitter.com/NatGeoPhotos/status/976858595408142338
comments: true
share: true
references:
  - id: 1
    title: ""
    url: ""
  - id: 2
    title: "Debug & Run Angular2 Typescript with Visual Studio Code?"
    url: "https://stackoverflow.com/questions/36494938/debug-run-angular2-typescript-with-visual-studio-code"
---

* TOC
{:toc}


## Debugging TypeScript Language in Visual Studio Code

Visual Sudio Code debugging:
https://code.visualstudio.com/docs/editor/debugging

TypeScript Language debugging:
https://code.visualstudio.com/docs/languages/typescript

注意设置：
`"outFiles": ["${workspaceRoot}/lib/**/*.js"]`
https://stackoverflow.com/questions/31169259/how-to-debug-typescript-files-in-visual-studio-code


## Debugging TypeScript Angular application

Before you begin, make sure you have latest version of VS code. You can verify latest version – Help > Check For Updates or About.

1. Install extension called 'Debugger for Chrome'. Once install complete, restart VS code.
2. Go to Debug window, open launch.json using Chrome.
3. In *Launch.json* configuration section, use below config
```json
{
    "name": "Launch localhost with sourcemaps",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:3000/Welcome",
    "sourceMaps": true,
    "webRoot": "${workspaceRoot}"
}
```
4. In *__tsconfig.json__*, make sure you have `"sourceMap": true`

This completes your debug environment settings. Now, before you start debugging, make sure all your existing *Chrome.exe* instances are closed. Verify from Task Manager OR Use DOS command `killall chrome`

5. Run your project, using `npm start` command and Chrome as default browser.
6. Once application is run successfully, you will receive port number. Copy URL from chrome browser and paste into url section above. (NOTE: If you are using routing in your application then url would like above otherwise it will be ending index.html etc)
7. Now, place breakpoints wherever you want in your typescript files.
8. Again, go to debug window in VS code, and hit Run. Your tab/instance connected to debugger will looks like below.
[[2.](#reference-2)]


https://code.visualstudio.com/docs/nodejs/angular-tutorial#_configure-the-chrome-debugger
