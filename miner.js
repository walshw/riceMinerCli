const axios = require('axios').default;
const tokenizer = require('./multiplicationTokenizer');

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
