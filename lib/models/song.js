const Helper = require('../utils/helper');

module.exports = class Song{
    constructor(id, title, owner, songwriter, producer, released){
        if(arguments.length != 5)   throw new Error("Expecting 5 arguments!");
        else if(!id || !Helper.isString(id))  throw new Error("Invalid id");
        else if(!title || !Helper.isString(title))    throw new Error("Invalid title");
        else if(!owner || !Helper.isString(owner))   throw new Error("Invalid owner");
        else if(!songwriter || !Helper.isString(songwriter))   throw new Error("Invalid songwriter");
        else if(!producer || !Helper.isString(producer))   throw new Error("Invalid producer");


        Object.assign(this, {id, title, owner, songwriter, producer, released})
        
        this.assetType = "SONG";
        this.payload = [];
    }

    toJSON(){
        return{
            id: this.id,
            title: this.title,
            owner: this.owner, 
            songwriter: this.songwriter,
            producer: this.producer, 
            assetType: this.assetType,
            payload: this.payload
        }
    }
}