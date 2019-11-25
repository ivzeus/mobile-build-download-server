const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const path = require('path')
const passport = require('passport')
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

app.use('/builds', passport.authenticate('basic', { session: false }))
app.use('/builds', express.static(path.join(__dirname, 'builds')))

// app.set('views', path.join(__dirname, 'views'));
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
    console.log(process.env.USERNAME, username)
    console.log(password, process.env.PASSWORD)
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

app.get('/builds', passport.authenticate('basic', { session: false }), function(
  req,
  res
) {
  let json = {
    title: 'App Installer',
    login: process.env.USERNAME,
    password: process.env.PASSWORD,
  }
  res.render('builds', json)
})

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
console.log('Server run at localhost:3000')
app.listen(3000)
