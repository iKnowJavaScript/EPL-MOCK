const crypto = require('crypto');
const cryptoCodeGenerator = () => {
  const generateCode = () => crypto.randomBytes(20).toString('hex');
  const generateLink = () => crypto.randomBytes(20).toString('hex');
  return {
    generateCode,
    generateLink
  };
};

module.exports = cryptoCodeGenerator();
