/**
**LIST OF OPTIONS**
* MAP LENGTH ◄
* GROWTH PER FOOD ☼
* SNAKE SPEED ◄
* GAME END BY Last Standing or All crashed
* DISAPPEAR AFTER CRASH ♦
* AMOUNT OF FOOD ◄
* FOOD TYPE (RED=Growing, Blue=Slow, Green=Faster, White=Smaller) ☼
* STARTING SIZE ☼
* BOARD/BACKGROUND THEME ♦ 
* More *  
**/


/***CODE BY LUISGUILLE***/

var mouseCordinates = false;


{
var fps = 12; //12
var btnFps = 12;

var keysPressed = [];
var mouseMoving = false;
var previousMouse = {
    x: 0,
    y: 0
};

var f = createFont("sans-serif");

var playerAmount = 1;
var boardWidth = 28; //small 18, normal 28, big 28, large  42
var boardHeight = 26; //small 16, normal 16, big 26, large 39
var settingScreen = 0; //"choose mode" 
var started = false;
var disappearAfterCrash = false;
var allowSelfCrash = true;
var winByLastStanding = true;
var startingSize = 1;
var scaleValue = 1; //small 1.5, normal 1.15, big 1, large 0.6825

var playersCrashed = [false, true, true];

var singleplayerHighScores = [0, 0, 0, 0, 0]; //custom,standard,runner,party,tight

/*var highPlayer1Small = [0, 0];
var highPlayer1Normal = [0, 0];
var highPlayer1Big = [0, 0];
var highPlayer1Large = [0, 0];*/
var highscoreChooser = 0;

var roundNumber = 1;
var player1Wins = 0;
var player2Wins = 0;
var timesCalled = 0;
var highScores = [0, 0];

//ORIGINAL lenght => 26
//ORIGINAL width => 37

var limitSettings = true;

} //variables


//styles
var styles = [

{name: "dark", background: color(3, 42, 82), box: color(0, 0, 0), player1: color(19, 194, 37), player2: color(66, 75, 204), player3: color(212, 189, 15), bar1: color(125, 125, 125), bar2: color(207, 207, 207), sizeBar: color(245, 245, 90), btnOff: color(69, 69, 69), btnOn: color(111, 111, 111)}, 

{name: "woods", background: color(82, 19, 3), box: color(0, 17, 66), player1: color(10, 176, 27), player2: color(140, 140, 11), player3: color(180, 38, 227), bar1: color(125, 125, 125), bar2: color(207, 207, 207), sizeBar: color(143, 143, 71), btnOff: color(51,51,51), btnOn: color(31, 92, 7)},

{name: "vibrid", background: color(59, 59, 59), box: color(22, 35, 117), player1: color(36, 168, 49), player2: color(222, 187, 13), player3: color(173, 0, 230), bar1: color(146, 153, 108), bar2: color(153, 127, 113), sizeBar: color(117, 173, 98), btnOff: color(50, 74, 112), btnOn: color(13, 94, 15)}];
    
var activeStyle = 2;




/****FOOD****/
var Food = function(amount, increase) {
    this.amount = amount;
    this.increase = increase;
    this.tileX = [floor(random(1,boardWidth))+1];
    this.tileY = [floor(random(1,boardHeight))+1];
    //this.tileX = floor(random(1,boardWidth))+1;
    //this.tileY = floor(random(1,boardHeight))+1;
};
Food.prototype.red = function() {
    
    /*for (var i=0; i < this.amount; i++) {
        this.tileX[i] = floor(random(1, boardWidth))+1;
    }*/
    
    //noStroke();
    strokeWeight(1);
    fill(255, 0, 0);
    for (var i = 0; i < this.amount; i++) {
    rect(this.tileX[i]*20, this.tileY[i]*20, 20, 20);
    }
    stroke(0, 0, 0);
};
Food.prototype.refreshAmount = function() {
    for (var i=0; i < this.amount; i++) {
        this.tileX[i] = floor(random(0, boardWidth))+1;
        this.tileY[i] = floor(random(0, boardHeight))+1;
    }
};

var food1 = new Food(1, 3);
food1.refreshAmount();

/*****SNAKES******/ 
{
var Snakes = function(tileX, tileY, direction, snakeColor, snakeID) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.size = startingSize;
    this.direction = direction;
    this.recordMovement = {x:[], y:[]};
    this.timedCheck = 1; //fps/10
    this.crashed = false;
    this.snakeColor = snakeColor;
    this.museControler = false;
    this.snakeID = snakeID;
};

var player1 = new Snakes(3, 3, 3, styles[activeStyle].player1, 0); //color(3, 227, 29)
var player2 = new Snakes(26, 24, 1, styles[activeStyle].player2, 1);
var player3 = new Snakes(10, 10, 2, styles[activeStyle].player3, 2);

Snakes.prototype.drawIt = function() {
    
    
    strokeWeight(1);
    stroke(0, 0, 0);
    /**RECORD MOVEMENT**/
    if (this.crashed && disappearAfterCrash === false) {
        this.recordMovement.x[this.size] = this.tileX;
        this.recordMovement.y[this.size] = this.tileY;
    } else {
    this.timedCheck--;
    }
    
    if (this.timedCheck <= 0) {
    strokeWeight(1);
    //rect(this.tileX*20, this.tileY*20, 20, 20); Doesn't matter
    
    this.timedCheck = 1; //fps/10
    
    if (this.crashed && disappearAfterCrash) { } else {
    this.recordMovement.x.unshift(this.tileX);
    this.recordMovement.y.unshift(this.tileY);
    }
    if (this.recordMovement.x.length > this.size || this.crashed && disappearAfterCrash) {
        this.recordMovement.y.pop();
        this.recordMovement.x.pop();
    }
    }

    
    /**DRAWS SNAKE**/
    strokeWeight(1);
    //stroke(255, 0, 0);
    for (var i = 0; i < this.recordMovement.x.length; i++) {
        //fill(3, 227, 29);
        fill(this.snakeColor);
        rect(this.recordMovement.x[i]*20, this.recordMovement.y[i]*20, 20, 20);
    }
    
    /**ON CRASH**/
    if (player1.crashed && disappearAfterCrash) {
            if (player1.recordMovement.x.length > 0) {
        fill(194, 183, 183);
        rect(player1.tileX*20, player1.tileY*20, 20, 20);
            } 
        } else if (player1.crashed && disappearAfterCrash === false) {
            fill(194, 183, 183);
            rect(player1.tileX*20, player1.tileY*20, 20, 20);
        }
    if (player2.crashed && disappearAfterCrash) {
            if (player2.recordMovement.x.length > 0) {
        fill(194, 183, 183);
        rect(player2.tileX*20, player2.tileY*20, 20, 20);
            } 
        } else if (player2.crashed && disappearAfterCrash === false) {
            fill(194, 183, 183);
            rect(player2.tileX*20, player2.tileY*20, 20, 20);
        }    
        
        
        
    /**ON PICKUP**/
    /*if (this.tileX === food1.tileX && this.tileY === food1.tileY) {
        food1.tileX = floor(random(boardWidth)) + 1;
        food1.tileY = floor(random(boardHeight)) + 1;
        this.size+=3;
    } else {*/
        for (var i = 0; i < this.recordMovement.x.length; i++) {
            for (var j = 0; j < food1.amount; j++) {
             if (this.recordMovement.x[i] === food1.tileX[j] && this.recordMovement.y[i] === food1.tileY[j]) {
                food1.tileX[j] = floor(random(boardWidth)) + 1;
                food1.tileY[j] = floor(random(boardHeight)) + 1;
                this.size+=food1.increase;
             }       
            }
        }
    //}
};

