

import React, { useEffect, useState } from 'react';

import fs from 'flatstore';
import { send } from '../acosg';

import buzzer1 from '../audio/buzzer1.mp3'
import sound1 from '../audio/sound1.mp3'
import sound2 from '../audio/sound2.mp3'
import sound3 from '../audio/sound3.mp3'
import sound4 from '../audio/sound4.mp3'

const sounds = [
    new Audio(buzzer1),
    new Audio(sound1),
    new Audio(sound2),
    new Audio(sound3),
    new Audio(sound4),
];


fs.set('isGameover', false);

function Note(props) {

    const [active, setActive] = useState(false);

    const id = props.id;
    const activeClass = (props.playNote == id || active) ? 'active' : '';
    var isPlaying = false;

    const playSound = (soundId) => {

        let isGameover = fs.get('isGameover');
        if (isGameover)
            return;
        let playAuto = fs.get('playAuto');
        // if (playAuto)
        //     return;

        // isPlaying = true;
        if (!playAuto)
            props.onNoteDone(soundId);

        setActive(true);
        setTimeout(() => {

            if (playAuto)
                props.onNoteDone(soundId);
            setActive(false);

        }, 350);

        sounds[soundId].currentTime = 0;
        sounds[soundId].play();


        // sounds[soundId].onended = (ev) => {
        //     if (props.playNote == soundId) {

        //     }

        // }
    };


    const clicked = () => {
        console.log('clicked cellid: ', id);

        let playAuto = fs.get('playAuto');
        if (playAuto || active) {
            return;
        }
        let state = fs.get('state');
        let userPos = fs.get('userPos') || 0;
        let savedPattern = fs.get('savedPattern');
        let userPattern = fs.get('userPattern') || [];

        let isGameStart = state.gamestatus == 'gamestart';
        if (isGameStart) {
            if (savedPattern[userPos] != id) {
                // let encoded = encodePattern(userPattern);
                send('pick', userPattern);
                fs.set('userPos', 0);
                playSound(0);
                return;
            }


            userPos += 1;
            userPattern.push(id);
            fs.set('userPos', userPos);
            fs.set('userPattern', userPattern);
        }

        playSound(id);



    }

    useEffect(() => {
        if (props['events-gameover']) {
            //playSound(0);
            fs.set('isGameover', true);
        }
        else if (props.playNote == id && !active) {
            playSound(id);
        }

    })


    return (
        <div
            className={"cell cell-" + id + ' ' + activeClass}
            onMouseDown={() => clicked(id)}
            onTouchStart={() => clicked(id)}
        >
            <div></div>
        </div>
    )

}


export default fs.connect(['playNote', 'events-gameover'])(Note);