import React from 'react'

export const notify = ({
    content,
    callback,
    className,
    autoClose,
    onClose
}) => {
    if (typeof window !== 'undefined')
        window.dispatchEvent(
            new CustomEvent('notify', {
                detail: {
                    content,
                    callback,
                    className,
                    autoClose,
                    onClose
                }
            })
        )
}

export const prompt = ({
    content,
    callback,
    className,
    autoClose,
    onClose
}) => {
    if (typeof window !== 'undefined')
        window.dispatchEvent(
            new CustomEvent('prompt', {
                detail: {
                    content,
                    callback,
                    className,
                    autoClose,
                    onClose
                }
            })
        )
}

export const hash = async data => {
    if (typeof window !== 'undefined') {
        let { sea } = window
        if (typeof data === 'object') data = JSON.stringify(data)
        return await sea.work(data, null, null, {
            name: 'SHA-256'
        })
    }
}

export const signAndHash = async data => {
    if (typeof window !== 'undefined') {
        let { sea, user } = window
        if (user.is && user._ && user._.sea) {
            const signedData = await sea.sign(data, user._.sea)

            const _ = JSON.stringify({
                data: signedData,
                user: { pub: user.is.pub }
            })

            return { data: _, hash: await hash(_) }
        }
        return {}
    }
    return {}
}

export const encodeQuery = data =>
    Object.entries(data)
        .map(_ =>
            _.map(__ =>
                typeof __ === 'object'
                    ? encodeURIComponent(JSON.stringify(__))
                    : encodeURIComponent(__)
            ).join('=')
        )
        .join('&')

export const spintax = text => {
    let matches, options, random
    while ((matches = /{([^{}]+?)}/.exec(text)) !== null) {
        options = matches[1].split('|')
        random = Math.floor(Math.random() * options.length)
        text = text.replace(matches[0], options[random])
    }
    return text
}

export const schemaToDisplay = (schema = []) => {
    var result = schema
        .filter(
            field =>
                (field.area && field.area.indexOf('title') > -1) ||
                (field.type === 'data' && field.schema)
        )
        .map(field => {
            if (field.type !== 'data' && field.name) return field.name
            if (field.type === 'data' && field.schema)
                return schemaToDisplay(field.schema)
        })

    return result
}

export const objectToArray = (obj = {}) => {
    let data = {},
        keys = [],
        tmp

    while (typeof obj === 'object') {
        if (obj.data && obj.keys) {
            try {
                keys = JSON.parse(obj.keys)
            } catch {}
            Object.entries(obj.data).filter(_ => {
                if (keys.indexOf(_[0]) > -1) data[_[0]] = _[1]
            })
            tmp = data
        } else tmp = obj

        return Object.entries(tmp).map(item => {
            if (typeof item[1] === 'object') return objectToArray(item[1])
            return item[1]
        })
    }
    return tmp
}

export const arrayToString = data => {
    const separator = _ => {
        return Array.isArray(_) &&
            _.length === 2 &&
            typeof _[0] === 'string' &&
            Array.isArray(_[1])
            ? ': '
            : ', '
    }

    return data
        .map(item => (Array.isArray(item) ? item.join(separator(item)) : item))
        .join(separator(data))
}

export const arrayToTags = data => {
    if (Array.isArray(data))
        return data.map(item =>
            Array.isArray(item) &&
            item.length === 2 &&
            typeof item[0] === 'string' &&
            Array.isArray(item[1]) ? (
                <span>
                    <span className="tags has-addons">
                        <span className="tag is-success">{item[0]}</span>
                        <span className="tag">{item[1].join(', ')}</span>
                    </span>
                </span>
            ) : Array.isArray(item) ? (
                <span className="tag is-success">{item.join(', ')}</span>
            ) : (
                <span className="tag is-success">{item}</span>
            )
        )
}

export const randomInt = (min, max) => {
    min = Math.ceil(min || 0)
    max = Math.floor(max || 10000)
    return Math.floor(Math.random() * (max - min) + min)
}

export const randomText = (l, c) => {
    var s = ''
    l = l || 24 // you are not going to make a 0 length random number, so no need to check type
    c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz'
    while (l > 0) {
        s += c.charAt(Math.floor(Math.random() * c.length))
        l--
    }
    return s
}

export const randomKey = int => (int || Date.now()).toString(36) + randomText(7)

export const randomItem = data =>
    Array.isArray(data) ? data[Math.floor(Math.random() * data.length)] : null

export const filterData = (data = {}, prefix = '') =>
    Object.entries(data).filter(
        item => typeof item[0] === 'string' && item[0].indexOf(prefix) > -1
    )

export const logic = (exp, data) => {
    const isLogic = _ =>
        typeof _ === 'object' &&
        _ !== null &&
        (_['AND'] || _['OR'] || _['&&'] || _['||']) &&
        !Array.isArray(_) &&
        Object.keys(_).length === 1

    const ops = {
        AND: arr => {
            for (let item of arr) {
                // if item is LEX -> run match -> if false, return false
                // if item is Logic -> return logic(item)
                if (isLogic(item)) item = logic(item)
                if (item == false) return false
            }
            return true // if all items are true
        },
        '&&': arr => ops['AND'](arr),
        OR: arr => {
            for (let item of arr) {
                // if item is LEX -> run match -> if true, return true
                // if item is Logic -> return logic(item)
                if (isLogic(item)) item = logic(item)
                if (item == true) return true
            }
            return false // if no item is true
        },
        '||': arr => ops['OR'](arr)
    }
    // if exp is object and has key '&&', 'AND', '||', 'OR' -> return ops(exp)
    // if exp is object and has none of above keys -> return match
    if (isLogic(exp)) {
        const op = Object.keys(exp)[0]
        const data = exp[op]
        return ops[op](data)
    }
    return !!exp // return Gun.text.match
}
