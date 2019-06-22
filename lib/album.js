
module.exports = class Album{
    constructor(id, title, owner, songs, producer){
        this.id = id
        this.title = title
        this.owner = owner
        this.songs = songs
        this.producer = producer
        this.assetType = "Album"
        this.released = Date.now()
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
            payload: this.payload
        }
    }

    setTransactionType(transactionType, transactionMaker){
        this.payload.push({
            transactionType: transactionType,
            timestamp: this.released,
            transactionMaker: transactionMaker
        })
    }

}