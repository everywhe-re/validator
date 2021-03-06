const lotion = require('lotion');

const genesis = require.resolve('../genesis.json');
const lotionPort = 3000;
const config = require('../config/config');
const dev = process.env.DEV || false;

// Build basic configuration
const options = {
    lotionPort: lotionPort,
    p2pPort: 46656,
    tendermintPort: 46657,
    initialState: {
        messages: [{ sender: 'Nic', message: 'Roses are red, violets are blue and centralization is an old shoe.' }]
    }
};

// Update config based on the environment
if (dev) {
    options.devMode = true;
} else {
    options.keys = 'validator_priv.json';
    options.peers = config.peers.map((addr) => `${addr}:46656`);
    options.genesis = genesis;
}

// Print config
console.log('Using config', options);

// Initialize lotion app
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
}, (err) => {
    console.error('Failed to start app', err);
});


// Handle errors
process.on('unhandledRejection', function(reason, p){
    console.log('Please report the following error as an GitHub issue at: ')
    console.log(
        ` 
        Please report the following error as an GitHub issue at:
        https://github.com/everywhe-re/validator
        `
    )
    console.log("Possibly unhandled rejection at: Promise ", p, " reason: ", reason);
    console.trace();
});