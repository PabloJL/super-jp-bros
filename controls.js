export function checkControls({ mario, keys }) {
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
}
