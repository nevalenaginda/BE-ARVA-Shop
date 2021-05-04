const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "3ad2e30b",
  apiSecret: "WPmXG1KAiBk7mASf",
});

const sendSMS = (number, code) =>
  new Promise((resolve, reject) => {
    const from = "ZWallet Apps";
    const to = number;
    const textSms = `[ZWallet] One Time Password (OTP) Code : ${code}`;

    vonage.message.sendSms(from, to, textSms, (err, responseData) => {
      if (err) {
        reject(err);
      } else {
        if (responseData.messages[0]["status"] === "0") {
          resolve(true);
        } else {
          reject(responseData.messages[0]["error-text"]);
        }
      }
    });
  });

module.exports = sendSMS;
