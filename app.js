import "/core/framework.js"
import "/core/layouts/simple.js"

document.body.innerHTML = `
    <simple-layout/>
`

// load eruda devtools
document.addEventListener("DOMContentLoaded", e => {
    if (/eruda=true/.test(window.location)) {
        fetch("//cdn.jsdelivr.net/npm/eruda")
            .then(res => res.text())
            .then(src => {
                eval(src)
                eruda.init()
            })
    }
})
