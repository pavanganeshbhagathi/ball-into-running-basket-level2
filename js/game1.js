var width = window.innerWidth;
console.log(width);
var height = window.innerHeight;

var game = new Phaser.Game(width, height, Phaser.CANVAS, "", {
  preload: preload,
  create: create,
  update: update,
});

function preload() {
  game.load.image("ball", "images/ball.png");
  game.load.image("hoop", "images/hoop.png");
  game.load.image("side rim", "images/side_rim.png");
  game.load.image("front rim", "images/front_rim.png");
  game.load.image("background", "images/ground.jpg", {
    frameWidth: width,
    frameHeight: height,
  });

  //    this.load.spritesheet("ball2", "images/ball2.png", {
  //      frameWidth: 16,
  //      frameHeight: 16,        //    });
}

var hoop,
  left_rim,
  right_rim,
  ball,
  front_rim,
  current_score = 0,
  current_score_text,
  high_score = 0,
  high_score_text,
  current_best_text;

var movexx;

var collisionGroup;
//                              create
function create() {
  game.physics.startSystem(Phaser.Physics.P2JS);

  game.physics.p2.setImpactEvents(true);
  //      this.ship1 = this.add.sprite(
  //        config.width / 2 - 50,
  //        config.height / 2,
  //        "ball2"
  //      );
  game.physics.p2.restitution = 0.98;
  game.physics.p2.gravity.y = 0;

  collisionGroup = game.physics.p2.createCollisionGroup();

  score_sound = game.add.audio("score");

  game.stage.backgroundColor = "#ffffff";

  current_score_text = game.add.text(1000, 400, "", {
    font: "Arial",
    fontSize: "40px",
    fill: "#ffffff",
    align: "center",
    backgroundColor: "#790604",
  });
  current_best_text = game.add.text(1000, 420, "", {
    font: "Arial",
    fontSize: "20px",
    fill: "#ffffff",
    align: "center",
    backgroundColor: "#4c5160",
  });
  current_best_score_text = game.add.text(1000, 500, "", {
    font: "Arial",
    fontSize: "40px",
    fill: "#00e6e6",
    align: "center",
  });
  score_board = game.add.text(820, 12, "", {
    font: "Arial",
    fontSize: "40px",
    fill: "#00e6e6",
    align: "center",
  });

  this.text1 = this.add.text(100, 600, "Level:2", {
    font: "Arial",
    fontSize: "20px",
    fill: "hotpink",
  });
  this.text = this.add.text(500, 20, "Ball into Running Basket", {
    font: "Arial",
    fontSize: "20px",
    fill: "#111E6C",
  });

  //function openWindow(url) {
  //  var result = window.open("", "_blank")
  // }
  //window.open("http://127.0.0.1:5500/index.html", "blank");

  createBall();

  cursors = game.input.keyboard.createCursorKeys();

  game.input.onDown.add(click, this);
  game.input.onUp.add(release, this);

  var instructions = document.createElement("span");

  document.body.appendChild(instructions);
  // background = game.add.sprite(0, 0, "background");
  // background.width = width;
  //background.height = height;
  /*this.mountainsBack = this.game.add.tileSprite(
    0,
  this.game.height - this.game.cache.getImage("background").height,
  this.game.width,
    this.game.cache.getImage("background").height,
    "background"
  );*/

  this.hoop = game.add.sprite(0, 62, "hoop"); //420

  this.left_rim = game.add.sprite(60, 184, "side rim"); //480-420=60
  this.right_rim = game.add.sprite(100, 184, "side rim"); //580  580-480=100
  this.movexx = 60;
  //game.physics.enable([left_rim, right_rim, hoop], Phaser.Physics.ARCADE);
  game.physics.p2.enable([left_rim, right_rim], false);

  left_rim.body.setCircle(2.5);
  left_rim.body.static = true;
  left_rim.body.setCollisionGroup(collisionGroup);
  left_rim.body.collides([collisionGroup]);
  // left_rim.body.velocity.x = -150;

  right_rim.body.setCircle(2.5);
  right_rim.body.static = true;
  right_rim.body.setCollisionGroup(collisionGroup);
  right_rim.body.collides([collisionGroup]);
  //right_rim.body.velocity.x = -150;
  //  hoop.body.static = true;
  //  hoop.body.velocity.x = -150;
}
//                                           update
function update() {
  this.movexx += 0.8;
  console.log(this.movexx + "moving");

  if (ball && ball.body.velocity.y > 0) {
    // this.front_rim = game.add.sprite(this.movexx, 182, "front rim"); //480
    ball.body.collides([collisionGroup], this);
  }
  this.left_rim.x += 0.8;
  this.right_rim.x += 0.8;

  console.log(this.left_rim.x + "leftrim");
  this.hoop.x += 0.8;
  /* if (this.movexx > width) {
    this.movexx *= -0.5;
  }
  if (this.movexx < 0) {
    this.movexx *= -0.5;
  }

  console.log(width);
*/
  if (
    this.right_rim.x > width ||
    this.left_rim.x > width ||
    this.hoop.x > width
  ) {
    // this.hoop.x *= -1;
    //  this.left_rim.x *= -1;
    // this.right_rim.x *= -1;
    this.hoop.x = 0;
    this.left_rim.x = 60;
    this.right_rim.x = 160;
    this.movexx = 60;
  }
  if (
    ball &&
    ball.body.velocity.y > 0 &&
    ball.body.y > 188 &&
    !ball.isBelowHoop
  ) {
    ball.isBelowHoop = true;
    ball.body.collideWorldBounds = false;

    if (ball.body.x > this.movexx && ball.body.x < this.movexx + 110) {
      score_board;
      current_score += 1;
      current_score_text.text = current_score;
      console.log(current_score);
    } else {
      if (current_score > high_score) {
        score_board;
        high_score = current_score;
      }

      score_board;
      current_score = 0;
      current_score_text.text = "";
      current_best_text.text = "Current Best";
      current_best_score_text.text = high_score;
    }
  }

  if (ball && ball.body.y > 1200) {
    game.physics.p2.gravity.y = 0;

    createBall();
  }
  // this.left_rim.xpos += 5;
}

