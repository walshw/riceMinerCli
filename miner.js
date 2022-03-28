import Session from './session.js'
import readline from 'readline';

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
// (async () => {
//     const sesh = new Session();
//     console.log(sesh.runningTotal);
    
//     const start = Date.now();

//     await sesh.init();

//     while (keepPlaying) {
//         await sesh.answerQuestion();
//         console.log(`${sesh.runningTotal}`);

//         // so basically I am sleeping one minute intervals to see if by making one request every minute can we get stuck into an infinite loop
//         // IE, is it a number of requests? or a timeout that will just get refreshed if you try talking to it to check
//         if (sesh.timedOut) {
//             timeoutCount++;
//             await sleep(60000);
//             console.log(`Times slept: ${timeoutCount}`);
//         } else {
//             timeoutCount = 0;
//         }
//     }

//     // About a little less than 2k requests in about ~470s (7.8min)
//     // 15 min cooldown

//     const end = Date.now();

//     console.log(`Runtime: ${(end - start) / 1000} seconds (maybe make this mins:seconds????)`);
//     console.log(`Total rice: ${sesh.runningTotal}`);
// })().then(_ => process.exit());

function sleep(ms) {
    console.log("Sleeping");
    // TODO: loading spinner? with a duration or maybe even just a simple countdown
    return new Promise((resolve) => setTimeout(resolve, ms));
}
