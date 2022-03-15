const axios = require('axios').default;

const payload = { "category": "66f2a9aa-bac2-5919-997d-2d17825c1837", "level": 1, "user": null };

axios.post('https://engine.freerice.com/games?lang=en', payload).then(res => {
    console.log(res.data['data']['attributes']['question']);
}).catch(err => console.log(err))
