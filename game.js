const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d")
canvas.width = 1000; //determined on css file. Can do window.innerHight/innerWidth if want full screen. Norm: 800x500
canvas.height = 500

const keys = []
const weapons = []
const weapons2 = []
const weapons3 = []
const weapons4 = []
const enemies = []
const victims = []
let enemiesInterval = 20 //time between enemies
let enemyNumbers = 0
let victimsInterval = 30
let frame = 0
let score = 0
let livesLost = 0
let gameOver = false

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
    // timer: 0 //keeps track of charactr's updates
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
    if(player.frameY === 2.1 && keys[32] && (frame % 1  === 0)) {//facing right
        player.attacking
        weapons.push(new Weapon(player.x + 15, player.y + 30))
    }
    if(player.frameY === 1 && keys[32] && (frame % 1  === 0)) {//facing left
        player.attacking
        weapons2.push(new Weapon2(player.x + 25, player.y + 30))
    }
    if(player.frameY === 3.1 && keys[32] && (frame % 1  === 0)) {//facing up
        player.attacking
        weapons3.push(new Weapon3(player.x + 25, player.y ))
    }
    if(player.frameY === 0 && keys[32] && (frame % 1  === 0)) {//facing down
        player.attacking
        weapons4.push(new Weapon4(player.x + 25, player.y + 50))
    }

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
        } //remove weapons when out of bounds
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
            this.y += this.speed //weapon moves up
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

        if (weapons4[i] && weapons4[i].y < 0) {
            weapons4.splice(i, 1)
            i--
        } 
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
        this.speed = (Math.random()*1.5) + 4
        this.health = 50
        this.maxHealth = this.health
    }
    draw() {
        drawEnemy(enemySprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
        ctx.fillStyle = "#FF0000" 
        ctx.font = "12px Arial"
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 10)
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

// for (i = 0; i < numberOfEnemies; i++) { //creates more characters
//     enemies.push(new Enemy())
// }

function handleEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update()
        enemies[i].draw()
        if (enemies[i].health <= 0) { //remove enemies from array when health reaches 0
            score += enemies[i].maxHealth/10
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
        // enemies.push(new Enemy(Math.random() * ((canvas.height - 100) - 100) + 100))
        // if (enemiesInterval <= 0) {gameOver = true}
    }

    player
    for (let j = 0; j < enemies.length; j++){
        if(collision(player, enemies[j])){
            enemies[j].speed = 0
            enemies[j].frameY = 4 
            enemies[j].frameX = 0
            enemies[j].health -= 50
            player.health -= 5
            if (player.health <= 0)  {
                gameOver = true
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
        // if (this.frameX < this.maxFrame) this.frameX++; //standing to walking
        // else this.frameX = this.minFrame

    }
    update() {
        
        this.y -= this.speed //victims will walk up
    }
}

function drawVictim(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}

// for (i = 0; i < numberOfEnemies; i++) { //creates more characters
//     enemies.push(new Enemy())
// }

function handleVictims() {
    for (let i = 0; i < victims.length; i++) {
        victims[i].update()
        victims[i].draw()
        if (victims[i].y <= 110) { 
            score += 10
            victims.splice(i, 1)
            i-- 
        }
        for (let j = 0; j < enemies.length; j++ ) { //cyce through enemies to check for collision
            if (enemies[j] && victims[i] && collision(victims[i], enemies[j])) {
                victims.splice(i, 1) //remove victim that collided
                enemies.splice(j, 1) //enemy can only take one life
                i--
                livesLost += 1
                if (livesLost === 15)  {
                    gameOver = true
                }
            }
        }
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
goalSprite.src = "./images/gate.png" //probably change

const goal = {
    x: 90, //starting position
    y: 25,
    width: 105, //382x111
    height: 110, 
    frameX: 0, 
    frameY: 0, 
}


const gatekeeperSprite = new Image()
gatekeeperSprite.src = "./images/guardian.png" //probably change

const keeper = {
    x: 1,
    y: 25,
    width: 130,
    height: 118, 
    frameX: 0, 
    frameY: 0, 
}


//GAME STATUS

function GameStatus() { //displays amount of resources on controlsbar
    ctx.fillStyle = "blue"
    ctx.font = "25px Arial"
    ctx.fillText('Score: ' + score, 200, 40);
    ctx.fillText('Lives lost: ' + livesLost, 200, 80);
    if (gameOver) {
        ctx.fillStyle = "red"
        ctx.font = "100px Arial"
        ctx.fillText("YOU LOST", 300, 250)
    }
    ctx.fillStyle = "red"
    ctx.font = "25px Arial"
    ctx.fillText('Health: ' + player.health, 800, 40);
    if (enemyNumbers >= 20) {
        ctx.fillStyle = "red"
        ctx.font = "60px Arial"
        ctx.fillText("NEW ENEMIES COMING!", 140, 250) //do message, not fill text
    }
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



function welcome() { //displays amount of resources on controlsbar
        ctx.fillStyle = "rgba(0, 181, 204, 0.4)";
        ctx.fillRect(300, 50, 400, 400)
        ctx.fillStyle = "white" 
        ctx.font = "30px Arial"
        ctx.fillText("Hit enter to begin", 375, 400) 
        ctx.fillText("[story]", 375, 100) 
        ctx.fillText("[controls]", 375, 200) 
        if (keys[13]) {
            frame = 1
        }
}

function animate() {
    if (frame === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // ctx.fillRect(300, 50, 400, 400); //clear everything behind w/ every animate
        // ctx.fillStyle = "rgba(0, 181, 204, 0.2)"
        welcome()
    }
    requestAnimationFrame(animate)
    now = Date.now()
    elapsed = now - then
    if (elapsed > fpsInterval && !gameOver && frame >= 1) {
        then = now - (elapsed % fpsInterval) 
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear everything behind w/ every animate
        ctx.fillStyle = "rgba(0, 181, 204, 0.2)" //0.2 = transparency
        ctx.fillRect(0,0, controlsBar.width, controlsBar.height) //(0,0) = top left corner of canvas
        drawSprite(goalSprite, goal.width * goal.frameX, goal.height * goal.frameY, goal.width, goal.height, goal.x, goal.y, goal.width, goal.height) 
        drawSprite(gatekeeperSprite, keeper.width * keeper.frameX, keeper.height * keeper.frameY, keeper.width, keeper.height, keeper.x, keeper.y, keeper.width, keeper.height) 
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height) 
        //crop rectangle of one player frame + put in same dimensions on canvas. 
        //Where the image is cropped changes depending on position
        movePlayer()
        // playerAttack() 
        handlePlayerFrame()
        handleEnemies()
        handleWeapons()
        handleWeapons2()
        handleWeapons3()
        handleWeapons4()
        handleVictims()
        GameStatus()
        frame ++ //adds a frame with every animation
    }
} 

startAnimating(10) //arg = fps




window.addEventListener("resize", function() { //keeps the characters from getting re-sized with window size changes
    canvas.width = 1000
    canvas.height = 500

})