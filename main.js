var container = document.getElementById('gridBox');
var gridSize = 30;
var boxSize = 10;
var playerX = 0;
var playerY = 0;
var paused = true;
var gridArrayA = [];
var gridArrayB = [];
var gridCycle = "a"
var gidBoxPos


//draw the grid with new divs
function drawGrid(){
  container.style.width = (gridSize * boxSize) + "px";
  container.style.height = (gridSize * boxSize) + "px";
  for(let i =0; i<(gridSize*gridSize); i++){
    let newBox = document.createElement('div')
    newBox.style.width = boxSize + "px";
    newBox.style.height = boxSize + "px";
    newBox.style.backgroundColor = "white"
    newBox.className = 'box'
    container.append(newBox)
  }
  gridArrayA = Create2DArray(gridSize);
  gridArrayB = Create2DArray(gridSize);
  for(let x = 0; x < gridSize; x++){
    for(let y = 0; y < gridSize; y++){
      gridArrayA[x][y] = 0;
      gridArrayB[x][y] = 0;
    }
  }
}

function Create2DArray(rows) {
  var arr = [];
  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }
  return arr;
}

//toggle pause
$('#pauseButton').click(function(){
  if(paused === true){
    paused = false;
    document.querySelector('#pauseText').textContent = "living"
  }else {
    paused = true;
    document.querySelector('#pauseText').textContent = "PAUSED"
  }
})

//pencil a square with selected color
container.addEventListener('click', function(event){
  //console.log(event.target)
  if(event.target.classList.contains('box') && paused == true){
    event.target.style.backgroundColor = "red";
    let boxPos = event.target.getBoundingClientRect();
    let containerPos = container.getBoundingClientRect();
    let boxX = Math.floor((boxPos.left - containerPos.left)/boxSize);
    let boxY = Math.floor((boxPos.top - containerPos.top)/boxSize);
    console.log(boxX + " , " + boxY);
    if(gridCycle === "a"){
      gridArrayA[boxX][boxY] = 1;
    } else {
      gridArrayB[boxX][boxY] = 1;
    }
  }
})

function runStep(){
  if(gridCycle === "a"){
    gridCheck(gridArrayA, gridArrayB);
    makeChanges(gridArrayB, gridArrayA);
  } else if(gridCycle === "b"){
    gridCheck(gridArrayB, gridArrayA);
    makeChanges(gridArrayA, gridArrayB);
  }
}
$('#stepButton').click(function(){
  runStep();
})


//check each position with conway's 4 rules
function gridCheck(checked, empty){
  for(let x = 0; x < gridSize; x++){
    for(let y = 0; y < gridSize; y++){
      let count = 0
      //position not on a side
      if(x>0 && x<(gridSize-1) && y>0 && y<(gridSize-1)){
        //top row
        count += (checked[x-1][y-1] + checked[x-1][y] + checked[x-1][y+1])
        //mid two
        count += (checked[x][y-1] + checked[x][y+1])
        //bottom row
        count += (checked[x+1][y-1] + checked[x+1][y] + checked[x+1][y+1])

      //position on the left side
      } else if(x == 0){
        count += checked[x+1][y]
        //also at top
        if(y == 0){
          //bottom right two
          count += (checked[x][y+1] + checked[x+1][y+1])
        //also at bottom
        } else if(y == gridSize -1){
          //top right two
          count += (checked[x+1][y-1] + checked[x][y-1])
        //between top and bottom sides
      } else if (y > 0 && y < gridSize -1){
          //top and bottom right two
          count += (checked[x][y-1] + checked[x+1][y-1])
          count += (checked[x][y+1] + checked[x+1][y+1])
        }

        //position on the right side
      } else if(x == gridSize -1){
        count += checked[x-1][y]
        //also at top
        if(y == 0){
          //bottom left two
          count += (checked[x-1][y+1] + checked[x][y+1])
        //also at bottom
        } else if(y == gridSize -1){
          //top left two
          count += (checked[x][y-1] + checked[x-1][y-1])
        //between top and bottom sides
        } else {
          //both top and bottom left two
          count += (checked[x-1][y+1] + checked[x][y+1])
          count += (checked[x][y-1] + checked[x-1][y+1])
        }
      }
      //Apply conway's rules
      if(checked[x][y] == 1){
        if(count < 2){
          //rule #1
          empty[x][y] = 0;
        } else if(count == 2 || count == 3){
          //rule #2
          empty[x][y] = 1;
        } else if(count > 3){
          //rule #3
          empty[x][y] = 0;
        }
      } else {
        if(count == 3){
          //rule #4
          empty[x][y] = 1;
        }
      }
    }
  }
}

function makeChanges(changed, toEmpty){
  let containerPos = container.getBoundingClientRect();
  for(let y = 0; y < gridSize; y++){
    for(let x = 0; x < gridSize; x++){
      toEmpty[x][y] = 0;
      let gridPos = document.elementFromPoint(x*boxSize + containerPos.left, y*boxSize + containerPos.top)
      if(changed[x][y] == 1){
        gridPos.style.backgroundColor = "red"
      } else {
        gridPos.style.backgroundColor = "white"
      }
    }
  }
  if(gridCycle == "a"){
    gridCycle = "b"
  } else if (gridCycle == "b"){
    gridCycle = "a"
  }
}

drawGrid();
