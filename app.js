const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)


const gravity = 0.7
//PlayerOne and PlayerTwo blueprint
class Sprite {
    constructor({ position, velocity, color, offset }) { //übergabe position, velocity, etc
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() { // rechteckt zeichnen
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attackbox draw
        if (this.isAttacking) {     //Hier auskommentieren ;)

            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        }
        else this.velocity.y += gravity

    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

}
//PlayerOne and PlayerTwo Objects
const PlayerOne = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',

    offset: {
        x: 0,
        y: 0
    }
})

const PlayerTwo = new Sprite({
    position: {
        x: 500,
        y: 50
    },
    velocity: {
        x: 0,
        y: 0

    },
    color: 'blue',

    offset: {
        x: -50,
        y: 0

    }



})

//object Healthbar
class HealthBar {
    constructor ({position, color, isMirrored = false}) {
        this.position = position;
        this.width = 400;
        this.height = 30;
        this.color = color;
        this.isMirrored = isMirrored; 
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
    }

    // verringern der Lebensanzeige
    decrease(amount) {
        if (this.isMirrored) {
            this.width -= amount;
        } else {
            this.position.x += amount;
            this.width -= amount;
        }
    }
}

const healthPlayerOne = new HealthBar({
    position: {
        x: 50,
        y: 50
    },
    color: 'yellow' 
});

const healthPlayerTwo = new HealthBar({
    position: {
        x: 570,
        y: 50
    },
    color: 'yellow',
    isMirrored: true  // Gespiegelt für Spieler Zwei
});



console.log(PlayerOne);

const keys = {
    a: {
        pressed: false

    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }

}


//timer Funktion

let timer = 11

function decreaseTimer() {
    setTimeout(decreaseTimer, 1000)
    if (timer > 0) {
        timer--
        document.querySelector('#timerId').innerHTML = timer
    }
    if (timer === 0 && PlayerOne.health === PlayerTwo.health) {
        document.querySelector('#textTie').innerHTML = 'Tie'
    } else if (PlayerTwo.health === 0) {
        document.querySelector('#textTie').innerHTML = 'Player One wins'
        document.querySelector('#timerId').innerHTML = 0
        

    } else if (PlayerOne.health === 0) {
        document.querySelector('#textTie').innerHTML = 'Player Two wins'
        document.querySelector('#timerId').innerHTML = 0

    }
}

let lastKey


function rectangularCollision({
    rectangle1, rectangle2
}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x && rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}


//animaten 
console.log(PlayerTwo.health);


function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    PlayerOne.update()
    PlayerTwo.update()
    healthPlayerOne.update()
    healthPlayerTwo.update()

    PlayerOne.velocity.x = 0
    //PlayerOne Movement
    if (keys.a.pressed && lastKey === 'a') {
        PlayerOne.velocity.x = -5
    } else if (keys.d.pressed && lastKey === 'd') {
        PlayerOne.velocity.x = 5
    }

    //PlayerTwo Movement
    PlayerTwo.velocity.x = 0
    if (keys.ArrowLeft.pressed && PlayerTwo.lastKey === 'ArrowLeft') {
        PlayerTwo.velocity.x = -5
    } else if (keys.ArrowRight.pressed && PlayerTwo.lastKey === 'ArrowRight') {
        PlayerTwo.velocity.x = 5
    }


    // Kollisionsabfrage PlayerOne
    if (rectangularCollision({
        rectangle1: PlayerOne,
        rectangle2: PlayerTwo
    }) &&
        PlayerOne.isAttacking
    ) {
        PlayerOne.isAttacking = false
        PlayerTwo.health = PlayerTwo.health - 20
        healthPlayerTwo.decrease(30) // abzug lebensanziege


        console.log("Attack PlayerOne");
        console.log(PlayerTwo.health, 'healt two');
    }

    //Kollisionsabfrage PlayerTwo

    if (rectangularCollision({
        rectangle1: PlayerTwo,
        rectangle2: PlayerOne
    }) &&
        PlayerTwo.isAttacking
    ) {
        PlayerTwo.isAttacking = false
        PlayerOne.health = PlayerOne.health - 20
        healthPlayerOne.decrease(3) // abzug lebensanziege

        console.log("Attack PlayerTwo");
        console.log(PlayerOne.health, 'health one');

    }

}
decreaseTimer();
animate();

//Eventlistener für alle Keys die gedrückt werden
window.addEventListener('keydown', (event) => {
    console.log(event.key);
    switch (event.key) {

        //PlayerOne Keys
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 'w':
            PlayerOne.velocity.y = -23
            break
        case ' ':
            PlayerOne.attack()
            break

        //PlayerTwo Keys

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            PlayerTwo.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            PlayerTwo.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            PlayerTwo.velocity.y = -23
            break
        case 'Enter':
            PlayerTwo.attack()
            break
    }
    // console.log(event.key);
})
// Eventlistener für alle Keys die losgelassen werden
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    //PlayerTwo Keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }


})

