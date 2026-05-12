const dbDriver = process.env.DB_DRIVER || 'mysql'
const dbUsername = process.env.DB_USERNAME
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbDatabase = process.env.DB_DATABASE


export const DATABASE_URL = `${dbDriver}://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`
export const baseUrl=  process.env.BETTER_AUTH_URL