Snakes.prototype.directionControls = function() {
    if (this.crashed === false) {
    if (this.direction === 1 && this.direction !== 3) {
        this.direction = 1;
        this.tileY-=1; //fps/10
    }
    if (this.direction === 2 && this.direction !== 4) {
        this.direction = 2;
        this.tileX+=1; //fps/10
    }
    if (this.direction === 3 && this.direction !==1) {
        this.direction = 3;
        this.tileY+= 1; //fps/10
    }
    
    if ( this.direction === 4 && this.direction !== 2) {
        this.direction = 4;
        this.tileX-= 1; //fps/10
    }
    }
};

Snakes.prototype.selfCrash = function() {
    /**SELF CRASH**/
    if (this.tileX > boardWidth || this.tileX < 1 || this.tileY > boardHeight || this.tileY < 1 && this.crashed === false) {
        this.crashed = true;
    }
    
    if (allowSelfCrash && playerAmount > 1 || playerAmount === 1) {
    for (var i = 1; i < this.size; i++) {
        if (this.tileX === this.recordMovement.x[i] && this.tileY === this.recordMovement.y[i] && this.crashed === false && this.size > 1) {
            this.crashed = true;
        }
    }
    }
    if (this.crashed === true) {
        playersCrashed[this.snakeID] = true;
    }
    
};

Snakes.prototype.crashOnOtherSnakes = function() {
    if (playerAmount > 1) {
        
        if (this.snakeID === 0) {
        for (var i = 0; i < player2.size; i++) {
        if (this.tileX === player2.recordMovement.x[i] && this.tileY === player2.recordMovement.y[i] && this.crashed === false) {
            this.crashed = true;
        }
        }
        } else if (this.snakeID === 1) {
        for (var i = 0; i < player1.size; i++) {
        if (this.tileX === player1.recordMovement.x[i] && this.tileY === player1.recordMovement.y[i] && this.crashed === false) {
            this.crashed = true;
        }
        }
        }
    }
};

Snakes.prototype.controlsPlayerArrows = function() {
    
    /**CONTROLS P1**/
    
    if (keysPressed[UP] && this.timedCheck === 1 && this.tileY-1 !== this.recordMovement.y[1]) { //fps/10
        this.direction = 1;
    } 
    if (keysPressed[RIGHT] && this.timedCheck === 1 && this.tileX+1 !== this.recordMovement.x[1]) { //fps/10
        this.direction = 2;
    }
    if (keysPressed[DOWN] && this.timedCheck === 1 && this.tileY+1 !== this.recordMovement.y[1]) { //fps/10
        this.direction = 3;
    }
    if (keysPressed[LEFT] && this.timedCheck === 1 && this.tileX-1 !== this.recordMovement.x[1]) { //fps/10
        this.direction = 4;
    }
    
};

Snakes.prototype.controlsPlayerWASD = function() {
    /**CONTROLS P2**/
    
    if (keysPressed[87] && this.timedCheck === 1 && this.tileY-1 !== this.recordMovement.y[1]) { //fps/10
        this.direction = 1;
    } 
    if (keysPressed[68] && this.timedCheck === 1 && this.tileX+1 !== this.recordMovement.x[1]) { //fps/10
        this.direction = 2;
    }
    if (keysPressed[83] && this.timedCheck === 1 && this.tileY+1 !== this.recordMovement.y[1]) { //fps/10
        this.direction = 3;
    }
    if (keysPressed[65] && this.timedCheck === 1 && this.tileX-1 !== this.recordMovement.x[1]) { //fps/10
        this.direction = 4;
    }
};

Snakes.prototype.controlsPlayer3Click = function() {
    
    /**CONTROLS P3**/
    /*
    if (mouseIsPressed && mouseButton === CENTER && this.timedCheck === 1 && this.tileY-1 !== this.recordMovement.y[1]) { //fps/10
        this.direction = 1;
    } 
    else if (mouseIsPressed && mouseButton === RIGHT && this.timedCheck === 1 && this.tileX+1 !== this.recordMovement.x[1]) { //fps/10
        this.direction = 2;
    }
    else if (mouseMoving && mouseY > previousMouse.y && this.timedCheck === 1 && this.tileY+1 !== this.recordMovement.y[1]) { //fps/10
        this.direction = 3;
    }
    else if (mouseIsPressed && mouseButton === LEFT && this.tileX-1 !== this.recordMovement.x[1]) { //fps/10
        this.direction = 4;
    }
    mouseMoving = false;*/
    
    /*if (mouseIsPressed && mouseButton === RIGHT && this.timedCheck === 1 && this.tileX+1 !== this.recordMovement.x[1]) { //fps/10
        this.direction +=1;
    }
    else if (mouseIsPressed && mouseButton === LEFT && this.tileX-1 !== this.recordMovement.x[1]) { //fps/10
        this.direction -= 1;
    }
    if (this.direction < 1) {
        this.direction = 4;
    } else if (this.direction > 4) {
        this.direction = 1;
    }*/
};

Snakes.prototype.controlsPlayer3Moving = function() {
    
    /**CONTROLS P3**/
    
    if (mouseMoving === false) {
        previousMouse.x = mouseX;
        previousMouse.y = mouseY;
    }
    
    
    if (mouseMoving && mouseY < previousMouse.y && this.timedCheck === 1 && this.tileY-1 !== this.recordMovement.y[1]) { 
        this.direction = 1;
    } 
    if (mouseMoving && mouseX > previousMouse.x && this.timedCheck === 1 && this.tileX+1 !== this.recordMovement.x[1]) { 
        this.direction = 2;
    }
    if (mouseMoving && mouseY > previousMouse.y && this.timedCheck === 1 && this.tileY+1 !== this.recordMovement.y[1]) { 
        this.direction = 3;
    }
    if (mouseMoving && mouseX < previousMouse.x && this.timedCheck === 1 && this.tileX-1 !== this.recordMovement.x[1]) { 
        this.direction = 4;
    }
    mouseMoving = false;
};

Snakes.prototype.controlsPlayer3MouseArrows = function() {
    
    /**CONTROLS P3**/
    
    this.mouseController = true;
    
        //UP
        if (mouseX > 449 && mouseX < 509 && mouseY > 386-20 && mouseY < 432 && mouseIsPressed && this.tileY-1 !== this.recordMovement.y[1]) {
            this.direction = 1;
        }
        
        //DOWN
        if (mouseX > 449 && mouseX < 509 && mouseY > 432 && mouseY < 498 && mouseIsPressed && this.tileY+1 !== this.recordMovement.y[1]) {
            this.direction = 3;
        }
        
        //LEFT
        if (mouseX > 379 && mouseX < 449 && mouseY > 400-10 && mouseY < 465+10 && mouseIsPressed && this.tileX-1 !== this.recordMovement.x[1]) {
            this.direction = 4;
        }
        
        //RIGHT
        if (mouseX > 509 && mouseX < 579 && mouseY > 400-10 && mouseY < 465+10 && mouseIsPressed && this.tileX+1 !== this.recordMovement.x[1]) {
            this.direction = 2;
        }
};

