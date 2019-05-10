const ClientIdentity = require('fabric-shim').ClientIdentity;

class Helper {
    
    // convert iterator to array of objects
    static async getAllResults(iterator, isHistory) {
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

    // generate unique id 
    static generateID(){
            var text = ""
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var timestamp = Date.now()

            for (var i = 0; i < 10; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length))

            console.log("text ", text)

            return timestamp + text
          
        
    }

    static jsonToBytes(response){
        let result = JSON.stringify(response);
        return Buffer.from(result);
    }

    static getTransactionMaker(stub){
        console.log('============= START : getTransactionMaker  ===========')

        let _clientIdentity = new ClientIdentity(stub); 
        let _cert = _clientIdentity.getX509Certificate();

        if (_cert.subject.commonName){
            console.log('Transaction Owner = ' + _cert.subject.commonName);
            console.log('============= END : getTransactionMaker  ===========')
            return _cert.subject.commonName;
        } else {
            console.log('============= END : getTransactionMaker (NULL) ===========')
            return null;
        }
    }


          

    

}

module.exports = Helper