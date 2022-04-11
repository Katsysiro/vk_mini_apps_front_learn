const createPlayer = (x, y, game) => {
    //const sprite = game.add.sprite(x, y, 'car')
    //game.physics.p2.enable(sprite, false)

    const sprite = game.physics.add.sprite(400, 300, "car", 1);
    sprite.body.setBounce(20, 20);
    sprite.setDrag(0.9);
    sprite.setCollideWorldBounds(true);

    return sprite
}
  
export default createPlayer