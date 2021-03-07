![alt text](https://github.com/michelle-ha/GuardianPanda/blob/main/images/guardian.png "Logo")

# Guardian Panda

[Guardian Panda Live Link](https://michelle-ha.github.io/GuardianPanda/)

Guardian Panda is a 2D web-based game using vanilla Javascipt and HTML canvas. Characters control a a panda using the keyboard keys and shoot oncoming monkeys using the spacebar. The game end when the player's health reaches zero or 10 escaping pandas are captured. 

<img src="https://github.com/michelle-ha/GuardianPanda/blob/main/images/welcome_screen.png" alt="welcome screen"/>

## Features

### Player functionality

Players are able to fully control their character using the keyboard. The panda is able to walk and shoot in all four directions. When facing different directions, the character's frame changes. When there is melee or weapon collision, animations are created to indicate expressions of hurt or suprirse. Walking animations are also implemented to indicate movement. 

<img src="https://github.com/michelle-ha/GuardianPanda/blob/main/images/recording.gif" alt="functionality"/>

[coding for weapon directions]

In order for weapons to appear in the proper location and be thrown in accordance to the direction the character is facing, three arguments are given when creating a new weapon object: x strting coordinate, y starting coordinate, and the direction the weapon will be flying. 

<img src="https://github.com/michelle-ha/GuardianPanda/blob/main/images/coding.png" alt="code example"/>

### Pause/Restart

Users are given the opportunity to pause the game at any time, while the restart option is available on game win or loss. When clicking the pause button, the user is taken back to the welcome screen and able to resume playing when hitting "enter". When restarting, enemies, score, and user attributes and lives lost are reset. 

<img src="https://github.com/michelle-ha/GuardianPanda/blob/main/images/recording%20(1).gif" alt="pause/restart"/>

### Increase in level difficulties

Over time, enemies increaase in difficulty. Enemies begin to spawn and move faster. Enemies also gain an increase in health and strength. To counter this, powerups are made available to players to restore health and increase their speed and strength. 

<img src="https://github.com/michelle-ha/GuardianPanda/blob/main/images/recording%20(3).gif" alt="pause/restart"/>

## Future Plans
* Incorporate sound effects and background music
* Leader scoreboard
* More enemies
* Different powerups and weapons 
