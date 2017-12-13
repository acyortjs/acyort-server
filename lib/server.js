const http = require('http')
const url = require('url')
const pathFn = require('path')
const fs = require('fs')
const mime = require('mime')

function pageError(res, err) {
  res.writeHead(err ? 500 : 404, { 'Content-Type': 'text/plain' })
  res.write(err || '404 Not Found')
  res.end()
}

function inject(path) {
  if (mime.getType(path) !== 'text/html') {
    return ''
  }
  return fs.readFileSync(pathFn.join(__dirname, 'inject.html'))
}

class Server {
  constructor(base, dir) {
    this.public = pathFn.join(base, dir.public)
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

      return fs.readFile(path, 'binary', (err, file) => {
        if (err) {
          return pageError(res, err)
        }

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
      })
    }).listen(port)
  }
}

module.exports = Server