Snakes.prototype.controlsPlayer3Mouse = function() {
    
};

    /**FIX MOVEMENT**/
keyPressed = function() {
    keysPressed[keyCode] = true;
    keysPressed[key.code] = true;
};
keyReleased = function() {
    keysPressed[keyCode] = false;
    keysPressed[key.code] = false;
};
mouseMoved = function() {
    mouseMoving = true;  
};
}


/*****BUTTONS*****/
{
var Button = function(xPosition, yPosition, btnWidth, btnHeight,textMessage, textX, textY, textSize, actionID, rectRadius) {
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.btnWidth = btnWidth;
    this.btnHeight = btnHeight;
    this.textMessage = textMessage;
    this.textX = textX;
    this.textY = textY;
    this.textSize = textSize;
    this.actionID = actionID;
    this.timedClick = 12; //1.2 seconds (10fps)
    this.showList = false;
    if (rectRadius >= 0) {
        this.rectRadius = rectRadius;
    } else {
        this.rectRadius = 12;
    }
    this.forceRandom = false;
    this.randomNumber = random(0, 100);
    this.btnClicked = false;
};

/**Select Mode**/
var playSingleplayerBtn = new Button(width/2.7, height/2.6, 143, 39, "Play Now", 21, 10, 23, 1);
/*var playMultiplayerBtn = new Button(width/2.7, height/1.9, 143, 39, "Multiplayer", 15, 10, 23, 2);
var settingsBtn = new Button(width/2.7, height/1.5, 143, 39, "Settings", 28, 9, 25, 0);*/
var playofflineBtn = new Button(width/2.7, height/1.9, 143, 39, "Same Device", 2, 10, 23, 0);
var playonlineBtn = new Button(width/2.7, height/1.5, 143, 39, "Online", 37, 10, 23, 0);


/**Choose Singleplayer Mode**/
var playStandardBtn = new Button(140, 230, 143, 39, "Standard", 22, 10, 23, 0);
var playRunnerBtn = new Button(307, 230, 143, 39, "Runner", 32, 10, 23, 0);
var playTightBtn = new Button(307, 315, 143, 39, "Tight", 43, 10, 23, 0);
var playPartyBtn = new Button(140, 315, 143, 39, "Party", 43, 10, 23, 0);
var playRandomBtn = new Button(140, 400, 143, 39, "Randomized", 6, 10, 23, 0);
var playCustomBtn = new Button(307, 400, 143, 39, "Customized", 10, 10, 23, 0);


/**One Computer Multiplayer**/
//var singleplayerBtn = new Button(width/2.7, height/2.6, 143, 39, "Singleplayer", 9, 10, 23, 1);
var twoplayerBtn = new Button(width/2.7, 250, 143, 39, "Two Players", 9, 10, 23, 2);
var threeplayerBtn = new Button(width/2.7, 350, 143, 39, "Three Players", 7, 10, 21, 3);

/**Custom Settings Choosers**/
var boardSize = new Button(286, 200, 152, 39, "Big (26x28)", 20, 10, 21, 3);
var snakeSpeed = new Button(330, 255, 65, 43, fps, 15, 14, 25, -1, 5);
var redFoodAmount = new Button(330, 310, 65, 43, food1.amount, 15, 14, 25, -1, 5);
var redFoodGrowth = new Button(330, 365, 65, 43, food1.increase, 15, 14, 25, -1, 5);

/**General Buttons**/
var startGameBtn = new Button(width/1.42, height/16.2, 137, 39, "Start Game", 9, 10, 23, 1);
var backToStartBtn = new Button(38, 38, 123, 35, "Back", 34, 9, 21, 1);
}
/**On Game End**/
var playAgain1Player = new Button(240, height/1.9, 123, 35, "Play Again", 9, 9, 21, 1);
var backToMenu1Player = new Button(240, height/1.67, 123, 35, "Menu", 34, 9, 21, 1);
var playAgain2Players = new Button(240, 316, 123, 35, "Next Round", 5, 9, 21, 1);
var backToMenu2Players = new Button(240, 360, 123, 35, "Menu", 34, 9, 21, 1);

{
Button.prototype.drawIt = function() {
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && this.actionID >= 0) {
        //fill(111, 111, 111);
        fill(styles[activeStyle].btnOn);
    } else {
    //fill(69, 69, 69);
    fill(styles[activeStyle].btnOff);
    }
    stroke(255, 255, 255);
    strokeWeight(2.5);
    rect(this.xPosition, this.yPosition, this.btnWidth, this.btnHeight, this.rectRadius);
    stroke(0, 0, 0);
    
    fill(255, 255, 255);
    textFont(f, this.textSize);
    text(this.textMessage, this.xPosition+this.textX, this.yPosition+this.textY, 1.5*this.btnWidth, this.btnHeight);
};

Button.prototype.detectClick = function() {
    if (this.timedClick > 0) {
    this.timedClick--;
    }
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
        
        this.btnClicked = true;
        
        this.timedClick = 12;
        this.fixTimer = 10;
    } else {
        this.btnClicked = false;
    }
};

Button.prototype.changeScreenTo = function(screenID) {
    if (this.timedClick > 0) {
    this.timedClick--;
    }
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
        settingScreen = screenID;
        
        this.timedClick = 12;
        this.fixTimer = 10;
    }
};

Button.prototype.definePlayersAmount = function(totalPlayers) {
    
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed) {
            playerAmount = this.actionID;
        if (totalPlayers > 0 && totalPlayers < 4) {
            playerAmount = totalPlayers;
        }
        //settingScreen = 2;
        snakeSpeed.timedClick = 200;
    }
};

Button.prototype.dropDown = function() {
    
    
    
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight) {
        fill(styles[activeStyle].btnOn);
    } else {
    fill(styles[activeStyle].btnOff);
    }
    stroke(255, 255, 255);
    strokeWeight(2.5);
    rect(this.xPosition, this.yPosition, this.btnWidth, this.btnHeight, 6);
    stroke(0, 0, 0);
    
    fill(255, 255, 255);
    textFont(f, this.textSize);
    text(this.textMessage, this.xPosition+this.textX, this.yPosition+this.textY, 1.5*this.btnWidth, this.btnHeight);
};

