/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./game-server/acosg.js":
/*!******************************!*\
  !*** ./game-server/acosg.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

class ACOSG {
    constructor() {
        try {
            this.actions = globals.actions();
        }
        catch (e) { this.error('Failed to load actions'); return }
        try {
            this.originalGame = globals.game();
        }
        catch (e) { this.error('Failed to load originalGame'); return }
        try {
            this.nextGame = globals.game();
        }
        catch (e) { this.error('Failed to load nextGame'); return }


        this.currentAction = null;

        this.isNewGame = false;
        // this.markedForDelete = false;
        this.defaultSeconds = 15;
        // this.nextTimeLimit = -1;
        this.kickedPlayers = [];

        this.randomFunc = null;
        // if (!this.nextGame || !this.nextGame.rules || Object.keys(this.nextGame.rules).length == 0) {
        //     this.isNewGame = true;
        //     this.error('Missing Rules');
        // }

        if (this.nextGame) {
            if (!('timer' in this.nextGame)) {
                this.nextGame.timer = {};
            }
            if (!('state' in this.nextGame)) {
                this.nextGame.state = {};
            }

            if (!('players' in this.nextGame)) {
                this.nextGame.players = {};
            }

            //if (!('prev' in this.nextGame)) {
            this.nextGame.prev = {};
            //}

            if (!('next' in this.nextGame)) {
                this.nextGame.next = {};
            }

            if (!('rules' in this.nextGame)) {
                this.nextGame.rules = {};
            }

            this.nextGame.events = {};
        }
    }

    on(type, cb) {

        // if (type == 'newgame') {
        //     //if (this.isNewGame) {
        //     this.currentAction = this.actions[0];
        //     if (this.currentAction.type == '')
        //         cb(this.actions[0]);
        //     this.isNewGame = false;
        //     //}

        //     return;
        // }

        for (var i = 0; i < this.actions.length; i++) {
            if (this.actions[i].type == type) {
                this.currentAction = this.actions[i];
                let result = cb(this.currentAction);
                if (typeof result == "boolean" && !result) {
                    this.ignore();
                    break;
                }
            }

        }

    }

    ignore() {
        globals.ignore();
    }

    setGame(game) {
        for (var id in this.nextGame.players) {
            let player = this.nextGame.players[id];
            game.players[id] = player;
        }
        if (!this.nextGame)
            this.nextGame = {};

        for (const key in game) {
            if (key == 'room')
                continue;
            this.nextGame[key] = game[key];
        }
        // this.nextGame = game;
    }

    submit() {
        if (this.kickedPlayers.length > 0)
            this.nextGame.kick = this.kickedPlayers;

        globals.finish(this.nextGame);
    }

    gameover(payload) {
        this.event('gameover', payload);
    }

    log() {
        // globals.log.apply(globals, arguments);
        globals.log(arguments)
        // globals.log(msg);
    }
    error() {
        // globals.error.apply(globals, arguments);
        globals.error(arguments);
    }

    kickPlayer(id) {
        this.kickedPlayers.push(id);
    }

    database() {
        return globals.database();
    }

    action() {
        return this.currentAction;
    }

    state(key, value) {

        if (typeof key === 'undefined')
            return this.nextGame.state;
        if (typeof value === 'undefined')
            return this.nextGame.state[key];

        this.nextGame.state[key] = value;
    }

    playerList() {
        return Object.keys(this.nextGame.players);
    }
    playerCount() {
        return Object.keys(this.nextGame.players).length;
    }

    players(userid, value) {
        if (typeof userid === 'undefined')
            return this.nextGame.players;
        if (typeof value === 'undefined')
            return this.nextGame.players[userid];

        this.nextGame.players[userid] = value;
    }

    rules(rule, value) {
        if (typeof rule === 'undefined')
            return this.nextGame.rules;
        if (typeof value === 'undefined')
            return this.nextGame.rules[rule];

        this.nextGame.rules[rule] = value;
    }

    prev(obj) {
        if (typeof obj === 'object') {
            this.nextGame.prev = obj;
        }
        return this.nextGame.prev;
    }

    next(obj) {
        if (typeof obj === 'undefined' || obj == null) {
            return this.nextGame.next;
        }

        if (typeof obj === 'object' && !Array.isArray(obj)) {
            this.nextGame.next = obj;
        }

        this.nextGame.next = { id: obj };
    }

    setTimelimit(seconds) {
        seconds = seconds || this.defaultSeconds;
        if (!this.nextGame.timer)
            this.nextGame.timer = {};
        this.nextGame.timer.set = Math.min(60, Math.max(10, seconds));
    }

    reachedTimelimit(action) {
        if (typeof action.timeleft == 'undefined')
            return false;
        return action.timeleft <= 0;
    }

    event(name, payload) {
        if (!payload)
            return this.nextGame.events[name];

        this.nextGame.events[name] = payload || {};
    }

    clearEvents() {
        this.nextGame.events = {};
    }

    //discrete random using room data, initialized before server script is run
    random() {
        return globals.random();
    }

    // events(name) {
    //     if (typeof name === 'undefined')
    //         return this.nextGame.events;
    //     this.nextGame.events.push(name);
    // }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new ACOSG());

/***/ }),

