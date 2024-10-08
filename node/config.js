const fs = require('fs')
const path = require('path')
require('dotenv').config()
const env = process.env.NODE_ENV
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
var Router = require('koa-router')
const cors = require('koa2-cors')
const sslify = require('koa-sslify').default
const https = require('https')

let options
if (env === 'development') {
  options = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
  }
} else {
  const homeDir = process.env.HOME || process.env.USERPROFILE
  options = {
    key: fs.readFileSync(path.join(homeDir, 'ssl/www.xtr327.com.key')),
    cert: fs.readFileSync(path.join(homeDir, 'ssl/www.xtr327.com.pem'))
  }
}

const app = new Koa()
app.use(bodyParser())
app.use(sslify())
app.use(cors())

https.createServer(options, app.callback()).listen(3033, (err) => {
  if (err) {
    console.log('服务启动出错', err)
  } else {
    console.log('运行在' + 3033 + '端口')
  }
})

var router = new Router()

router.prefix('/api')
app.use(router.routes()).use(router.allowedMethods())

module.exports = {
  https,
  router,
  app
}
