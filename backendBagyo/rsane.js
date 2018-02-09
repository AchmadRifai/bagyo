const fs = require('fs')
const bigint = require('bigint')

rsane=(nggone)=>{
  this.nggone = nggone
  var key = bigint.Key()
  key.generate(2048, "10001")
}

module.exports = rsane;
