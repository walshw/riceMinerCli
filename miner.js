const axios = require('axios').default;
const tokenizer = require('./multiplicationTokenizer');

const url = 'https://engine.freerice.com/games?lang=en';
const payload = { "category": "66f2a9aa-bac2-5919-997d-2d17825c1837", "level": 1, "user": null };




class Session {
    url = 'https://engine.freerice.com/games?lang=en';
    payload = { "category": "66f2a9aa-bac2-5919-997d-2d17825c1837", "level": 1, "user": null };
    data = {};

    async init() {
        const promise = await axios.post(url, payload);
        this.data = promise.data['data'];
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
        const answerId = this.findAnswer(answer, options);

        const questionPayload = { "answer": answerId, "question": questionId, "user": null };
        const promise = await axios.patch(`https://engine.freerice.com/games/${sessionId}/answer?lang=en`, questionPayload);

        this.data = promise.data['data'];
    }

    getPayload() {
        return { "answer": answerId, "question": questionId, "user": null };
    }

    // TODO: helper function, probs shouldnt be here tbh
    findAnswer(answer, options) {
        return options.find(option => option['text'] === answer + '')['id']
    }
}


async function main() {
    // res.data['data']['attributes']['question']['text']
    axios.post(url, payload).then(async res => {
        const sessionId = res.data['data']['id'];

        let questionId = res.data['data']['attributes']['question_id'];

        const question = res.data['data']['attributes']['question']['text'];
        const options = res.data['data']['attributes']['question']['options'];


        const answer = tokenizer.multiply((question));
        let answerId = findAnswer(answer, options);

        // console.log(question);
        // console.log(options);

        // console.log(answerId + " " + answer);



        // Go through here and go through the old way we got it to work and see why it worked




        // while (true) {
        const questionPayload = { "answer": answerId, "question": questionId, "user": null };

        axios.patch(`https://engine.freerice.com/games/${sessionId}/answer?lang=en`, questionPayload).then(x => {
            x.data
            console.log(x.data['data']);
        }).catch(err => {
            err
        });

        // await AnswerQuestion(sessionId, questionPayload);
        // }
    }).catch(err => console.log(err));
}


async function AnswerQuestion(sessionId, payload) {
    const promise = await axios.patch(`https://engine.freerice.com/games/${sessionId}/answer?lang=en`, payload);
    const questionId = promise.data['data']['attributes']['question']['text'];
    const question = res.data['data']['attributes']['question']['text'];
    const options = res.data['data']['attributes']['question']['options'];
    const answer = tokenizer.multiply((question));
    const answerId = findAnswer(answer, options);

    return new Answer(answerId, questionId);
}


// main();

(async () => {
    const sesh = new Session();
    await sesh.init();
    await sesh.answerQuestion();
    await sesh.answerQuestion();
    console.log(sesh.data['attributes']['rice'])
})();

// Fetch question
// Determine answer
// Submit answer
// Fetch next question

// Probably want to have a recursive function that calls itself on answering the question (check if we get a next question link)
// Want to have the possibility of scaling to have multiple requests going off at the same time



// have to make a PATCH to https://engine.freerice.com/games/<question_id>????? or is it just the ID of the promise?/answer?lang=en

// request to the id with the question_id in the payload, I THINK

function findAnswer(answer, options) {
    return options.find(option => option['text'] === answer + '')['id']
}