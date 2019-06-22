/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { AlbumContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

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

describe('AlbumContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new AlbumContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"album 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"album 1002 value"}'));
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

    describe('#readAlbum', () => {

        it('should return a album', async () => {
            await contract.readAlbum(ctx, '1001').should.eventually.deep.equal({ value: 'album 1001 value' });
        });

        it('should throw an error for a album that does not exist', async () => {
            await contract.readAlbum(ctx, '1003').should.be.rejectedWith(/The album 1003 does not exist/);
        });

    });

    describe('#updateAlbum', () => {

        it('should update a album', async () => {
            await contract.updateAlbum(ctx, '1001', 'album 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"album 1001 new value"}'));
        });

        it('should throw an error for a album that does not exist', async () => {
            await contract.updateAlbum(ctx, '1003', 'album 1003 new value').should.be.rejectedWith(/The album 1003 does not exist/);
        });

    });

    describe('#deleteAlbum', () => {

        it('should delete a album', async () => {
            await contract.deleteAlbum(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a album that does not exist', async () => {
            await contract.deleteAlbum(ctx, '1003').should.be.rejectedWith(/The album 1003 does not exist/);
        });

    });

});