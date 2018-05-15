const lotion = require('lotion');

const genesis = require.resolve('../genesis.json');
const validators = require('../config/validators');

// Configure lotion
const options = {
    lotionPort: 3000,
    p2pPort: 46656,
    tendermintPort: 46657,
    peers: validators.map((addr) => `${addr}:46656`),
    genesis: genesis,
    initialState: {
        messages: [{ sender: 'Nic', message: 'Roses are red, violets are blue and centralization is an old shoe.' }]
    }
};

let app = lotion(options);

// Middleware MUST be deterministic!
const msgHandler = (state, tx) => {
    // tx.sender has wrong type
    if (typeof tx.sender !== 'string') {
        return;
    }
    
    // Sender name is too long
    if (tx.sender.length > 24) {
        return;
    }

    // Sender name is empty
    if (tx.sender.length === 0) {
        return;
    }

    // Sender name is blank
    if (tx.sender.trim().length === 0) {
        return;
    }

    // tx.message has wrong type
    if (typeof tx.sender !== 'string') {
        return;
    }

    // tx.message is too long
    if (tx.message.length > 50) {
        return;
    }

    // Message is empty
    if (tx.message.length === 0) {
        return;
    }

    // Message is blank
    if (tx.message.trim().length === 0) {
        return;
    }

    state.messages.push({
        sender: tx.sender,
        message: tx.message
    });
};

// Register middleware
app.use(msgHandler);

app.listen(3000).then(genesis => {
    console.log(`App listening on port ${options.lotionPort}.`);
    console.log(genesis);
})
.catch(err => {
    console.error('Failed to start app', err);
});


// Handle errors
process.on('unhandledRejection', function(reason, p){
    console.log('Please report the following error as an GitHub issue on: ')
    console.log(
        ` 
        Please report the following error as an GitHub issue on:
        https://github.com/everywhe-re/validator
        `
    )
    console.log("Possibly unhandled rejection at: Promise ", p, " reason: ", reason);
    console.trace();
});