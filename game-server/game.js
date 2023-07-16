import cup from './acosg';

let defaultGame = {
    state: {
        _ninja: 'HAHAHAH',
        history: [],
        round: 3,
        //pattern: [],  
    },
    players: {},
    next: {},
    events: {}
}

class MemorizeUp {

    onNewGame(action) {
        cup.setGame(defaultGame);
        this.checkNewRound();
    }

    onSkip(action) {
        let next = cup.next();
        if (!next || !next.id)
            return;

        let players = cup.playerList();

        this.playerLeave(players[0]);
    }

    onJoin(action) {
        cup.log(action);
        if (!action.user.id)
            return;

        // action.test.hello = 1;

        let player = cup.players(action.user.id);
        player.rank = 1;
        player.score = 0;
        player._clown = 'YES ITS ME!';
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

        if (maxCorrect > -1) {
            this.setWinner(action.user.id, maxCorrect);
            return;
        }

        let player = cup.players(action.user.id);

        // let input = action?.payload;
        // if (!input || !Array.isArray(input) || input.length == 0)
        //     player.score = 0;
        // else


        let state = cup.state();
        player.score = state.round;
        state.round = state.round + 1;
        this.newRound();
    }


    checkGameover(action) {
        let input = action?.payload;
        if (!input || !Array.isArray(input) || input.length == 0)
            return 0;

        let state = cup.state();

        if (input.length < state.history.length)
            return input.length;
        // let inputPattern = this.decodePattern(input);
        for (var i = 0; i < input.length; i++) {
            if (input[i] != state.history[i])
                return i + 1;
        }


        return -1;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let r = cup.random();
        return Math.floor(r * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    addPatterns() {
        let state = cup.state();
        //state.pattern = [];

        let count = state.round == 3 ? 3 : 1;

        for (let i = 0; i < count; i++) {
            let nextPattern = this.getRandomInt(1, 5);
            state.history.push(nextPattern);
            // state.pattern.push(nextPattern);
        }
    }

    newRound() {
        let state = cup.state();


        this.addPatterns();

        cup.next('*');

        // state.pattern = this.encodePattern();   
        // cup.event('pattern', this.encodePattern());

        let minTime = Math.max(state.history.length * 1.5, 15);//+ Math.round(state.history.length * 0.8) * 100;
        cup.setTimelimit(minTime);
    }

    // set the winner event and data
    setWinner(userid, maxCorrect) {
        let state = cup.state();
        let player = cup.players(userid);
        if (!player) {
            player = {};
            player.id = 'unknown player';
        }
        player.rank = 1;
        player.score = state.round;


        cup.gameover({
            type: 'winner',
            correct: maxCorrect
        });
        // cup.next({});
    }
}

export default new MemorizeUp();