


const Album = require('../models/album');
const Helper = require('../utils/helper');

module.exports = class ControllerAlbum {
    static async createAlbum(ctx, title, owner, songs, producer) {
        try {
            // create an unique id
            const albumId = Helper.generateUUID();

            // intantiate an album object 
            const album = new Album(albumId, title, owner, JSON.parse(songs), producer, Helper.getTxTimestamp(ctx));

            // JSON to buffer
            const buffer = Helper.jsonToBytes(album.toJSON());

            // Record it into the ledger 
            await ctx.stub.putState(albumId, buffer);

            // Emit an event about the transaction
            ctx.stub.setEvent('CreateAlbum', buffer);

            return {
                data: album.toJSON(),
                message: `Album ${albumId} created successfully!`,
                txTimestamp:  Helper.getTxTimestamp(ctx),
                txId: ctx.stub.getTxID(),
                txMaker: Helper.getTransactionMaker(ctx)
            }
        }
        catch (error) {
            console.log(error.toString());
            return error.toString();
        }
    }

    static async updateAlbum(ctx, id, keys, values){
        try{
            keys = JSON.parse(keys);
            values = JSON.parse(values);
    
            if(keys.length != values.length) throw new Error("Keys or Values incorrect");
    
            let album = await this.getAssetById(ctx, id);

            let update = {}
            for(let i = 0; i < keys.length; i++){
                update[keys[i]] = values[i];
            }

            album = Object.assign(album, update);

            const buffer = Helper.jsonToBytes(album);
            await ctx.stub.putState(id, buffer);
            return{
                "message": "Album updated successfully"
            }
        }
        catch(error){
            console.log(error.toString());
        }
    }
}

