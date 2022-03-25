const axios = require('axios').default;
const readline = require('readline');
const tokenizer = require('./multiplicationTokenizer');

class Session {
    url = 'https://engine.freerice.com/games?lang=en';
    payload = { "category": "66f2a9aa-bac2-5919-997d-2d17825c1837", "level": 1, "user": null };
    data = {};
    runningTotal = 0;
    previousRiceValue = 0;
    timedOut = false;

    async init() {
        try {
            const promise = await axios.post(this.url, this.payload);
            this.data = promise.data['data'];
            this.timedOut = false;
        } catch (error) {
            if (error['response']['status'] === 429) {
                console.log("Too many requests we gotta chill out");
                this.timedOut = true;
            }
        }
    }

    /**
     * Answers a question and gets the object ready for the next question.
     */
    async answerQuestion() {
        const sessionId = this.data['id'];
        const questionId = this.data['attributes']['question_id'];
        const question = this.data['attributes']['question']['text'];
        const options = this.data['attributes']['question']['options'];
        const answer = tokenizer.multiply((question));
        const answerId = this.#findAnswer(answer, options);

        const questionPayload = { "answer": answerId, "question": questionId, "user": null };

        try {
            const promise = await axios.patch(`https://engine.freerice.com/games/${sessionId}/answer?lang=en`, questionPayload);

            this.data = promise.data['data'];
            // TODO: this might be a case that never gets hit...
            this.timedOut = false;

            if (this.data['attributes']['answer']['correct']) {
                this.runningTotal += 10;
            }
        } catch (error) {
            // Typically 400 error in this case indicates that we have run out of potential questions and must recreate the session.

            // TODO: how to handle 429...
            // 429 means too many requests
            console.log("Re-initializing session");
            await this.init();
        }
    }

    #findAnswer(answer, options) {
        return options.find(option => option['text'] === answer + '')['id']
    }
}

let keepPlaying = true;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
console.log("Press \'x\' at any time to stop mining.");
process.stdin.on('keypress', (str, key) => {
    if (key.name === 'x') {
        keepPlaying = false;
        console.log("Stopping miner, finishing remaining tasks...");
    } else if (key.ctrl && key.name === 'c') {
        console.log("ABORTING...");
        process.exit();
    }
});

let timeoutCount = 0;

// TODO: run multiple sessions
(async () => {
    const sesh = new Session();
    console.log(sesh.runningTotal);
    
    const start = Date.now();

    await sesh.init();

    while (keepPlaying) {
        await sesh.answerQuestion();
        console.log(`${sesh.runningTotal}`);

        // so basically I am sleeping one minute intervals to see if by making one request every minute can we get stuck into an infinite loop
        // IE, is it a number of requests? or a timeout that will just get refreshed if you try talking to it to check
        if (sesh.timedOut) {
            timeoutCount++;
            await sleep(60000);
            console.log(`Times slept: ${timeoutCount}`);
        } else {
            timeoutCount = 0;
        }
    }

    // About a little less than 2k requests in about ~470s (7.8min)
    // 15 min cooldown

    const end = Date.now();

    console.log(`Runtime: ${(end - start) / 1000} seconds (maybe make this mins:seconds????)`);
    console.log(`Total rice: ${sesh.runningTotal}`);
})().then(_ => process.exit());

function sleep(ms) {
    console.log("Sleeping");
    // TODO: loading spinner? with a duration or maybe even just a simple countdown
    return new Promise((resolve) => setTimeout(resolve, ms));
}


// Convert this into a module, npm init type deal so we can have better import/exports
// also so we can get top level awaits with the newest version of node.