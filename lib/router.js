class Router {
  constructor () {
    this.routes = []
  }

  /**
   * Mount middleware and Router intances
   * @param {string|function|Router} first If String the rest of the arguments are mounted as middleware on that route
   * @param  {function|Router} rest Middlewares or Router instance to mount
   */
  use (first, ...rest) {
    let path, handlers, router
    const type = typeof first

    if (type === 'string') {
      path = first
      const [ second ] = rest

      if (this.isRouter(second)) {
        router = second
      } else {
        handlers = rest
      }
    } else {
      // path is not defined, default to root
      path = '/'
    }

    if (type === 'function') {
      handlers = [first].concat(...rest)
    }

    if (this.isRouter(first)) {
      router = first
    }

    if (router) {
      this.mountRouter(path, router)
    }
    if (handlers) {
      this.mountMiddleware(path, handlers)
    }

    // console.log(this.routes)
  }

  /**
   * Mounts a Router instance
   * @param {string} path Path to mount on
   * @param {Router} router Router instance to mount
   */
  mountRouter (path, router) {
    let { routes } = router

    if (path === '/') {
      this.routes = this.routes.concat(routes)
      return
    } else {
      // append mount path to route path
      routes = routes.map(route => {
        let newPath = route.path === '/' ? path : path + route.path
        route.path = newPath
        return route
      })

      this.routes = this.routes.concat(routes)
    }
  }

  /**
   * Mounts handlers as middleware
   * @param {string} path Path to mount on
   * @param {...function} middleware Handlers to mount
   */
  mountMiddleware (path, handlers) {
    this.routes = this.routes.concat({ method: '*', path, handlers })
  }

  mountRoute (path, method, handlers) {
    this.routes = this.routes.concat({ method, path, handlers })
  }

  /**
   * Mount handlers as GET method
   * @param {string} path Path to mount on
   * @param  {...any} handlers Handlers to mount
   */
  get (path, ...handlers) {
    this.mountRoute(path, 'get', handlers)
  }

  /**
   * Mount handlers as POST method
   * @param {string} path Path to mount on
   * @param  {...any} handlers Handlers to mount
   */
  post (path, ...handlers) {
    this.mountRoute(path, 'post', handlers)
  }

  /**
   * Mount handlers as PUT method
   * @param {string} path Path to mount on
   * @param  {...any} handlers Handlers to mount
   */
  put (path, ...handlers) {
    this.mountRoute(path, 'put', handlers)
  }

  /**
   * Mount handlers as DELETE method
   * @param {string} path Path to mount on
   * @param  {...any} handlers Handlers to mount
   */
  delete (path, ...handlers) {
    this.mountRoute(path, 'delete', handlers)
  }

  /**
   * Check if value is an instance of Router
   * @param {*} value Value to test
   * @returns Boolean
   */
  isRouter (value) {
    return value instanceof Router
  }

  /**
   * Matches an url and returns the handlers
   * @param {string} url URL to match
   * @param {string} method HTTP request method to match
   * @returns Array of middleware and handlers
   */
  matchUrl (url, method) {
    let matches = this.routes.filter(route => {
      const urlMatch = route.path === url
      const methodMatch = route.method === '*' || route.method === method

      return urlMatch && methodMatch
    })
    .map(route => route.handlers)

    return matches.flat()
  }
}

module.exports = Router
