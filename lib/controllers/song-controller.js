const Song = require('../models/song');
const Helper = require('../utils/helper');

module.exports = class ControllerSong {
    static async createSong(ctx, title, owner, songwriter, producer) {
        try {
            // create an unique id
            const songId = Helper.generateUUID();

            // intantiate an album object 
            const song = new Song(songId, title, owner, songwriter, producer, Helper.getTxTimestamp(ctx));

            // JSON to buffer
            const buffer = Helper.jsonToBytes(song.toJSON());

            // Record it into the ledger 
            await ctx.stub.putState(songId, buffer);
            return {
                data: song.toJSON(),
                message: `Song ${songId} created successfully!`,
                txTimestamp:  Helper.getTxTimestamp(ctx),
                txId: ctx.stub.getTxID(),
                txMaker: Helper.getTransactionMaker(ctx),
                txType: "CreateSong"
            }
        }
        catch (error) {
            console.log(error.toString());
            return error.toString();
        }
    }
}

