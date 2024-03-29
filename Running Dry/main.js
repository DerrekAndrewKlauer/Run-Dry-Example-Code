 canvas = document.getElementById('finalgame');
        context = canvas.getContext('2d');
        document.addEventListener('keydown', handleKeypress);
      
        var cellWidth = canvas.width/25;
        
        //assets
        //                             Block                            move Block                       node                               water                            ping red                           ping blue                         floor tile
        var blockSources = new Array("http://i.imgur.com/aonFspq.jpg", "http://i.imgur.com/Erv3sBF.png", "http://i.imgur.com/wuun39e.png", "http://i.imgur.com/PP76JCU.png", "http://i.imgur.com/SNBLBfP.png" , "http://i.imgur.com/Nl8PQg6.png", "http://i.imgur.com/xqNwhd1.png"); 
        //                            up                           down                            right                              left
        //var playerSources = new Array("http://imgur.com/Te50MqO.png", "http://imgur.com/hZ9cFbq.png", "http://imgur.com/80z9vLc.png", "http://imgur.com/RfKPi7c.png")
        //v2 Sprites
        var playerSources = new Array("http://i.imgur.com/5PZNoCz.png", "http://i.imgur.com/OA4h9KW.png", "http://i.imgur.com/wvD9TEM.png", "http://i.imgur.com/gUDVL75.png"); //http://i.imgur.com/dVg8gmW.png

        // original player sources: http://people.ucsc.edu/~mkhali1/CMPM%20files/up.png  http://people.ucsc.edu/~mkhali1/CMPM%20files/down.png  http://people.ucsc.edu/~mkhali1/CMPM%20files/right.png  http://people.ucsc.edu/~mkhali1/CMPM%20files/left.png
        //                          title                                                              background                                                            endstate
        var miscSources = new Array("http://i.imgur.com/X1WosQx.png","http://i.imgur.com/gMgaDgg.png", /*"http://i.imgur.com/GXvhsCZ.png"*/"http://i.imgur.com/AhdTKPu.png", "http://i.imgur.com/ksW3UWC.png"); //http://i.imgur.com/3mqMDqZ.png
        //                               Node covered                                                  left step                                                          right step                                                           water filled node                                                     Text sound                                                          Text2                                                                         victory sound                                                         background music
        var sounds = new Array(new Audio('http://people.ucsc.edu/~mkhali1/CMPM%20files/Covered.wav'), new Audio('http://people.ucsc.edu/~mkhali1/CMPM%20files/Left.wav'), new Audio('http://people.ucsc.edu/~mkhali1/CMPM%20files/Right.wav'), new Audio('http://people.ucsc.edu/~mkhali1/CMPM%20files/Filled.wav'), new Audio('http://people.ucsc.edu/~mkhali1/CMPM%20files/Text.wav'), new Audio('http://people.ucsc.edu/~mkhali1/CMPM%20files/Text.wav'), new Audio('http://people.ucsc.edu/~mkhali1/CMPM%20files/Victory.wav'), new Audio('http://people.ucsc.edu/~mkhali1/CMPM%20files/Loop.mp3'));
        //                         100%full  60%full   40%full   20%full   0%full
        var endSources = new Array("http://i.imgur.com/5WwdRRq.png", "http://i.imgur.com/8XWBMdz.png", "http://i.imgur.com/DkbafMe.png", "http://i.imgur.com/FSz0IAS.png", "http://i.imgur.com/pfjiPHk.png");
        var step = true;
        var playerImages = new Array(); 
        var miscImages = new Array();
        var blockImages = new Array();
        var endImages = new Array();
        var INITIAL_SCORE = 1000;
        var spreadOnce = false;
        var test;
        var score = INITIAL_SCORE;
        var soundtest = false;
        
        //undo
        var blockMovedIndex = 0;
        var blockMovedLastX = 0;
        var blockMovedLastY = 0;
        var blockMoved = false;
        var playerLastX = 0;
        var playerLastY = 0;
        
        //current level
        var blocks = new Array();
        var water = new Array();
        
        //initial state game variables
        var direction = 'down';
        var currentLevel = -1;
        var gameState = "menu";
        var startTime = new Date().getTime();
        var time = 0; //implement time-levelTime
        var levelTime;
        var totalTime = 0 - time;
        var levelComplete = true;
        var timeBool = false;
        var canLosePoints;
        var textCounter = 0;
        
        //Misc
        var currentText;
        var textTracker = true;
        var pings = new Array();
        var showPings = false;
        var levelBool = true;
        var levelCompleteTime;
        var levelEndTime;
        var bluePings = new Array();
        
        //Block types
        var Block_NONMOVEABLE = 0;
        var Block_MOVEABLE = 1;
        var Block_NODE = 2;
        var Block_WATER = 3;
        var Block_REDPING = 4;
        var Block_BLUEPING = 5;

        function handleKeypress(e){
                if (levelBool)
            if (gameState == "puzzle")
            switch(e.keyCode){
                 case 38 : //upwards
                case 87 :
                    direction = 'up';
                    if(!(isCollide(nextX, nextY, direction))){
                        blockMoved = false;
                        if (step)
                            sounds[1].play();
                        if (!step)
                            sounds[2].play();
                        step = !step;
                    }
                    break;
                case 40 : //downwards
                case 83 :     
                    direction = 'down';
                    if(!(isCollide(nextX, nextY, direction))){
                        blockMoved = false;
                        if (step)
                            sounds[1].play();
                        if (!step)
                            sounds[2].play();
                        step = !step;
                    }
                    break;
                case 39 : //right
                case 68 :
                    direction = 'right';
                    if(!(isCollide(nextX, nextY, direction))){
                        blockMoved = false;
                        if (step)
                            sounds[1].play();
                        if (!step)
                            sounds[2].play();
                        step = !step;
                    }  
                    break;
                case 37 : //left
                case 65 :
                    direction = 'left';
                    if(!(isCollide(nextX, nextY, direction))){
                        blockMoved = false;
                        if (step)
                            sounds[1].play();
                        if (!step)
                            sounds[2].play();
                        step = !step;
                    }
                    break;
                case 80 :                    
                    loadLevel(levels[currentLevel%levels.length]);
                    break;
                //case 75://<--------------------------------------------temp (skip level)
                    //currentLevel++;
                    //levelComplete = true;
                    //break;
                case 85:
                    undo();
                    break;
            }
            switch(e.keyCode){
                case 32 :
                    if (gameState == "menu"){
                    gameState = "puzzle";
                    break;
                    }
                    if (gameState == "pause"){
                    gameState = "puzzle"
                    break;
                    }
                    if (gameState == "end"){
                    gameState = "menu";
                    score = INITIAL_SCORE;
                    //time = 0;
                    break;
                    }
                    break;
                case 77:
                    if (sounds[7].paused)
                    sounds[7].play();
                    else
                        sounds[7].pause();
                    break; 
            }
        }
              
        function Block(x, y, type){
            this.x = x*cellWidth;
            this.y = y*cellWidth;
            this.type = type;
            this.isSolid = this.type == Block_MOVEABLE || this.type == Block_NONMOVEABLE ? true : false;
            this.img = blockImages[this.type];
            
            this.draw = function(){
                context.drawImage(this.img, this.x, this.y, cellWidth, cellWidth);
            }
        }
        
        function loadLevel(level){
            //reset level stats and variables
            startTime = new Date().getTime();
            levelTime = time;
            if (timeBool)
            totalTime +=time;
            blocks = new Array();
            water = new Array();
            pings = new Array();
            bluePings = new Array();
            blockMoved = false;
            textCounter = 0;
            levelBool = true;
            currentText = "";
            
            for (i in level)
                for (j in level)
                    if (level[i][j] == "#")
                        blocks.push(new Block(j,i,0))      
            for (i in level)
                for (j in level)
                     if (level[i][j] == "@"){
                        blocks.push(new Block(j,i,1))
                        blocks.push(new Block(j,i,6));
                     }
            for (i in level)
                for (j in level)
                    if (level[i][j] == "."){
                        blocks.push(new Block(j,i,2))
                        blocks.push(new Block(j,i,6));
                    }
            for (i in level)
                for (j in level)
                        if (level[i][j] == "&"){
                        player.x = j*cellWidth;
                        player.y = i*cellWidth;
                        playerLastX = j*cellWidth;
                        playerLastY =  i*cellWidth;
                        blocks.push(new Block(j,i,6));
                    }
            for (i in level)
                for (j in level)
                    if (level[i][j] == "_")
                        blocks.push(new Block(j,i,6));
            for (i in level)
                for (j in level)
                    if (level[i][j] == "~")
                        water.push(new Block(j,i,3));
                    
            gameState = "pause";
        }
        
        function handleTick(){
            var tickRate = 0;
            switch ((currentLevel)%levels.length+1){
                case 1:
                    tickRate = 2;
                    break;
                case 2:
                    tickRate = 2;
                    break;
                case 3:
                    tickRate = 3;
                    break;
                case 4:
                    tickRate = 3;
                    break;
                case 5:
                    tickRate = 3;
                    break;
                case 6:
                    tickRate = 3;
                    break;
                case 7:
                    tickRate = 3;
                    break;
                case 8:
                    tickRate = 3;
                    break;
                case 9:
                    tickRate = 3;
                    break;
                case 10:
                    tickRate = 2;
                    break;
                
                
                    
            }
            spreadWater(tickRate);
        }
        
        function undo(){
            player.x = playerLastX;
            player.y = playerLastY;
            if (blockMoved){
                blocks[blockMovedIndex].x = blockMovedLastX;
                blocks[blockMovedIndex].y = blockMovedLastY;
            }
        }
        
     function spreadWater(tr){
            var spreadRight = true;
            var spreadUp = true;
            var spreadLeft = true;
            var spreadDown = true;
            var spreadSound = false;
            
            if ((time % tr) != 0)
                spreadOnce = true; 
            if (((time % tr) == 0) && (spreadOnce)){ 
              if (water.length < 1000)
                for (i in water) {
                    spreadRight = true;
                    spreadUp = true;
                    spreadLeft = true;
                    spreadDown = true;
                    
                   for (j in water){
                      //check if adjacent spaces are empty
                      if ((water[i].x+cellWidth == (water[j].x)) && (water[i].y == water[j].y))
                        spreadRight = false;
                      if ((water[i].x == (water[j].x)) && (water[i].y-cellWidth == water[j].y))
                        spreadUp = false;
                      if ((water[i].x-cellWidth == (water[j].x)) && (water[i].y == water[j].y))
                        spreadLeft = false;
                      if ((water[i].x == (water[j].x)) && (water[i].y+cellWidth == water[j].y))
                        spreadDown = false;
                   }
                   for (j in blocks){
                      //check if adjacent spaces are empty
                      if (blocks[j].type == Block_NONMOVEABLE){
                         if ((water[i].x+cellWidth == (blocks[j].x)) && (water[i].y == blocks[j].y))
                           spreadRight = false;
                         if ((water[i].x == (blocks[j].x)) && (water[i].y-cellWidth == blocks[j].y))
                           spreadUp = false;
                         if ((water[i].x-cellWidth == (blocks[j].x)) && (water[i].y == blocks[j].y))
                           spreadLeft = false;
                         if ((water[i].x == (blocks[j].x)) && (water[i].y+cellWidth == blocks[j].y))
                           spreadDown = false;
                      }
                      if (blocks[j].type == Block_MOVEABLE){
                         for (var k = j; k < blocks.length; k++){
                            if (blocks[k].type == Block_NODE){ 
                              //check collision between next space and current block, then check if there 
                              //is a collision between the current block and any node in the level
                               if ((water[i].x+cellWidth == (blocks[j].x)) && (water[i].y == blocks[j].y))
                                  if (blocks[k].x == blocks[j].x && blocks[k].y == blocks[j].y)
                                     spreadRight = false;

                               if ((water[i].x == (blocks[j].x)) && (water[i].y-cellWidth == blocks[j].y))
                                  if (blocks[k].x == blocks[j].x && blocks[k].y == blocks[j].y)
                                     spreadUp = false;

                               if ((water[i].x-cellWidth == (blocks[j].x)) && (water[i].y == blocks[j].y))
                                  if (blocks[k].x == blocks[j].x && blocks[k].y == blocks[j].y)
                                     spreadLeft = false;

                               if ((water[i].x == (blocks[j].x)) && (water[i].y+cellWidth == blocks[j].y))
                                  if (blocks[k].x == blocks[j].x && blocks[k].y == blocks[j].y)
                                     spreadDown = false;
  
                            }
                        }
                     }
                   
                   }
                   
                   if (spreadRight){
                      water.push(new Block((water[i].x/cellWidth)+1, water[i].y/cellWidth, 3));
                      spreadOnce  = false;
                       for (k in blocks)
                           if (blocks[k].type == 2 && blocks[k].x == water[water.length-1].x && blocks[k].y == water[water.length-1].y)   
                               spreadSound = true;
                   }
                   if (spreadUp){
                      water.push(new Block((water[i].x/cellWidth), water[i].y/cellWidth-1, 3)); 
                      spreadOnce = false;
                       for (k in blocks)
                           if (blocks[k].type == 2 && blocks[k].x == water[water.length-1].x && blocks[k].y == water[water.length-1].y)
                                spreadSound = true;
                   }
                   if (spreadLeft){
                      water.push(new Block((water[i].x/cellWidth)-1, water[i].y/cellWidth, 3));
                      spreadOnce  = false;
                       for (k in blocks)
                           if (blocks[k].type == 2 && blocks[k].x == water[water.length-1].x && blocks[k].y == water[water.length-1].y)
                                    spreadSound = true;
                   }
                   if (spreadDown){
                      water.push(new Block((water[i].x/cellWidth), water[i].y/cellWidth+1, 3)); 
                      spreadOnce = false;
                       for (k in blocks)
                           if (blocks[k].type == 2 && blocks[k].x == water[water.length-1].x && blocks[k].y == water[water.length-1].y)
                                    spreadSound = true;
                   }
         }
                
        }
          
        
         if (spreadSound)
             sounds[3].play();
         
      }
      
        //returns index of Block in blocks, -1 if not found
        function blockAt(x,y){
            for (var i in blocks){
                if (blocks[i].x == x && blocks[i].y == y)
                    return i;
            }
            return -1;
        }
        
        function Player(x, y){
            this.x = x*cellWidth;
            this.y = y*cellWidth;
            this.img = playerImages[1];
    
            this.draw = function(){
                context.drawImage(this.img, this.x, this.y, cellWidth, cellWidth);
            }
            this.update = function(){
                nextX = this.x;
                nextY = this.y;
                switch(direction){
                    case 'up':
                        this.img = playerImages[0];
                        playerLastX = player.x;
                        playerLastY = player.y;
                        nextY -= cellWidth;
                        break;
                    case 'down':
                        this.img = playerImages[1];
                        playerLastX = player.x;
                        playerLastY = player.y;
                        nextY += cellWidth;
                        break;
                    case 'right': 
                        this.img = playerImages[2];
                        playerLastX = player.x;
                        playerLastY = player.y;
                        nextX += cellWidth;
                        break;
                    case 'left':
                        this.img = playerImages[3];
                        playerLastX = player.x;
                        playerLastY = player.y;
                        nextX -= cellWidth;
                        break;
                }
                if(!(isCollide(nextX, nextY, direction))){
                this.x = nextX;
                this.y = nextY;
                }
                
                direction = 'neutral';
            }
        }
        
        function filledNode(){  
            var filledNodes = 0;
            var nodes = 0;
                for (k in blocks){
                    if (blocks[k].type == 2)
                        nodes++;
                    if (bluePings.length < nodes)
                    bluePings.push(new Block(blocks[k].x/cellWidth, blocks[k].y/cellWidth, 5));
                }
                for(i in blocks){
                    if (blocks[i].type == 2){
                  for (j in blocks){
                    if (blocks[j].type == 1 && blocks[j].x == blocks[i].x && blocks[j].y == blocks[i].y){
                        filledNodes++;
                        for (var k in pings){
                            if (pings[k].x == blocks[i].x && pings[k].y == blocks[i].y){
                                var temp = pings[k];
                                pings[k] = pings[pings.length-1];
                                pings[pings.length-1] == temp;
                                pings.pop();
                                break;
                            }
                        }
                     }
                        
                    }
                  }
                }
                
            
                if (filledNodes == nodes){
                         if (levelBool){
                            if (currentLevel != -1)
                                    sounds[6].play();
                            levelCompleteTime = time;
                            levelEndTime = 3;
                            levelBool = false;
                         }
                    
                    if (time - levelCompleteTime == levelEndTime || currentLevel == -1){
                    if (currentLevel != LAST_LEVEL){
                        currentLevel++;
                        levelComplete = true;
                        test = 1;
                    }
                    
                    if (currentLevel == LAST_LEVEL){
                    gameState = "end";
                    currentLevel = -1;
                     }
                    }
                }
            
            var unfilled = 0;
            for (i in blocks){
                if (blocks[i].type == 2)
                    for (j in water){
                       if (blocks[i].x == water[j].x && blocks[i].y == water[j].y){
                               unfilled++;
                           
                           if (pings.length < nodes){
                               var notDuplicate = true;
                               for (var k in pings){
                                   if (pings[k].x == blocks[i].x && pings[k].y == blocks[i].y)
                                       notDuplicate = false;
                               }
                               if (notDuplicate)
                                   pings.push(new Block(blocks[i].x/cellWidth, blocks[i].y/cellWidth, 4));
                    
                           }
                    }
                }
            }
            if ((time % 2) != 0){
                canLosePoints = true;
                showPings = true;
            }
            
            if (((time % 2) == 0) && (canLosePoints)){ 
                score -=10*unfilled;
                if (score < 0)
                    score = 0;
                canLosePoints = false;
                showPings = false;
                    
         
            }
        
        }
        function isCollide(x1, y1, dir){
            //return (x1 == x2 && y1 == y2);
            
            for(i in blocks){
                if (blocks[i].x == x1 && blocks[i].y == y1 && blocks[i].type == 0)
                    return true;
                if (blocks[i].type == 1){
                    //Erase water block in node block
                    for (var j = i; j < blocks.length;j++){
                        if (blocks[j].type == Block_NODE){
                            if (blocks[i].x == blocks[j].x && blocks[i].y == blocks[j].y){
                                for (var k in water){
                                    if (blocks[i].x == water[k].x && blocks[i].y == water[k].y){
                                        var temp = water[k];
                                        water[k] = water[water.length-1];
                                        water[water.length-1] = temp;
                                        water.pop();
                                    }
                                }
                            }
                        }
                    }
                    
                    if (blocks[i].x == x1 && blocks[i].y == y1){
                        switch(direction){
                            case 'up':
                                var BlockPos = blockAt(x1,y1-cellWidth);
                                blockMovedIndex = blockAt(x1,y1);
                                blockMovedLastX = blocks[blockMovedIndex].x;
                                blockMovedLastY = blocks[blockMovedIndex].y;
                                if (BlockPos != -1){
                                    if (blocks[BlockPos].isSolid){
                                        return true;
                                    }
                                    if (blocks[BlockPos].type == 2)
                                        sounds[0].play();                          
                                }
                                blocks[i].y -= cellWidth;
                                blockMoved = true;                            
                                break;
                            case 'down':
                                var BlockPos = blockAt(x1,y1+cellWidth);
                                blockMovedIndex = blockAt(x1,y1);
                                blockMovedLastX = blocks[blockMovedIndex].x;
                                blockMovedLastY = blocks[blockMovedIndex].y;
                                if (BlockPos != -1){
                                    if (blocks[BlockPos].isSolid){
                                        return true;
                                    }
                                    if (blocks[BlockPos].type == 2)
                                        sounds[0].play();
                                }
                                blocks[i].y += cellWidth;
                                blockMoved = true;
                                break;
                            case 'right': 
                                var BlockPos = blockAt(x1+cellWidth,y1);
                                blockMovedIndex = blockAt(x1,y1);
                                blockMovedLastX = blocks[blockMovedIndex].x;
                                blockMovedLastY = blocks[blockMovedIndex].y;
                                if (BlockPos != -1){
                                    if (blocks[BlockPos].isSolid){
                                        return true;
                                    }
                                    if (blocks[BlockPos].type == 2)
                                        sounds[0].play();
                                }
                                blocks[i].x += cellWidth;
                                blockMoved = true;
                                break;
                            case 'left':
                                var BlockPos = blockAt(x1-cellWidth,y1);
                                blockMovedIndex = blockAt(x1,y1);
                                blockMovedLastX = blocks[blockMovedIndex].x;
                                blockMovedLastY = blocks[blockMovedIndex].y;
                                if (BlockPos != -1){
                                    if (blocks[BlockPos].isSolid){

                                        return true;
                                    }
                                    if (blocks[BlockPos].type == 2)
                                        sounds[0].play();
                                }
                                blocks[i].x -= cellWidth;
                                blockMoved = true;
                                break;
                        }
                    }
                }
                            
            }
            return false;
        }
       
        function update(){
          time = parseInt((new Date().getTime()-startTime)/1000, 10);
          player.update();
          filledNode();
            if (levelComplete && gameState != "end"){
                loadLevel(levels[currentLevel%levels.length]);
                levelComplete = false;
            }
          handleTick();
          timeBool = true;
          
          if (score <= 0){
              gameState = "end";
              currentLevel = 0;
              levelComplete = true; 
          }
            
        }
        
        function pauseUpdate(){
            if (dialogue[currentLevel%levels.length].length > 1)
            if (dialogue[currentLevel%levels.length].substring(textCounter-1,textCounter) != "."){
            textCounter++;
            currentText = dialogue[currentLevel%levels.length].substring(0,textCounter);
            
                if (textTracker){
                sounds[4].play();
                sounds[5].currentTime = 0;
                }
                if (!textTracker){
                sounds[5].play(); 
                sounds[4].currentTime = 0;
                }
                textTracker = !textTracker;
            
            }
        }
        
        function pauseDraw(){
            context.fillStyle = "rgba(160,160,160,.5)";
            context.fillRect(0,0, canvas.width, canvas.height);
            
            context.fillStyle = "#E2E2E2";
            context.font = "30px Impact ";
            context.textAlign = "center";
            context.fillText("Press Spacebar to Continue", canvas.width/2,canvas.height-10 );
            
            context.textAlign = "left";
            context.fillText(currentText.substring(0, 35), 50, 100);
            context.fillText(currentText.substring(35, 70), 50, 140);
            context.fillText(currentText.substring(70, 105), 50, 180);
        }
        
        function menuUpdate(){
            
        }
        
        function menuDraw(){
            canvas.width = canvas.width;
            menuBackground = miscImages[0];
            context.drawImage(menuBackground, 0, 0, canvas.width, canvas.height);
        }
        
        function endUpdate(){
            
        }
        
        function endDraw(){
            canvas.width = canvas.width;
            context.drawImage(miscImages[2], 0, 0, canvas.width, canvas.height);
            var percentage = score/INITIAL_SCORE*100;
            var waterLevel = 0; //max 360
            switch (true){
                case percentage > 90:
                    context.drawImage(endImages[0], 0, 0, canvas.width, canvas.height);
                    context.font = "20px Impact ";
                    context.fillStyle = "white";
                    context.fillText("The water you managed to", 120, 120);
                    context.fillText("salvage is more than enough", 120, 140);
                    context.fillText("Your efficiency and quick", 120, 190);
                    context.fillText("thinking resolved the crisis", 120, 210);
                    context.fillText("Thanks to your efforts, the", 120, 270);
                    context.fillText("future is looking bright", 120, 290);
                    context.fillText("                         Well Done", 120, 350);
                    break;
                case percentage > 60:
                    context.drawImage(endImages[1], 0, 0, canvas.width, canvas.height);
                    context.font = "20px Impact ";
                    context.fillStyle = "white";
                    context.fillText("You managed to fix the pipelines,", 120, 120);
                    context.fillText("but a significant amount of water", 120, 140);
                    context.fillText("was lost", 120, 160);
                    
                    break;
                case percentage > 40:
                    context.drawImage(endImages[2], 0, 0, canvas.width, canvas.height);
                    context.font = "20px Impact ";
                    context.fillStyle = "white";
                    context.fillText("You managed to fix the pipelines,", 120, 120);
                    context.fillText("but a significant amount of water", 120, 140);
                    context.fillText(" was lost", 120, 160);
                    context.fillText("Despite your best efforts, the", 120, 190);
                    context.fillText("amount you managed to retrieve", 120, 210);
                    context.fillText("was not enough", 120, 230);
                    break;
                case percentage > 20:
                    context.drawImage(endImages[3], 0, 0, canvas.width, canvas.height);
                    context.font = "20px Impact ";
                    context.fillStyle = "white";
                    context.fillText("You managed to fix the pipelines,", 120, 120);
                    context.fillText("but a significant amount of water", 120, 140);
                    context.fillText(" was lost", 120, 160);
                    context.fillText("Despite your best efforts, the", 120, 190);
                    context.fillText("amount you managed to retrieve", 120, 210);
                    context.fillText("was not enough", 120, 230);
                    context.fillText("Devoid of this rapidly ", 120, 270);
                    context.fillText("diminishing resource, the future ", 120, 290);
                    context.fillText("looks bleak", 120, 310);
                    break;
                case percentage >= 0:
                    context.drawImage(endImages[4], 0, 0, canvas.width, canvas.height);
                    context.font = "20px Impact ";
                    context.fillStyle = "white";
                    context.fillText("You fail entirely to procure", 120, 120);
                    context.fillText("any of the precious water", 120, 140);
                    context.fillText("The pipelines remain damaged, ", 120, 190);
                    context.fillText("and you return empty handed", 120, 210);
                    context.fillText("Without water, you will surely ", 120, 270);
                    context.fillText("perish soon", 120, 290);
                    context.fillText("            Better luck next time", 120, 350);
                    break;    
            } 
            
            
            context.fillStyle = "black";
            context.font = "30px Impact ";
            context.textAlign = "center";
            context.fillText("Final Score: " + percentage.toFixed(0) + "%", canvas.width/2, 40);
            context.fillText("Press Spacebar to Restart", canvas.width/2, 80);
            context.textAlign = "left";
        }
        

        function draw(){    
          canvas.width = canvas.width;
          //draw background
            var puzzleBackground = miscImages[2];
            context.drawImage(puzzleBackground, 0, 0, canvas.width, canvas.height)
            
          //draw blocks
            for (var i in blocks)
                if  (blocks[i].type == 6)
                    blocks[i].draw();
            for(var i in blocks)
                if (blocks[i].type == 0)
                blocks[i].draw();
            for (var i in water)
                water[i].draw();
            for(var i in blocks)
                if (blocks[i].type == 2)
                blocks[i].draw();
            for(var i in blocks)
                if (blocks[i].type == 1)
                blocks[i].draw();
            if (showPings){
             for (var i in pings)
                if (pings[i].type == 4)
                pings[i].draw();
                
             for (var i in bluePings)
                if (!levelBool){ 
                bluePings[i].draw();
              }
            } 
             

           //draw player
            player.draw();
            var percentage = score/INITIAL_SCORE*100; 
            
           //draw additional information
            context.fillStyle = "white";
            context.font = "30px Impact ";
            if (gameState == "puzzle"){
            context.fillText("Level: "+((currentLevel)%levels.length+1), 300, canvas.height-10);          //original pos 280
            //context.fillText("Current: "+ time, 20, canvas.height-80);                                  //time original
            context.fillText("Water: " + percentage.toFixed(0) + "%", 100, canvas.height-10);              //score original pos 80
            }
        }  
        
        
        function loadAssets(){
            for (var i in playerSources){
                playerImages.push(new Image());
                playerImages[i].src = playerSources[i];
            }
            for (var i in blockSources){
                blockImages.push(new Image());
                blockImages[i].src = blockSources[i];
            }
            for (var i in miscSources){
                miscImages.push(new Image());
                miscImages[i].src = miscSources[i];
            }
            for (var i in endSources){
                endImages.push(new Image());
                endImages[i].src = endSources[i];
            }
        }
        
        function game_loop(){
          if (gameState == "menu"){
          menuUpdate();
          menuDraw();
          }
          if (gameState == "puzzle"){
          update();
          }
          if (gameState == "puzzle" || gameState == "pause"){
          draw();   
          }
          if (gameState == "pause"){
          pauseUpdate();
          pauseDraw();
          }
          if (gameState == "end") 
          {
          endUpdate();
          endDraw();
          }
        }
       
      
      loadAssets();
      var player = new Player(10,10);
      sounds[7].loop = true;
      sounds[7].volume = .5; 
      sounds[7].play();
      setInterval(game_loop, 30);
        
        //kill switch is '.'
        var d1 = "What little water we have left willleak through gaps in this pipeline.";
        var d2 = "It's not too late to fix this-     these cracks can be patched using  the spare parts lying around.";
        var d3 = "Although, whatever you're going to do, make sure to do it quickly.";
        var d4 = "The water that leaks through these pipes cannot be recovered.";
        var d5 = "The faster we manage to fix each   leak, the more water we save for   everyone.";
        var d6 = ".";
        var d7 = "Just a few more, and we can get    out of here.";
        var d8 = ".";
        var d9 = "We are almost through this- just  alittle more.";
        var d10 = ".";
        var dialogue = new Array(d1, d2, d3, d4, d5, d6, d7, d8, d9, d10);
        
