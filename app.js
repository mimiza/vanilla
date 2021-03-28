import '/core/framework.js'
import '/core/layouts/simple.js'

document.body.innerHTML = `
    <simple-layout/>
`

// load eruda devtools
document.addEventListener("DOMContentLoaded", (e) => {
    if (/eruda=true/.test(window.location)) {
        const el = document.createElement('script')
        eruda.src = '//cdn.jsdelivr.net/npm/eruda'
        document.body.append(el)
        const init = document.createElement('script').innerHTML = 'eruda.init()'
        document.body.append(init)
    }
})
