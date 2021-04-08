import {
    context,
    setContext
} from "/core/framework.js"
import "/core/layouts/simple.js"

// load eruda devtools for mobile browsers
if (
    /eruda=true/.test(window.location) ||
    localStorage.getItem("eruda") === "true"
) {
    localStorage.setItem("eruda", true)
    fetch("//cdn.jsdelivr.net/npm/eruda")
    .then(res => res.text())
    .then(src => {
        eval(src)
        eruda.init()
    })
}

document.body.innerHTML = `
<simple-layout>
Lorem ipsum
</simple-layout>
`