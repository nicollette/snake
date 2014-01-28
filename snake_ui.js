(function(root) {
	var SnakeGame = root.SnakeGame = (root.SnakeGame || {});

	var View = SnakeGame.View = function($el) {
    this.$el = $el;
	};

	View.prototype.htmlRender = function() {
    var view = this;
		view.$el.html("");
    
    var $score = $("<div class='score'>");
    $score.text("Score: " + this.board.score);
    view.$el.append($score);
    
		var board_array = this.board.render();
    
		board_array.forEach(function(row, idx) {
      var $newRow = view.buildHtmlRow(row);
			view.$el.append($newRow);
		})
	};
  
  View.prototype.buildHtmlRow = function(row, idx) {
    var view = this;
    var $newRow = $("<div class='row' id='" + idx + "'>");
    
    row.forEach(function(cell) {
      var $newCell = $("<div class='cell'>");
      
      if (view.isSnakeCell(cell)) {
        $newCell.toggleClass("snake");
      }
      else if(view.isAppleCell(cell)) {
        $newCell.toggleClass("apple");
      }

      $newRow.append($newCell);
    })
    
    return $newRow;
  }

  View.prototype.isSnakeCell = function(cell) {
    if (cell === "s") {
      return true;
    }
    return false;
  };
  
  View.prototype.isAppleCell = function(cell) {
    if (cell === "a") {
      return true;
    }
    return false;
  };
  
	View.prototype.start = function() {
		this.board = new SnakeGame.Board([10, 10]);
    this.bindKeys();
		this.intervalId = window.setInterval(this.step.bind(this), 500);
    this.appleIntervalId = window.setInterval(this.board.generateApples.bind(this.board), 5500);
	};

	View.prototype.step = function() {
    this.board.gameStep();
    if(this.board.isGameOver()) {
      this.stop();
    }
    this.htmlRender();
	};

  View.prototype.stop = function() {
    window.clearInterval(this.intervalId);
    window.clearInterval(this.appleIntervalId);
    alert("Game Over!")
  };
  
	View.prototype.bindKeys = function() {
		$(document).on("keydown", this.handleKeyEvent.bind(this));
	};

	View.prototype.handleKeyEvent = function(event) {
		if(event.keyCode === 39){
			this.board.snake.turn("right");
		}
		else if (event.keyCode === 37) {
			this.board.snake.turn("left");
		}
	};

})(this);

$(document).ready(function() {
	var new_view = new SnakeGame.View($("body"));
	new_view.start();
});
