const axios = require('axios').default;
const tokenizer = require('./multiplicationTokenizer');

const url = 'https://engine.freerice.com/games?lang=en';
const payload = { "category": "66f2a9aa-bac2-5919-997d-2d17825c1837", "level": 1, "user": null };


// res.data['data']['attributes']['question']['text']
axios.post(url, payload).then(res => {
    const question = res.data['data']['attributes']['question']['text'];
    console.log(tokenizer.multiply((question)));
}).catch(err => console.log(err))
