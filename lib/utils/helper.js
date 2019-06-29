const ClientIdentity = require('fabric-shim').ClientIdentity;
const uuid = require("uuid/v1");

module.exports = class Helper {

    static generateUUID() {
        return uuid();
    }
    
    static isString(x) {
        return Object.prototype.toString.call(x) === "[object String]";
    }

    static deleteUndefined(obj){
        Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
        return obj;
    }

    static async extractIterator(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();
            console.log(res)
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.IsDelete = res.value.is_delete.toString();
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        console.log(res.value.value.toString('utf8'));
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        console.log(res.value.value.toString('utf8'));
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                await iterator.close();
                console.log(allResults)
                console.log('End: getAllResults');
                return allResults;
            }
        }
    }

    static jsonToBytes(response){
        return Buffer.from(JSON.stringify(response));
    }
    
    static getTransactionMaker(ctx){
        let _clientIdentity = new ClientIdentity(ctx.stub); 
        let _cert = _clientIdentity.getX509Certificate();
        if (_cert.subject.commonName)   return _cert.subject.commonName;
        else  return null;
    }

    static async getTxTimestamp(ctx){
        return ctx.stub.getTxTimestamp().seconds.low
    }

    static async doesItExist(ctx, assetId) {
        const buffer = await ctx.stub.getState(assetId);
        return (!!buffer && buffer.length > 0);
    }

    static async getAsset(ctx, assetId) {
        const exists = await this.doesItExist(ctx, assetId);
        if (!exists)    throw new Error(`The asset ${assetId} does not exist`);
        
        const buffer = await ctx.stub.getState(assetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    static async getAssetHistory(ctx, assetId) {
        const exists = await this.doesItExist(ctx, assetId);
        if (!exists)    throw new Error(`The asset ${assetId} does not exist`);

        let iterator = await ctx.stub.getHistoryForKey(assetId);
        const result = await this.extractIterator(iterator, true);
        return result
    }

    static async deleteAsset(ctx, assetId) {
        const exists = await this.doesItExist(ctx, assetId);
        if (!exists)    throw new Error(`The asset ${assetId} does not exist`);
        
        await ctx.stub.deleteState(assetId);
    }

}

