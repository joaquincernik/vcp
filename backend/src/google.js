import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
)

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

export const sheets = google.sheets({
  version: 'v4',
  auth: oAuth2Client
})
