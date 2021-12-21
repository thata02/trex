var trex, trex_correndo, bordas, solo, soloInvisivel, rand, imagemDaNuvem, obs1,obs2,obs3,obs4,obs5,obs6,grupoObstaculos,grupoNuvens, colidir, reiniciar, reiniciarImg, fim, fimImg, somdepulo, somdemorte, somdepontos, fonte;
var pontos = 0;
var JOGAR = 1;
var FIM = 0;
var estadoJogo = JOGAR;

function preload(){
  
  //criar animação do T-Rex correndo
  trex_correndo = loadAnimation('trex1.png','trex3.png','trex4.png');
  
  //carregar imagem do solo
  imagemDoSolo = loadImage("solo2.png");
  
  //carregar imagem da nuvem
  imagemDaNuvem = loadImage("nuvem.png");
  
  obs1 = loadImage("obstaculo1.png");
  obs2 = loadImage("obstaculo2.png");
  obs3 = loadImage("obstaculo3.png");
  obs4 = loadImage("obstaculo4.png");
  obs5 = loadImage("obstaculo5.png");
  obs6 = loadImage("obstaculo6.png");
  colidir = loadAnimation("trex_colidiu.png");
  reiniciarImg = loadImage("reiniciar.png") ;
  fimImg = loadImage("fimDoJogo.png");
  somdepulo = loadSound("pulo.mp3");
  somdemorte = loadSound("morte.mp3");
  somdepontos = loadSound("checkPoint.mp3");
  fonte = loadFont("fonte.ttf")

}
  

function setup(){
  
  //cria a tela
  createCanvas(600,200);
  
  //cria bordas
  bordas = createEdgeSprites();
  
  
  //cria solo
  solo = createSprite(300,180,1200,20);
  //adiciona imagem de solo
  solo.addImage("solo", imagemDoSolo)
  solo.x = solo.width/2;
  
  //cria solo invisível
  soloInvisivel = createSprite(300,200,600,10);
  soloInvisivel.visible = false;
  
  //cria sprite do T-Rex
  trex = createSprite(50,60,20,50);
  trex.scale = 0.5;
  trex.x = 50;
  //adiciona a animação de T-Rex correndo ao sprite
  trex.addAnimation('correndo', trex_correndo);
  trex.addAnimation('colidir',colidir)
  
  trex.debug=false
  trex.setCollider("circle",0,0,43)
  //teste para criar números aleatórios de um a 100
  rand = Math.round(random(1,100));
  
  grupoNuvens = new Group();
  grupoObstaculos = new Group();
  
  reiniciar = createSprite(300, 120)
  reiniciar.addImage(reiniciarImg)
  reiniciar.scale = 0.7
  reiniciar.visible = false
  
  fim = createSprite(300, 60)
  fim.addImage(fimImg)
  fim.scale = 1
  fim.visible = false
  
}

function draw(){

  //fundo branco
  background("white");
  //text(mouseX+", "+mouseY,200,20)
  textFont(fonte);
  fill(100)
  text(pontos, 550, 20);
  
  //desenha os sprites
  drawSprites();
  
  
  //Trex colide com o solo
  trex.collide(soloInvisivel)
  //gravidade  
  trex.velocityY = trex.velocityY + 1;
  
  //estados de jogo
  if (estadoJogo === JOGAR){
    //gerar nuvens
    gerarNuvens();
    gerarObstaculos();
    pontos = Math.round(pontos+frameRate()/60)  
    if (pontos%100 === 0 && pontos>0){
      somdepontos.play();
    }
    //faz o T-Rex correr adicionando velocidade ao solo
    solo.velocityX = -(6+pontos*3/100);
     //T-Rex pula ao apertar espaço
    if(keyDown('space') && trex.y>170){
      trex.velocityY = -15;
      somdepulo.play();
    }
    //faz o solo voltar ao centro se metade dele sair da    tela
    if (solo.x<0){
      solo.x=solo.width/2;
    }
    if (trex.isTouching(grupoObstaculos)){
      estadoJogo = FIM;
      somdemorte.play();
      //descomete para trex inteligente 
        //trex.velocityY = -15;
      //somdepulo.play();
    }
    
  } else if(estadoJogo === FIM){
    grupoNuvens.setVelocityXEach(0);
    grupoObstaculos.setVelocityXEach(0);
    solo.velocityX= 0;
    trex.changeAnimation("colidir", colidir)
    grupoNuvens.setLifetimeEach(-1)
    grupoObstaculos.setLifetimeEach(-1)
    reiniciar.visible = true
    fim.visible = true
    if(mousePressedOver(reiniciar)){
      reinicie();
    }
  }
  
}

function gerarNuvens(){
      if(frameCount %60 === 0){
        nuvem = createSprite(630,100,40,10);
        nuvem.y = Math.round(random(40,120));
        nuvem.addImage(imagemDaNuvem);
        nuvem.scale =0.5;
        nuvem.velocityX=-3;
        nuvem.depth = trex.depth;
        trex.depth = trex.depth +1;
        nuvem.lifetime = 200;
        grupoNuvens.add(nuvem);
      }
}
function gerarObstaculos() {
     if (frameCount %60 === 0){
       obstaculo = createSprite(600,165);
       obstaculo.velocityX=-(6+pontos*3/100);
       obstaculo.lifetime=110
       obstaculo.scale=0.6
       grupoObstaculos.add(obstaculo);
       var NumeroAleatorio = Math.round(random(1,6))
       switch(NumeroAleatorio){
         case 1: obstaculo.addImage(obs1);
           break;
         case 2: obstaculo.addImage(obs2);
           break;
         case 3: obstaculo.addImage(obs3);
           break;
         case 4: obstaculo.addImage(obs4);
           break;
         case 5: obstaculo.addImage(obs5);
           break;
         case 6: obstaculo.addImage(obs6);
           break;
           default:
           break;
       }
     }
  
}
function reinicie (){
  estadoJogo = JOGAR;
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  reiniciar.visible=false;
  fim.visible=false;
  trex.changeAnimation("correndo", trex_correndo);
  pontos = 0
}
