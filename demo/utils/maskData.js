"use strict";

const maskPhoneOptions = {
    maskWith: "*",
    unmaskedStartDigits: 5,
    unmaskedEndDigits: 1
};
const emailMask2Options = {
    maskWith: "*",
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false
};
const maskCardOptions = {
    maskWith: "*",
    unmaskedStartDigits: 2,
    unmaskedEndDigits: 1
};

class MaskData {
    constructor() {
        if (!MaskData.instance) {
            MaskData.instance = require("maskdata");
        }
    }

    getInstance() {
        return MaskData.instance;
    }

    maskResponse(response) {
            if (typeof response === "object") {
                for (const k in response) {
                    if (typeof response[k] === "object") {
                        response[k] = this.maskResponse(response[k]);
                    } else if (typeof response[k] === "string" && response[k].substr(0, 1) === "{") {
                        try {
                            response[k] = JSON.stringify(this.maskResponse(JSON.parse(response[k])));
                        } catch (e) {
                            response[k] = this.maskAttribute(k, response[k]);
                        }
                    } else {
                        response[k] = this.maskAttribute(k, response[k]);
                    }
                }
            }
        
        return response;
    }

    maskAttribute(key, value) {
        switch (key.toLowerCase()) {
            case "email":
            case ":email":
            case "primaryemail":
            case ":primaryemail":
                if (typeof value === "string") {
                    return MaskData.instance.maskEmail2(value, emailMask2Options);
                }
                return value;
            case "phone_number":
            case ":phone_number":
            case "mobilephonenumber":
            case ":mobilephonenumber":
            case "primaryphone":
            case ":primaryphone":
            case "phone":
            case ":phone":
            case "accountphone":
            case ":accountphone":
                return MaskData.instance.maskPhone(value, maskPhoneOptions);
            case "address":
            case ":address":
            case "address1":
            case ":address1":
            case "address2":
            case ":address2":
            case "address3":
            case ":address3":
            case "address4":
            case ":address4":
            case "address5":
            case ":address5":
            case "city":
            case ":city":
            case "state":
            case ":state":
            case "stateprovince":
            case ":stateprovince":
            case "zipcode":
            case ":zipcode":
            case "country":
            case ":country":
            case "colony":
            case ":colony":
            case "province":
            case ":province":
            case "name":
            case ":name":
            case "given_name":
            case ":given_name":
            case "firstname":
            case ":firstname":
            case "lastname":
            case ":lastname":
            case "zip":
            case ":zip":
            case "lat":
            case ":lat":
            case "lon":
            case ":lon":
            case "langpref":
            case ":langpref":
            case "defaultaddress":
            case ":defaultaddress":
            case "postalcode":
            case ":postalcode":
                if (value.length > 2) {
                    return value.slice(0, 2) + Array(5).fill("*").join("") + value.slice(value.length - 1, value.length);
                } else if (value.length > 0) {
                    return value.slice(0, 1) + "***";
                } else {
                    return "***";
                }
            default:
                return value;
        }
    }
}

module.exports = new MaskData();
