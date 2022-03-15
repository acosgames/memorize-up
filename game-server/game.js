import cup from './acosg';

let defaultGame = {
    state: {
        _history: [],
        round: 0,
        pattern: [],
    },
    players: {},
    next: {},
    events: {}
}

class Tictactoe {

    onNewGame(action) {
        cup.setGame(defaultGame);
        this.checkNewRound();
    }

    onSkip(action) {
        let next = cup.next();
        if (!next || !next.id)
            return;

        this.playerLeave(next.id);
    }

    onJoin(action) {
        cup.log(action);
        if (!action.user.id)
            return;

        let player = cup.players(action.user.id);
        player.score = 0;
    }

    checkNewRound() {
        //if player count reached required limit, start the game
        //let maxPlayers = cup.rules('maxPlayers') || 2;
        this.newRound();
    }

    onLeave(action) {
        this.playerLeave(action.user.id);
    }

    playerLeave(userid) {
        this.setWinner(userid)
    }

    onPick(action) {

        let maxCorrect = this.checkGameover(action)

        if (maxCorrect > 0) {
            this.setWinner(action.user.id, maxCorrect);
            return;
        }

        this.newRound();
    }


    checkGameover(action) {
        let input = action?.payload;
        if (!input || !Array.isArray(input))
            return 1;

        let inputPattern = this.decodePattern(input);
        for (var i = 0; i < inputPattern.length; i++) {
            if (inputPattern[i] != state._history[i])
                return i + 1;
        }

        return 0;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    addPatterns() {
        let state = cup.state();
        state.pattern = [];

        for (let i = 0; i < 3; i++) {
            let nextPattern = this.getRandomInt(1, 5);
            state._history.push(nextPattern);
            state.pattern.push(nextPattern1);
        }
    }

    newRound() {
        let state = cup.state();
        state.round = state.round + 1;

        this.addPatterns();

        cup.next({ 'id': '*' });

        state.pattern = this.encodePattern();
        // cup.event('pattern', this.encodePattern());

        let minTime = Math.max(state._history.length, 5) + Math.round(state._history.length * 0.8);
        cup.setTimelimit(minTime);
    }

    decodePattern(input) {
        let output = [];
        for (var i = 0; i < input.length; i++) {
            let test = input[i];
            if (test & (0xF0000000)) {
                output.push(test >> 28);
            }
            if (test & (0x0F000000)) {
                output.push(test >> 24);
            }
            if (test & (0x00F00000)) {
                output.push(test >> 20);
            }
            if (test & (0x000F0000)) {
                output.push(test >> 16);
            }
            if (test & (0x0000F000)) {
                output.push(test >> 12);
            }
            if (test & (0x00000F00)) {
                output.push(test >> 8);
            }
            if (test & (0x000000F0)) {
                output.push(test >> 4);
            }
            if (test & (0x0000000F)) {
                output.push(test);
            }
        }

        return output;
    }

    encodePattern() {

        let state = cup.state();
        let pattern = state.pattern;

        let bits = 0;
        let output = [];
        let i = round * 3;

        if (pattern[i])
            bits |= (pattern[i])
        if (pattern[i + 1])
            bits |= (pattern[i + 1] << 4)
        if (pattern[i + 2])
            bits |= (pattern[i + 2] << 8)

        // output.push(bits);

        return bits;
    }


    // set the winner event and data
    setWinner(userid) {

        let player = cup.players(userid);
        player.rank = 1;
        player.score = maxCorrect;
        if (!player) {
            player.id = 'unknown player';
        }

        cup.gameover({
            type: 'winner',
            correct: maxCorrect
        });
        cup.next({});
    }
}

export default new Tictactoe();