import fs from 'flatstore';
import { useEffect } from 'react';
import { send } from '../acosg';
import Note from './Note';


fs.set('userPos', 0);

function MelodyManual(props) {


    const onNoteDone = (prevId) => {
        let pos = fs.get('userPos');

        if (pos == -1) {
            fs.set('playNote', null);
            return;
        }
        let playAuto = fs.get('playAuto');
        if (playAuto) {
            return;
        }

        let savedPattern = fs.get('savedPattern');
        if (!savedPattern)
            return;
        // let patternId = Math.floor(pos / 3);
        // if (pos > savedPattern.length) {
        //     fs.set('playNote', null);
        //     fs.set('userPos', -1);
        //     return;
        // }

        let note = savedPattern[pos - 1];
        // let decoded = decodePattern(bits);

        if (!note) {
            fs.set('playNote', null);
            fs.set('userPos', 0);
            return;
        }

        // let nextId = decoded[pos % 3];

        console.log("playing:", note);

        fs.set('playNote', null);
        // pos += 1;
        // fs.set('userPos', pos);

        if (pos >= savedPattern.length) {
            let state = fs.get('state');
            let gamestatus = fs.get('gamestatus');

            if (gamestatus == 'gamestart') {
                // let encoded = encodePattern(userPattern);
                let userPattern = fs.get('userPattern');
                send('pick', userPattern);
                fs.set('userPos', 0);

            }

        }
        // setPlays[nextId](true);
    }


    useEffect(() => {

    })

    return (
        <div className="gamearea">
            <Note key={'note-1'} id={1} onNoteDone={onNoteDone} />
            <Note key={'note-2'} id={2} onNoteDone={onNoteDone} />
            <Note key={'note-3'} id={3} onNoteDone={onNoteDone} />
            <Note key={'note-4'} id={4} onNoteDone={onNoteDone} />
        </div>
    )
}

export default MelodyManual;