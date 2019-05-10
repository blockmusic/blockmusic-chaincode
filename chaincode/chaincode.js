'use strict';

const { Contract } = require('fabric-contract-api');
const helper = require('./helper'); 


class Chaincode extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
    }

    async createAlbum(ctx, title, owner, songs, producer) {
        console.info('============= START : Create Album ===========');
        
        const id  = helper.generateID();

        var album = {
            assetType:"album",
            owner: owner,
            id: id,
            title: title,
            producer: producer,
            songs: songs,
            payload: []
          }
          let transaction = {
            transaction: 'createAlbum',
            timestamp: Math.floor(Date.now() / 1000)
          }
          album.payload.push(transaction)

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(album)));
        console.info('============= END : Create Album ===========');
    }

    async queryAsset(ctx, assetId) {
        const assetAsBytes = await ctx.stub.getState(assetId); 
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetId} does not exist`);
        }
        console.log(assetAsBytes.toString());
        console.log(JSON.parse(assetAsBytes))
        return JSON.parse(assetAsBytes);
    }


}

module.exports = Chaincode;