Button.prototype.defineBoardSize = function() {
    if (this.timedClick > 0 && mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth + this.btnHeight) {
    this.timedClick--;
    
    } else if (mouseX < this.xPosition-40 || mouseX > this.xPosition + this.btnWidth+40) {
        this.timedClick = 4;
        this.showList = false;
    }
    
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
        this.timedClick = 5;
        if (this.showList === false) {
            this.showList = true;
        } else if (this.showList === true) {
            this.showList = false;
        }
    }
    
    if (this.showList) {
        
        fill(111, 111, 111);
        
        /**Small 16x18**/
        if (mouseX > this.xPosition && mouseY > this.yPosition + 40 && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight + 40) {
        if (mouseIsPressed) {
            this.showList = false;
            this.textMessage = "Small (18x16)";
            this.textX = 10;
            boardWidth = 18;
            boardHeight= 16;
            scaleValue = 1.5;
            food1.refreshAmount();
        } else {
            fill(69, 69, 69);
        }
    }
        stroke(255, 255, 255);
        strokeWeight(2.5);
        rect(this.xPosition, this.yPosition+40, this.btnWidth, this.btnHeight, 1);
        stroke(0, 0, 0);
    
        fill(255, 255, 255);
        textFont(f, this.textSize);
        text("Small (18x16)", this.xPosition+10, this.yPosition+this.textY+40, 1.5*this.btnWidth, this.btnHeight);
        /**Normal 28x16**/
        fill(111, 111, 111);
        if (mouseX > this.xPosition && mouseY > this.yPosition + 80 && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight + 80) {
        if (mouseIsPressed) {
            this.showList = false;
            this.textMessage = "Normal (24x22)";
            this.textX = 3;
            boardWidth = 24;
            boardHeight= 22;
            scaleValue = 1.15;
            food1.refreshAmount();
        } else {
            fill(69, 69, 69);
        }
    }
        
        stroke(255, 255, 255);
        strokeWeight(2.5);
        rect(this.xPosition, this.yPosition+80, this.btnWidth, this.btnHeight, 1);
        stroke(0, 0, 0);
    
        fill(255, 255, 255);
        textFont(f, this.textSize);
        text("Normal (24x22)", this.xPosition+3, this.yPosition+this.textY+80, 1.5*this.btnWidth, this.btnHeight);
    /**Big 28x26**/
        fill(111, 111, 111);
        if (mouseX > this.xPosition && mouseY > this.yPosition + 120 && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight + 120) {
        if (mouseIsPressed) {
            this.showList = false;
            this.textMessage = "Big (28x26)";
            this.textX = 18;
            boardWidth = 28;
            boardHeight= 26;
            scaleValue = 1;
            food1.refreshAmount();
        } else {
            fill(69, 69, 69);
        }
    }
        stroke(255, 255, 255);
        strokeWeight(2.5);
        rect(this.xPosition, this.yPosition+120, this.btnWidth, this.btnHeight, 1);
        stroke(0, 0, 0);
    
        fill(255, 255, 255);
        textFont(f, this.textSize);
        text("Big (28x26)", this.xPosition+18, this.yPosition+this.textY+120, 1.5*this.btnWidth, this.btnHeight);
        /**Large 42x39**/
        fill(111, 111, 111);
        if (mouseX > this.xPosition && mouseY > this.yPosition + 160 && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight + 160) {
        if (mouseIsPressed) {
            this.showList = false;
            this.textMessage = "Large (42x39)";
            this.textX = 9;
            boardWidth = 42;
            boardHeight= 39;
            scaleValue= 0.6825;
            food1.refreshAmount();
        } else {
            fill(69, 69, 69);
        }
    }
        stroke(255, 255, 255);
        strokeWeight(2.5);
        rect(this.xPosition, this.yPosition+160, this.btnWidth, this.btnHeight, 1);
        stroke(0, 0, 0);
    
        fill(255, 255, 255);
        textFont(f, this.textSize);
        text("Large (42x39)", this.xPosition+9, this.yPosition+this.textY+160, 1.5*this.btnWidth, this.btnHeight);
    }
    player2.tileX = boardWidth-2;
    player2.tileY = boardHeight-2;
    player2.recordMovement.x = [boardWidth-2];
    player2.recordMovement.y = [boardHeight-2];
};

Button.prototype.startGame = function() {
    
    if (this.timedClick > 0) {
        this.timedClick--;
    }
    
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
        
        started = true;
        food1.refreshAmount();
        playersCrashed[0] = false;
        if (playerAmount === 1) {
            playersCrashed[1] = true;
            playersCrashed[2] = true;
        }
        if (playerAmount > 1) {
            playersCrashed[1] = false;
            if (playerAmount === 3) {
                playersCrashed[2] = false;
            }
        }
        
        this.timedClick = 12;
        this.setPlayersInitialPositions();
    }
};

Button.prototype.restartGame = function() {
    
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed || keysPressed[82] || keysPressed[32] || keysPressed[ENTER] || keysPressed[SHIFT]) {
        
        playersCrashed[0] = false;
        player1.tileX = 3;
        player1.tileY = 3;
        player1.recordMovement.x = [3];
        player1.recordMovement.y = [3];
        player1.direction = 3;
        player1.size = 1;
        player1.crashed = false;
        
        //println(this.forceRandom);
        if (this.forceRandom) {
        //this.randomNumber = random(0, 100);
        this.setSettingsToRandom(true);
        //println("fps: " + fps + ", amount:" + food1.amount + ", increase: " + food1.increase + ". Number: " + floor(this.randomNumber));
    }
    
     if (playerAmount > 1) {
        playersCrashed[1] = false;
        player2.tileX = boardWidth-2;
        player2.tileY = boardHeight-2;
        player2.recordMovement.x = [boardWidth-2];
        player2.recordMovement.y = [boardHeight-2];
        player2.direction = 1;
        player2.size = 1;
        player2.crashed = false;
        
        if (playerAmount === 3) {
            playersCrashed[2] = false;
            player1.direction = 3;
            player1.size = 1;
            player1.crashed = false; //To Edit Here
        }
     }
    
    food1.refreshAmount();
    if (playerAmount === 2) {
        roundNumber++;
    }
    }
};

Button.prototype.backToMenu = function() {
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed) {
        this.timedClick = 12;
        settingScreen = 1;
        started = false;
        if (playerAmount === 1) {
        playersCrashed[0] = false;
        }
        player1.tileX = 3;
        player1.tileY = 3;
        player1.recordMovement.x = [3];
        player1.recordMovement.y = [3];
        player1.direction = 3;
        player1.size = 1;
        player1.crashed = false;
        food1.refreshAmount();
        singleplayerHighScores[0] = 0;
        
        if (playerAmount > 1) {
            playersCrashed[1] = false;
            player2.tileX = boardWidth-2;
            player2.tileY = boardHeight-2;
            player2.recordMovement.x = [boardWidth-2];
            player2.recordMovement.y = [boardHeight-2];
            player2.direction = 1;
            player2.size = 1;
            player2.crashed = false;
            
            player1Wins = 0;
            player2Wins = 0;
            timesCalled = 0;
            roundNumber = 1;
        }
        
        if (playerAmount > 1) {
            playAgain2Players.forceRandom = false;
        } else {
            playAgain1Player.forceRandom = false;
        }
    }
};

