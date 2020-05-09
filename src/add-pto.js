import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { GoogleCalendar } from 'google-calendar'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import passport from 'passport'
import serverless from 'serverless-http'
import sessions from 'client-sessions'

const { SESSION_SECRET, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, DEPLOY_PRIME_URL } = process.env

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: `${DEPLOY_PRIME_URL}/.netlify/functions/add-pto/auth/callback`,
      scope: [
        'openid',
        'email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar',
      ],
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      req.session.accessToken = accessToken
      done(null, profile)
    },
  ),
)

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())

app.use(
  sessions({
    cookieName: 'session',
    secret: SESSION_SECRET,
    cookie: {
      ephemeral: false,
      secure: true,
    },
  }),
)

app.use(passport.initialize())
app.use(passport.session())

app.get('/auth', passport.authenticate('google'))

app.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/auth' }))

const auth = (req, res, next) => {
  if (!req.session.accessToken) {
    res.status(200).json({
      response_type: 'ephemeral',
      text: `Please authenticate with Google first: ${DEPLOY_PRIME_URL}/.netlify/functions/add-pto/auth`,
    })
  }

  next()
}

app.post('/command', auth, async (req, res) => {
  const { text } = req.body

  res.status(200).json({
    response_type: 'ephemeral',
    text: `Event added to PTO calendar: ${userId}: ${text}`,
  })
})

exports.handler = serverless(app)
