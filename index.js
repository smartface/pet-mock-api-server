const argv = require('minimist')(process.argv.slice(2));

const app = require('./src/api');
const redisWrapper = require('./setup-redis-client-to-gloabal');

const port = argv.port || 13131;

app.listen(port, () => console.log(`Mock API Project App listening on port ${port}!`));

redisWrapper.setup(argv.redisPort || 6379, argv.redisHost || '127.0.0.1');

module.exports = app;