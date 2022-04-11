import Phaser from 'phaser'

import { WORLD_SIZE } from '../config'
// import { createText } from './utils'
import fileLoader from '../config/fileloader'
import createWorld from './world/createWorld'
import player from './player'
// import newPlayer from './sockets/newPlayer'
// import updatePlayers from './sockets/updatePlayers'
// import playerMovementInterpolation from './predictions/playerMovementInterpolation'

const SERVER_IP = 'https://simple-car-game.herokuapp.com/'
let socket = null
let otherPlayers = {}

class Game extends Phaser.Scene {
  constructor () {
    super()
    this.player = {}
  }

    preload () {
        // Loads files
        fileLoader(this)
    }

    create () {
        const { width, height } = WORLD_SIZE
        // Creates the world
        createWorld(this)
        // Connects the player to the server
        // socket = io(SERVER_IP)
        // Creates the player passing the X, Y, game and socket as arguments
        this.player = player(Math.random() * width, Math.random() * height / 2, this, socket)
        // // Creates the player name text
        //this.player.playerName = createText(this.game, this.player.sprite.body)
        // // Creates the player speed text
        //this.player.speedText = createText(this.game, this.player.sprite.body)

        // // Sends a new-player event to the server
        // newPlayer(socket, this.player)
        // // update all players
        // updatePlayers(socket, otherPlayers, this.game)

        this.cameras.main.setBounds(0, 0, width, height)
        this.cameras.main.startFollow(this.player.sprite, true)
    }

    update () {
        this.player.drive(this)
        // // Interpolates the players movement
        // playerMovementInterpolation(otherPlayers)
    }
}

export default Game