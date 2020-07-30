function Sprite(options) {
    let self = this
        self.image = options.image;
        self.frameIndex = 0;
        self.tickCount = 0;
        self.speed = options.speed || 0;
        self.numberOfFrames = options.numberOfFrames || 1;
        self.width = options.width;
        self.height = options.height;
        self.sY = options.sY
        self.round = options.round
    self.update = function() {
        self.tickCount++;
        if (self.tickCount > self.speed) {
            self.tickCount = 0;
            if (self.frameIndex < self.numberOfFrames - 1) {
                self.frameIndex++;
            } else if(self.round) {
                self.frameIndex = 0;
            }
        }
    }
    self.render = function(x, y) {
        context.drawImage(
            self.image,
            self.frameIndex * self.width / self.numberOfFrames,
            self.sY,
            self.width / self.numberOfFrames,
            self.height,
            x,
            y,
            self.width / self.numberOfFrames,
            self.height
            )
        }
        self.start = function(x,y){
        self.update()
        self.render(x,y)
    }
}
let spritesOptions = {
    hero: {
        runRight: {
            image: hero,
            width: 738.5, 
            height: 72.37,
            numberOfFrames: 15,
            speed: 1,
            sY: 157.5,
            round: true
        },
        runLeft: {
            image: hero,
            width: 739.4, 
            height: 72.37,
            numberOfFrames: 15,
            speed: 1,
            sY: 321,
            round: true
        },
        standRight: {
            image: hero,
            width: 656.2, 
            height: 73.39,
            numberOfFrames: 15,
            speed: 1,
            sY: 237 ,
            round: true
        },
        standLeft: {
            image: hero,
            width: 658, 
            height: 73.39,
            numberOfFrames: 15,
            speed: 1,
            sY: 482 ,
            round: true
        },
        jumpRight: {
            image: hero,
            width: 767.1, 
            height: 71.55,
            numberOfFrames: 15,
            speed: 1,
            sY: 77,
            round: false
        },
        jumpLeft: {
            image: hero,
            width: 767.1, 
            height: 71.55,
            numberOfFrames: 15,
            speed: 1,
            sY: 400,
            round: false
        },
        
    },
    enemyGirl: {
        stand: {
            image: enemyGirl,
            width: 782, 
            height: 82,
            numberOfFrames: 15,
            speed: 1,
            sY: 265,
            round: true
        },
        runRight: {
            image: enemyGirl,
            width: 530, 
            height: 82,
            numberOfFrames: 10,
            speed: 3,
            sY: 0,
            round: true
        },
        runLeft: {
            image: enemyGirl,
            width: 530, 
            height: 82,
            numberOfFrames: 10,
            speed: 3,
            sY: 87,
            round: true
        }
    },
    enemyBoy: {
        stand: {
            image: enemyBoy,
            width: 690, 
            height: 82,
            numberOfFrames: 15,
            speed: 2,
            sY: 160,
            round: true
        },
        runRight: {
            image: enemyBoy,
            width: 519, 
            height: 82,
            numberOfFrames: 10,
            speed: 3,
            sY: 82,
            round: true
        },
        runLeft: {
            image: enemyBoy,
            width: 520, 
            height: 82,
            numberOfFrames: 10,
            speed: 3,
            sY: 247,
            round: true
        }
    },
    coins: {
        image: coins,
        width:192,
        height: 16,
        numberOfFrames: 12,
        speed: 1,
        sY: 0,
        round: true
    }
  }

