const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const path = require('path')
const fs = require('fs')
const serveIndex = require('serve-index')
const passport = require('passport')
const http = require('http')
const https = require('https')
var BasicStrategy = require('passport-http').BasicStrategy

//------------------------------------------------------//
// init express
const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//------------------------------------------------------//
// init passport
passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next()

  // if they aren't redirect them to the home page
  res.redirect('/')
}

passport.use(
  new BasicStrategy(function(username, password, done) {
    if (
      username === process.env.USERNAME &&
      password === process.env.PASSWORD
    ) {
      return done(null, { user: 1 })
    } else {
      return done(null, false, { message: 'Invalid user name or password' })
    }
  })
)

//------------------------------------------------------//
// handling routes
app.get('/', (req, res) => {
  res.send('ok')
})

app.use(
  '/builds',
  passport.authenticate('basic', { session: false }),
  express.static(path.join(__dirname, 'builds')),
  serveIndex('builds', { icons: true, view: 'details' })
)

//------------------------------------------------------//
// handling errors
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

//------------------------------------------------------//
// start server

const server = http.createServer(app)
// use this line if you want to start https server
// self-signed can be generated using: openssl req -nodes -new -x509 -keyout server.key -out server.cert
// const server = https.createServer(
//   {
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert'),
//   },
//   app
// )
server.listen(process.env.PORT)
server.on('error', err => {
  console.log('Error: ', err)
})
server.on('listening', () => {
  const addr = server.address()
  console.log(`server listening at localhost:${addr.port}`)
})
// app.listen(3000)
