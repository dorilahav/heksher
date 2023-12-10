'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./heksher.production.min.js');
} else {
  module.exports = require('./heksher.development.js');
}