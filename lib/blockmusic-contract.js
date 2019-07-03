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

    /** 
     * @param {Context} ctx 
     * @param {String} id
     * @param {String} keys
     * @param {String} values
     */
    async updateAlbum(ctx, id, keys, values){
        return ControlllerAlbum.updateAlbum(ctx, id, keys, values);
    }


}


module.exports = BlockmusicContract;
