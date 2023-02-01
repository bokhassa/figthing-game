class Sprite {
    constructor({ position, imgSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0} }) {
        this.position = position;
        this.img = new Image();
        this.img.src = imgSrc;
        this.scale = scale;
        this.framesMax = framesMax; //so that we don't distort the other images
        this.currentFrame = 0;
        this.framsElapsed = 0;
        this.framsHold = 15;
        this.offset = offset;
        //utiliser pour le ia
        this.called = 0;
        this.jumped;
        //
    }

    draw() {
        c.drawImage(
            this.img,
            //How to crop the image dependent on the amount of frames
            this.currentFrame * (this.img.width / this.framesMax),
            0,
            this.img.width / this.framesMax, //Image has X frames dependent on each sprite
            this.img.height,
            // 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.img.width / this.framesMax) * this.scale, 
            this.img.height * this.scale,
        );
    }

    animateFrames() {
        this.framsElapsed++;
        if (this.framsElapsed % this.framsHold === 0) {
            if (this.currentFrame < this.framesMax - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({ position, 
        velocity, 
        color = 'red', 
        offset, 
        imgSrc, 
        scale = 1, 
        framesMax = 1, 
        sprites, 
        attackBox = { offset: {}, width: undefined, height: undefined },
    }) {
        super({
            position,
            imgSrc,
            scale,
            framesMax,
            offset,
        });
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = { 
            position: { x: this.position.x, y: this.position.y }, 
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.currentFrame = 0;
        this.framsElapsed = 0;
        this.framsHold = 15;
        this.sprites = sprites;
        this.isDead = false;

        for (const sprite in sprites) {
            sprites[sprite].img = new Image();
            sprites[sprite].img.src = sprites[sprite].imgSrc;
        }
    }

    update() {
        this.draw();
        if (!this.isDead) this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        //Attack box
       // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        //Hitbox debuggning
       // c.fillRect(
         // this.attackBox.position.x,
          // this.attackBox.position.y,
          //this.attackBox.width,
         // this.attackBox.height
         //); 

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Gravity
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else {
            this.velocity.y += gravity;
        } 
    }

    attack() {
        this.switchSprites('attack1');
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20;
        if (this.health <= 0) {
            audio.victory.play();
            this.switchSprites('death');
            audio.victory.stop();
        } else {
            this.switchSprites('takeHit');
        }
    }

    switchSprites(sprite) {
        //Override the other animations with attacking, dying and getting hit
        if (this.img === this.sprites.death.img) {
            if (this.currentFrame === this.sprites.death.framesMax - 1) this.isDead = true;
            return;
        }
        if (this.img === this.sprites.attack1.img && this.currentFrame < this.sprites.attack1.framesMax - 1) return;
        if (this.img === this.sprites.takeHit.img && this.currentFrame < this.sprites.takeHit.framesMax - 1) return;

        switch (sprite) {
            case 'idle':
                if (this.img !== this.sprites.idle.img) {
                    this.img = this.sprites.idle.img;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.currentFrame = 0; //gets rid of flickering
                }
            break;
            case 'sprint':
                if (this.img !== this.sprites.sprint.img) {
                    this.img = this.sprites.sprint.img;
                    this.framesMax = this.sprites.sprint.framesMax;
                    this.currentFrame = 0;
                }
            break;
            case 'jump':
                if (this.img !== this.sprites.jump.img) {
                    this.img = this.sprites.jump.img;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.currentFrame = 0;
                }
            break;
            case 'fall':
                if (this.img !== this.sprites.fall.img) {
                    this.img = this.sprites.fall.img;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.currentFrame = 0;
                }
            break;
            case 'attack1':
                if (this.img !== this.sprites.attack1.img) {
                    this.img = this.sprites.attack1.img;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.currentFrame = 0;
                }
            break;
            case 'takeHit':
                if (this.img !== this.sprites.takeHit.img) {
                    this.img = this.sprites.takeHit.img;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.currentFrame = 0;
                }
            break;
            case 'death':
                if (this.img !== this.sprites.death.img) {
                    this.img = this.sprites.death.img;
                    this.framesMax = this.sprites.death.framesMax;
                    this.currentFrame = 0;
                }
            break;
        }
    }
}