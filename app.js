import { createServer, IncomingMessage, ServerResponse } from 'node:http';

const ACTIVITYSTREAMS_CONTENT_TYPE = 'application/activity+json'

/**
 * @typedef {{body: string, statusCode: string, headers?: import('node:http').OutgoingHttpHeaders | import('node:http').OutgoingHttpHeader[]}} HandledRequest 
 */

/**
 * 
 * @param {string} data 
 * @returns {Promise<HandledRequest | null>}
 */
async function handleRequestBody(data, contentType) {
  console.debug(data)
  return {
    body: 'ok',
    statusCode: 200
  }
}

/**
 * 
 * @param {ServerResponse} response
 * @param {HandledRequest} responseData 
 */
function writeResponse(response, responseData) {
  response.writeHead(responseData.statusCode, responseData.headers)
  response.end(responseData.body)
}

/**
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
function handlePOST(req, res) {
  let body = ''
  req.addListener("data", (/** @type {string} */ chunk) => {
    body = body.concat(chunk)
  })
  req.addListener("end", async () => {
    const response = await handleRequestBody(body, req.headers['content-type'] ?? '')
    let responseData = { body: '', statusCode: 404 }
    if (response !== null) {
      responseData = response
    }
    return writeResponse(res, responseData)
  })
}

/**
 * 
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
function handleRequest(req, res) {
  console.dir(req.headers)
  console.debug(req.method)
  console.debug(req.url)
  req.setEncoding("utf8")
  if (['POST', 'PUT'].includes(req.method)) {
    handlePOST(req, res)
  }
  return writeResponse(res, {
    body: JSON.stringify({
      data: 'Hello World!',
    }), statusCode: 200, headers: { 'Content-Type': 'application/json' }
  })
}

// Create a local server to receive data from
const server = createServer(handleRequest);

server.addListener("listening", () => {
  console.log('Server is listening')
})

server.addListener("close", () => {
  console.debug('Connection closed')
})

server.listen(9000, "0.0.0.0");