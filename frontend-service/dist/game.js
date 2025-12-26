const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let player, cursors, zombies, coins, score = 0, scoreText;

function preload() {
    // Placeholder assets (replace with your own)
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('zombie', 'https://labs.phaser.io/assets/sprites/zombie.png');
    this.load.image('coin', 'https://labs.phaser.io/assets/sprites/goldCoin.png');
}

function create() {
    // Player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);

    // Zombies
    zombies = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        let zombie = zombies.create(x, y, 'zombie');
        zombie.setCollideWorldBounds(true);
        zombie.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
        zombie.setBounce(1);
    }

    // Coins
    coins = this.physics.add.group();
    for (let i = 0; i < 10; i++) {
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        coins.create(x, y, 'coin');
    }

    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // Collision
    this.physics.add.overlap(player, zombies, collectZombie, null, this);
    this.physics.add.overlap(player, coins, collectCoin, null, this);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.setVelocity(0);
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    }
}

function collectZombie(player, zombie) {
    zombie.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
    let x = Phaser.Math.Between(50, 750);
    let y = Phaser.Math.Between(50, 550);
    coins.create(x, y, 'coin');
}

function collectCoin(player, coin) {
    coin.destroy();
    score += 5;
    scoreText.setText('Score: ' + score);
}
