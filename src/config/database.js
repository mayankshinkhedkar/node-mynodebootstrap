import { config } from 'dotenv'

config()

const database = {
  mysql: {
    host: process.env.MYSQL_DB_HOST,
    port: process.env.MYSQL_DB_PORT,
    user: process.env.MYSQL_DB_USERNAME,
    password: process.env.MYSQL_DB_PASSWORD,
    db: process.env.MYSQL_DB_NAME,
    timezone: process.env.MYSQL_DB_TIMEZONE,
  }
}

export default database