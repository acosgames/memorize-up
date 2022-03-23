
import Scoreboard from './Scoreboard';
import MelodyAuto from './MelodyAuto';
import MelodyManual from './MelodyManual';

import fs from 'flatstore';

function Gamescreen(props) {

    return (
        <>
            <div className="gamescreen">
                <Scoreboard />
                <div className="gamearea-wrapper">
                    <Melody />
                </div>
            </div>
        </>
    )
}


function Melody(props) {
    if (props.playAuto)
        return (<MelodyAuto />);

    return (<MelodyManual />)
}

Melody = fs.connect(['playAuto'])(Melody);


export default Gamescreen;