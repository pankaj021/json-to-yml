const postmanToOpenApi = require('postman-to-openapi')

function convertJsonToYml(jsonPath) {
   return postmanToOpenApi(jsonPath, null, { defaultTag: 'General' })
}

module.exports = convertJsonToYml;