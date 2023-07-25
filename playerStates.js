class States{
    constructor(name, player, maxFrame, imageIndex, fps = null){
        this.player = player;
        this.name = name;
        this.maxFrame = maxFrame;
        this.imageIndex = imageIndex;
        this.fps = fps ?? this.player.fps;
    }

    /**
     * 
     * @param {Object} input 
     */
    handleInput(input){}
}

class DOUBLE_JUMP extends States{
    constructor(player){
        super('DOUBLE_JUMP', player, 5, 0, 40);
    }

    enterState(){
        this.player.velocityY = this.player.maxJumpHeight;
        this.player.jumpCoolDownTimer = 0;
        this.player.canDoubeJump = false;
        return false;
    }

    handleInput(input){
        if(this.player.isOnGround){
            this.player.enterState('RUNNING');
        }
        else if (this.player.velocityY > 0) this.player.enterState("FALLING");
    }
}

class FALLING extends States{
    constructor(player){
        super('FALLING', player, 0, 1);
    }

    handleInput(input){
        if(this.player.isOnGround){
            this.player.enterState('RUNNING');
        }
        else if(input.up){
            this.player.enterState("JUMPING");//double jump
        }
    }
}

class IDLE extends States{
    constructor(player){
        super('IDLE', player, 10, 2);        
    }

    handleInput(input){
        if(this.player.isOnGround){
            if(input.up){
                this.player.enterState("JUMPING");
            }
            else if (this.player.velocityX !== 0) this.player.enterState("RUNNING");
        }
        else this.player.enterState("FALLING");
    }
}

class JUMPING extends States{
    constructor(player){
        super('JUMPING', player, 0, 3);
    }
    enterState(){
        if(this.player.jumpCoolDownTimer > this.player.jumpCoolDownInterval){
            if (this.player.isOnGround){
                this.player.jumpCoolDownTimer = 0;
                this.player.velocityY = this.player.maxJumpHeight;
            } else if(this.player.canDoubeJump){
                this.player.enterState("DOUBLE_JUMP");
                return true;
            }
        } else return true;
        
        return false;
    }
    handleInput(input){
        if(this.player.isOnGround){
            this.player.enterState('RUNNING');
        }
        else if(input.up) this.player.enterState("JUMPING");//double jump
        else if(this.player.velocityY > 0) this.player.enterState('FALLING');
    }
}

class HIT extends States{
    constructor(player){
        super('HIT', player, 6, 4);
    }

    handleInput(input){
        if(this.player.currentFrame === this.maxFrame) return;

        if(input.up){
            this.player.enterState('JUMPING');
        }
        if(this.player.isOnGround){
            this.player.enterState('RUNNING');
        }
        else if(this.player.velocityY > 0){
            this.player.enterState('FALLING');
        }
    }
}

class RUNNING extends States{
    constructor(player){
        super('RUNNING', player, 11, 5, 80);
    }
    handleInput(input){
        if(this.player.isOnGround){
            if(input.up){
                this.player.enterState("JUMPING")
            }
            else if(this.player.velocityX === 0){
                this.player.enterState('IDLE');
            }
        }
        else if(this.player.velocityY > 0){
            this.player.enterState('FALLING');
        }
    }
}

class WALL_JUMP extends States{
    constructor(player){
        super("WALL_JUMP", player, 4, 6);
    }

    handle(input){
        if(input.up){
            this.player.enterState('JUMPING');
        }
        if(this.player.isOnGround){
            this.player.enterState('RUNNING');
        }
    }
}