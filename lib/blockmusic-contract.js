/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const Helper = require('./utils/helper');
const ControlllerAlbum = require('./controllers/album-controller');
const ControllerSong = require('./controllers/song-controller');

class BlockmusicContract extends Contract {

    /** 
     * @param {Context} ctx 
     * @param {String} title
     * @param {String} owner
     * @param {String} songs
     * @param {String} producer
     */
    async createAlbum(ctx, title, owner, songs, producer) {
        return ControlllerAlbum.createAlbum(ctx, title, owner, songs, producer);
    }
    
    /** 
     * @param {Context} ctx 
     * @param {String} title
     * @param {String} owner
     * @param {String} songwriter
     * @param {String} producer
     */
    async createSong(ctx, title, owner, songwriter, producer) {
        return ControllerSong.createSong(ctx, title, owner, songwriter, producer);
    }

    /** 
     * @param {Context} ctx 
     * @param {String} id
     */
    async getAssetById(ctx, id){
        return Helper.getAsset(ctx, id);
    }

    async updateAlbum(ctx, id, keys, values){
        try{
            keys = JSON.parse(keys);
            values = JSON.parse(values);
    
            if(keys.length != values.length) throw new Error("Keys or Values incorrect");
    
            let album = await this.getAssetById(ctx, id);

            console.log("ALBUM", album)

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


module.exports = BlockmusicContract;
