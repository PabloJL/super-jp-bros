import { createAnimations } from "./animations.js";

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

  this.load.spritesheet("mario", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16,
  });

  this.load.audio("gameover", "assets/sound/music/gameover.mp3");
}

///2
function create() {
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

  this.physics.world.setBounds(0, 0, 2000, config.height);
  this.physics.add.collider(this.mario, this.floor);

  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(this.mario);

  createAnimations(this);

  this.keys = this.input.keyboard.createCursorKeys();
}

///3. Bucle continuo
function update() {
  const { mario, keys } = this;

  const isMarioTouchingFloor = mario.body.touching.down;
  const isLeftKeyDown = keys.left.isDown;
  const isRighttKeyDown = keys.right.isDown;
  const isUpKeyDown = keys.space.isDown;

  if (mario.isDead) return;

  if (isLeftKeyDown) {
    isMarioTouchingFloor && mario.anims.play("mario-walk", true);
    mario.x -= 2;
    mario.flipX = true;
  } else if (isRighttKeyDown) {
    isMarioTouchingFloor && mario.anims.play("mario-walk", true);
    mario.x += 2;
    mario.flipX = false;
  } else if (isMarioTouchingFloor) {
    mario.anims.play("mario-idle", true);
  }

  //JUMP
  if (isUpKeyDown && isMarioTouchingFloor) {
    mario.setVelocityY(-300);
    mario.anims.play("mario-jump", true);
  }

  if (mario.y >= config.height) {
    mario.isDead = true;
    mario.anims.play("mario-dead", true);
    mario.setCollideWorldBounds(false);
    this.sound.add("gameover", { volume: 0.2 }).play();
    setTimeout(() => {
      mario.setVelocityY(-250);
    }, 100);

    setTimeout(() => {
      this.scene.restart();
    }, 2000);
  }
}
