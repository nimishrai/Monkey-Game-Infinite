//gameStates
var PLAY = 1;
var END = 0;
var gameState = PLAY;
//Global Variables
var jungle, jungle_img;
var invigr;
var player, player_running, player_jump, player_collided;
var foodGroup, banana, banana_img;
var obstacleGroup, stone, stone_img;
var restart, re_img, gameover, go_img;
var score = 0;
var count = 0;

function preload() {
  jungle_img = loadImage("jungle.jpg");
  player_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");
  player_jump = loadImage("Monkey_09-1.png");
  player_collided = loadImage("Monkey_10-1.png");
  banana_img = loadImage("Banana.png");
  stone_img = loadImage("stone.png");
  //Restart And Game Over Images
  re_img = loadImage("restart.png");
  go_img = loadImage("gameOver.png");
}


function setup() {
  createCanvas(600, 400);
  //Background
  jungle = createSprite(300, 200, 20, 20);
  jungle.x = jungle.width / 2;
  jungle.addImage("jungle", jungle_img);
  //Ground
  invigr = createSprite(300, 370, 600, 10);
  invigr.visible = false;
  //Player
  player = createSprite(40, 300, 40, 40);
  player.addAnimation("player", player_running);
  player.addAnimation("jump", player_jump);
  player.addAnimation("collided", player_collided);
  player.scale = 0.125;
  //Banana Group
  foodGroup = new Group();
  obstacleGroup = new Group();
  //Restart and gameover
  restart = createSprite(300, 140, 20, 20);
  restart.addImage("restart", re_img);
  gameover = createSprite(300, 205, 20, 20);
  gameover.addImage("gameover", go_img);
  gameover.scale = 1.5;
  restart.visible = false;
  gameover.visible = false;
}


function draw() {
  background(255);
  if (gameState == PLAY) { 
    //The Velocity Of Background, Obstacles And Food
    jungle.velocityX = -(6 + score / 2);
    //Restting Background
    if (jungle.x <= 0) {
      jungle.x = jungle.width / 2;
    }
    //Calling The Functions
    food();
    obstacle();
    //Increasing Score
    for (var i = 0; i < foodGroup.length; i++) {
      var temp = foodGroup.get(i);
      if (temp.isTouching(player)) {
        temp.destroy();
        temp = null;
        score = score + 2;
      }
    }
    //Controls Of The Player And The Changing Animation
    if (keyDown("space") && player.y >= 300 ) {
      player.velocityY = -19.6;
    } if (player.y <325) {
      player.changeAnimation("jump", player_jump);
    }
    if (player.y >= 325) {
      player.changeAnimation("player", player_running)
    }
    //Gravity
    if (player.y < 400) {
      player.velocityY = player.velocityY + 0.98;
    }
    //Decreasing Score
    for (var m = 0; m < obstacleGroup.length; m++) {
      var temp2 = obstacleGroup.get(m);
      if (temp2.isTouching(player) && count == 0 ) {
        player.scale = player.scale - 0.01;
        score = score - 1;
        count = count + 1;
        temp2.destroy();
        temp2 = null;
      } else if (count == 1 && temp2.isTouching(player)) {
        score = score - 1;
        count = count + 1;
        obstacleGroup.setLifetimeEach(-1);
      }
    }
    if (count == 2) {
      gameState = END;
    }
  } else if (gameState == END) {
    gameover.visible = true;
    restart.visible = true;
    jungle.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
    player.changeAnimation("collided", player_collided);
    if (mousePressedOver(restart)) {
      reset();
    }
  }
  player.collide(invigr);
  // console.log(player.scale);
  drawSprites();
  //Score
  stroke("black");
  textSize(30);
  fill("white");
  textFont("Times New Roman");
  text("Score : " + score, 450, 50);
}
//Food Function
function food() {
  if (frameCount % 180 === 0) {
    banana = createSprite(600, 200, 20, 20);
    banana.y = random(60, 320);
    banana.velocityX = jungle.velocityX;
    banana.scale = 0.075;
    banana.lifetime = 300;
    banana.addImage("banana", banana_img);
    foodGroup.add(banana);
  }
}
//Obstacle Function
function obstacle() {
  if (frameCount % 100 === 0) {
    stone = createSprite(600, 320, 20, 20);
    stone.y = random(310, 380);
    stone.velocityX = jungle.velocityX;
    stone.scale = 0.25;
    obstacle.lifetime = 300;
    stone.addImage("stone", stone_img);
    obstacleGroup.add(stone);
  }
}
//Reset Function
function reset() {
  gameState = PLAY;
  gameover.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  foodGroup.destroyEach();
  score = 0;
  count = 0;
  player.scale = 0.125;
  player.changeAnimation("player", player_running);
  player.y = 330;
}

