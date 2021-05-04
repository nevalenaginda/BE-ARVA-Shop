const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
  validAuthUser: (body) => {
    const schema = {
      email: { type: "string", min: 5, max: 64 },
      password: { type: "string", min: 5, max: 64 },
    };
    const check = v.compile(schema);
    return check(body);
  },
};
