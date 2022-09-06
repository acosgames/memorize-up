import React, { useEffect } from 'react';
import fs from 'flatstore';
import flatstore from 'flatstore';

fs.set('local', {});
fs.set('state', {});
fs.set('players', {});
fs.set('rules', {});
fs.set('prev', {});
fs.set('next', {});
fs.set('events', {});

let needsReset = false;
let timerHandle = 0;
let memorizeTimerHandle = 0;

export function GameLoader(props) {



    const timerLoop = (cb) => {

        if (cb)
            cb();

        timerHandle = setTimeout(() => { timerLoop(cb) }, 100);


        let timer = fs.get('timer');
        if (!timer)
            return;

        let deadline = timer.end;
        if (!deadline)
            return;

        let now = (new Date()).getTime();
        let elapsed = deadline - now;

        if (elapsed <= 0) {
            elapsed = 0;
        }

        fs.set('timeleft', elapsed);

        // let events = fs.get('events');
        // if (events?.gameover) {
        //     clearTimeout(timerHandle);
        //     return;
        // }
    }


    const flatstoreUpdate = (message) => {
        if (!message)
            return;

        if (message.local) {
            fs.set('local', message.local);
        }
        if (message.timer) {
            fs.set('timer', message.timer);
        }

        if (message.players) {
            fs.set('players', message.players);
        }
        if (message.rules) {
            fs.set('rules', message.rules);
        }
        if (message.next) {
            fs.set('next', message.next);
        }
        if (message.events) {
            fs.set('events', message.events);
        }
        // if (message.prev) {
        //     fs.set('prev', message.prev);
        // }

        if (message?.room?.status) {
            fs.set('gamestatus', message.room.status);
        }
        if (message?.room?.sequence) {
            fs.set('gamesequence', message.room.sequence)
        }

        if (message.state) {

            let state = fs.get('state') || {};
            let prevRound = state?.round;
            let nextRound = message.state?.round;

            fs.set('state', message.state);
            //let pattern = message?.state?.history || [];//fs.get('savedPattern') || [];
            if (memorizeTimerHandle) {
                clearTimeout(memorizeTimerHandle);
            }
            memorizeTimerHandle = setTimeout(() => {
                //if (prevRound != nextRound) {
                // pattern = pattern.concat(message.state.pattern);
                fs.set('savedPattern', message?.state?.history);
                fs.set('playPos', -1);
                fs.set('userPos', 0);
                fs.set('userPattern', []);
                fs.set('playAuto', true);
                //}
            }, 1000)

        }

        if (message.events) {
            fs.set('events', message.events);
        }
    }



    const onMessage = (evt) => {

        // console.log("MESSAGE EVENT CALLED #1");
        let message = evt.data;
        let origin = evt.origin;
        let source = evt.source;
        if (!message || message.length == 0)
            return;

        console.log('New Game State:', message);

        // if (needsReset) {
        //     flatstoreUpdate({
        //         local: {},
        //         state: {},
        //         players: {},
        //         events: {},
        //         next: {},
        //         timer: {},
        //         rules: {},
        //     })
        //     needsReset = false;
        // }

        flatstoreUpdate(message);

        if (message && message?.events?.gameover) {
            needsReset = true;
        }

    }



    useEffect(() => {
        console.log("ATTACHING TO MESSAGE EVENT");
        window.addEventListener('message', onMessage, false);
        console.log("CREATING TIMER LOOP");
        timerLoop();

        send('ready', true);
    }, []);


    let Comp = props.component;
    return (<Comp></Comp>)
}



export async function send(type, payload) {
    window.parent.postMessage({ type, payload }, '*');
}