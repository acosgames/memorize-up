import fs from 'flatstore';
import { useEffect } from 'react';
import Note from './Note';


fs.set('playPos', -1);

function MelodyAuto(props) {


    const onNoteDone = (prevId) => {
        let pos = fs.get('playPos');
        // let playNote = fs.get('playNote');

        // if (playNote == null)
        //     return;

        if (pos == -1) {
            // fs.set('playNote', null);

            return;
        }

        let savedPattern = fs.get('savedPattern');
        if (!savedPattern) {
            fs.set('playNote', null);
            fs.set('playAuto', false);
            return;
        }
        // let patternId = Math.floor(pos / 3);


        let note = savedPattern[pos];
        // let decoded = decodePattern(bits);

        if (!note) {
            fs.set('playNote', null);
            fs.set('playAuto', false);
            return;
        }

        // let nextId = decoded[pos % 3];

        console.log("playing:", note);


        pos += 1;
        if (pos > savedPattern.length) {
            fs.set('playNote', null);
            fs.set('playAuto', false);
            return;
        }

        fs.set('playPos', pos);
        fs.set('playNote', note);
        // setPlays[nextId](true);
    }

    const startPlayBack = () => {
        fs.set('playPos', 0);
        onNoteDone(-1)
    }

    useEffect(() => {
        let playPos = fs.get('playPos');
        if (playPos == -1)
            startPlayBack();

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

export default fs.connect(['playAuto'])(MelodyAuto);