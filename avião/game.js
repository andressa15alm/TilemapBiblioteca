
let player;
let gravity = 0.3;
let score = 0;

let layer = [];     
let layerImages = [];

var tiledmap;
var pickupImage;


let BACKGROUND = 0;
let CASA = 1;
let GROUND = 2;
let FOREGROUND = 3;
let LADDER = 4;
let RIO = 5;

let pickups = []; 


let kaching;
let music;
let soundOn = false;

function preload(){
    tiledmap = loadTiledMap("andressa", "image");
    pickupImage = loadImage("image/coin.png");
    kaching = loadSound("audio/coin.wav");
    music = loadSound("audio/gameloop.mp3");
    
}

function setup(){
    createCanvas(820,460);
  
    //JOGADOR
    player = createSprite(100,100);
    player.velocity.x=0;
    player.setDefaultCollider();
    player.alive = true;
    player.addAnimation('stand', 'anims/tile011.png');
    player.addAnimation('walk', 'anims/tile011.png', 'anims/tile008.png', 'anims/tile005.png');
   
    
    
    //MAPA
    layer = getTilemapLayers(tiledmap);
    layerImages = getTilemapImages(tiledmap);
   
    
    //MOEDAS
    for (let i=0; i<10; i = i +1){
        let pickup = new Pickup(200 + i * 60,random(120,90)) ;
        pickups.push(pickup);
    }
      
    
}

function draw(){
    background(72,72,150);
    checkInput();   
    checkWorldBounds(player, tiledmap);
    
    
    image(layerImages[BACKGROUND], 0, 0);
    image(layerImages[CASA], 0, 0);
    image(layerImages[GROUND], 0, 0);
    image(layerImages[LADDER], 0, 0);
    image(layerImages[RIO], 0, 0);
    image(layerImages[FOREGROUND], 0, 0);
    drawSprite(player);
    handlePickups();
    
    
    

    

    fill('black');
    textSize(16);
    text("Score: "+score, screenLeft(), screenTop() + textAscent());
    
    
    focusCamera(player, tiledmap);
 
    
   
    //MUSICA
   if (soundOn === true){
        if (music.isPlaying() === false){
            music.loop();
            music.setVolume(0.2);
        }
    }
    
    if (soundOn === false){
        if(keyIsDown){
            soundOn = true;
        }
    }
    
}

//APAGAR MOEDA
function handlePickups(){
  
    for (let i=pickups.length-1; i>=0; i = i-1){
        if (pickups[i].checkHit(player)){
            pickups.splice(i,1);
        } else {
            pickups[i].show();
        }    
    }
  
}


function die(){
    player.velocity.x = 0;
    player.velocity.y = -10;
    player.rotationSpeed = 20;
    
}


function checkInput(){

    //VERIFICA SE CAIU NO RIO
    let isOnDeath = isInContact(player, layer[RIO]);
    
    if (isOnDeath.any){
        player.alive = false;
        die();
    }
    
    if (player.alive === false){
        return;
    }

    //VERIFICA O CONTATO COM O SOLO
    let touchingGround = isInContact(player, layer[GROUND]);

    
    player.velocity.y = player.velocity.y + gravity;
    
    
   
    if (keyIsDown(LEFT_ARROW)){
        player.changeAnimation('walk');
        player.mirrorX(-1);
        player.velocity.x = player.velocity.x - 1
        
    } else if (keyIsDown(RIGHT_ARROW)){
        player.changeAnimation('walk');
        player.mirrorX(1);
        player.velocity.x = player.velocity.x + 1;
    } 
        
    if (player.velocity.x < -5) {
        player.velocity.x = -5;
    }
    if (player.velocity.x > 5) {
        player.velocity.x = 5;
    }
    if (player.velocity.x > -1 && player.velocity.x <1){
        player.changeAnimation('stand');
        player.velocity.x = 0;
    }
    
    player.velocity.x = 0.9 * player.velocity.x;
    
    
    
    playerBrake(player, touchingGround);
    
    //pulo
    if ( keyIsDown(32) && touchingGround.below   ) {
        player.velocity.y = -7;
    }
    
    
    //escada
    
    let onLadder = isInContact(player, layer[LADDER]);
  
    if (onLadder.any){

        if (keyIsDown(UP_ARROW)){
            player.velocity.y=0;
            player.position.y = player.position.y -5;
        } else if (keyIsDown(DOWN_ARROW)) {
            player.velocity.y =0;
            
            if (touchingGround.below){
                player.position.y = player.position.y + touchingGround.belowDistance;
            } else {
                player.position.y = player.position.y + 5;
            }
            
                
        } else {
            player.velocity.y = 0;
        }
        
        if (keyIsDown(32)){
            player.velocity.y = -5;
        }
        
    }
    
}


