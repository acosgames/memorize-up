
import React, { Component } from 'react';

import fs from 'flatstore';
import Timeleft from './timeleft';
import Timeboard from './Timeboard';

function Scoreboard(props) {



    return (
        <div className="player-panel">
            <div className="hstack" style={{ alignItems: "center", justifyContent: "center" }}>
                <div className="score">{props['state-round'] || 0}</div>
                <Timeboard />
            </div>
        </div>
    )


}

export default fs.connect(['state-round'])(Scoreboard);;