const Helper = require('../utils/helper');

module.exports = class Album{
    constructor(id, title, owner, songs, producer, released){
        if(arguments.length != 6)   throw new Error("Expecting 6 arguments!");
        else if(!id || !Helper.isString(id))  throw new Error("Invalid id");
        else if(!title || !Helper.isString(title))    throw new Error("Invalid title");
        else if(!owner || !Helper.isString(owner))   throw new Error("Invalid owner");
        else if(!songs || songs.length == 0)   throw new Error("Invalid songs");
        else if(!producer || !Helper.isString(producer))   throw new Error("Invalid producer");
        else if(!released)   throw new Error("Invalid released");

        Object.assign(this, {id, title, owner, songs, producer, released}, {assetType: "ALBUM", payload: []});
        
    }

    toJSON(){
        return Object.assign({}, this)
    }
}