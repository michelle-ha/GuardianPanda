const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d")
canvas.width = 1000; //determined on css file. Can do window.innerHight/innerWidth if want full screen. Norm: 800x500
canvas.height = 500


//PLAYER

const keys = []

const player = {
    x: 100, //starting position
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

//GAME BOARD

const playerSprite = new Image()
playerSprite.src = "./images/panda2.png" 
const background = new Image()
background.src = "./images/background2.jpg"

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH) 
    //takes in the image + cuts out a portion of that image (one sprite frame). Places somewhere on canvas
    //s = source (how you crop the image), d = destination (where you want to put image)
}

 //lower frame rate of game to controle player speed (so doesn't blink in and out). Keep consistent fsp rate 
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
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height) //background covers entire canvas
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height) 
        //crop rectangle of one player frame + put in same dimensions on canvas. 
        //Where the image is cropped changes depending on position
        movePlayer()
        handlePlayerFrame()
    }
}

startAnimating(30) //arg = fps




window.addEventListener("resize", function() { //keeps the characters from getting re-sized with window size changes
    canvas.width = 1000
    canvas.height = 500
})