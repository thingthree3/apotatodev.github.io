let game;
window.addEventListener('load', function(){
    const CANVAS = this.document.getElementById('GameCanvas');
    const CTX = CANVAS.getContext('2d');
    CANVAS.height = Constants.World.height;
    CANVAS.width = Constants.World.width;
    
    class Game {
        #currentLevel
        #UPDATES_PERSECOND
        #FPS
        #isGameover
        #IsGameStoped
        #timer
        #score
        #IMAGES
        #input
        constructor(){
            this.UPDATES_PERSECOND = 120;
            this.FPS = 80;

            this.#isGameover =  false;
            this.#IsGameStoped = false;
            this.timer = 0;

            this.score = 0;

            this.offsetX = 0;
            this.scrollAreaWidth = 200;

            this.#currentLevel = 0

            //todo: make better image managing system
            //all images used in game
            this.images = new Map([
                ["terrainImage", [document.querySelector("#terrain")]],
                ["backgroundImages", [
                    document.querySelector("#blue"),
                    document.querySelector("#pink"),
                    document.querySelector("#green"),
                    document.querySelector("#gray"),
                    document.querySelector("#brown"),
                    document.querySelector("#purple"),
                    document.querySelector("#yellow")
                ],],
                ["pinkMan", [
                    document.querySelector("#pinkManIdleImage"),
                    document.querySelector("#pinkManRunImage"),
                ],],
                ["virtualGuy", [
                    document.querySelector("#virtualGuyDouble_jump"),
                    document.querySelector("#virtualGuyFall"),
                    document.querySelector("#virtualGuyIdle"),
                    document.querySelector("#virtualGuyJump"),
                    document.querySelector("#virtualGuyHit"),
                    document.querySelector("#virtualGuyRun"),
                ]]
            ]);

            this.input = new InputHandler();
            this.player = new Player(this, 300, 300, this.images.get("virtualGuy"), "virtualGuy");
            this.background = new BackGround(this);
            //this.iu = new UI(this);
        }

        getCurrentLevel(){ return this.#currentLevel; }

        // fix later, still works
        getImages(imagesName){ return this.images.get(imagesName); }

        getIsGameStoped(){ return this.#IsGameStoped; }

        draw(context){
            this.background.draw(context, this.offsetX);
            this.player.draw(context, this.offsetX);
        }

        scrollWindow(){
            if(
                ( (this.player.x + this.player.width - this.offsetX >= Constants.World.width - this.scrollAreaWidth) && this.player.velocityX > 0 ) ||
                ((this.player.x - this.offsetX <= this.scrollAreaWidth) && this.player.velocityX < 0)
            ){
                this.offsetX += this.player.velocityX;
            }
        }

        update(deltatime){
            this.scrollWindow();
            this.player.update(deltatime, this.input.keys, this.background.getObjects());
        }
    }

    const pauseGame = resolve => {
        const thisInterval = setInterval(() => {
            if( !game.inputs.getGameIsPaused() ){
                clearInterval(thisInterval);
                resolve();
            }
        }, 100);
    };

    game = new Game(CANVAS.width, CANVAS.height);
    let lastime = 0;
    async function animate(timestamp){//this is the game loop
        const deltatime = timestamp - lastime;
        lastime = timestamp;
        CTX.clearRect(0,0, CANVAS.width, CANVAS.height);
        game.update(deltatime);
        game.draw(CTX);
        if( game.input.getGameIsPaused() ) await new Promise(pauseGame);
        if( !game.getIsGameStoped() ) { requestAnimationFrame(animate); }
        //else displayGameOverScreen();
    }
    animate(0);
});