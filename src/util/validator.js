const {body} = require('express-validator');

let validateMember = () => {
    return [ 
        body('username', 'username does not Empty').not().isEmpty(),
        body('username', 'username must be Alphanumeric').isAlphanumeric(),
        body('email', 'Invalid does not Empty').not().isEmpty(),
        body('email', 'Invalid email').isEmail(),
    ]; 
  }
  
  let validate = {
    validateMember: validateMember,
  };
  
  module.exports = {validate};