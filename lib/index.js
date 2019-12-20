const http = require('http')

let server

const routes = {
  middlewares: []
}

function routeFactory (method, handlers) {
  return {
    middlewares: [],
    [method]: handlers
  }
}

function requestHandler (request, response) {
  let { url, method } = request
  method = method.toLowerCase()

  response.status = code => response.statusCode = code

  try {
    const [ handler ] = routes[url][method]
    handler(request, response)
  } catch (error) {
    response.status(500)
    response.end('Internal server error')
  }
}

class Server {
  constructor (options) {
    this.http = null
    this.init()
  }

  init () {
    server = http.createServer(requestHandler)
  }

  listen (PORT) {
    server.listen(PORT)
  }

  mountRoute (method, route, ...handlers) {
    routes[route] = routeFactory(method, handlers)
  }

  get (route, ...handlers) {
    this.mountRoute('get', route, ...handlers)
  }

  post (route, ...handlers) {
    this.mountRoute('post', route, ...handlers)
  }

  put (route, ...handlers) {
    this.mountRoute('put', route, ...handlers)
  }

  delete (route, ...handlers) {
    this.mountRoute('delete', route, ...handlers)
  }
}

module.exports = (options) => new Server(options)
