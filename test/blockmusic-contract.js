/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { BlockmusicContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

function makeIterator(arrayEntry){

    var array = arrayEntry.map(item => { return {tx_id: 1, timestamp: 100000, is_delete: "true", value: Buffer.from(JSON.stringify(item))}} )
    
    let nextIndex = 0;

    return {
        next: () => {
            return nextIndex < array.length ?
                { value: array[nextIndex++], done: false } :
                { done: true };
        },
        close: () =>{

        }
    }
};

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('BlockmusicContract', () => {

    let contract;
    let ctx;

    let albumSample = {
        "title": "Unknown Pleasures",
        "owner": "Joy division",
        "songs": ["Desorder"], 
        "producer": "Producer"
    }

    beforeEach(() => {
        contract = new BlockmusicContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('123').resolves(Buffer.from(JSON.stringify(albumSample)));
        ctx.stub.getQueryResult.withArgs(sinon.match("123")).resolves(makeIterator([albumSample]))
    });

    describe('#albumExists', () => {

        it('should return true for a album', async () => {
            await contract.albumExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a album that does not exist', async () => {
            await contract.albumExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createAlbum', () => {

        it('should create a album', async () => {
            await contract.createAlbum(ctx, '1003', 'album 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"album 1003 value"}'));
        });

        it('should throw an error for a album that already exists', async () => {
            await contract.createAlbum(ctx, '1001', 'myvalue').should.be.rejectedWith(/The album 1001 already exists/);
        });

    });

    describe('#getAssetById', () => {

        it('should return a album', async () => {

            ctx.stub.getState.withArgs('123').resolves(Buffer.from(JSON.stringify(albumSample)));

            let response = await contract.getAssetById(ctx, '123');
            
            response.should.be.have.property('title').and.to.be.equal('Unknown Pleasures');
        });

        it('should throw an error for a album that does not exist', async () => {
            await contract.readAlbum(ctx, '1003').should.be.rejectedWith(/The album 1003 does not exist/);
        });

    });


});