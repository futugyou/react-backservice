import app from './app.js'
import http from 'http'
import config from './utils/config.js'
import logger from './utils/logger.js'
import hqlServer from './graphql/ApolloApp.js'

hqlServer.listen().then(({ url, subscriptionsUrl }) => {
   logger.info(`hqlserver running on port ${url}/graphql`)
   logger.info(`Subscriptions ready at ${subscriptionsUrl}`)
})
const server = http.createServer(app)
app.listen(config.PORT, () => {
   logger.info(`server running on port ${config.PORT}`)
})
