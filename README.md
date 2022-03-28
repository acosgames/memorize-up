# Memorize Up
Attempt to memorize the pattern for as long as you can go.

[Play on ACOS.games](https://acos.games/g/memorize-up)

[View Acos Documentation](https://docs.acos.games)

--- 

## Getting Started

Requires Node v16+

### Installation 
```bash
npm install
```

### Run Simulator, Client, and Server
```bash
npm start
```

### Playing the game

1. Open 1 tab at [http://localhost:3200/](http://localhost:3200/)
2. Enter a username on each tab and click 'Join'
3. When ready, press "Start Game"

The game was designed to play in Scaled Resolution mode, 4:4 resolution, 600 width.


## About Client

Client is built using ReactJS.  It will run inside an iframe and communicate with the parent frame which is the [Simulator's](https://github.com/acosgames/acosgames) client.  

All assets (images, svg, audio) should be packed into a single `client.bundle.js` file.

A browser-sync is included so that your changes are reflected immediately.

## About Server

Server code is built using NodeJS code and bundled into a single `server.bundle.js` file.

## About Simulator

[Simulator](https://github.com/acosgames/acosgames) runs a simple frontend that displays your `client.bundle.js` inside an iframe.  

[Simulator](https://github.com/acosgames/acosgames) also runs a NodeJS express/socket.io server with a worker that uses vm2 to run your `server.bundle.js` code.

