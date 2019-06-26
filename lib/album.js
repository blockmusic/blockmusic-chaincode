
module.exports = class Album{
    constructor(id, title, owner, songs, producer, released){
        this.id = id
        this.title = title
        this.owner = owner
        this.songs = songs
        this.producer = producer
        this.assetType = "Album"
        this.released = released
        this.payload = []

    }

    toJSON(){
        return{
            id: this.id,
            title: this.title,
            owner: this.owner, 
            songs: this.songs,
            producer: this.producer, 
            assetType: this.assetType,
            payload: this.payload,
            released: this.released
        }
    }

    setTransactionType(transactionType, transactionMaker){
        this.payload.push({
            transactionType: transactionType,
            transactionMaker: transactionMaker
        })
    }

}