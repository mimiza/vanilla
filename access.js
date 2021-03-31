import acl from './access.json'

export const access = key => {
    const user = acl.users.filter(
        user =>
            user.key &&
            user.key.pub &&
            user.key.epub &&
            user.key.pub === key.pub &&
            user.key.epub === key.epub
    )[0]
    const roles = (user && user.roles) || ['customer']
    let permissions = []
    if (roles && acl.permissions) {
        const process = data => {
            if (Array.isArray(data)) {
                // loop through each menu item in group
                data.map(item => process(item))
            } else if (typeof data === 'object') {
                for (const path in data) {
                    for (let role of roles) {
                        if (
                            (data[path].roles || data[path]).indexOf(role) >
                                -1 &&
                            permissions.indexOf(path) === -1
                        )
                            permissions.push(path)
                    }
                }
            }
        }
        process(acl.permissions)
        // for (const permission of acl.permissions) {
        //     for (const path in permission) {
        //         for (let role of roles) {
        //             if (
        //                 permission[path].indexOf(role) > -1 &&
        //                 permissions.indexOf(path) === -1
        //             )
        //                 permissions.push(path)
        //         }
        //     }
        // }
    }
    return permissions
}

export const signUp = (data, callback) => {
    if (typeof window !== 'undefined') {
        let { user } = window

        if (data.username && data.password && callback) {
            user.create(data.username, data.password, response => {
                callback(response)
                if (!response.err) window.dispatchEvent(window.authenticated)
            })
        }
    }
}

export const authenticate = (...args) => {
    if (typeof window !== 'undefined') {
        let { user, authenticated } = window

        const credentials =
            typeof args[0] === 'string' && typeof args[1] === 'string'
                ? [args[0], args[1]]
                : typeof args[0] === 'object'
                ? [args[0]]
                : []

        const callback =
            args && args.length > 1
                ? args.filter(arg => typeof arg === 'function')[0]
                : null

        const options =
            args && args.length > 2 && typeof args[args.length - 1] === 'object'
                ? args[args.length - 1]
                : {}

        user.auth(
            ...credentials,
            response => {
                if (callback) callback(response)
                if (response.err) console.error(response)
                else {
                    if (
                        options.remember === true &&
                        typeof window !== 'undefined'
                    ) {
                        let { user } = window
                        if (user._.sea)
                            localStorage.setItem(
                                'pair',
                                JSON.stringify(user._.sea)
                            )
                    }
                    window.dispatchEvent(authenticated)
                }
            },
            { remember: true }
        )
    }
}

export const logOut = callback => {
    if (typeof window !== 'undefined') {
        window.user.leave()
        localStorage.removeItem('pair')
        window.dispatchEvent(window.logOut)
        if (callback) callback()
    }
}

export const changePassword = (password, callback) => {
    if (typeof window !== 'undefined') {
        let { user } = window
        user.auth(
            user._.sea,
            password,
            response => {
                if (callback) callback(response)
            },
            {
                change: password,
                remember: true
            }
        )
    }
}
