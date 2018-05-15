const lotion = require('lotion');

const validators = require('../config/validators');

const options = {
    lotionPort: 3000,
    p2pPort: 46656,
    tendermintPort: 46657,
    peers: validators.map((addr) => `${addr}:46656`),
    initialState: {
        messages: [{ sender: 'Nic', message: 'Roses are red, violets are blue and centralization is an old shoe.' }]
    }
};

let app = lotion(options);

// Middleware MUST be deterministic!
app.use((state, tx) => {
    if (state.count === tx.nonce) {
        state.count++;
    }
});

app.listen(3000).then(genesis => {
    console.log('App listening on port 3000. Congrats, you have launched your first blockchain!');
});