function createBall() {
  var xpos;
  if (current_score === 0) {
    xpos = width / 2;
  } else {
    xpos = width / 2;
  }

  ball = game.add.sprite(xpos, 550, "ball");
  game.add.tween(ball.scale).from({
      x: 0.7,
      y: 0.7,
    },
    100,
    Phaser.Easing.Linear.None,
    true,
    0,
    0,
    false
  );
  game.physics.p2.enable(ball, false);
  ball.body.setCircle(60);
  ball.launched = false;
  ball.isBelowHoop = false;
  score_board;
}

var location_interval;
var isDown = false;
var start_location;
var end_location;

function click(pointer) {
  var bodies = game.physics.p2.hitTest(pointer.position, [ball.body]);
  if (bodies.length) {
    start_location = [pointer.x, pointer.y];
    isDown = true;
    location_interval = setInterval(
      function () {
        start_location = [pointer.x, pointer.y];
      }.bind(this),
      200
    );
  }
}

function release(pointer) {
  if (isDown) {
    window.clearInterval(location_interval);
    isDown = false;
    end_location = [pointer.x, pointer.y];

    if (end_location[1] < start_location[1]) {
      var slope = [
        end_location[0] - start_location[0],
        end_location[1] - start_location[1],
      ];
      var x_traj = (-2500 * slope[0]) / slope[1];
      launch(x_traj);
    }
  }
}

function launch(x_traj) {
  if (ball.launched === false) {
    ball.body.setCircle(36);
    ball.body.setCollisionGroup(collisionGroup);
    current_best_text.text = "";
    current_best_score_text.text = "";
    ball.launched = true;
    game.physics.p2.gravity.y = 3000;
    game.add.tween(ball.scale).to({
        x: 0.6,
        y: 0.6,
      },
      500,
      Phaser.Easing.Linear.None,
      true,
      0,
      0,
      false
    );
    ball.body.velocity.x = x_traj;
    ball.body.velocity.y = -1850;
    ball.body.rotateRight(x_traj / 3);
  }
}