const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d")
canvas.width = 1000; //determined on css file. Can do window.innerHight/innerWidth if want full screen. Norm: 800x500
canvas.height = 500

const pauseButton = document.getElementById("pauseButton")
pauseButton.addEventListener("click", gamePause)

let keys = []
let weapons = []
let weapons2 = []
let weapons3 = []
let weapons4 = []
let enemies = []
let victims = []
let powersUps = []
let enemiesInterval = 20 //time between enemies
let enemyNumbers = 0
let victimsInterval = 15
let frame = 0
let score = 0
let livesSaved = 0
let livesLost = 0
let gameOver = false
let restart = false
let paused = false

//MESSAGES
const messages = []
class Message {
    constructor(value, x, y, size, color) { //size = text size
        this.value = value
        this.x = x
        this.y = y
        this.size = size
        this.color = color 
        this.lifeSpan = 0 //how long the message lasts
        this.opacity = 1 
    }
    update() {
        this.y -= 0.3 //message floats up
        this.lifeSpan += 1
        if (this.opacity > 0.05) this.opacity -= 0.05 //increase transparency
    }
    draw() {
        ctx.globalAlpha = this.opacity //affects everything drawn on canvas
        ctx.fillStyle = this.color //dif color for dif categories
        ctx.font = this.size + 'px Arial'
        ctx.fillText(this.value, this.x, this.y)
        ctx.globalAlpha = 1 //reset back
    }
}

function handleMessages() {
    for (let i = 0; i < messages.length; i++) {
        messages[i].update()
        messages[i].draw()
        if (messages[i].lifeSpan >= 20) {
            messages.splice(i, 1)
            i--
        }
    }
}

//PLAYER

const playerSprite = new Image()
playerSprite.src = "./images/panda5.png" 

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH) 
    //takes in the image + cuts out a portion of that image (one sprite frame). Places somewhere on canvas
    //s = source (how you crop the image), d = destination (where you want to put image)
}

const player = {
    x: 500, //starting position
    y: 300,
    width: 77, //depends on sprite sheet. highlight over image to get dimensions. 144x192. x/(# columns). Include decimals. 225x300
    height: 75, //y/(# rows)
    frameX: 0, //changes what picture you're getting. 
    frameY: 0, 
    speed: 10, 
    moving: false, //swith between standing + walking
    attacking: false,
    health: 100
}

const exclamationSprite = new Image()
exclamationSprite.src = "./images/exclamation.png" 

const exclamation = {
    width: 13,
    height: 19, 
    frameX: 0, 
    frameY: 0, 
}

const confusedSprite = new Image()
confusedSprite.src = "./images/confused.png" 

const confused = {
    width: 40,
    height: 46, 
    frameX: 0, 
    frameY: 0, 
}


window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true //every time key is pressed, added to keys array
})

window.addEventListener("keyup", function(e) {
    delete keys[e.keyCode] //removes key from keys array
    player.moving = false
})

function movePlayer() { //NOTE: CHANGE MARGINS WHEN WE PUT IN VICTIMS
    if (keys[38] && player.y > 40) { //38 = up arrow on keyboard. Prevents player from moving off-screen
        player.y -= player.speed //moves in negative direction along y axis (moves up)
        player.frameY = 3.1 //character's position changes so it looks like he'ss facing away
        player.moving = true //to prevent characters from "gliding"
    }
    if (keys[37] && player.x > 20) { //37 = left arrow on keyboard. Prevents player from moving off-screen
        player.x -= player.speed //moves left on screen
        player.frameY = 1 //character's position changes so it looks like he's facing left
        player.moving = true
    }
    if (keys[40] && player.y < canvas.height - player.height) { //40 = down
        player.y += player.speed //moves down on screen
        player.frameY = 0 //character's position changes so it looks like he's facing down
        player.moving = true
    }
    if (keys[39] && player.x < canvas.width - player.width - 50) { //39 = right
        player.x += player.speed 
        player.frameY = 2.1 
        player.moving = true
    }
}

