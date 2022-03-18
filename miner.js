const axios = require('axios').default;
const tokenizer = require('./multiplicationTokenizer');

const url = 'https://engine.freerice.com/games?lang=en';
const payload = { "category": "66f2a9aa-bac2-5919-997d-2d17825c1837", "level": 1, "user": null };


// res.data['data']['attributes']['question']['text']
axios.post(url, payload).then(res => {
    const sessionId = res.data['data']['id'];
    const questionId = res.data['data']['attributes']['question_id'];

    const question = res.data['data']['attributes']['question']['text'];
    const options = res.data['data']['attributes']['question']['options'];


    const answer = tokenizer.multiply((question));
    const answerId = findAnswer(answer, options);

    console.log(question);
    console.log(options);

    console.log(answerId + " " + answer);

    const questionPayload = {"answer": answerId,"question":questionId,"user":null};


    axios.patch(`https://engine.freerice.com/games/${sessionId}/answer?lang=en`, questionPayload).then(res2 => console.log(res2.data));
}).catch(err => console.log(err));


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