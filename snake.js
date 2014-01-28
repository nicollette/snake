//UPDATE:
//render head of snake differently
// keep track of score
//  add to board.score when apple is eaten, render in div score

(function(root) {
	var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

	var Snake = SnakeGame.Snake = function(dims) {
		this.dir = "S";
		this.segments = this.centerPos(dims);
	};

  Snake.prototype.centerPos = function(dims) {
    return [[Math.floor(dims[0] / 2), Math.floor(dims[1] / 2)]];
  };

	Snake.prototype.move = function(eatsApple) {
		var nextSpot = this.nextGridSpot();
		this.segments.unshift(nextSpot);
    
    if(eatsApple === null) {
  		this.segments.pop();      
    }
	};

	var direction = SnakeGame.direction = {
		N: [0, 1],
		E: [1, 0],
		S: [0, -1],
		W: [-1, 0]
	};

	var cardinalSeq = ["N", "E", "S", "W"];

	Snake.prototype.nextGridSpot = function() {
		return [this.segments[0][0] + direction[this.dir][0],
			this.segments[0][1] + direction[this.dir][1]];
	};

	Snake.prototype.turn = function(turnDir) {
		if(turnDir === "right") {
			var newDirIdx = cardinalSeq.indexOf(this.dir) + 1;
		}
		else if(turnDir === "left") {
			var newDirIdx = cardinalSeq.indexOf(this.dir) - 1;
		}

		if(newDirIdx > 3) {
			newDirIdx = 0;
		}
		else if(newDirIdx < 0) {
			newDirIdx = 3;
		}
		this.dir = cardinalSeq[newDirIdx];
	};

	var Board = SnakeGame.Board = function(dims) {
		this.snake = new Snake(dims);
		this.grid = dims;
		this.applePositions = [];
    this.generateApples();
    this.score = 0;
	};

	Board.prototype.gameStep = function() {
    var eatenAppleIdx = this.checkEatsApple();
		this.snake.move(eatenAppleIdx);
    
    if(!(eatenAppleIdx === null)) {
      this.score += 10;
      this.removeApple(eatenAppleIdx);
      window.setTimeout(this.snake.appleWearsOff.bind(this.snake), 20000);
    }
	};
  
  Snake.prototype.appleWearsOff = function() {
    this.segments.pop();
  };
  
  Board.prototype.checkEatsApple = function() {
    var board = this;
    var eatenAppleIdx = null;
    // need to check if apple is the next grid spot
    // var snakeHeadPos = this.snake.segments[0];
    var snakeHeadPos = this.snake.nextGridSpot();    
    this.applePositions.forEach(function(applePos, index) {
      if(board.compareCellsEq(snakeHeadPos, applePos)) {
        eatenAppleIdx = index;
      }
    })
    
    return eatenAppleIdx;
  };
  
  Board.prototype.removeApple = function(idx) {
    this.applePositions.splice(idx, 1);
  }
  
  Board.prototype.compareCellsEq = function(cell1, cell2) {
    return (cell1[0] === cell2[0] && cell1[1] === cell2[1])
  };
  
	Board.prototype.render = function() {
		var board_arr = [];
    
		for (i = 0; i < this.grid[0]; i++) {
			var row = [];
      
			for (j = 0; j < this.grid[1]; j++) {
        if(this.isEmptyCell([i, j])) {
          row.push("");
        }
        else {
          row.push(this.cellContains([i, j]));
        }
			}
      
			board_arr.push(row);
		}
		return board_arr;
	};
  
  Board.prototype.cellContains = function(cell) {
    var board = this;
    var cellIs = null;
    
    this.snake.segments.forEach(function(segment) {
      if(board.compareCellsEq(cell, segment)) {
        cellIs = "s";
      }
    })
    
    this.applePositions.forEach(function(applePos) {
      if(board.compareCellsEq(cell, applePos)) {
        cellIs = "a";
      }
    })
    
    return cellIs;
  };
  
	Board.prototype.isGameOver = function() {
    if(!this.isInBounds() || this.isSnakeOverlapping()) {
      return true;
    }
    else {
      return false;
    }
	};
  
	Board.prototype.isInBounds = function() {
    var snake = this.snake
		return (snake.segments[0][0] >= 0 && snake.segments[0][0] <= this.grid[0]
			&& snake.segments[0][1] >= 0 && snake.segments[0][1] <= this.grid[1]);
	};
  
  Board.prototype.isSnakeOverlapping = function () {
    var overlaps = false;
    var snake = this.snake;
    
    for(var j = 1; j < snake.segments.length; j++) {
      if (this.compareCellsEq(snake.segments[0], snake.segments[j])) {
        overlaps = true;
      }
    }
    return overlaps;
  };
  
  Board.prototype.isEmptyCell = function(pos) {
    var board = this;
    var isEmpty = true;
    
    if(this.applePositions.length > 0) {
      this.applePositions.forEach(function(applePos) {
        if (board.compareCellsEq(applePos, pos)){
          isEmpty = false;
        }
      })
    }
    
    this.snake.segments.forEach(function(segment) {
      if (board.compareCellsEq(segment, pos)) {
        isEmpty = false;
      }
    })
    
    return isEmpty;
  };
  
  Board.APPLE_COUNT = 5;
  
  Board.prototype.generateApples = function() {
    this.applePositions = [];
    
    while(this.applePositions.length < Board.APPLE_COUNT) {
      var pos = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
      if(this.isEmptyCell(pos)) {
        this.applePositions.push(pos);
      }
    }
  };
  
})(this);
