//**********************************************************************************************\
//                                        mindmap.js
//
// Author(s): lmout82
// Licence:  MIT License
// Link: https://github.com/lmout82/Rush-JS-JQuery
// Creation date: March 2017
//***********************************************************************************************/

jQuery.fn.extend ({

	mymindmap: function(cWidth, cHeight) {

		var counter  = 0;
		var mapId    = $(this).attr("id");
		var mindSize = {"w": 150,    "h": 25};
		var mapSize  = {"w": cWidth, "h": cHeight};
		var colorDlg = null;


		$(document).keyup( function(event) {
			switch (event.which)
			{
				case 13:
	        		var id = $('.mind-container.selected').attr('id');
	        		addSubMind('your sub idea', id);		

					break;
				case 46:
					var id = $('.mind-container.selected').attr('id');
					delSubMind(id);

					break;
			}

		} );


		$('body:not(.mind-container)').click( function(event) {
			if(event.target.id == "")
				return;

			if( $('#'+event.target.id).hasClass('mind-container') )
			{
				$('.mind-container').removeClass('selected');
				$('#'+event.target.id).addClass('selected');
			}
			else
			{
				$('.mind-container').removeClass('selected');
			}
		} );


		var getDivCenter = function (id)
		{
			var div = $('#'+id).position();
			var div_h = $('#'+id).height();
			var div_w = $('#'+id).width();

			return {"x": (div.left+div_w/2), "y": (div.top+div_h/2)};
		};


		var getLineDistance = function (pt1, pt2)
		{
			var delta_x = pt2.x-pt1.x;
			var delta_y = pt2.y-pt1.y;

			return Math.sqrt(delta_x*delta_x+delta_y*delta_y); 
		};


		var setLineRotation = function (id, angle)
		{
		    var rotation = 'rotate('+angle+'deg)';
		    $('#'+id).css('transform', rotation);
		};


		var drawConnector = function (id1, id2)
		{
			$('#board').append('<div id="connector_'+id1+'_'+id2+'" class="line"></div>');
			updateConnector(id1, id2);

			$('#connector_'+id1+'_'+id2).dblclick( function() { 
				var border = $(this).css('border-top-style');
				if(border == 'solid')
					$(this).css('border-top-style', 'dashed');
				else
					$(this).css('border-top-style', 'solid');
			} );
		};


		var updateConnector = function (id1, id2)
		{
			// in case ofthe parent mind was deleted
			if( $('#connector_'+id1+'_'+id2).length == 0 )
				return;

			var pt1 = getDivCenter(id1);
			var pt2 = getDivCenter(id2);
			var length = getLineDistance(pt1, pt2);
			var angle  = Math.atan2( (pt1.y-pt2.y), (pt1.x-pt2.x) )*(180/3.14159);

			var x = ((pt1.x+pt2.x)/2)-(length/2);
			var y = ((pt1.y+pt2.y)/2);


			$('#connector_'+id1+'_'+id2).css('width' , length);
		    $('#connector_'+id1+'_'+id2).css('height', 2);
		    $('#connector_'+id1+'_'+id2).css('left'  , x+'px');
		    $('#connector_'+id1+'_'+id2).css('top'   , y+'px');
		    $('#connector_'+id1+'_'+id2).css('z-index', 50);

		    setLineRotation('connector_'+id1+'_'+id2, angle);
		};


		var deleteConnector = function (parent_id, id)
		{
			$('#connector_'+parent_id+'_'+id).remove();
		};


		var setBoxFontColor = function (event, ui)
		{
			colorDlg.dialog('close');
			var color   = $('#font_color').val();
			var mind_id = colorDlg.data('mind_id');

			$('#'+mind_id).css('color', color);
		};


		var drag_last_pos = 0;
		var onBoxDragStart = function (event)
		{
			drag_last_pos = $('#'+event.target.id).position();
		};


		var onBoxDrag = function (event, ui)
		{
			var id           = event.target.id;
			var parent_id    = $('#'+id).attr('data-parent'); 
			var ctrlKeyState = event.ctrlKey;

			updateConnector(parent_id, id);

			if(!ctrlKeyState)
			{
				$('.mind-container[data-parent="'+id+'"]').each( function() {
						var id        = $(this).attr('id');
						var parent_id = $(this).attr('data-parent');
						updateConnector(parent_id, id);
				} );
			}
			else
			{
				var curr_pos = $('#'+id).position();

				 shiftBoxChilds(id, curr_pos.left-drag_last_pos.left,
				 				    curr_pos.top-drag_last_pos.top);
					
				drag_last_pos = curr_pos; 
			}
		};


		var onBoxDrop = function (event, ui)
		{
			var drag_zone_id      = event.target.id;
			var drag_zone_parent  = $('#'+drag_zone_id).attr('data-parent');
			var dropped_id        = ui.draggable.attr('id');
			var dropped_id_parent = $('#'+dropped_id).attr('data-parent'); 
			
			var last_p = $('div[data-parent="'+drag_zone_id+'"]').last().position();
			if(last_p == undefined)
			{
				last_p = $('#'+drag_zone_id).last().position(); 
			}

			$('#'+dropped_id).css('top',  last_p.top+50+'px');
			$('#'+dropped_id).css('left', last_p.left+'px');
			$('#'+dropped_id).attr('data-parent', drag_zone_id);

			deleteConnector(dropped_id_parent, dropped_id);
			drawConnector(drag_zone_id, dropped_id);
		};


		var shiftBox = function (id, shiftX, shiftY)
		{
			var pos = $('#'+id).position();
			pos.left += shiftX;
			pos.top  += shiftY;

			$('#'+id).css('left', pos.left+'px');
			$('#'+id).css('top' , pos.top+'px');
		};


		var shiftBoxChilds = function (id, shiftX, shiftY)
		{
			$('.mind-container[data-parent="'+id+'"]').each( function() {
				var child_id        = $(this).attr('id');
				var child_parent_id = $(this).attr('data-parent');

				shiftBox(child_id, shiftX, shiftY);
				updateConnector(child_parent_id, child_id);

				shiftBoxChilds(child_id, shiftX, shiftY);
			} );			
		};


		var addBox = function (text, id, parent_id, left, top)
		{
			$('#board').append('<div id="'+id+'" class="mind-container">'+text+'</div>');
			$('#'+id).attr('data-parent', parent_id);
			$('#'+id).css('width',   mindSize["w"]+'px');
			$('#'+id).css('height',  mindSize["h"]+'px');
			$('#'+id).css('top',     top+'px');
			$('#'+id).css('left',    left+'px');
			$('#'+id).css('z-index', 100);

			if(id != 'mind-master')
				$('#'+id).draggable( {
					start: onBoxDragStart,
					drag: onBoxDrag,
				} );

			$('#'+id).droppable( {
				accept: '.mind-container',
				drop  : onBoxDrop,
			} );			

			$('#'+id).dblclick( function() {
				var txt = $(this).html();
				$(this).html('<input type="text" value="'+txt+'" />');
				$('input').focus();
			} );

			$('#'+id).focusout( function(event) {
				var txt = event.target.value;
				$(this).html(txt);
				$(this).attr("title", txt);
			} );

			$('#'+id).contextmenu( function(event) {
				$('#colordlg').data('mind_id', id).dialog('open');

				event.preventDefault();
			} );		
		};


		var delSubMind = function (id)
		{
			var parent_id = $('#'+id).attr('data-parent');

			$('#'+id).remove();
			deleteConnector(parent_id, id);

			$('.mind-container[data-parent="'+id+'"]').each ( function() {
				var child_id        = $(this).attr('id');
				var child_parent_id = $(this).attr('data-parent');

				deleteConnector(child_parent_id, child_id);
			} );
		};


		var addSubMind = function (text, parent_id)
		{
			if(parent_id == undefined)
				return;

			var mast_p = $('#'+parent_id).position();
			var last_p = $('div[data-parent="'+parent_id+'"]').last().position();
			if(last_p == undefined)
			{
				last_p = mast_p;
				last_p.top -= mindSize["h"]+50; 
			}

			counter++;
			addBox(text, 'node-'+counter, parent_id,
										  mast_p.left+50+mindSize["w"],
										  last_p.top+50 );

			drawConnector(parent_id, 'node-'+counter);

		};


		var addMind = function (text)
		{
			addSubMind(text, 'mind-master');
		};


		$(this).append('<div id="board" style="width:'+cWidth+'px; height:'+cHeight+'px"></div>');

		$(this).append('<div id="colordlg" title="Font color"><form>Please select the font color for this mind box:<br/><input type="color" id="font_color" value="#000000"/></form></div>');
		colorDlg = $('#colordlg').dialog( { autoOpen: false, modal: true, width: 350, buttons: { 'Save': setBoxFontColor } } );
		$('#colordlg').find('form').on('submit', function(event) { event.preventDefault(); });

		addBox('master idea', 'mind-master', '0',
										    (mapSize["w"]-mindSize["w"])/2,
										    (mapSize["h"]-mindSize["h"])/2 );


		return this;
  },
  
});