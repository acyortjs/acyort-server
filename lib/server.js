const http = require('http')
const url = require('url')
const pathFn = require('path')
const fs = require('fs')
const mime = require('mime')

function pageError(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.write('404 Not Found')
  res.end()
}

function inject(path) {
  if (mime.getType(path) !== 'text/html') {
    return ''
  }
  return fs.readFileSync(pathFn.join(__dirname, 'inject.html'))
}

class Server {
  constructor() {
    this.public = undefined
  }

  path(req) {
    const { pathname } = url.parse(req.url)
    return decodeURIComponent(pathFn.join(this.public, pathname))
  }

  create(port) {
    return http.createServer((req, res) => {
      let path = this.path(req)

      if (!fs.existsSync(path)) {
        return pageError(res)
      }

      if (fs.statSync(path).isDirectory()) {
        path = pathFn.join(path, 'index.html')
      }

      if (!fs.existsSync(path)) {
        return pageError(res)
      }

      const file = fs.readFileSync(path, 'binary')

      res.writeHead(200, {
        'Content-Type': mime.getType(path),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        Expires: '-1',
        Pragma: 'no-cache',
      })
      res.write(file, 'binary')
      res.write(inject(path))
      res.end()

      return res
    }).listen(port)
  }
}

module.exports = Server