Button.prototype.numberSelector = function() {
    if (this.timedClick > 3) {
        this.timedClick = 3;
    }
        // plus +
    if (mouseX > this.xPosition+this.btnWidth && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth+40 && mouseY < this.yPosition + this.btnHeight) {
        fill(207, 205, 207);
        if (mouseIsPressed) {
            this.increaseValue = true;
            this.decreaseValue = false;
            this.timedClick--;
        } else {
            this.increaseValue = false;
        }
    } else {
    fill(255, 255, 255);
    }
    stroke(112, 112, 112);
    strokeWeight(2.5);
    rect(this.xPosition+this.btnWidth+5, this.yPosition, 40, this.btnHeight, this.rectRadius);
    stroke(0, 0, 0);
    fill(102, 102, 102);
    textFont(f, 50);
    text("+", this.xPosition+this.btnWidth+10, this.yPosition+39);

        // minus -
    if (mouseX > this.xPosition-40-5 && mouseY > this.yPosition && mouseX < this.xPosition && mouseY < this.yPosition + this.btnHeight) {
        fill(207, 205, 207);
        if (mouseIsPressed) {
            this.decreaseValue = true;
            this.increaseValue = false;
            this.timedClick--;
        } else {
            this.decreaseValue = false;
        }
    } else {
    fill(255, 255, 255);
    }
    stroke(112, 112, 112);
    strokeWeight(2.5);
    rect(this.xPosition+this.btnWidth-110, this.yPosition, 40, this.btnHeight, this.rectRadius);
    stroke(0, 0, 0);
    fill(102, 102, 102);
    textFont(f, 60);
    text("-", this.xPosition+this.btnWidth-100, this.yPosition+37);
};

Button.prototype.snakeSpeedSelector = function() {
    if (this.increaseValue === true && this.timedClick <= 0 && fps < 30) {
        
        fps++;
        this.timesChanged++;
         if (this.timesChanged < 2) {
            this.timedClick = 4;
        } else if (this.timesChanged >= 2 && this.timesChanged < 4) {
            this.timedClick = 3;
        } else {
            this.timedClick = 2;
        }
        if (fps < 10) {
            this.textMessage = " " + fps;    
        } else {
        this.textMessage = fps;
        }
    }
    if (this.decreaseValue === true && this.timedClick <= 0 && fps> 4) {
        fps--;
        this.timesChanged++;
         if (this.timesChanged < 2) {
            this.timedClick = 4;
        } else if (this.timesChanged >= 2 && this.timesChanged < 4) {
            this.timedClick = 3;
        } else {
            this.timedClick = 2;
        }
        if (fps < 10) {
            this.textMessage = " " + fps;    
        } else {
        this.textMessage = fps;
        }
    }
    if (this.decreaseValue === false && this.increaseValue === false) {
        this.timedClick = 0;
        this.timesChanged = 0;
    }
    //println(this.timedClick);
};

Button.prototype.redFoodAmountSelector = function() {
    if (this.increaseValue === true && this.timedClick <= 0 && food1.amount < 150) {
        food1.amount++;
        this.timesChanged++;
        if (this.timesChanged < 2) {
            this.timedClick = 4;
        } else if (this.timesChanged >= 2 && this.timesChanged < 4) {
            this.timedClick = 3;
        } else if (this.timesChanged >= 4 && this.timesChanged < 14){
            this.timedClick = 2;
        } else {
            this.timedClick = 1;
        }
        if (food1.amount < 10) {
            this.textMessage = " " + food1.amount;
        } else {
        this.textMessage = food1.amount;
        }
    }
    if (this.decreaseValue === true && this.timedClick <= 0 && food1.amount> 1) {
        food1.amount--;
        this.timesChanged++;
        if (this.timesChanged < 2) {
            this.timedClick = 4;
        } else if (this.timesChanged >= 2 && this.timesChanged < 4) {
            this.timedClick = 3;
        } else if (this.timesChanged >= 4 && this.timesChanged < 14){
            this.timedClick = 2;
        } else {
            this.timedClick = 1;
        }
        if (food1.amount < 10) {
            this.textMessage = " " + food1.amount;
        } else {
        this.textMessage = food1.amount;
        }
        
    }
    if (food1.amount > food1.tileX.length) {
        food1.refreshAmount();
    }
    if (this.decreaseValue === false && this.increaseValue === false) {
        this.timedClick = 0;
        this.timesChanged = 0;
    }
};

Button.prototype.redFoodGrowthSelector = function() {
    if (this.increaseValue === true && this.timedClick <= 0 && food1.increase < 30) {
        
        food1.increase++;
        this.timesChanged++;
         if (this.timesChanged < 2) {
            this.timedClick = 4;
        } else if (this.timesChanged >= 2 && this.timesChanged < 4) {
            this.timedClick = 3;
        } else {
            this.timedClick = 2;
        }
        this.textMessage = food1.increase;
    }
    if (this.decreaseValue === true && this.timedClick <= 0 && food1.increase> 1) {
        food1.increase--;
        this.timesChanged++;
         if (this.timesChanged < 2) {
            this.timedClick = 4;
        } else if (this.timesChanged >= 2 && this.timesChanged < 4) {
            this.timedClick = 3;
        } else {
            this.timedClick = 2;
        }
        this.textMessage = food1.increase;
    }
    if (this.decreaseValue === false && this.increaseValue === false) {
        this.timedClick = 0;
        this.timesChanged = 0;
    }
};

Button.prototype.resetTimerOnUnhovered = function() {
    if (mouseX > this.xPosition -20 && mouseY > this.yPosition-20 && mouseX < this.xPosition + this.btnWidth +20 && mouseY < this.yPosition + this.btnHeight +20) {
        
    } else {
        this.timedClick = 7;
    }
};

Button.prototype.workInProgressText = function() {
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed) {
        this.beingPressed = true;
        fill(255, 0, 0);
        textFont(f, 20);
        text("Feature not finished. Will be implemented in future versions.", 33, 534);
       
    } else {
        this.beingPressed = false;
    }
};

Button.prototype.resetSettingsToDefault = function() {
    if (this.timedClick > 0) {
    this.timedClick--;
    }
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
        
    fps = 12; //12

    boardWidth = 28; //small 18, normal 28, big 28, large  42
    boardHeight = 26; //small 16, normal 16, big 26, large 39
    scaleValue = 1;
    
    food1.amount = 1;
    food1.increase = 3;
    
    disappearAfterCrash = false;
    allowSelfCrash = true;
    startingSize = 1;
    
        
        this.fixTimer = 10;
    }
};

Button.prototype.setSettingsToRunner = function() {
    if (this.timedClick > 0) {
    this.timedClick--;
    }
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
        
    fps = 20; //12

    boardWidth = 42; //small 18, normal 28, big 28, large  42
    boardHeight = 39; //small 16, normal 16, big 26, large 39
    scaleValue = 0.6825;
    
    food1.amount = 6;
    food1.increase = 4;
    
    disappearAfterCrash = false;
    allowSelfCrash = true;
    startingSize = 1;
    
        
        this.fixTimer = 10;
    }
};