function killAction() {
    if (keys[32] && !player.moving && (frame % 1.5  === 0)) {
        player.attacking
        if(player.frameY === 2.1 ) {//facing right
            weapons.push(new Weapon(player.x + 15, player.y + 30))
        }
        if(player.frameY === 1) {//facing left
            weapons2.push(new Weapon2(player.x + 25, player.y + 30))
        }
        if(player.frameY === 3.1) {//facing up
            weapons3.push(new Weapon3(player.x + 25, player.y ))
        }
        if(player.frameY === 0 ) {//facing down
            weapons4.push(new Weapon4(player.x + 25, player.y + 50))
        }
    }
    
    if(keys[32] && player.moving ) {
        messages.push(new Message("Stop moving to throw!", player.x, player.y, 15, "red"))
    }
        
    // if(player.frameY === 2.1 && keys[32] && (frame % 1.5  === 0) && !player.moving ) {//facing right
    //     player.attacking
    //     weapons.push(new Weapon(player.x + 15, player.y + 30))
    // }
    // if(player.frameY === 1 && keys[32] && (frame % 1.5  === 0) && !player.moving) {//facing left
    //     player.attacking
    //     weapons2.push(new Weapon2(player.x + 25, player.y + 30))
    // }
    // if(player.frameY === 3.1 && keys[32] && (frame % 1.5  === 0) && !player.moving) {//facing up
    //     player.attacking
    //     weapons3.push(new Weapon3(player.x + 25, player.y ))
    // }
    // if(player.frameY === 0 && keys[32] && (frame % 1.5  === 0) && !player.moving) {//facing down
    //     player.attacking
    //     weapons4.push(new Weapon4(player.x + 25, player.y + 50))
    // }
    // if(keys[32] && (frame % 1.5  === 0) && player.moving ) {
    //     messages.push(new Message("Stop moving to throw!", player.x, player.y, 15, "red"))
    // }
}

function handlePlayerFrame() { //walking animation
    if (player.frameX < 2 && player.moving) player.frameX++ //grid is 3x4. Check player.moving so legs aren't moving while standing
    else player.frameX = 0
    
}

//WEAPONS

const weaponSprite = new Image()
weaponSprite.src = "./images/shuriken.png"

