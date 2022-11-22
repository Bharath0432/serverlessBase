"use strict";

const Ajv = require("ajv");
const ajValidator = new Ajv({ async: true });

const payloadValidator = (schema, body) => {
    try {
      const validate = ajValidator.compile(schema);
      const result = validate(body);
      if (!result) {
        const errors = parseErrors(validate.errors);
       return {
          success: false,
          message: "Invalid payload",
          errors,
        };
      }
    } catch (e) {
      return {
        success: false,
        message: "Something went wrong"
      };
    }
};

const parseErrors = validationErrors => {
  return validationErrors.map(error => {
    return {
      param: error.params["missingProperty"],
      key: error.keyword,
      field:  error.instancePath,
      message: error.message,
      property: (function () {
        return error.keyword === 'minimum' ? error.dataPath : undefined;
      })()
    };
  });
};

module.exports = {
  payloadValidator
}