Button.prototype.setSettingsToTight = function() {
    if (this.timedClick > 0) {
    this.timedClick--;
    }
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
        
    fps = 10; //12

    boardWidth = 18; //small 18, normal 28, big 28, large  42
    boardHeight = 16; //small 16, normal 16, big 26, large 39
    scaleValue = 1.5;
    
    food1.amount = 1;
    food1.increase = 2;
    
    disappearAfterCrash = false;
    allowSelfCrash = true;
    startingSize = 1;
    
        
        this.fixTimer = 10;
    }
};

Button.prototype.setSettingsToParty = function() {
    if (this.timedClick > 0) {
    this.timedClick--;
    }
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
        
    fps = 12; //12

    boardWidth = 24; //small 18, normal 24, big 28, large  42
    boardHeight = 22; //small 16, normal 16, big 26, large 39
    scaleValue = 1.15;
    
    food1.amount = 75;
    food1.increase = 1;
    
    disappearAfterCrash = false;
    allowSelfCrash = true;
    startingSize = 1;
    
        
        this.fixTimer = 10;
    }
};

Button.prototype.setSettingsToRandom = function(force) {
    
    if (this.timedClick > 0) {
        this.timedClick--;
    }
    
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1 || force) {
    
    if (playerAmount > 1) {
            playAgain2Players.forceRandom = true;
        } else {
            playAgain1Player.forceRandom = true;
        }
    this.randomNumber = random(0, 100) + (this.randomNumber/random(5, 20)) - (random(1, 20)/this.randomNumber);
    //tends to ~52
        
    fps = 7+(floor(this.randomNumber/(5.88+random(0,4)))); //min 7, max 24

    if (this.randomNumber > 75) {
    boardWidth = 42; //small 18, normal 24, big 28, large  42
    boardHeight = 39; //small 16, normal 22, big 26, large 39
    scaleValue = 0.6825; //small 1.5, normal 1.15, big 1, large 0.6825
    } else if (this.randomNumber > 50) {
    boardWidth = 28; 
    boardHeight = 26; 
    scaleValue = 1; 
    } else if (this.randomNumber > 25) {
    boardWidth = 24; 
    boardHeight = 22; 
    scaleValue = 1.15; 
    } else {
    boardWidth = 18; 
    boardHeight = 16; 
    scaleValue = 1.5; 
    }
    
    food1.amount = 1+floor(this.randomNumber/random(2,40));
    food1.increase = 2 + floor(this.randomNumber/random(4, 80));
    
    disappearAfterCrash = false;
    allowSelfCrash = true;
    startingSize = 1;
    
        //this.timedClick = 12;
        this.fixTimer = 10;
    }
};

Button.prototype.selectRandomPreset = function() {
    if (this.timedClick > 0) {
        this.timedClick--;
    }
    
    if (mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth && mouseY < this.yPosition + this.btnHeight && mouseIsPressed && this.timedClick < 1) {
    
    this.forceRandom = true;
    this.prcntStandard = 20;
    this.prcntRunner = 20;
    this.prcntParty = 20;
    this.prcntTight = 20;
    this.prcntRandom = 20;
    this.randomChooser = random(0, 100);
    
    if (this.randomChooser > 80) {
        this.setSettingsToStandard();
    } else if (this.randomChooser > 60) {
        this.setSettingsToRunner();
    } else if (this.randomChooser > 40) {
        this.setSettingsToParty();
    } else if (this.randomChooser > 20) {
        this.setSettingsToTight();
    } else {
        this.setSettingsToRandom();
    }
    }
};

Button.prototype.refreshSettingsValues = function() {

boardSize = new Button(286, 200, 152, 39, "Big (28x26)", 20, 10, 21, 3);

if (boardWidth === 18) {
    boardSize.textMessage = "Small (18x16)";
    boardSize.textX = 10;
} else if (boardWidth === 24) {
    boardSize.textMessage = "Normal (24x22)";
    boardSize.textX = 3;
} else if (boardWidth === 28) {
    boardSize.textMessage = "Big (28x26)";
    boardSize.textX = 18;
} else if (boardWidth === 42) {
    boardSize.textMessage = "Large (42x39)";
    boardSize.textX = 9;
} 

snakeSpeed = new Button(330, 255, 65, 43, fps, 15, 14, 25, -1, 5);
redFoodAmount = new Button(330, 310, 65, 43, food1.amount, 15, 14, 25, -1, 5);

redFoodGrowth = new Button(330, 365, 65, 43, food1.increase, 15, 14, 25, -1, 5);

};

Button.prototype.setPlayersInitialPositions = function() {
    if (this.timedClick > 0 && mouseX > this.xPosition && mouseY > this.yPosition && mouseX < this.xPosition + this.btnWidth + this.btnHeight) {
        if (playerAmount < 3) {
        player1.tileX = 2;
        player1.tileY = 2;
        } else {
            player1.tileX = boardWidth / 2;
            player1.tileY = 2;
        }
        player2.tileX = boardWidth - 2;
        player2.tileY = boardHeight -2;
        player3.tileX = 2;
        player3.tileY = boardHeight -2;
    }
};
}
    

/***STARTING SCREEN SETTINGS***/

var startingScreen = function() {
        fill(255, 255, 255);
        
        /**Choose Mode*0*/
        if (settingScreen === "choose mode" || settingScreen === 0) {
            fill(66, 64, 66);
            rect(110, 80, 380, 100);
            fill(74, 73, 74);
            noStroke();
            rect(120, 90, 360, 80);
            textFont(f,55);
            fill(255, 255, 255);
            text("Snake Clash", 147, 148);
            
            playSingleplayerBtn.drawIt();
            playSingleplayerBtn.definePlayersAmount();
            playSingleplayerBtn.changeScreenTo("choose singleplayer mode");
            
            playofflineBtn.drawIt();
            playofflineBtn.changeScreenTo("choose multiplayer mode");
            
            playonlineBtn.drawIt();
            playonlineBtn.workInProgressText();
            
            if (playonlineBtn.beingPressed === false) {
            fill(255, 255, 255);
            textFont(f, 16);
            text("Made by LuisGuille", 430, 530);
            }
        }
        
        /**Choose Singleplayer Mode*1*/
        if (settingScreen === "choose singleplayer mode" || settingScreen === 1) {
            textFont(f,20);
            text("Select the mode you want to play", 147, height/3.3);
            playStandardBtn.drawIt();
            playStandardBtn.resetTimerOnUnhovered();
            playStandardBtn.resetSettingsToDefault();
            playStandardBtn.startGame();
            playStandardBtn.refreshSettingsValues();
            
            playRunnerBtn.drawIt();
            playRunnerBtn.setSettingsToRunner();
            playRunnerBtn.startGame();
            
            playTightBtn.drawIt();
            playTightBtn.setSettingsToTight();
            playTightBtn.startGame();
            
            playPartyBtn.drawIt();
            playPartyBtn.setSettingsToParty();
            playPartyBtn.startGame();
            
            playRandomBtn.drawIt();
            //playRandomBtn.selectRandomPreset();
            playRandomBtn.setSettingsToRandom();
            playRandomBtn.startGame();
            
            playCustomBtn.drawIt();
            playCustomBtn.changeScreenTo(2);
            
            backToStartBtn.drawIt();
            backToStartBtn.changeScreenTo(0);
        }
        
        /**Choose Custom Settings*2*/
        if (settingScreen === 2 || settingScreen === "choose custom settings") {
            fill(255, 255, 255);
            textFont(f, 20);
            text("Select Settings:", width/2.7, height/3.9);
            text("Snake Speed:", 135, 282);
            text("Food Amount:", 135, 334);
            text("Growth/Food:", 135, 386);
            text("Board Size:", 154, 226);
            
            snakeSpeed.drawIt();
            snakeSpeed.numberSelector();
            snakeSpeed.snakeSpeedSelector();
            
            redFoodAmount.drawIt();
            redFoodAmount.numberSelector();
            redFoodAmount.redFoodAmountSelector();
            
            redFoodGrowth.drawIt();
            redFoodGrowth.numberSelector();
            redFoodGrowth.redFoodGrowthSelector();
            
            boardSize.dropDown();
            boardSize.defineBoardSize();
            
            startGameBtn.drawIt();
            startGameBtn.startGame();
            
            backToStartBtn.drawIt();
            backToStartBtn.backToMenu();
        }
        
        /**Choose Multiplayer Mode*3*/
        if (settingScreen === "choose multiplayer mode" || settingScreen === 3) {
             textFont(f,20);
            text("Select amount of players", 191, height/3.3);
            
            twoplayerBtn.drawIt();
            twoplayerBtn.definePlayersAmount(2);
            twoplayerBtn.changeScreenTo(1);
            
            threeplayerBtn.drawIt();
            threeplayerBtn.definePlayersAmount(3);
            threeplayerBtn.changeScreenTo(1);
            
            backToStartBtn.drawIt();
            backToStartBtn.changeScreenTo(0);
        }
        
        
        
        /**Choose Custom Same Device Settings*4*/
};

