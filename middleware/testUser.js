const { BadRequestError } = require("../errors");

const testUser = (req, res,next) => {
  if (req.user.testUser) {
    throw new BadRequestError("You cannot perform this action ");
    }
    next()
};


module.exports = testUser