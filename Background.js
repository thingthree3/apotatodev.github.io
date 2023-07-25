class BackGround {
    #game;
    #backgroundTileImages;
    #backgroundImage;
    #terrainImage;
    #tileSize;
    #BlockSize;
    #floor;
    #Blocks;
    constructor(game){
        this.#game = game;
        this.#backgroundTileImages = this.#game.getImages("backgroundImages");
        this.#backgroundImage = this.#backgroundTileImages[this.#game.getCurrentLevel()];
        this.#terrainImage = this.#game.getImages("terrainImage")[0];
        this.#tileSize = Constants.Background.bgTileSize;
        this.#BlockSize = Constants.Background.terrainBlockSize;

        //just put dirt for ground rn, we need to use tiled
        this.#floor = Array.from(
            Array( Math.floor((Constants.World.width * 2) / this.#BlockSize) ),
            (_, index) =>  new Map([
                ['x', index * this.#BlockSize],
                ['y', Constants.World.height - this.#BlockSize],
                ['size', this.#BlockSize],
            ])
        );
        console.log(this.#floor)
        this.#floor.push(
            new Map([
                ['x', Math.floor(Constants.World.width / this.#BlockSize) - 1],
                ['y', Constants.World.height - this.#BlockSize * 2],
                ['size', this.#BlockSize]
            ]),
            new Map([
                ['x', (Math.floor(Constants.World.width / this.#BlockSize) - 1) * this.#BlockSize],
                ['y', Constants.World.height - this.#BlockSize * 2],
                ['size', this.#BlockSize]
            ]),
            new Map([
                ['x', (Math.floor(Constants.World.width / this.#BlockSize) - 1) * this.#BlockSize],
                ['y', Constants.World.height - this.#BlockSize * 3],
                ['size', this.#BlockSize]
            ])
        );
    }

    #drawBackgroundTiles(context){
        for (let row = 0; row < Math.floor(Constants.World.height / this.#tileSize) + 1; row++) {
            for (let column = 0; column < Math.floor(Constants.World.width / this.#tileSize) + 1; column++) {
                context.drawImage(
                    this.#backgroundImage,
                    column * this.#tileSize,
                    row * this.#tileSize
                );
            }
        }
    }

    #drawTerrain(context, offsetX){
        for (let i = 0; i < this.#floor.length; i++) {
            context.drawImage(
                this.#terrainImage,
                96,
                0,
                this.#BlockSize / 2,
                this.#BlockSize / 2,
                this.#floor[i].get('x') - offsetX,
                this.#floor[i].get('y'),
                this.#BlockSize,
                this.#BlockSize
            );
        }
    }

    draw(context, offsetX){
        context.save();
        context.imageSmoothingEnabled = false;
        this.#drawBackgroundTiles(context);
        this.#drawTerrain(context, offsetX);
        context.restore();

    }

    getObjects(){
        return this.#floor;
    }

    CollidingTerrain(rect){

    }
}