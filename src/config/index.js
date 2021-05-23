import { config } from 'dotenv'

config()

const Config = {
  env: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
}

export default Config;