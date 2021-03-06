/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Helper = require('./utils/helper');
const ControlllerAlbum = require('./controllers/album-controller');
const ControllerSong = require('./controllers/song-controller');


/*  Extends default context variable to have a list of events that can be emitted by a transaction  */
class BlockmusicContext extends Context {
    constructor(){
        super();
        this.events = [];
    }
}

class BlockmusicContract extends Contract {
    
    createContext(){
        return new BlockmusicContext();
    }

    /** 
     * @param {Context} ctx 
     */
    async beforeTransaction(ctx){
        // TO DO: authorization by MSPID
    }

    /** 
     * @param {Context} ctx 
     */
    async afterTransaction(ctx){
        if(ctx.events != undefined && ctx.events.length > 0){
            ctx.stub.setEvent("blockmusicEvent", Buffer.from(JSON.stringify(ctx.events)));
        }
    }

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


    /** 
     * @param {Context} ctx 
     * @param {String} pageSize
     * @param {String} bookmark
     */
    async queryAlbumsWithPagination(ctx, pageSize, bookmark){
        return ControlllerAlbum.queryAlbumsWithPagination(ctx, pageSize, bookmark);
    }


}


module.exports = BlockmusicContract;