class Weapon {
    constructor(x, y) { //depends on position of player
        this.x = x
        this.y = y
        this.width = 22 //87x26
        this.height = 26
        this.power = 50 //changes depending onprojectile/powerup, etc
        this.speed = 15
        this.frameX = 0
        this.frameY = 0
    }
    update() {
            this.x += this.speed //weapon moves right
    }
    draw() {
        drawWeapon(weaponSprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
        if (this.frameX < 3) this.frameX++; 
        else this.frameX = 0
    }
}

function drawWeapon(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function handleWeapons() {
    for (let i = 0; i < weapons.length; i++){
        weapons[i].update()
        weapons[i].draw()

        for (let j = 0; j < enemies.length; j++ ) { //cyce through weapons to check for collision
            if (enemies[j] && weapons[i] && collision(weapons[i], enemies[j])) {
                enemies[j].frameY = 4 
                enemies[j].frameX = 0
                enemies[j].health -= weapons[i].power
                weapons.splice(i, 1) //remove projectile that collided
                i--
            }
        }

        if (weapons[i] && weapons[i].x > canvas.width - 75) {//don't want enemies to be hit when the spawn off-grid
            weapons.splice(i, 1)
            i--
        }
    }
}

class Weapon2 {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 22
        this.height = 26
        this.power = 50 
        this.speed = 15
        this.frameX = 0
        this.frameY = 0
    }
    update() {
            this.x -= this.speed //weapon moves left
    }
    draw() {
        drawWeapon(weaponSprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
        if (this.frameX < 3) this.frameX++; 
        else this.frameX = 0
    }
}

function handleWeapons2() {
    for (let i = 0; i < weapons2.length; i++){
        weapons2[i].update()
        weapons2[i].draw()

        for (let j = 0; j < enemies.length; j++ ) { 
            if (enemies[j] && weapons2[i] && collision(weapons2[i], enemies[j])) {
                enemies[j].frameY = 4 
                enemies[j].frameX = 0
                enemies[j].health -= weapons2[i].power
                weapons2.splice(i, 1) 
                i--
            }
        }

        if (weapons2[i] && weapons2[i].x < 0) {
            weapons2.splice(i, 1)
            i--
        } 
    }
}

class Weapon3 {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 22
        this.height = 26
        this.power = 50 
        this.speed = 15
        this.frameX = 0
        this.frameY = 0
    }
    update() {
            this.y -= this.speed //weapon moves up
    }
    draw() {
        drawWeapon(weaponSprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
        if (this.frameX < 3) this.frameX++; 
        else this.frameX = 0
    }
}

function handleWeapons3() {
    for (let i = 0; i < weapons3.length; i++){
        weapons3[i].update()
        weapons3[i].draw()

        for (let j = 0; j < enemies.length; j++ ) { 
            if (enemies[j] && weapons3[i] && collision(weapons3[i], enemies[j])) {
                enemies[j].frameY = 4 
                enemies[j].frameX = 0
                enemies[j].health -= weapons3[i].power
                weapons3.splice(i, 1) 
                i--
            }
        }

        if (weapons3[i] && weapons3[i].y < 0) {
            weapons3.splice(i, 1)
            i--
        } 
    }
}

class Weapon4 {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 22
        this.height = 26
        this.power = 50 
        this.speed = 15
        this.frameX = 0
        this.frameY = 0
    }
    update() {
            this.y += this.speed //weapon moves down
    }
    draw() {
        drawWeapon(weaponSprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
        if (this.frameX < 3) this.frameX++; 
        else this.frameX = 0
    }
}

function handleWeapons4() {
    for (let i = 0; i < weapons4.length; i++){
        weapons4[i].update()
        weapons4[i].draw()

        for (let j = 0; j < enemies.length; j++ ) { 
            if (enemies[j] && weapons4[i] && collision(weapons4[i], enemies[j])) {
                enemies[j].frameY = 4 
                enemies[j].frameX = 0
                enemies[j].health -= weapons4[i].power
                weapons4.splice(i, 1) 
                i--
            }
        }

        if (weapons4[i] && weapons4[i].y > canvas.height) {
            weapons4.splice(i, 1)
            i--
        } 
    }
}

//POWERUPS

const enemySprite = new Image()
enemySprite.src = "./images/monkey2.png"

const effects = [stregth, speed, health, time]
class powerUp {
    constructor() {
        this.x = Math.random() * (canvas.width - 100) //dont' want in enemy territory
        this.y = Math.random() * ((canvas.height - 100) - 100) + 100
        this.effect = effects[Math.floor(Math.random()*effects.length)]
        this.width = 142.25 //1138, 712
        this.height = 142.4
    }
}
 
//ENEMY
const enemySprite = new Image()
enemySprite.src = "./images/monkey2.png"

class Enemy {
    constructor(){
        this.width = 83.3 //1345x475
        this.height = 79
        this.frameX = 0
        this.frameY = 1
        this.minFrame = 1
        this.maxFrame = 2
        this.x = canvas.width
        this.y = Math.random() * ((canvas.height - 100) - 100) + 100 //make so it doesn't go below/above wanted margins
        this.speed = (Math.random()*1.5) + 10
        this.health = 50
        this.maxHealth = this.health
    }
    draw() {
        drawEnemy(enemySprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
        // ctx.fillStyle = "#FF0000" 
        // ctx.font = "12px Arial"
        // ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 10)
        if (this.frameX < this.maxFrame) this.frameX++; //standing to walking
        else this.frameX = this.minFrame

    }
    update() {
        
        this.x -= this.speed //enemies will walk to left
    }
}

function drawEnemy(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function collision(first, second) {
    if( !( first.x > second.x + second.width - 50||
            first.x + first.width < second.x + 20 ||
            first.y > second.y + second.height - 40 ||
            first.y + first.height < second.y + 25)    
    ){
        return true
    }
}

function handleEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update()
        enemies[i].draw()
        if (enemies[i].health <= 0) { //remove enemies from array when health reaches 0
            score += enemies[i].maxHealth/10
            enemies.splice(i, 1)
            i-- 
        }
        if (enemies[i] && enemies[i].x < 20) {
            if (victims.length > 0) {
                victims.splice(0, 1)
                livesLost += 1
            }
            enemies.splice(i, 1)
            i-- 
        }
    }  
    if (frame % enemiesInterval === 0 && enemyNumbers <= 20) //stop after a certain number to bring in bigger monsters
        {//every time frame is divisible by interval, we push new enemies into the game. Only add enemies if winning score was not reached yet
        let verticalPosition = Math.random() * ((canvas.height - 100) - 100) + 100
        enemies.push(new Enemy(verticalPosition))
        enemyNumbers += 1

        // if (enemiesInterval > 120) enemiesInterval -= 50 //staggers wave of enemies. Changes difficulty
    }

    if (frame % 100 === 0 && enemies.length > 1) {
        enemiesInterval -= 5
    }

    player
    for (let j = 0; j < enemies.length; j++){
        if(collision(player, enemies[j])){
            enemies[j].speed = 0
            ctx.drawImage(exclamationSprite, exclamation.width * exclamation.frameX, exclamation.height * exclamation.frameY, exclamation.width, exclamation.height, player.x + 30, player.y - 20, exclamation.width, exclamation.height)
            ctx.drawImage(exclamationSprite, exclamation.width * exclamation.frameX, exclamation.height * exclamation.frameY, exclamation.width, exclamation.height, player.x + 40, player.y - 20, exclamation.width, exclamation.height)
            if (confused.frameX < 3) confused.frameX++; 
            else confused.frameX = 0

            enemies[j].frameY = 4 
            enemies[j].frameX = 0
            enemies[j].health -= 50
            player.health -= 5
            if (player.health <= 0)  {
                gameOver = true
            }
            if (player.health === 50) {
                messages.push(new Message("Your health!", player.x, player.y, 20, "red"))
            }
        } 
    }
}

//VICTIM

const victimSprite = new Image()
victimSprite.src = "./images/victim.png"

class Victim {
    constructor(){
        this.width = 42.9 //815x395
        this.height = 57.3
        this.frameX = 4.5
        this.frameY = 2.08
        this.x = 130
        this.y = canvas.height //start from bottom
        this.speed = (Math.random()*1.5) + 2
    }
    draw() {
        drawVictim(victimSprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
    }
    update() {
        
        this.y -= this.speed //victims will walk up
    }
}

function drawVictim(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

function handleVictims() {
    for (let i = 0; i < victims.length; i++) {
        victims[i].update()
        victims[i].draw()
        if (victims[i].y <= 110) { 
            score += 10
            livesSaved += 1
            victims.splice(i, 1)
            i-- 
        }
        for (let j = 0; j < enemies.length; j++ ) { //cyce through enemies to check for collision
            if (enemies[j] && victims[i] && collision(victims[i], enemies[j])) {
                victims.splice(i, 1) //remove victim that collided
                enemies.splice(j, 1) //enemy can only take one life
                i--
                livesLost += 1
                if (livesLost >= 15)  {
                    gameOver = true
                }
            }
        }
    }
    if (livesLost === 10) {
        messages.push(new Message("Protect the pandas!", 70, 150, 30, "red"))
    } 

    if (frame % victimsInterval === 0 ) {//every time frame is divisible by interval, we push new victims into the game. Only add victims if winning score was not reached yet
        let position = 200
        victims.push(new Victim(position))
    }
}

//GAMEBOARD

const controlsBar = { //bar on top of game w/ controls/score/etc
    width: canvas.width,
    height: 100
}

const goalSprite = new Image()
goalSprite.src = "./images/gate.png" 

const goal = {
    x: 90, //starting position
    y: 25,
    width: 105, //382x111
    height: 110, 
    frameX: 0, 
    frameY: 0, 
}


const gatekeeperSprite = new Image()
gatekeeperSprite.src = "./images/guardian.png" 

const keeper = {
    x: 1,
    y: 25,
    width: 130,
    height: 118, 
    frameX: 0, 
    frameY: 0, 
}

const treeSprite = new Image()
treeSprite.src = "./images/Firefly_Tree.png" 

const tree = {
    x: 920, 
    y: 70  ,
    width: 71,
    height: 70, 
    frameX: 0.1, 
    frameY: 0.1, 
}

const tree2 = {
    x: 940, 
    y: 100,
    width: 120,
    height: 160, 
    frameX: 1.72, 
    frameY: 0.05, 
}

function treeLine() {
    ctx.drawImage(treeSprite, tree.width * tree.frameX, tree.height * tree.frameY, tree.width, tree.height, tree.x, tree.y, tree.width, tree.height)
    ctx.drawImage(treeSprite, tree.width * tree.frameX, tree.height * tree.frameY, tree.width, tree.height, 935, 150, tree.width, tree.height)
    ctx.drawImage(treeSprite, tree.width * tree.frameX, tree.height * tree.frameY, tree.width, tree.height, 920, 300, tree.width, tree.height)
    ctx.drawImage(treeSprite, tree.width * tree.frameX, tree.height * tree.frameY, tree.width, tree.height, 960, 230, tree.width, tree.height)
    ctx.drawImage(treeSprite, tree.width * tree.frameX, tree.height * tree.frameY, tree.width, tree.height, 955, 300, tree.width, tree.height)
    ctx.drawImage(treeSprite, tree.width * tree.frameX, tree.height * tree.frameY, tree.width, tree.height, 915, 200, tree.width, tree.height)
    ctx.drawImage(treeSprite, tree2.width * tree2.frameX, tree2.height * tree2.frameY, tree2.width, tree2.height, 915, 360, tree2.width, tree2.height)
    ctx.drawImage(treeSprite, tree2.width * tree2.frameX, tree2.height * tree2.frameY, tree2.width, tree2.height, 930, 0, tree2.width, tree2.height)
    
}

//GAME STATUS

function GameStatus() { //displays amount of resources on controlsbar
    ctx.fillStyle = "blue"
    ctx.font = "25px Arial"
    ctx.fillText('Score: ' + score, 200, 40);
    ctx.fillText('Lives Saved: ' + livesSaved, 200, 80);
    ctx.fillStyle = "red"
    ctx.fillText('Lives lost: ' + livesLost, 790, 80);
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // canvas.style.visibility = "hidden"
        ctx.fillStyle = "rgba(0, 181, 204, 0.8)";
        ctx.fillRect(300, 50, 400, 400)
        ctx.fillStyle = "red"
        ctx.font = "60px Arial"
        ctx.fillText("YOU LOST", 345, 200)
        ctx.fillStyle = "white"
        ctx.font = "40px Arial"
        ctx.fillText("Restart?", 430, 300)
        ctx.fillText("Hit ESC key", 400, 350)
        pauseButton.style.visibility = "hidden"
    }
    ctx.fillStyle = "red"
    ctx.font = "25px Arial"
    ctx.fillText('Health: ' + player.health, 790, 40);
    if (enemyNumbers === 20) {
        // ctx.fillStyle = "blue"
        // ctx.font = "60px Arial"
        // ctx.fillText("NEW ENEMIES COMING!", 140, 250) //do message, not fill text
        messages.push(new Message("NEW ENEMIES COMING!", 140, 250, 60, "red"))
        messages.push(new Message("...SOON!", 350, 400, 60, "black"))
    }
}


const spacebarSprite = new Image()
spacebarSprite.src = "./images/spacebar.png" 

const spacebar = {
    x: 710,
    y: 290,
    width: 68,
    height: 36, 
    frameX: 0, 
    frameY: 0, 
}

const arrowSprite = new Image()
arrowSprite.src = "./images/arrow.png" 

const arrow = {
    x: 640,
    y: 210,
    width: 100,
    height: 100, 
    frameX: 0, 
    frameY: 0, 
}

const welcomeSprite = new Image()
welcomeSprite.src = "./images/welcome.png" 

const welcomePanda = {
    x: 30,
    y: 25,
    width: 425,
    height: 441, 
    frameX: 0, 
    frameY: 0, 
}

const pandaHeartSprite = new Image()
pandaHeartSprite.src = "./images/pandaHeart.png" 

const pandaHeart = {
    x: 410,
    y: 400,
    width: 47.5,
    height: 62,
    frameX: 0, 
    frameY: 0, 
}

//FUNCTIONALITY

//lower frame rate of game to control player speed (so doesn't blink in and out). Keep consistent fsp rate 
let fps, fpsInterval, startTime, now, then, elapsed;  

function startAnimating(fps) { //controls speed of char
    fpsInterval = 1000/fps // value in miliseconds
    then = Date.now() //# of miliseconds elapsed 
    startTime = then
    animate()
}

function callRestart() {
    if (keys[27] && gameOver) {
         keys = []
         weapons = []
         weapons2 = []
         weapons3 = []
         weapons4 = []
         enemies = []
         victims = []
         powerUps = []
         enemiesInterval = 20 
         enemyNumbers = 0
         victimsInterval = 15
         frame = 1
         score = 0
         livesLost = 0
         livesSaved = 0
         player.health = 100
         player.x = 500, 
         player.y = 300
         player.frameX = 0, //changes what picture you're getting. 
         player.frameY = 0
         gameOver = false
    }
}

function welcome() { //displays amount of resources on controlsbar
        if (paused) {
            ctx.fillStyle = "rgba(0, 181, 204, 0.2)" //0.2 = transparency
            ctx.fillRect(0,0, controlsBar.width, controlsBar.height)
            ctx.font = "35px Arial"
            ctx.fillStyle = "red"
            ctx.fillText("Game Paused. Hit ENTER to resume", 180, 40)     
    
        }
        ctx.drawImage(pandaHeartSprite, pandaHeart.width * 1, pandaHeart.height * pandaHeart.frameY, pandaHeart.width, pandaHeart.height, pandaHeart.x, 380, pandaHeart.width, pandaHeart.height)
        ctx.drawImage(pandaHeartSprite, pandaHeart.width * 2, pandaHeart.height * pandaHeart.frameY, pandaHeart.width, pandaHeart.height, 380, 400, pandaHeart.width, pandaHeart.height)
        ctx.drawImage(pandaHeartSprite, pandaHeart.width * pandaHeart.frameX, pandaHeart.height * pandaHeart.frameY, pandaHeart.width, pandaHeart.height, pandaHeart.x, pandaHeart.y, pandaHeart.width, pandaHeart.height)

        ctx.drawImage(welcomeSprite, welcomePanda.width * welcomePanda.frameX, welcomePanda.height * welcomePanda.frameY, welcomePanda.width, welcomePanda.height, welcomePanda.x, welcomePanda.y, welcomePanda.width, welcomePanda.height)

        drawSprite(playerSprite, player.width * 1, player.height * 0.1, player.width, player.height, 140, 65, player.width, player.height) 
        ctx.fillStyle = "rgba(0, 181, 204, 0.8)";
        ctx.fillRect(500, 50, 400, 400)
        ctx.fillStyle = "white" 
        ctx.font = "50px Arial"
        ctx.fillStyle = "white"
        ctx.fillText("Guardian Panda", 510, 94)  
        ctx.font = "30px Arial"
        ctx.fillText("HIT ENTER KEY TO BEGIN", 510, 440)
        ctx.font = "18px Arial"
        ctx.fillText("The pandas' home is destroyed and being", 510, 120)
        ctx.fillText("over-run by monkeys! Defend the fleeing pandas", 510, 140)
        ctx.fillText("and prevent them from getting captured! Your", 510, 160) //  (If the monkey gets to the end of the board without touching a monkey, that still counts as a loss!)
        ctx.fillText("cause is lost if more than 15 pandas are taken", 510, 180)
        ctx.fillText("or you die. If a monkey gets to the end of the", 510, 200)
        ctx.fillText("board without touching a panda, that still counts!", 510, 220)
        ctx.font = "25px Arial"
        ctx.fillText("Movement: ", 510, 280) 
        ctx.drawImage(spacebarSprite, spacebar.width * spacebar.frameX, spacebar.height * spacebar.frameY, spacebar.width, spacebar.height, spacebar.x, spacebar.y, spacebar.width, spacebar.height)
        ctx.drawImage(arrowSprite, arrow.width * arrow.frameX, arrow.height * arrow.frameY, arrow.width, arrow.height, arrow.x, arrow.y, arrow.width, arrow.height)
        ctx.fillText("Attack: spacebar", 510, 315) 
        ctx.fillText("No attacking while moving", 510, 350) 
        ctx.fillText("Melee attacks cost health", 510, 385) 
        if (keys[13]) {
            frame = 1
        }
}

function gamePause() {
    paused = true
    pauseButton.style.visibility = "hidden"
    frame = 0
    // animate()
}

function animate() {
    // restart()
    if (frame === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        welcome()
    }
    requestAnimationFrame(animate)
    

    now = Date.now()
    elapsed = now - then
    if (elapsed > fpsInterval && !gameOver && frame >= 1) {
        pauseButton.style.visibility = "visible"
        then = now - (elapsed % fpsInterval) 
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear everything behind w/ every animate
        ctx.fillStyle = "rgba(0, 181, 204, 0.2)" //0.2 = transparency
        ctx.fillRect(0,0, controlsBar.width, controlsBar.height) //(0,0) = top left corner of canvas
        treeLine()
        drawSprite(goalSprite, goal.width * goal.frameX, goal.height * goal.frameY, goal.width, goal.height, goal.x, goal.y, goal.width, goal.height) 
        drawSprite(gatekeeperSprite, keeper.width * keeper.frameX, keeper.height * keeper.frameY, keeper.width, keeper.height, keeper.x, keeper.y, keeper.width, keeper.height) 
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height) 
        //crop rectangle of one player frame + put in same dimensions on canvas. 
        //Where the image is cropped changes depending on position
        movePlayer()
        killAction()
        handlePlayerFrame()
        handleEnemies()
        handleWeapons()
        handleWeapons2()
        handleWeapons3()
        handleWeapons4()
        handleVictims()
        handleMessages()
        GameStatus()
        frame ++ //adds a frame with every animation
    }
    callRestart()
}

startAnimating(10) //arg = fps

window.addEventListener("resize", function() { //keeps the characters from getting re-sized with window size changes
    canvas.width = 1000
    canvas.height = 500
})