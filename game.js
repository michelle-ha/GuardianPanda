const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d")
canvas.width = 1000; //determined on css file. Can do window.innerHight/innerWidth if want full screen. Norm: 800x500
canvas.height = 500

const keys = []
const enemies = []
// let numberOfEnemies = 10
let enemiesInterval = 60 //time between enemies
let frame = 0
let score = 0
let livesLost = 0

//PLAYER

const playerSprite = new Image()
playerSprite.src = "./images/panda2.png" 

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH) 
    //takes in the image + cuts out a portion of that image (one sprite frame). Places somewhere on canvas
    //s = source (how you crop the image), d = destination (where you want to put image)
}

const player = {
    x: 500, //starting position
    y: 300,
    width: 48, //depends on sprite sheet. highlight over image to get dimensions. 144x192. x/(# columns). Include decimals
    height: 48, //y/(# rows)
    frameX: 0, //changes what picture you're getting. 
    frameY: 0, 
    speed: 5, 
    moving: false //swith between standing + walking
}

window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true //every time key is pressed, added to keys array
    player.moving = true
})

window.addEventListener("keyup", function(e) {
    delete keys[e.keyCode] //removes key from keys array
    player.moving = false
})

function movePlayer() { //NOTE: CHANGE MARGINS WHEN WE PUT IN VICTIMS
    if (keys[38] && player.y > 0) { //38 = up arrow on keyboard. Prevents player from moving off-screen
        player.y -= player.speed //moves in negative direction along y axis (moves up)
        player.frameY = 3 //character's position changes so it looks like he'ss facing away
        player.moving = true //to prevent characters from "gliding"
    }
    if (keys[37] && player.x > 0) { //37 = left arrow on keyboard. Prevents player from moving off-screen
        player.x -= player.speed //moves left on screen
        player.frameY = 1 //character's position changes so it looks like he's facing left
        player.moving = true
    }
    if (keys[40] && player.y < canvas.height - player.height) { //40 = down
        player.y += player.speed //moves left on screen
        player.frameY = 0 //character's position changes so it looks like he's facing left
        player.moving = true
    }
    if (keys[39] && player.x < canvas.width - player.width) { //39 = right
        player.x += player.speed 
        player.frameY = 2 
        player.moving = true
    }
}

function handlePlayerFrame() { //walking animation
    if (player.frameX < 2 && player.moving) player.frameX++ //grid is 3x4. Check player.moving so legs aren't moving while standing
    else player.frameX = 0
    
}

//ENEMY
const enemySprite = new Image()
enemySprite.src = "./images/death_scythe.png"

class Enemy {
    constructor(){
        this.width = 48
        this.height = 48
        this.frameX = 0
        this.frameY = 1
        this.x = canvas.width
        this.y = Math.random() * ((canvas.height - 100) - 100) + 100 //make so it doesn't go below/above wanted margins
        this.speed = (Math.random()*1.5) + 0.5
        this.health = 100
        this.maxHealth = this.health
    }
    draw() {
        drawEnemy(enemySprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "#FF0000" 
        ctx.font = "12px Arial"
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y - 5)

    }
    update() {
        this.x -= this.speed //enemies will walk to left
    }
}

function drawEnemy(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

// for (i = 0; i < numberOfEnemies; i++) { //creates more characters
//     enemies.push(new Enemy())
// }

function handleEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update()
        enemies[i].draw()
        if (enemies[i].health <= 0) { //remove enemies from array when health reaches 0
            score += maxHealth/10
            enemies.splice(i, 1)
            i-- 
        }
    }
    if (frame % enemiesInterval === 0 ) {//every time frame is divisible by interval, we push new enemies into the game. Only add enemies if winning score was not reached yet
        let verticalPosition = Math.random() * ((canvas.height - 100) - 100) + 100
        enemies.push(new Enemy(verticalPosition))
        // if (enemiesInterval > 120) enemiesInterval -= 50 //staggers wave of enemies. Changes difficulty
    }
}



//GAMEBOARD
const controlsBar = { //bar on top of game w/ controls/score/etc
    width: canvas.width,
    height: 100
}

const goal = new Image()
goal.src = "./images/ShojiDoor2"

//////////////////////////////////LEFT OFF HERE /////////////////////////////////////////////////////////////////////////////////////

//GAME STATUS

function GameStatus() { //displays amount of resources on controlsbar
    ctx.fillStyle = "blue"
    ctx.font = "25px Arial"
    ctx.fillText('Score: ' + score, 30, 40);
    ctx.fillText('Lives lost: ' + livesLost, 30, 80);
}

// function gameStatus() {

// }


//FUNCTIONALITY

//lower frame rate of game to control player speed (so doesn't blink in and out). Keep consistent fsp rate 
let fps, fpsInterval, startTime, now, then, elapsed;  

function startAnimating(fps) { //controls speed of char
    fpsInterval = 1000/fps // value in miliseconds
    then = Date.now() //# of miliseconds elapsed 
    startTime = then
    animate()
}

function animate() {
    requestAnimationFrame(animate)
    now = Date.now()
    elapsed = now - then
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval) 
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear everything behind w/ every animate
        GameStatus()
        ctx.fillStyle = "rgba(0, 181, 204, 0.2)" //call "ctx" because that's where all canvas methods are stored
        ctx.fillRect(0,0, controlsBar.width, controlsBar.height) //(0,0) = top left corner of canvas
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height) 
        //crop rectangle of one player frame + put in same dimensions on canvas. 
        //Where the image is cropped changes depending on position
        movePlayer()
        handlePlayerFrame()
        handleEnemies()
        frame ++ //adds a frame with every animation

    }

}

startAnimating(10) //arg = fps




window.addEventListener("resize", function() { //keeps the characters from getting re-sized with window size changes
    canvas.width = 1000
    canvas.height = 500
})