const http = require('http')
const Router = require('./router')
const routes = new Router()

let server

function requestHandler (request, response) {
  let { url, method } = request
  console.log(`${method} ${url}`)
  method = method.toLowerCase()

  response.status = code => response.statusCode = code

  try {
    const handlers = routes.matchUrl(url, method)

    if (handlers.length) {
      handlers[0](request, response)
      return
    }
  } catch (error) {
    console.log(error)
    response.status(500)
    response.end('Internal server error')
  }
}

class Server {
  constructor (options) {
    this.init()
  }

  init () {
    server = http.createServer(requestHandler)
  }

  listen (PORT) {
    server.listen(PORT)
  }

  use (first, ...rest) {
    routes.use(first, ...rest)
  }

  get (path, ...handlers) {
    routes.mountRoute(path, 'get', ...handlers)
  }

  post (path, ...handlers) {
    routes.mountRoute(path, 'post', ...handlers)
  }

  put (path, ...handlers) {
    routes.mountRoute(path, 'put', ...handlers)
  }

  delete (path, ...handlers) {
    routes.mountRoute(path, 'delete', ...handlers)
  }
}

exports = module.exports = (options) => {
  return new Server(options)
}

exports.Router = Router
