import React from 'react'
import PIXI from 'pixi'
import Phaser from 'phaser'

function GameComponent() {
    const game = new Phaser.Game({
        ...configs,
        parent: 'game-content',
    })

    return <div id="game-content" />
}

export default GameComponent