

class Person{
    constructor(name){
        this.name = name
    }
}


let x = new Person("jack", "haha");


console.log(x)


let album = ["title", "owner", "[\"song\"]", "producer"]


let y = {
    "data":
    {"id":"d8149a60-9a79-11e9-8c0e-fff6ef631fae","title":"title","owner":"owner","songs":["song"],"producer":"producer","assetType":"Album","released":{},"payload":[]
    },
    "message":"Album d8149a60-9a79-11e9-8c0e-fff6ef631fae created successfully!",
    "timestamp":{},
    "txId":"3074e1da18cbdbf1657579bb9e0d17cd9c42749fda67ac940a062e3f7f926a01",
    "txMaker":"admin",
    "txType":"CreateAlbum"
}