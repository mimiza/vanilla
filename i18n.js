import React from 'react'
import Block from '../components/Block'
import { Link, StaticQuery, graphql, navigate } from 'gatsby'
export const siteLocales = require('../locales/locales')
export const defaultLocale = siteLocales.filter(locale => locale.default)[0]

export const createPath = (locale, path) =>
    locale && path
        ? `/${locale}` +
          path.replace(/(\/\w{2})($|\/.*)/g, '$2').replace(/\/$/g, '')
        : null

export const redirect = () => {
    if (typeof window !== 'undefined') {
        const pathLocale = getLocale(window.location.pathname)
        localStorage.locale =
            localStorage.locale || pathLocale || defaultLocale.code
        if (!pathLocale) {
            const path = createPath(
                localStorage.locale,
                window.location.pathname + window.location.search
            )
            navigate(path)
        }
    }
}

export const getLocale = path => {
    const pathLocale = path
        .replace(/(\/)(\w{2})($|\/.*)/g, '$2')
        .replace(/[\W\d]/g, '')
    if (siteLocales.filter(locale => locale.code === pathLocale).length > 0)
        return pathLocale
    return null
}

export const createElement = block => {
    if (React.isValidElement(block)) return block
    if (Array.isArray(block)) return block.map(item => this.createElement(item))
    if (block?.component) {
        const { pageContext } = block
        return React.createElement(this.components[block.component], {
            key: block.key || randomKey(),
            id: block.id || randomKey(),
            pageContext: pageContext,
            ...block,
            children:
                typeof block?.children === 'object'
                    ? this.createElement(block.children)
                    : typeof block?.children === 'string'
                    ? block.children
                    : null
        })
    }
}

export const SmartLink = ({
    pageContext,
    to,
    className,
    icon,
    children,
    render,
    onClick
}) => {
    if (!React.isValidElement(children) && children?.component) {
        children = <Block {...children} />
    }

    return to ? (
        <StaticQuery
            query={graphql`
                {
                    allSitePage {
                        edges {
                            node {
                                path
                                context {
                                    title
                                }
                            }
                        }
                    }
                }
            `}
            render={data => {
                const newPath =
                    pageContext && pageContext.locale
                        ? createPath(pageContext.locale, to)
                        : null
                const defaultPath = createPath(defaultLocale.code, to)
                let finalPath = newPath

                // check if newPath matches
                let _data = data.allSitePage.edges.filter(
                    page => page.node.path === newPath
                )
                let finalTitle = _data[0] ? _data[0].node.context.title : null

                // newPath doesnt match
                if (_data.length === 0) {
                    // check if defaultPath matches
                    _data = data.allSitePage.edges.filter(
                        page => page.node.path === defaultPath
                    )

                    if (_data.length > 0) {
                        finalPath = defaultPath
                        finalTitle = _data[0].node.context.title
                    }
                    // nothing matches, fallback to the input value
                    else {
                        finalPath = to
                        finalTitle = children
                    }
                }

                const result =
                    finalPath && (children || finalTitle) ? (
                        <Link
                            to={finalPath}
                            className={
                                (pageContext &&
                                pageContext.pagePath &&
                                finalPath === pageContext.pagePath
                                    ? 'is-active'
                                    : '') + (className ? ` ${className}` : '')
                            }
                            onClick={onClick}
                        >
                            {icon ? (
                                <span className="icon-text">
                                    {icon && (
                                        <span className="icon">
                                            <i className={icon} />
                                        </span>
                                    )}
                                    <span>{children || finalTitle}</span>
                                </span>
                            ) : (
                                <span>{children || finalTitle}</span>
                            )}
                        </Link>
                    ) : null

                if (render && result) {
                    return render(result)
                }

                if (result) return result
            }}
        />
    ) : (
        <div className={className}>{children}</div>
    )
}
