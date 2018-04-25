const request = require('request');
const config = require('./config.js');
const reserveDay = config.reserveDay;

function getAuthToken(callback) {
  let data = JSON.stringify({
    "username": config.reserveAccount,
    "password": config.reservePassword
  });

  let header = {
    "content-type": "application/json",
    "cache-control": "no-cache"
  }
  request.post({url:'https://booked.pdis.rocks/booked_tang/Web/Services/Authentication/Authenticate', form:data, headers: header}, function(err,httpResponse,body){
      let token = JSON.parse(body).sessionToken;
      callback(token);
  });
}

function bookSchedule(dict,authToken,callback) {
      var data = JSON.stringify({
            "startDateTime": new Date(dict.start).toISOString(),
            "endDateTime": new Date(dict.end).toISOString(),
            "description": "des",
            "resourceId": "65",
            "title": "另有公務行程",
            "userId": "505",
            "customAttributes": [
              {
                "attributeId": "3",
                "attributeValue": "另有公務行程"
              },
              {
                "attributeId": "4",
                "attributeValue": "可聯繫的email"
              },
              {
                "attributeId": "6",
                "attributeValue": "單位名稱"
              },
              {
                "attributeId": "5",
                "attributeValue": "另有公務行程"
              }
            ]
          });
      if(dict.username!=undefined) {
        data = JSON.stringify({
              "startDateTime": new Date(dict.start).toISOString(),
              "endDateTime": new Date(dict.end).toISOString(),
              "description": "des",
              "resourceId": "65",
              "title": dict.username,
              "userId": "505",
              "customAttributes": [
                {
                  "attributeId": "3",
                  "attributeValue": dict.username
                },
                {
                  "attributeId": "4",
                  "attributeValue": dict.email
                },
                {
                  "attributeId": "6",
                  "attributeValue": dict.department
                },
                {
                  "attributeId": "5",
                  "attributeValue": dict.description
                }
              ]
            });
      }


      let header = {
        "x-booked-sessiontoken":authToken,
        "x-booked-userid": "505",
        "content-type": "application/json",
        "cache-control": "no-cache"
      }

      request.post({url:'https://booked.pdis.rocks/booked_tang/Web/Services/Reservations/', form:data, headers: header}, function(err,httpResponse,body){
          console.log(body);
          callback(body);
      });
}

exports.getAuthToken = getAuthToken;
exports.bookSchedule = bookSchedule;