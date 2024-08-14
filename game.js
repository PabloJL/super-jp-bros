import { createAnimations } from "./animations.js";
import { initAudio, playAudio } from "./audio.js";
import { checkControls } from "./controls.js";
import { initSpritesheet } from "./spritesheet.js";

/*Global phase */
const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

new Phaser.Game(config);

///1
function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");

  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");

  initSpritesheet(this);
  initAudio(this);
}

///2
function create() {
  createAnimations(this);

  //cloud
  this.add.image(100, 50, "cloud1").setOrigin(0, 0).setScale(0.15);

  //floor
  this.floor = this.physics.add.staticGroup();

  this.floor
    .create(0, config.height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  this.floor
    .create(150, config.height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  //mario
  // this.mario = this.add.sprite(50, 210, "mario").setOrigin(0, 1);
  this.mario = this.physics.add
    .sprite(50, 100, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(500);

  this.enemy = this.physics.add
    .sprite(120, config.height - 30, "goomba")
    .setOrigin(0, 1)
    .setVelocityX(-50)
    .setGravityY(500);
  this.enemy.anims.play("goomba-walk", true);

  this.coins = this.physics.add.staticGroup();
  this.coins.create(150, 150, "coin").anims.play("coin-idle", true);
  this.coins.create(160, 150, "coin").anims.play("coin-idle", true);
  this.physics.add.overlap(this.mario, this.coins, collectCoin, null, this);

  this.physics.world.setBounds(0, 0, 2000, config.height);

  this.physics.add.collider(this.mario, this.floor);
  this.physics.add.collider(this.enemy, this.floor);
  this.physics.add.collider(this.mario, this.enemy, onHitEnemy, null, this);

  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(this.mario);

  this.keys = this.input.keyboard.createCursorKeys();
}

function onHitEnemy(mario, enemy) {
  if (mario.body.touching.down && enemy.body.touching.up) {
    enemy.anims.play("goomba-hurt", true);
    enemy.setVelocityX(0);
    playAudio("goomba-stomp", this);
    setTimeout(() => {
      enemy.destroy();
    }, 500);

    mario.setVelocityY(-200);
  } else {
    killMario(this);
  }
}

///3. Bucle continuo
function update() {
  const { mario } = this;
  checkControls(this);

  if (mario.y >= config.height) {
    killMario(this);
  }
}

function collectCoin(mario, coin) {
  coin.destroy();
  playAudio("coin-pickup", this, { volume: 0.1 });
}

function killMario(game) {
  const { mario, scene } = game;
  if (mario.isDead) return;
  mario.isDead = true;
  mario.anims.play("mario-dead", true);
  mario.setCollideWorldBounds(false);

  playAudio("gameover", game, { volume: 0.2 });
  mario.body.checkCollision.none = true;
  mario.setVelocityX(0);

  setTimeout(() => {
    mario.setVelocityY(-250);
  }, 100);

  setTimeout(() => {
    scene.restart();
  }, 2000);
}
