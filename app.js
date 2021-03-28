import "/core/framework.js"
import "/core/layouts/simple.js"

document.body.innerHTML = `
    <simple-layout/>
`

// load eruda devtools
document.addEventListener("DOMContentLoaded", e => {
    if (/eruda=true/.test(window.location)) {
        // const eruda = document.createElement("script")
        // eruda.src = "//cdn.jsdelivr.net/npm/eruda"
        // document.body.append(eruda)
        // setTimeout(() => window.eruda.init(), 3000)
        fetch("//cdn.jsdelivr.net/npm/eruda")
            .then(res => res.text())
            .then(src => {
                eval(src)
                eruda.init()
            })
    }
})
