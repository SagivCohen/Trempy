kNN = require("k.n.n");

let data = [new kNN.Node({paramA: 1, paramB: 300, type: 'typeA'}),
    new kNN.Node({paramA: 3.1234, paramB: 350, type: 'typeA'}),
    new kNN.Node({paramA: 6, paramB: 1200, type: 'typeB'}),
    new kNN.Node({paramA: 8, paramB: 900, type: 'typeB'})]

let example = new kNN(data);

let results = example.launch(3, new kNN.Node({paramA: 4.1254, paramB: 350, type: false}));

console.log(results.type + ": " + results.percentage + "%");