//LIST OF LEVELS
//SECTION 1: AQUADUCT
        var level1 = new Array(
    "                         ",
    "           ###           ",
    "           #~#           ",
    "           #&#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #@#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #_#           ",
    "           #.#           ",
    "           ###           ",
    "                         ",
    "                         ",
    "                         ");
        var level2 = new Array(
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "      ##############     ",
    "      #__._________#     ",
    "      #&####_@_###_#     ",
    "      #~#  #_@_____#     ",
    "      ###  #######_#     ",
    "                 #.#     ",
    "                 ###     ",
    "                         ",
    "                         ",    
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");        
        var level3 = new Array(
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "      ##############     ",
    "      #.___________#     ",
    "      ######_###@#_#     ",
    "      #_@_____.#_#_#     ",
    "      #_####_###_#_#     ",
    "      #.________@__#     ",
    "      ######_#######     ",
    "          #_~_#          ",
    "          #_&_#          ",
    "          #####          ",
    "                         ",
    "                         ",    
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");
//SECTION 2: PUMP
        var level4 = new Array(       
    "                         ",       
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "           ###           ",
    "           #&#           ",
    "          #.@.#          ",
    "         #__~__#         ",
    "        #.#_@_#.#        ",
    "        #___@___#        ",
    "        #___@___#        ",
    "         #__@__#         ",
    "          #___#          ",
    "           #.#           ",
    "            #            ",  
    "                         ",
    "                         ",    
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");
        var level5 = new Array(
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "          #####          ",
    "          #_~_#          ",
    "          #_&_#          ",
    "          #_@_#          ",
    "         #_____#         ",
    "       ##__#.#####       ",
    "      #___#______.#      ",
    "      #_###_##@#@##      ",
    "      #_@___#.____#      ",
    "       ##_#_##___#       ",
    "        #_#.##__#        ",
    "         #######         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");

        var level6 = new Array(
    "                         ",
    "                         ",
    "                         ",
    "      #############      ",
    "     ###############     ",
    "    ##______~______##    ",
    "   ##___________@___##   ",
    "  ##_&____@__________##  ",
    " ##_____##..###.#_____## ",
    " ##____._______@_#____## ",
    " #######____###_@.____## ",
    " ##____#___@#_#__#____## ",
    " ##____.____###@_#____## ",
    " #######_________#____## ",
    " ##_____##.####.#_____## ",
    " ##_______@____@______## ",
    "  ##_________________##  ",
    "   ##_______________##   ",
    "    ##_____________##    ",
    "     ###############     ",
    "      #############      ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");
//SECTION 3: DAMS        
    
        var level7 = new Array(
    "                         ",
    " ####################### ",
    " #~~~~~~~~~~~~~~~~~~~~~# ",
    " #__________&__________# ",
    " #____#___________#____# ",
    " #___#_____@_@_____#___# ",
    " #__#______@_@______#__# ",
    " #.#____#_______#____#.# ",
    " #.____#_________#____.# ",
    " ########_______######## ",
    " # # # #_________# # # # ",
    "  # # # #_______# # # #  ",
    " ########_______######## ",
    " #._____#_______#_____.# ",
    " #_#__#_#_______#_#__#_# ",
    " #__#____@_____@____#__# ",
    " #_____#_@_____@_#_____# ",
    " #_#_________________#_# ",
    " #.__#____#___#____#__.# ",
    " ####################### ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");
/*    "                         ",
    " ####################### ",
    " #~__#_____#&#_____#__~# ",
    " #__@#_____#_#_____#@__# ",
    " #______#_______#______# ",
    " #______#___#___#______# ",
    " #______#_#_#_#_#______# ",
    " #__@#__###_#_###__#@__# ",
    " #~__#__# #_#_# #__#__~# ",
    " ######## #_#_# ######## ",
    "          #_#_#          ",
    "          #_#_#          ",
    " ######## #_#_# ######## ",
    " #._____# #_#_# #_____.# ",
    " #____#_###_#_###_#____# ",
    " #__#_____#___#_____#__# ",
    " #_____#_________#_____# ",
    " #_#_________________#_# ",
    " #.__#____#___#____#__.# ",
    " ####################### ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");*/

        var level8 = new Array(
    "                         ",
    "                         ",
    "  #####################  ",
    "  #~~~~~~~~~~~~~~~~~~~#  ",
    "  #___#__#_____#__#___#  ",
    "  #__#__#__#_#__#__#__#  ",
    "  #_#__#__#___#__#__#_#  ",
    "  ##__#__#_____#__#__##  ",
    "  #___________________#  ",
    "  #___________________#  ",
    "  #___________________#  ",
    "  ##_________________##  ",
    "  #_###___________###_#  ",
    "  #._________________.#  ",
    "  #.______.__._______.#  ",
    "  #__###############__#  ",
    "  #__@_@_@_@_@_@_@_@__#  ",
    "  #___________________#  ",
    "  #___________________#  ",
    "  #####___________#####  ",
    "  #___________________#  ",
    "  #.________&________.#  ",
    "  #####################  ",
    "                         ",
    "                         ");

/*    "                         ",
    "                         ",
    "  #####################  ",
    "  #~_________________~#  ",
    "  #######___&___#######  ",
    "  #___________________#  ",
    "  #__@____@___@____@__#  ",
    "  #..####_______####..#  ",
    "  #######_______#######  ",
    "  #.___##_______##____#  ",
    "  ###___#_______#_____#  ",
    "  #___________________#  ",
    "  #_____#_______#___###  ",
    "  #____##_@___@_##___.#  ",
    "  #######_______#######  ",
    "  #######_______#######  ",
    "  #_____#_______#_____#  ",
    "  #___.#_________#.___#  ",
    "  #___#___________#___#  ",
    "  #__#_____________#__#  ",
    "  #________@_@________#  ",
    "  #___________________#  ",
    "  #####################  ",
    "                         ",
    "                         ");*/
/*        var level9 = new Array(
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "       #########         ",
    "       #___~___#         ",
    "      ##____@__#         ",
    "      #_@##@___#         ",
    "      #__##_@__#         ",
    "      #__#__#__#         ",
    "      #_@#&##@##         ",
    "      #__@_____#         ",
    "      ###@_##__###       ",
    "      #_____#@_@_#       ",
    "      #_____#____#       ",
    "      #.....######       ",
    "      #.....#            ",
    "      #######            ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");*/

        var level9 = new Array(
    "                         ",
    "                         ",
    "                         ",
    "  #####################  ",
    "  #~______________###~#  ",
    "  #_###____#____###___#  ",
    "  #_______.#__________#  ",
    "  #_#___#######_______#  ",
    "  #_##_____________##_#  ",
    "  #__#_###@___@###__#.#  ",
    "  #__#______________###  ",
    "  ##________&________##  ",
    "  ##_________________##  ",
    "  ##______@___@______##  ",
    "  #__#____#___#______##  ",
    "  #__#________________#  ",
    "  #__#.________####___#  ",
    "  #__###__######_.#___#  ",
    "  #_______________#___#  ",
    "  #~_________________~#  ",
    "  #####################  ",
    "                         ",
    "                         ",
    "                         ",
    "                         ");
        
        var level10 = new Array(
    "                         ",
    "         #######         ",
    "       ##__...__##       ",
    "      #_____@_____#      ",
    "     #_____________#     ",
    "    #_______________#    ",
    "   #______##_##______#   ",
    "   #____##_____##____#   ",
    "  #____##_#_###_##____#  ",
    "  #____#_#._._.#_#____#  ",
    "  ###_#__#_@@@_#__#_###  ",
    "  #~#_#__#.@&@.#__#_#~#  ",
    "  ###_#__#_@@@_#__#_###  ",
    "  #____#_#._._.#_#____#  ",
    "  #__@_##_#####_##_@__#  ",
    "   #____##_____##____#   ",
    "   #______#####______#   ",
    "    #_______________#    ",
    "     #_____________#     ",
    "      #___________#      ",
    "       ##___~___##       ",
    "         #######         ",
    "                         ",
    "                         ",
    "                         ");
/*
        var level10 = new Array(
    "                         ",
    "          ###            ",
    "          #~#            ",
    "          #&#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #@#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #_#            ",
    "          #.#            ",
    "          ###            ",
    "                         ",
    "                         ",
    "                         ");*/

        var levels = new Array;
        levels.push(level1, level2, level3, level4, level5, level6, level7, level8, level9, level10);
        var LAST_LEVEL = levels.length;