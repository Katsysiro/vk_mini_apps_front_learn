export const isDown = (game, key) => {
    let keyObj = game.input.keyboard.addKey(key)
    return keyObj.isDown
}

export const createText = (game, target) =>
  game.add.text(target.x, target.y, '', {
    fontSize: '12px',
    fill: '#FFF',
    align: 'center'
  })