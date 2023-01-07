
import React, { Component } from 'react';

import fs from 'flatstore';
import Timeleft from './timeleft';
import Timeboard from './Timeboard';

function Scoreboard(props) {

    let [state] = fs.useWatch('state');

    return (
        <div className="player-panel">
            <div className="hstack" style={{ alignItems: "center", justifyContent: "center", height: '100%' }}>
                <div className="score">{state.round || 0}</div>
                <Timeboard />
            </div>
        </div>
    )
}

export default Scoreboard;