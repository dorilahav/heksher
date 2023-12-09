'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./optimized-context.production.min.js');
} else {
  module.exports = require('./optimized-context.development.js');
}