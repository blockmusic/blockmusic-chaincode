module.exports = class Song{
    constructor(id, title, owner, songwriter, producer){
        this.id = id
        this.title = title
        this.owner = owner
        this.songwriter = songwriter
        this.producer = producer
        this.assetType = "Song"
        this.released = Date.now()
        this.payload = []

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

    setTransactionType(transactionType, transactionMaker){
        this.payload.push({
            transactionType: transactionType,
            timestamp: this.released,
            transactionMaker: transactionMaker
        })
    }

}