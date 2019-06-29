/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const Helper = require('./utils/helper');
const ControlllerAlbum = require('./controllers/album-controller');

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
     * @param {String} id
     */
    async getAssetById(ctx, id){
        return Helper.getAsset(ctx, id);
    }


}


module.exports = BlockmusicContract;
