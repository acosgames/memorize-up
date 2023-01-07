

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

    let [playNote] = fs.useWatch('playNote');
    let [eventsGameover] = fs.useWatch('events-gameover');


    const id = props.id;
    const activeClass = (playNote == id || active) ? 'active' : '';
    let timeHandle = 0;

    const playSound = (soundId) => {
        let playAuto = fs.get('playAuto');

        if (!playAuto)
            props.onNoteDone(soundId);

        setActive(true);

        if (playAuto) {
            timeHandle = setTimeout(() => {
                props.onNoteDone(soundId);
                setActive(false);
            }, 350);
        }
        else {
            timeHandle = setTimeout(() => {
                setActive(false);
            }, 200);
        }

        sounds[soundId].currentTime = 0;
        try {
            PlayAudio(soundId);
        }
        catch (e) {
        }
    };

    const PlayAudio = async (soundId) => {
        try {
            await sounds[soundId].play();
        }
        catch (e) {
        }
    }

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

        let gamestatus = fs.get('gamestatus');
        let isGameStart = gamestatus == 'gamestart';
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
        if (playNote == id && !active) {
            playSound(id);
        }
    })

    useEffect(() => {
        return () => { clearTimeout(timeHandle) }
    }, [])

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

export default Note;