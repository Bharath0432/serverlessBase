const MaskData = require("./maskdata");

const { StatusCodes } = require("http-status-codes");

function buildResponse(statusCode, body) {
  const { success, data, message, ...extras } = body;

  const ret = {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "X-Frame-Options": "DENY",
      "Access-Control-Expose-Headers": "web-app-version",
      "web-app-version": "1",
    },
    body: JSON.stringify({
      ...extras,
      success: success || false,
      message: message || "",
      data: data || {},
    }),
  };

  const tbody = JSON.parse(JSON.stringify(ret.body));
  MaskData.maskResponse(tbody);
  const tmp = JSON.parse(JSON.stringify(ret));
  tmp.body = tbody;
  return ret;
}

function isRequired(paramName) {
  return failure({
    message: `${paramName} param is required for throwing error from buildResponse function`,
  });
}

function failure(body = isRequired("body")) {
  return buildResponse(StatusCodes.INTERNAL_SERVER_ERROR, body);
}

function success(body) {
  const success = true;
  if (!body) {
    body = {
      success,
    };
  } else {
    // this code is needed due to google API sending response of error as success response
    body.success = "success" in body ? body.success : success;
  }
  return buildResponse(StatusCodes.OK, body);
}
module.exports = {
  failure,
  success
};
