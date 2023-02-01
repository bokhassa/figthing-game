  sessionStorage.setItem('player', 3);
  sessionStorage.setItem('enemy', 0); 

function rectangularCollision( { playerRectangle, enemyRectangle }) {
    return (
        playerRectangle.attackBox.position.x + playerRectangle.attackBox.width >= enemyRectangle.position.x &&
        playerRectangle.attackBox.position.x <= enemyRectangle.position.x + enemyRectangle.width &&
        playerRectangle.attackBox.position.y + playerRectangle.attackBox.height >= enemyRectangle.position.y &&
        playerRectangle.attackBox.position.y <= enemyRectangle.position.y + enemyRectangle.height
    );
}

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie</br></br>Press ENTER to restart';
        sessionStorage.player = 0;
        sessionStorage.enemy = 0;
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins</br></br>Press ENTER to restart'; 
        sessionStorage.player = Number(sessionStorage.player) + 1;
        sessionStorage.enemy = 0;
    } else {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins</br></br>Press ENTER to restart';  
        sessionStorage.enemy = Number(sessionStorage.enemy) + 1;
        sessionStorage.player = 0;
    } 
}

//Verkar inte funka, vet vart felet ligger men vet inte hur jag skall stoppa räkningen eller få ut värdet en gång från vår infinite animation loop
//utan att förstöra animations frame... (Testa så som vi gjorde med AI, om jag orkar that is)
  function winStreak() {
    //Visa vinns om det finns några
    if (+sessionStorage.player > 0) {
        document.querySelector('#playerWins').style.display = 'flex';
    } else {
        document.querySelector('#playerWins').style.display = 'none';
    }

    if (+sessionStorage.enemy > 0) {
        document.querySelector('#enemyWins').style.display = 'flex';
    } else {
        document.querySelector('#enemyWins').style.display = 'none';
    }

    document.querySelector('#playerWins').innerHTML = 'wins:'+sessionStorage.player;
    document.querySelector('#enemyWins').innerHTML = 'wins:'+sessionStorage.enemy;
} 

let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        if (timer === 2) actionArr = []; //So that the AI doesn't buffer any actions before the game is done
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
    }
}

/**
 * TODO IF I FEEL THE NEED
 * Have the actions occur between 1-2s now that the infinity jumps and hits are solved
 * Let the movement occur between 0.5-1s so that the AI just doesn't follow around
 */

let randomAction;
let movementArr = ['forward', 'back']; //0.5s so that the AI has more fluent movement and is not only a duck
let actionArr = ['jump', 'attack'];
function ai({ player, enemy, boundryEnemy, counter }) {
    const extraMeasure = 30; //So that the AI doesn't walk inside player so that it can't attack

    /**
     * Work around for the infinty loop
     */
    if (counter === 200) {
        randomAction = actionArr[Math.floor(Math.random() * actionArr.length)];
        enemy.jumped = false;
        enemy.called = 0;
        console.log(randomAction);
    }

    if (!enemy.isDead && !player.isDead) {
        switch (randomAction) {
            case 'jump':
                if (enemy.velocity.y === 0 && !enemy.jumped) {
                    enemy.velocity.y = -20; //Same bug as before, when playing 1vs1
                    enemy.called = 0; //So an attack can be performeed after a jump again.
                    enemy.jumped = true; //So that the AI doesn't jump a billion times.
                } 
            break;
            case 'attack':
            if (enemy.called === 0) {
                enemy.attack();
                enemy.called = 1; // evite que l'ia ne fait qu'attaquer
                enemy.jumped = false; //So a jump can be performeed after a attack again.
            }
            break;
        }

        /**
         * Copy pasted from the 1vs1, resued code could be stored in a function instead  
         * AI follows you around everywhere I wanted it so that it goes for a bit then the randomActions array is called but I'm moving on, proof of concept
         */    
        if (player.position.x + player.width + extraMeasure < enemy.position.x && enemy.position.x > boundryEnemy) {
            enemy.velocity.x = -5;
            enemy.switchSprites('sprint');
        } else if (player.position.x + player.width > enemy.position.x) {
            enemy.velocity.x = +5;
            enemy.switchSprites('sprint');
        } else {
            enemy.switchSprites('idle');
        }

        if (enemy.velocity.y < 0) {
            enemy.switchSprites('jump');
        } else if (enemy.velocity.y > 0) {
            enemy.switchSprites('fall');
        }

        if (this.rectangularCollision({ playerRectangle: player, enemyRectangle: enemy }) && enemy.isAttacking && enemy.currentFrame === 2) {
            enemy.isAttacking = false;
            audio.hit1.play();
            player.takeHit();
            audio.hit1.stop();
            gsap.to('#playerHealth', {
               width: player.health + '%'
            });
        }
        //Attak manquer
        if (enemy.isAttacking && enemy.currentFrame === 2) { //5
            enemy.isAttacking = false;
        }
    }
}