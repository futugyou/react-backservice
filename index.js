import app from './app.js'
import http from 'http'
import config from './utils/config.js'
import logger from './utils/logger.js'
 
const server = http.createServer(app)
app.listen(config.PORT, () => {
   logger.info(`server running on port ${config.PORT}`)
})
