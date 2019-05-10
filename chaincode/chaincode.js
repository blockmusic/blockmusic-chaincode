'use strict';
const shim = require('fabric-shim')
const helper = require('./helper')
const Album = require('./album')
const Song = require('./song')

let Chaincode = class {

    /** initialize chaincode
    * @param {*} stub
    */ 
    async Init(stub) {
        console.log('============= START : Init method ===========')
        return shim.success()
    }
    
    /** core method to execute the others 
    * @param {*} stub
    */ 
    async Invoke(stub) {
        console.log('============= START : Invoke method ===========')
        let ret = stub.getFunctionAndParameters()
        let method = this[ret.fcn];

        if (!method) {
            console.error('no function of name:' + ret.fcn + ' found')
            throw new Error('Received unknown function ' + ret.fcn + ' invocation')
        }

        try {
            let payload = await method(stub, ret.params)
            console.info('============= END : Invoke method ===========')
            return shim.success(payload)
        } catch (err) {
            console.log(err)
            console.log('============= END : Invoke method (ERROR) ===========')
            return shim.error(err)
        }
    }
    
    /** create Album asset
    * @param {*} stub
    * @arg[0] -- title
    * @arg[1] -- owner
    * @arg[2] -- songs
    * @arg[3] -- producer
    */ 
    async createAlbum(stub, args) {
        console.log('============= START : createAlbum  ===========')
        
        // check args
        if (args.length != 4)   throw new Error(`Incorrect number of arguments, expecting 4 `)
        
        // generate an id for the asset
        const id = helper.generateID()
        
        // check if it already exists
        const albumAsBytes = await stub.getState(id)
        if (albumAsBytes.toString())    throw new Error('This Album already exists: ' + id)
       
        // instanciate a new album
        let album = new Album(id, args[0], args[1], args[2], args[3])

        // fill transaction data into payload
        const transactionMaker = helper.getTransactionMaker(stub)
        album.setTransactionType("createAlbum", transactionMaker)

        // record it onto the ledger
        await stub.putState(id, helper.jsonToBytes(album.toJSON()))
        console.log('============= END : createAlbum  ===========')
        return  (helper.jsonToBytes(album.toJSON()))
    }

       
    /** create Album asset
    * @param {*} stub
    * @arg[0] -- title
    * @arg[1] -- owner
    * @arg[2] -- songwriter
    * @arg[3] -- producer
    */ 
   async createSong(stub, args) {
    console.log('============= START : createSong  ===========')
    if (args.length != 4)   throw new Error(`Incorrect number of arguments, expecting 4`)
    
    const id = helper.generateID()

    const songAsBytes = await stub.getState(id)
    if (songAsBytes.toString())    throw new Error('This Song already exists: ' + id)

    const song = new Song(id, args[0], args[1], args[2], args[3])

    const transactionMaker = helper.getTransactionMaker(stub)
    album.setTransactionType("createSong", transactionMaker)

    await stub.putState(id, helper.jsonToBytes(song.toJSON()))
    console.log('============= END : createSong  ===========')
    return (helper.jsonToBytes(song.toJSON()))
}

     /** get asset by unique key
     * @param {*} stub
     * @arg[0] -- id
     */ 
    async queryAsset(stub, args) {
        console.log('============= START : queryAsset  ===========')
        if (args.length != 1)   throw new Error(`Incorrect number of arguments, expecting 1`)

        const result = await stub.getState(args[0])
        console.log('============= END : queryAsset  ===========')
        return result
    }

    /**
    * @param {*} stub
    * @arg[0] -- Owner
    * @arg[1] -- (optional) assetType
    
    */ // get asset by owner 
    async queryAssetsByOwner(stub, args) {
        if (args.length < 1) throw new Error("Takes at least one argument! ")
        let query = {
            selector: {
                owner: {
                    "$regex": args[0]
                }
            }
        };
        if (args[1] != undefined) {
            query.selector.assetType = {
                "$eq": args[1]
            }
        }
        let iterator = await stub.getQueryResult(JSON.stringify(query))
        let result = await helper.getAllResults(iterator, false)

        return Buffer.from(JSON.stringify(result))
    }

     /**
    * @param {*} stub
    * @arg[0] -- type
    */ // get asset by asset type 
    async queryAssetsByType(stub, args) {
        console.log('============= START : queryAssetsByType  ===========')
        if (args.length != 1)   throw new Error(`Incorrect number of arguments, expecting 1`)

        let query = {
            selector: {
                assetType: {
                    "$regex": args[0]
                }
            }
        };

        let iterator = await stub.getQueryResult(JSON.stringify(query))
        let result = await helper.getAllResults(iterator, false)

        console.log('============= END : queryAssetsByType  ===========')
        return (helper.jsonToBytes(result))
    }

 /**
    * @param {*} stub
    * @arg[0] -- key
    
    */ // get asset transaction history by unique key
    async queryHistory(stub, args) {
        console.log('============= START : queryHistory  ===========')
        if (args.length != 1)   throw new Error(`Incorrect number of arguments, expecting 1`)

        let result = await stub.getHistoryForKey(args[0])
        const assetHistory = await helper.getAllResults(result, true);
        
        console.log('============= END : queryHistory  ===========')
        return (helper.jsonToBytes(assetHistory))
    }

};
shim.start(new Chaincode());


