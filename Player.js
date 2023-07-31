export default class Player {
    constructor(game, x, y, characterImages, currentCharacter){
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = Constants.Player.width;
        this.height = Constants.Player.height;
        this.imageWidth = Constants.Player.imageWidth;
        this.imageHeight = Constants.Player.imageHeight;

        this.maxFallingSpeed = 20;
        this.maxJumpHeight = -20;
        this.friction = 0.85;
        this.velocityX = 0;
        this.gravity = 1.2;
        this.velocityY = 0;
        this.maxSpeed = 9;

        this.jumpCoolDownTimer = 0;
        this.jumpCoolDownInterval = 270;

        this.currentCharacter = currentCharacter;
        this.characterImages = characterImages;
        this.image = null;
        
        this.currentFrame = 0;
        this.maxFrame = 11;
        this.fps = 20;//defult fps
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;

        this.currentlyFacing = "right";
        this.isOnGround = false;
        
        this.canDoubeJump = true;
        this.states = new Map([
            ["DOUBLE_JUMP", new DOUBLE_JUMP(this)],
            ["FALLING", new FALLING(this)],
            ["IDLE", new IDLE(this)],
            ["JUMPING", new JUMPING(this)],
            ["RUNNING", new RUNNING(this)],
        ]);
        this.enterState('IDLE');
    }

    animate(deltatime){
        if(this.frameTimer >= this.frameInterval){
            this.frameTimer = 0;
            if(this.currentFrame < this.maxFrame ) { this.currentFrame++; }
            else { this.currentFrame = 0; }
        }else{ this.frameTimer += deltatime; }
    }

    applyForces(){
        //if moving right and switches direction or moving left and switches directions
        //set velocityX to 0 for proper acceleration
        if((this.currentlyFacing === "right" && this.velocityX < 0) || (this.currentlyFacing === "left" && this.velocityX > 0)) this.velocityX = 0;
        if(this.velocityY < this.maxFallingSpeed && !this.isOnGround) this.velocityY += this.gravity;
        this.x += this.velocityX;
        this.y += this.velocityY; 
    }

    isCollidingWith(objX, objY, objWidth, objHeight){
        return (
            this.x + this.width > objX &&
            objX + objWidth > this.x + this.velocityX &&
            this.y + this.height > objY &&
            objY + objHeight > this.y
        );
    }

    draw(context, offsetX){
        context.save();
        context.imageSmoothingEnabled = false;
        if(this.currentlyFacing === "left"){
            context.scale(-1, 1);
            context.translate(-((this.width / 2 + this.x) * 2), 1);
            offsetX = -offsetX;
        }//else player is facing right

        context.drawImage(
            this.image,
            this.currentFrame * this.imageWidth,
            0,
            this.imageWidth,
            this.imageHeight,
            this.x - offsetX,// apply window scrolling
            this.y,
            this.width,
            this.height
        );
        context.restore();
    }

    enterState(stateName){
        this.currentState = this.states.get(stateName);
        if(this.currentState.enterState !== undefined && this.currentState.enterState()) return;

        this.image = this.characterImages[this.currentState.imageIndex];
        this.maxFrame = this.currentState.maxFrame;
        this.currentFrame = 0;
        this.frameInterval = 1000 / this.currentState.fps;//1 second divided by frames per second = "frameInterval"
    }

    /**
     * 
     * @param {Map<String, Number} objects 
     */
    handleCollision(objects){
        this.isOnGround = false;
        objects.forEach(([[, objX], [, objY], [, objSize]]) => {

            //check for horizontal in moving direction collision
            if(this.isCollidingWith(objX - this.velocityX, objY, objSize, objSize)){
                // set player x to where it's touching object
                this.x = (this.velocityX > 0) ? objX - this.width : objX + objSize;
                this.velocityX = 0;
            }

            //check for vertical in moving direction collision
            if(this.isCollidingWith(objX, objY - this.velocityY, objSize, objSize)){
                // set player y to where it's touching object
                this.y = (this.velocityY > 0) ? objY - this.height : objY + objSize;
                this.velocityY = 0;
            }

            // check for ground collision
            if(this.isCollidingWith(objX, objY - 1, objSize, objSize)){
                this.isOnGround = true;
                this.canDoubeJump = true;
            }
        });
    }

    handleInputs(keyBoardInputs){
        if(Math.abs(this.velocityX) > this.maxSpeed) return;

        if (keyBoardInputs.right){
            this.currentlyFacing = "right";
            this.velocityX += (this.maxSpeed - Math.abs(this.velocityX)) * 0.25;
        }
        else if (keyBoardInputs.left){
            this.currentlyFacing = "left";
            this.velocityX -= (this.maxSpeed - Math.abs(this.velocityX)) * 0.25;
        }
        else this.velocityX *= this.friction;
        
        //when players velocity magnitude is to small: set to 0
        if(Math.abs(this.velocityX) < 0.75 && this.velocityX != 0){ this.velocityX = 0; }
    }

    handleTimers(deltatime){
        if(this.jumpCoolDownTimer < this.jumpCoolDownInterval){
            this.jumpCoolDownTimer += deltatime;
        }
    }
    /**
     * 
     * @param {Number} deltatime 
     * @param {Object} keyBoardInputs
     * @param {Map<String, Number>} objects 
     */
    update(deltatime, keyBoardInputs, objects){
        this.animate(deltatime);
        this.handleInputs(keyBoardInputs);
        this.handleCollision(objects);
        this.handleTimers(deltatime);
        this.currentState.handleInput(keyBoardInputs);
        this.applyForces();
    }
}