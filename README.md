# capstone-js-phaser-rpg
A RPG Turn Based Game Build Using the Phaser Framework

## Screenshots

![]()

## Online Version
 [Live Demo ](https://agitated-rosalind-b151a5.netlify.app/)

## Content

* [Features](#features)
* [Built With](#built-with)
* [Getting Start](#getting-start)
* [Overview](#overview)
* [Contributing](#contributing)
* [Acknowledgments](#acknowledgments)
* [Authors](#authors)

## Features

<ul>
  <p>Any User Can:</p>
  <li>Check 'How To Play'</li>
  <li>Check 'LeaderBoard'</li>
  <li>Start a New Game, in which
    <ul>
      <li>Walk Around the World Map</li>
      <li>Battle Against Dragons</li>
      <li>Defeat Dragons</li>
      <li>Post Score (Automatically Posted)</li>
    </ul>
  </li>
</ul>

## Built With

- HTML5
- Javascript
- Webpack
- Phaser 3
- Jest
- ESLint (Linter) with Stickler (CI Tool)
- Git, Github and VScode
<br>

## Getting Start

#### Get a local copy
Now you need a copy of this application, if you are using Git:
```js
git@github.com:rsnazario/weather-app-js.git
```
Otherwise just hit (Download Zip) on green button (Clone or Download) at top of this page.

#### Run App

Since this project already provides the required files for setting up the Webpack, just type on your terminal:

```js
npm install
````
Now, you can just open your *Visual Studio Code* and click on `Go Live` if you have the `Live Server` extension installed properly. If it requires to select a folder to set as origin, make sure you choose `Dist` folder.

### Overview
The goal of the game is to kill as much dragons as possible while playing this Turn Based Role Playing Game. It starts with two heroes against 4 types of dragons.<br>
The heroes are the Warrior (HP: 130 ATK: 12) and the Mage(HP: 80 ATK: 22). The dragons follows the same 'rule': the more the hp status, the less the damage inflicted.<br>
Once you encounter the enemie, the two enemy dragons will be randomly generated. Each Dragon defeated counts as +10 on your score!<br>
If any of the heroes goes bellow 40HP, it starts dealing double damage. After each fight, both heroes are healed in 12HP.<br>

### Battling
The Game Follows the same old structure as the first released Final Fantasy Games. In the World Map it is not possible to see the enemy encounter zones, which are randomly generated (Also, it's possible to start a game already in a battle if the encounter zone was generated at the Player's initial positioning).<br>
In the Battle, choose the actions and the enemy wisely in order to get the max score!

### Contributing

Contributions, issues and feature requests are welcome!

You can do it on [issues page](issues/).

## Acknowledgments

First of all, a special thanks for all Microverse Team and Code Reviewers that guides me through my learning.

For this project, I would like to say that I appreciate all help I had from:

- My Current Partner: [Martin Njoroge](github.com/kwizl)
- My Former Partner: [Thiago Miranda](github.com/Sevlamare)

## Authors

👤 **Rafael Nazario**

- Github: [@rsnazario](https://github.com/rsnazario)
- Twitter: [@@rsnazario](https://twitter.com/@rsnazario)
- Linkedin: [Rafael Nazario](https://www.linkedin.com/in/rsnazario/)

## Show your support

Give a ⭐️ if you like this project!
