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


        this.id = id;
        this.title = title;
        this.owner = owner;
        this.songs = songs;
        this.producer = producer;
        this.assetType = "ALBUM";
        this.released = released;
        this.payload = [];

    }

    toJSON(){
        return{
            id: this.id,
            title: this.title,
            owner: this.owner, 
            songs: this.songs,
            producer: this.producer, 
            assetType: this.assetType,
            released: this.released,
            payload: this.payload
            
        }
    }

}