const path = require('path');

module.exports = {
    isProduction: false,
    rootPath: (...args) => path.join(__dirname, ...args),
    devServerPort: 5000,
    serverPort: 5010,
};
