const shim = require('fabric-shim');
const Chaincode = require('./chaincode');

shim.start(new Chaincode());