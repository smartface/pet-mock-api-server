const { OpenAPIBackend } = require('openapi-backend');
const OpenAPIUtils = require('openapi-backend/utils').default;
const apiSpec = require('../../definitions.json');
const jsf = require('json-schema-faker');

const DEFAULT_SMART_MOCKER_OPTIONS = {
  randomStatusCode: false,
  responseDelay: null,
  randomResponse: true
};

const DEFAULT_RESPONSE_ERROR_CODE = 500;
const DEFAULT_RESPONSE_OK_CODE = 200;

const api = new OpenAPIBackend({
  definition: apiSpec 
});

api.init();

function getSmortMockerOptions (operation) {
  const smartMockerOptions = operation['x-smart-mocker'];
  return Object.assign({}, DEFAULT_SMART_MOCKER_OPTIONS, smartMockerOptions);
}

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomDelay (delayObj) {
  let randomDelay;
  if (typeof delayObj === 'number') {
    randomDelay = getRandomInt(delayObj);
  } else {
    const min = delayObj.min || 0;
    const max = delayObj.max || 0;
    randomDelay = min + getRandomInt(max > min ? max - min : 0); 
  }
  return randomDelay;
}

function getRandomResponseSchema (operation, statusCode) {
  const { responses } = operation;
  let status, response;
  if (statusCode) {
    if (responses[statusCode]) {
      status = Number(statusCode);
      response = responses[statusCode];
    } else {
      const res = OpenAPIUtils.findDefaultStatusCodeMatch(responses);
      status = res.status;
      response = res.res;
    }
  } else {
    const statusCodes = Object.keys(responses);
    const randResponseIndex = getRandomInt(statusCodes.length);
    status = Number(statusCodes[randResponseIndex]) || DEFAULT_RESPONSE_ERROR_CODE;
    response = responses[statusCodes[randResponseIndex]];
  }
  return { status, response };
}

api.createFakeRandomMockResponse = async (operationId, opts={}) => {
  const operation = api.getOperation(operationId);
  const smartMockerOptions = getSmortMockerOptions(operation);
  let responseData = api.mockResponseForOperation(operationId, opts);
  return new Promise((resolve, reject) => {
    if (smartMockerOptions.randomResponse) {
      try {
        const { response, status } = getRandomResponseSchema(operation, opts.code || (smartMockerOptions.randomStatusCode ? null : DEFAULT_RESPONSE_OK_CODE));
        const { content } = response;
        // resolve media type
        // 1. check for mediaType opt in content (default: application/json)
        // 2. pick first media type in content
        const mediaType = opts.mediaType || 'application/json';
        const mediaResponse = content[mediaType] || content[Object.keys(content)[0]];
        if (mediaResponse) {
          const { schema } = mediaResponse;
          if (schema) {
            responseData = { status, mock: jsf.generate(schema) };
          } 
        } else {
          responseData = api.mockResponseForOperation(operationId, opts);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (smartMockerOptions.responseDelay) {
      setTimeout(() => {
        resolve(responseData);
      }, getRandomDelay(smartMockerOptions.responseDelay));
    } else {
      resolve(responseData);
    }
  });
};

module.exports = api;