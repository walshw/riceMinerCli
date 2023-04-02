import { multiply } from './MultiplicationTokenizer.js';
import axios from 'axios';

export default class Session {
    url = 'https://engine.freerice.com/games?lang=en';
    payload = { "category": "66f2a9aa-bac2-5919-997d-2d17825c1837", "level": 1, "user": null };
    data = {};
    runningTotal = 0;
    previousRiceValue = 0;
    timedOut = false;
    numberOfRequests = 0;
    id = 0;

    constructor(id) {
        this.id = id;
    }

    async init() {
        try {
            this.numberOfRequests++;
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
        try {
            const sessionId = this.data['id'];
            const questionId = this.data['attributes']['question_id'];
            const question = this.data['attributes']['question']['text'];
            const options = this.data['attributes']['question']['options'];
            const answer = multiply((question));
            const answerId = this.#findAnswer(answer, options);
    
            const questionPayload = { "answer": answerId, "question": questionId, "user": null };
    
            this.numberOfRequests++;
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
