const redis = require('redis');
const uuidv4 = require('uuid/v4');

const SMART_MOCKER_PREFIX = '___smartmocker___';

const redisWrapper = (function () {
  function prepareRedisKeyForItem (key) {
    return `${SMART_MOCKER_PREFIX}:${key}`;
  }

  class RedisWrapper {
    constructor () {
      this.redisClient = null;
    }
    async setup (redisPort, redisHost) {
      return new Promise((resolve, reject) => {
        this.redisClient = redis.createClient(redisPort, redisHost); 
        this.redisClient.on('connect', () => {
          console.log(`Redis client connected to (${redisHost}:${redisPort})`);
          resolve();
        });
        this.redisClient.on('error', (err) => {
          console.log(`Redis client -> ${  err}`);
          reject(err);
        });
      });
    }
    async set (value, key = uuidv4()) {
      return new Promise((resolve, reject) => {
        this.redisClient.set(key, JSON.stringify(value), (err, reply) => {
          if (err)
            reject(err);
          resolve(key);
        });
      });
    }
    async get (key) {
      return new Promise((resolve, reject) => {
        this.redisClient.get(key, (err, result) => {
          if (err) {
            return reject(err);
          }
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            resolve(null);
          }
        });
      });
    }
    async addItem (value, colectionKey = uuidv4()) {
      let key = colectionKey;
      let itemContainer = await this.get(key);
      if (!itemContainer) {
        itemContainer = [];
        key = prepareRedisKeyForItem(uuidv4());
      }
      const itemId = itemContainer.length;
      if (typeof value.id !== 'undefined') {
        value.id = itemId;
      }
      itemContainer.push(value);
      await this.set(itemContainer, key);
      return key;
    } 
    async getItem (key, index) {
      const itemContainer = await this.get(key);
      if (itemContainer) { 
        return itemContainer[index] || null;
      }
      return null;
    }
    async updateItem (key, index, newValue) {
      const itemContainer = await this.get(key);
      let item = newValue;
      if (itemContainer) { 
        item = itemContainer[index] || null;
      }
      itemContainer[index] = Object.assign({}, item, newValue);
      if (typeof itemContainer[index].id !== 'undefined') {
        itemContainer[index].id = index;
      }
      await this.set(itemContainer, key);
      return itemContainer[index];
    } 
    async getItemCollection (key) {
      const itemContainer = await this.get(key);
      return itemContainer;
    } 
  }
  return new RedisWrapper();
}());

global.redis = redisWrapper;
module.exports = redisWrapper;