/***BOARD****/
var board = function() {
    
    /**Draws Board**/
    {
    pushMatrix();
    scale(scaleValue);
    background(styles[activeStyle].background);
    fill(styles[activeStyle].box);
    noStroke();
    rect(20, 20, boardWidth*20, boardHeight*20);
    popMatrix();
    }
    
    /**Detect Preset**/
    {
    if (food1.amount === 1 && fps === 12 && food1.increase === 3 && boardHeight === 26) {
        //fill(61, 169, 242);
        fill(styles[activeStyle].bar1);
        highscoreChooser = 1;
    } else if (food1.amount === 6 && fps === 20 && food1.increase === 4 && boardHeight === 39) {
        highscoreChooser = 2;
        fill(styles[activeStyle].bar1);
    } else if (food1.amount === 75 && fps === 12 && food1.increase === 1 && boardHeight === 22) {
        highscoreChooser = 3;
        fill(styles[activeStyle].bar1);
    } else if (food1.amount === 1 && fps === 10 && food1.increase === 2 && boardHeight === 16) {
        highscoreChooser = 4;
        fill(styles[activeStyle].bar1);
    } else {
        highscoreChooser = 0;
        fill(styles[activeStyle].bar2);
    }
    
    strokeWeight(1.5);
    stroke(0, 0, 0);
    rect(10, height-45, width-20, 40);
    }
    
    /***************
    ******SCORES****
    ****************/
    
    strokeWeight(1);
    
    
            /***CONTROLS***/ //Starting Screen, Multiplayer Screen
        
    if (settingScreen === 0 || settingScreen === "choose mode" || settingScreen === 3 || settingScreen === "choose multiplayer mode") {
            strokeWeight(1.5);
            fill(player1.snakeColor);
            rect(119, height-45, 157, 40);
            fill(player2.snakeColor);
            rect(276, height-45, 157, 40);
            fill(player3.snakeColor);
            rect(433, height-45, 157, 40);
            textFont(f, 25);
            fill(0, 0, 0);
            text("Controls", width/34.8, height/1.03);
            text("P1: WASD", 136, height/1.027);
            text("P2: Arrows", 293, height/1.027);
            text("P3: Mouse", 447, height/1.027);
            
       
            
    }

            /***1 PLAYER SCORES***/ 
    
    else if (playerAmount === 1) {
        
                /**Started**/
        if (started) {
            textFont(f, 25);
            fill(0, 0, 0);
            text("Length: " + player1.size, width/34.8, 583);
            /*//Small
            if (boardWidth === 18 && boardHeight === 16) {
                if (player1.size > highPlayer1Small[highscoreChooser]) {
                    highPlayer1Small[highscoreChooser] = player1.size;
                }
                text("High Score: " + highPlayer1Small[highscoreChooser], 400, height/1.03);
            }
            //Normal
            if (boardWidth === 24 && boardHeight === 22) {
                if (player1.size > highPlayer1Normal[highscoreChooser]) {
                    highPlayer1Normal[highscoreChooser] = player1.size;
                }
                text("High Score: " + highPlayer1Normal[highscoreChooser], 400, height/1.03);
            }
            //Big
            if (boardWidth === 28 && boardHeight === 26) {
                if (player1.size > highPlayer1Big[highscoreChooser]) {
                    highPlayer1Big[highscoreChooser] = player1.size;
                }
                text("High Score: " + highPlayer1Big[highscoreChooser], 400, height/1.03);
            }
            //Large
            if (boardWidth === 42 && boardHeight === 39) {
                if (player1.size > highPlayer1Large[highscoreChooser]) {
                    highPlayer1Large[highscoreChooser] = player1.size;
                }
                text("High Score: " + highPlayer1Large[highscoreChooser], 400, height/1.03);
            }*/
            
            if (player1.size > singleplayerHighScores[highscoreChooser]) {
                    singleplayerHighScores[highscoreChooser] = player1.size;
                }
                textAlign(RIGHT);
                text("High Score: " + singleplayerHighScores[highscoreChooser] + "  ", 386, 565, 210, 38);
                //rect(379, 556, 210, 38);
                textAlign(BASELINE);
            
                /**Not Started**/
        } else if (started === false) {
            textFont(f, 20);
            fill(styles[activeStyle].sizeBar);
            rect(139, height-45, 452, 40);
            fill(0, 0, 0);
            text("High Scores", 22, height/1.03);
            
            textFont(f, 20);
            if (singleplayerHighScores[1] < 10) {
            text("Standard: " + singleplayerHighScores[1], 144, height/1.03);
            } else {
                text("Standard:" + singleplayerHighScores[1], 144, height/1.03);
            }
            if (singleplayerHighScores[2] < 10) {
            text("Runner: " + singleplayerHighScores[2], 278, height/1.03);
            } else {
            text("Runner:" + singleplayerHighScores[2], 278, height/1.03);    
            }
            if (singleplayerHighScores[3] < 10) {
            text("Party: " + singleplayerHighScores[3], 395, height/1.03);
            } else {
                text("Party:" + singleplayerHighScores[3], 395, height/1.03);
            }
            if (singleplayerHighScores[4] < 10) {
            text("Tight: " + singleplayerHighScores[4], 489, height/1.03);
            
            } else {
                text("Tight:" + singleplayerHighScores[4], 489, height/1.03);
            }
        }
            
    
    }
        /**2 Players**/
    else if (playerAmount === 2) {
        fill(player1.snakeColor);
        rect(10, 555, 145, 40);
        if (player1.size > player2.size) {
        fill(player1.snakeColor);
        } else if (player2.size > player1.size) {
        fill(player2.snakeColor);
        }
        fill(122, 122, 122);
        rect(155, 555, 290, 40);
        fill(player2.snakeColor);
        rect(445, 555, 145, 40);
        fill(player2.snakeColor);
        rect(395, 555, 50, 40);
        fill(player1.snakeColor);
        rect(145, 555, 50, 40);
        
        fill(0, 0, 0);
        textFont(f, 25);
        textAlign(CENTER, TOP);
        text("Length: " + player1.size, 77, 561);
        text("Length: " + player2.size, 515, 561);
        text("Round "+roundNumber, 298, 561);
        
        text(floor(player2Wins), 389, 561, 60, 60);
        text(floor(player1Wins), 139, 561, 60, 60);
        textAlign(BASELINE, BASELINE);
        
        //fill(223, 230, 16);
        fill(161, 163, 56);
        if (player1Wins !== floor(player1Wins)) {
            rect(150, 589, 40, 3, 2);
        }
        if (player2Wins !== floor(player2Wins)) {
            rect(400, 589, 40, 3, 2);
        }
    }
    
    /**Mouse Controller**/
    if (player1.mouseController) {
        stroke(153, 153, 153);
        strokeWeight(2);
        //UP
        if (mouseX > 449 && mouseX < 509 && mouseY > 386-20 && mouseY < 432 && mouseIsPressed) {
            fill(97, 96, 96);
        } else {
            fill(201, 201, 201);
        }
        rect(449, 386, 60, 46);
        
        //DOWN
        if (mouseX > 449 && mouseX < 509 && mouseY > 432 && mouseY < 498 && mouseIsPressed) {
            fill(97, 96, 96);
        } else {
            fill(201, 201, 201);
        }
        rect(449, 432, 60, 46);
        
        //LEFT
        if (mouseX > 379 && mouseX < 449 && mouseY > 400-10 && mouseY < 465+10 && mouseIsPressed) {
            fill(97, 96, 96);
        } else {
            fill(201, 201, 201);
        }
        rect(399, 405, 50, 55);
        
        //RIGHT
        if (mouseX > 509 && mouseX < 579 && mouseY > 400-10 && mouseY < 465+10 && mouseIsPressed) {
            fill(97, 96, 96);
        } else {
            fill(201, 201, 201);
        }
        rect(509, 405, 50, 55);
        strokeWeight(1);
        stroke(0, 0, 0);
    }
    
};

