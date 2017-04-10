//**********************************************************************************************\
//                                        2048.js
//
// Author(s): lmout82
// Licence:  MIT License
// Link: https://github.com/lmout82/Rush-JS-JQuery
// Creation date: March 2017
//***********************************************************************************************/

jQuery.fn.extend ({

	mygame: function(block_size) {

		var gameId    = $(this).attr("id");
		var blockSize = block_size;
		var boardSize = blockSize*4+40;
		var flag      = false;  // first exe of function 'addRandomTile'
		var Score     = 0;


		var insertBoard = function ()
		{	
			$('#'+gameId).append('<div id="head"><div id="score">0</div></div><div style="clear: both;"></div>');
			$('#head').css('width',  boardSize+'px');

			$('#'+gameId).append('<div id="board"></div>');
			$('#board').css('height', boardSize+'px');
			$('#board').css('width',  boardSize+'px');
			$('#board').css('line-height', blockSize+'px');

			$('#'+gameId).append('<div id="gameover">Game over!</div>');
			$('#gameover').dialog( {autoOpen: false, position: {my: 'center', at: 'center', of: '#board' }} );
			$('.ui-dialog-titlebar').hide();

			for(var j=0; j<4; j++)
			{
				for(var i=0; i<4; i++)
				{
					$('#board').append('<div id="cell_'+i+j+'" class="square-container"></div>');
					$('#cell_'+i+j).attr('data-value', 0);
				}
			}
		};


		var updateScore = function (pt_to_add)
		{
			Score += pt_to_add;
			$('#score').html(Score);
		};


		var getRandNumber2_4 = function ()
		{
			return Math.random() < 0.5 ? 2 : 4;
		};


		var getRandNumber = function (min, max)
		{
			return Math.floor( Math.random()*(max-min+1) )+min;
		};


		var getRandomTile = function ()
		{
			var cell_val = 0;
			do {
				var i = getRandNumber(0, 3);
				var j = getRandNumber(0, 3);  
				var cell_id  = i+''+j; 
					cell_val = $('#cell_'+cell_id).attr('data-value');

				if(cell_val == 0)
				{
					var rand_value = getRandNumber2_4(); 
					$('#cell_'+cell_id).attr('data-value', rand_value);
					$('#cell_'+cell_id).html(rand_value);
				}
			} while (cell_val != 0);
		}


		var countEmptyCells = function ()
		{
			return $('.square-container[data-value="0"]').length;
		};


		var addRandomTile = function ()
		{
			if(!flag)
			{
				getRandomTile();
				getRandomTile();

				flag = true;
			}
			else
			{
				getRandomTile();
			}
		};


		var getCellValue = function (i, j)
		{
			return $('#cell_'+i+j).attr('data-value');			
		};


		var moveCell = function (i_0, j_0, i_1, j_1)
		{
			var cell_value = getCellValue(i_0, j_0);

			$('#cell_'+i_1+j_1).attr('data-value', cell_value);
			$('#cell_'+i_1+j_1).html(cell_value);

			$('#cell_'+i_0+j_0).attr('data-value', 0);
			$('#cell_'+i_0+j_0).html('');
		};


		//merge cell 0 into cell 1
		var mergeCell = function (i_0, j_0, i_1, j_1)
		{
			var cell_0_value = getCellValue(i_0, j_0);
			var cell_1_value = getCellValue(i_1, j_1);
			var sum = Number(cell_0_value)+Number(cell_1_value); 

			updateScore(sum);

			$('#cell_'+i_1+j_1).attr('data-value', sum);
			$('#cell_'+i_1+j_1).html(sum);
			$('#cell_'+i_1+j_1).effect('highlight', {}, 1000);

			$('#cell_'+i_0+j_0).attr('data-value', 0);
			$('#cell_'+i_0+j_0).html('');			
		};


		var columnDown = function (i)
		{
			var flag_cell_merged = false;

			for (var loop=0; loop<4; loop++)
			{
				for (var j=2; j>=0; j--)
				{
					var cell_value      = getCellValue(i, j);
					var prev_cell_value = getCellValue(i, j+1); 

					if( cell_value != 0 && prev_cell_value == 0 )
					{
						moveCell(i, j, i, j+1);
					}
					else if( (cell_value == prev_cell_value) && (cell_value != 0) && !flag_cell_merged)
					{
						mergeCell(i, j, i, j+1);
						flag_cell_merged = true;
					}
				}
			}
		};


		var columnUp = function (i)
		{
			var flag_cell_merged = false;

			for (var loop=0; loop<4; loop++)
			{
				for (var j=1; j<4; j++)
				{
					var cell_value      = getCellValue(i, j);
					var prev_cell_value = getCellValue(i, j-1); 

					if( cell_value != 0 && prev_cell_value == 0 )
					{
						moveCell(i, j, i, j-1);
					}
					else if( (cell_value == prev_cell_value) && (cell_value != 0) && !flag_cell_merged)
					{
						mergeCell(i, j, i, j-1);
						flag_cell_merged = true;
					}
				}
			}
		};


		var rowLeft = function (j)
		{
			var flag_cell_merged = false;

			for (var loop=0; loop<4; loop++)
			{
				for (var i=1; i<4; i++)
				{
					var cell_value      = getCellValue(i, j);
					var prev_cell_value = getCellValue(i-1, j); 

					if( cell_value != 0 && prev_cell_value == 0)
					{
						moveCell(i, j, i-1, j);
					}
					else if( (cell_value == prev_cell_value) && (cell_value != 0) && !flag_cell_merged)
					{
						mergeCell(i, j, i-1, j);
						flag_cell_merged = true;
					}
				}
			}
		};


		var rowRight = function (j)
		{
			var flag_cell_merged = false;

			for (var loop=0; loop<4; loop++)
			{
				for (var i=2; i>=0; i--)
				{
					var cell_value      = getCellValue(i, j);
					var prev_cell_value = getCellValue(i+1, j); 

					if( cell_value != 0 && prev_cell_value == 0)
					{
						moveCell(i, j, i+1, j);
					}
					else if( (cell_value == prev_cell_value) && (cell_value != 0) && !flag_cell_merged)
					{
						mergeCell(i, j, i+1, j);
						flag_cell_merged = true;
					}
				}
			}
		};


		var onArrowKeyDown = function ()
		{
			for (var i=0; i<4; i++)
			{
				columnDown(i);
			}
		};


		var onArrowKeyUp = function ()
		{
			for (var i=0; i<4; i++)
			{
				columnUp(i);
			}
		};


		var onArrowKeyLeft = function ()
		{
			for (var j=0; j<4; j++)
			{
				rowLeft(j);
			}
		};


		var onArrowKeyRight = function ()
		{
			for (var j=0; j<4; j++)
			{
				rowRight(j);
			}
		};


		$('body').keydown( function (event) { 
			switch (event.which)
			{
				case 38: //up
					onArrowKeyUp();
					break;

				case 40: //down
					onArrowKeyDown();
					break;

				case 37: // left
					onArrowKeyLeft();
					break;

				case 39: // right
					onArrowKeyRight();
					break;
			}
		} );


		$('body').keyup( function (event) { 
			var keyCode = event.which;

			if(keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39 )
			{
				if( countEmptyCells()>=1 )
				{
					addRandomTile();
				}
				else
				{
					$('#board').effect('explode', {}, 1000, function () {
						$(this).fadeTo(1000, 0.3);
						$(this).show();

						$('#gameover').dialog('open');
					} );

					$('body').unbind('keyup');
				}
			}
		} );


		insertBoard();
		addRandomTile();

		return this;
  },
  
});