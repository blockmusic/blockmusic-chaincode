'use strict';

const { Contract } = require('fabric-contract-api');
const helper = require('./helper'); 
const Album = require('./album');
const Song = require('./song');


class Chaincode extends Contract {
   
   /** initialize chaincode
    * @param {Context} ctx 
    */
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
    }

   /** create Album asset
    * @param {Context} ctx 
    * @param {String} title
    * @param {String} owner
    * @param {String} songs
    * @param {String} producer
    */
    async createAlbum(ctx, title, owner, songs, producer) {
        console.info('============= START : Create Album ===========');
        
         // check args
         if (!title && !owner && !songs && !producer)   throw new Error(`Incorrect number of arguments, expecting 4 `)
        
         // generate an id for the asset
         const id = helper.generateID()
         
         // check if it already exists
         const albumAsBytes = await ctx.stub.getState(id)
         if (albumAsBytes.toString())    throw new Error('This Album already exists: ' + id)
        
         // instanciate a new album
         let album = new Album(id, title, owner, songs, producer)
 
         // fill transaction data into payload
         const transactionMaker = helper.getTransactionMaker(ctx.stub)
         album.setTransactionType("createAlbum", transactionMaker)
 
         // record it onto the ledger
         await ctx.stub.putState(id, helper.jsonToBytes(album.toJSON()))
         console.log('============= END : createAlbum  ===========')
         return  (helper.jsonToBytes(album.toJSON()))
    }
    /** get asset by unique key
     * @param {Context} ctx 
     * @param {String} assetId
     */ 
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
