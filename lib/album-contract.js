/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const Helper = require('../lib/helper');
const Album = require('../lib/album');

class AlbumContract extends Contract {

    async albumExists(ctx, albumId) {
        const buffer = await ctx.stub.getState(albumId);
        return (!!buffer && buffer.length > 0);
    }

    /** 
     * @param {Context} ctx 
     * @param {String} title
     * @param {String} owner
     * @param {String} songs
     * @param {String} producer
     */
    async createAlbum(ctx, title, owner, songs, producer) {
        try {
            // check args
            if (!title || !owner || !songs || !producer) throw new Error(`Incorrect number of arguments, expecting 4 `);

            // generate an unique id
            const albumId = Helper.generateID();

            // check if it already exists
            const exists = await this.albumExists(ctx, albumId);
            if (exists) throw new Error(`The album ${albumId} already exists`);

            // instanciate a new album
            let album = new Album(albumId, title, owner, songs, producer);

            // fill transaction data into payload
            const transactionMaker = Helper.getTransactionMaker(ctx.stub);
            album.setTransactionType("createAlbum", transactionMaker);

            const buffer = Buffer.from(JSON.stringify(album.toJSON()));
            await ctx.stub.putState(albumId, buffer);
            return {
                code: 201,
                data: album.toJSON(),
                message: "Album created successfully!",

            };
        }
        catch (error) {
            console.log(error);
            return {
                code: -1,
                data: error,
                message: error.toString()
            };
        }
    }

    /** 
     * @param {Context} ctx 
     * @param {String} albumId
     */
    async queryAlbum(ctx, albumId) {
        try {
            const exists = await this.albumExists(ctx, albumId);
            if (!exists) throw new Error(`The album ${albumId} does not exist`);

            const buffer = await ctx.stub.getState(albumId);
            const album = JSON.parse(buffer.toString());
            return {
                code: 200,
                data: album,
                message: `ALbum ${albumId} current state.`
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: -1,
                data: error,
                message: error.toString()
            };
        }
    }

    /** 
     * @param {Context} ctx 
     * @param {String} assetType
     */
    async queryAssetsByType(ctx, assetType) {
        try {
            if (!assetType) throw new Error(`Expecting assetType`);

            const query = {
                selector: {
                    assetType: {
                        "$regex": assetType
                    }
                }
            };

            let iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
            const assets = await Helper.getAllResults(iterator, false);

            return {
                code: 200,
                data: JSON.parse(JSON.stringify(assets)),
                message: `List of ${assetType}s`
            };

        }
        catch (error) {
            console.log(error);
            return {
                code: -1,
                data: error,
                message: error.toString()
            };
        }

    }

    /** get asset transaction history by unique key
     * @param {Context} ctx 
     * @param {String} assetId
     */
    async queryHistory(ctx, assetId) {
        try {
            if (!assetId) throw new Error(`Expecting assetId`);

            let result = await ctx.stub.getHistoryForKey(assetId);
            const assetHistory = await Helper.getAllResults(result, true);

            return {
                code: 200,
                data: JSON.parse(JSON.stringify(assetHistory)),
                message: `${assetId} history`
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: -1,
                data: error,
                message: error.toString()
            };
        }
    }

    /** 
     * @param {Context} ctx 
     * @param {String} albumId
     * @param {String} field
     * @param {String} newValue
     */
    async updateAlbum(ctx, albumId, field, newValue) {
        try {
            const exists = await this.albumExists(ctx, albumId);
            if (!exists) {
                throw new Error(`The album ${albumId} does not exist`);
            }
            let asset = { field: newValue };
            const buffer = Buffer.from(JSON.stringify(asset));
            await ctx.stub.putState(albumId, buffer);
            return {
                code: 200,
                data: asset,
                message: `Album ${albumId} updated successfully!`
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: -1,
                data: error,
                message: error.toString()
            };
        }

    }

    /** 
     * @param {Context} ctx 
     * @param {String} albumId
     */
    async deleteAlbum(ctx, albumId) {
        try {
            const exists = await this.albumExists(ctx, albumId);
            if (!exists) {
                throw new Error(`The album ${albumId} does not exist`);
            }
            await ctx.stub.deleteState(albumId);
            return {
                code: 200,
                data: [],
                message: `Album ${albumId} deleted successfully!`
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: -1,
                data: error,
                message: error.toString()
            };
        }
    }
}


module.exports = AlbumContract;
