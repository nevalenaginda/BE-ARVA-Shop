const client = require("twilio")("xxxx", "xxxx");

client.messages
  .create({
    to: "+6289522407667",
    from: "+154122949091",
    body: "Testing OTP",
  })
  .then((message) => console.log(message.sid))
  .catch((err) => {
    console.log(err.message);
  });