/***/ "./game-server/game.js":
/*!*****************************!*\
  !*** ./game-server/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _acosg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./acosg */ "./game-server/acosg.js");


let defaultGame = {
    state: {
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
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.setGame(defaultGame);
        this.checkNewRound();
    }

    onSkip(action) {
        let next = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.next();
        if (!next || !next.id)
            return;

        let players = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.playerList();

        this.playerLeave(players[0]);
    }

    onJoin(action) {
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.log(action);
        if (!action.user.id)
            return;

        // action.test.hello = 1;

        let player = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.players(action.user.id);
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

        if (maxCorrect > -1) {
            this.setWinner(action.user.id, maxCorrect);
            return;
        }

        // let player = cup.players(action.user.id);

        // let input = action?.payload;
        // if (!input || !Array.isArray(input) || input.length == 0)
        //     player.score = 0;
        // else
        //     player.score = input.length;

        let state = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state();
        state.round = state.round + 1;
        this.newRound();
    }


    checkGameover(action) {
        let input = action?.payload;
        if (!input || !Array.isArray(input) || input.length == 0)
            return 0;

        let state = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state();

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
        let r = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.random();
        return Math.floor(r * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    addPatterns() {
        let state = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state();
        //state.pattern = [];

        let count = state.round == 3 ? 3 : 1;

        for (let i = 0; i < count; i++) {
            let nextPattern = this.getRandomInt(1, 5);
            state.history.push(nextPattern);
            // state.pattern.push(nextPattern);
        }
    }

    newRound() {
        let state = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state();


        this.addPatterns();

        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.next('*');

        // state.pattern = this.encodePattern();   
        // cup.event('pattern', this.encodePattern());

        let minTime = Math.max(state.history.length, 5) + Math.round(state.history.length * 0.8) * 100;
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.setTimelimit(minTime);
    }

    // set the winner event and data
    setWinner(userid, maxCorrect) {
        let state = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state();
        let player = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.players(userid);
        if (!player) {
            player = {};
            player.id = 'unknown player';
        }
        player.rank = 1;
        player.score = state.round;


        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.gameover({
            type: 'winner',
            correct: maxCorrect
        });
        // cup.next({});
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new MemorizeUp());

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./game-server/index.js ***!
  \******************************/
/* harmony import */ var _acosg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./acosg */ "./game-server/acosg.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./game-server/game.js");




_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('gamestart', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onNewGame(action));
_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('skip', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onSkip(action));
_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('join', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onJoin(action));
_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('leave', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onLeave(action));
_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('pick', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onPick(action));

_acosg__WEBPACK_IMPORTED_MODULE_0__.default.submit();
})();

/******/ })()
;
//# sourceMappingURL=server.bundle.dev.js.map