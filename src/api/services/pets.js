const openapi = require('../openapi-backend');
const ServerError = require('../../lib/error');
/**
 * @param {Object} options
 * @param {Integer} options.limit How many items to return at one time (max 100)
 * @throws {Error}
 * @return {Promise}
 */
module.exports.listPets = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  const { status, mock } = await openapi.createFakeRandomMockResponse('listPets', options);
  return {
    status,
    data: mock
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createPets = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  const { status, mock } = await openapi.createFakeRandomMockResponse('createPets', options);
  return {
    status,
    data: mock
  };
};

/**
 * @param {Object} options
 * @param {String} options.petId The id of the pet to retrieve
 * @throws {Error}
 * @return {Promise}
 */
module.exports.showPetById = async (options) => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  const { status, mock } = await openapi.createFakeRandomMockResponse('showPetById', options);
  return {
    status,
    data: mock
  };
};