/****ON GAME ENDED****/

var gameEnded = function() {
    
        /**Single Player**/
    if (playerAmount === 1) {
        if (highscoreChooser === 0) {
            noStroke();
            fill(41, 41, 41);
            rect(200, 169, 200, 239);
            fill(82, 3, 0);
            rect(200, 169, 200, 44);
            stroke(0, 0, 0);
        } else {
            fill(18, 18, 18);
            rect(200, 169, 200, 239);
            fill(3, 3, 3);
            rect(200, 169, 200, 44);
        }
        
        
        
        fill(255, 255, 255);
        textFont(f, 25);
        text("Game Over", 237, 200);
        textFont(f, 23);
        textAlign(CENTER, CENTER);
        //rect(200, 230, 200, 35);
        text("Length: " + player1.size, 200, 226, 200, 40);
        text("High: " + singleplayerHighScores[highscoreChooser], 203, 262, 200, 40);
        textAlign(BASELINE);
        
        playAgain1Player.drawIt();
        playAgain1Player.restartGame();
        backToMenu1Player.drawIt();
        backToMenu1Player.backToMenu();
        
    } else if (playerAmount === 2) {
        
        fill(18, 18, 18);
        rect(200, 169, 200, 239);
        
        
        if (player1.size > player2.size) {
            fill(player1.snakeColor);
        } else if (player2.size > player1.size) {
            fill(player2.snakeColor);
        } else if (player2.size === player1.size) {
            fill(3, 3, 3);
        }
        rect(200, 169, 200, 44);
        
        fill(255, 255, 255);
        text("Round "+ roundNumber, 258, 200);
        
        textFont(f, 20);
        if (player1.size > highScores[0]) {
            highScores[0] = player1.size;
        }
        if (player2.size > highScores[1]) {
            highScores[1] = player2.size;
        }
        
        if (highScores[0] > highScores[1]) {
            fill(player1.snakeColor);
            text("Highest Score: " + highScores[0], 221, 284); 
        } else if (highScores[1] > highScores[0]) {
            fill(player2.snakeColor);
            text("Highest Score: " + highScores[1], 221, 284); 
        } else {
        fill(255, 255, 255);
        text("Highest Score: " + highScores[0], 221, 284); 
        }
        
        if (player1.size > player2.size) {
            fill(player1.snakeColor);
            text("Round Score: " + player1.size, 228, 249); 
        } else if (player2.size > player1.size) {
            fill(player2.snakeColor);
            text("Round Score: " + player2.size, 228, 249);
        } else {
            fill(255, 255, 255);
            text("Round Score: " + player1.size, 228, 249);
        }
        
        
        
        
        playAgain2Players.drawIt();
        playAgain2Players.restartGame();
        backToMenu2Players.drawIt();
        backToMenu2Players.backToMenu();
        
        if (roundNumber > timesCalled && playersCrashed[0] && playersCrashed[1]) {
        if (player1.size > player2.size) {
            player1Wins++;
        } else if (player2.size > player1.size) {
            player2Wins++;
        } else if (player2.size === player1.size) {
            player1Wins+= 0.5;
            player2Wins+=0.5;
        }
        timesCalled++;
        }
        //println("round:"+roundNumber);
        //println("called:"+timesCalled);
    }
    strokeWeight(1);
};


/***Draw***/
draw = function() {
    if (started) {
        frameRate(fps);
    } else {
        frameRate(btnFps);
    }

    board();    
    if (started) {
        player1.controlsPlayerWASD();
        if (playerAmount === 1) {
        //player1.controlsPlayerArrows();
        player1.controlsPlayer3Click();
        
        } else if (playerAmount === 2) {
            player2.controlsPlayerArrows();
            player2.directionControls();
            /*player1.crashOnOtherSnakes();
            player2.crashOnOtherSnakes();*/
            }
        player1.directionControls();
    }
    
    
    
    pushMatrix();
    
    scale(scaleValue);
    food1.red();
    
    
    player1.drawIt();
    if (playerAmount === 2) {
        player2.drawIt();
        if (started) {
            player1.crashOnOtherSnakes();
            player2.crashOnOtherSnakes();
            player2.selfCrash();

        }
    }
    
    if (started) {
    player1.selfCrash();
    }
    
    popMatrix();
    if (started === false) {
        startingScreen();
    } else if (playersCrashed[0] && playersCrashed[1] && playersCrashed[2]) {
        gameEnded();
    }
    if (mouseCordinates) {
        println("x: " + mouseX + ", y: " + mouseY);
    }
    //println(food1.increase);
};
