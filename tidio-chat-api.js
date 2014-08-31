/*
** API Module - Color
*/

var tidioChatApiColor = {
		
    renderChatColors: function(firstColor, secondColor) {
		
        //rgbX - hex values with changed opacity
        var rgb02 = this.changeHexOpacity(secondColor, 0.2);
        var rgb03 = this.changeHexOpacity(secondColor, 0.3);
        var rgb06 = this.changeHexOpacity(secondColor, 0.6);

        var style = '';
        //set primary color
        style += '.tidio-chat-window header,#tidio-chat-discussion .operator .avatar-placeholder,.tidio-chat-window input[type="submit"]{background-color:' + secondColor + ';}';
		// set primary color (webkit)
        style += '.tidio-chat-window ::-webkit-scrollbar-thumb,.tidio-chat-window ::-webkit-scrollbar-thumb:window-inactive{background-color:' + secondColor + ';}';
        //set color for message
        style += '#tidio-chat-discussion .operator .message{color:' + secondColor + ';background-color:' + rgb02 + ';}';
        //set color for message footer
        style += '#tidio-chat-discussion .operator footer{color:' + rgb06 + ';background-color:' + rgb03 + ';}';
        //button styles
        style += this.getGradientStyle('#tidio-chat-button', firstColor, secondColor);
        style += '#tidio-chat-button{border-bottom-color:' + firstColor + ';}';
		
        return style;
    },
    changeHexOpacity: function(hex, opacity) {
        var rgb = this.hexToRgb(hex);
        opacity = 1 - opacity;
        rgb.r = (255 - rgb.r) * opacity + rgb.r;
        rgb.g = (255 - rgb.g) * opacity + rgb.g;
        rgb.b = (255 - rgb.b) * opacity + rgb.b;
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    },
    componentToHex: function(c) {
        c = Math.round(c);
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: function(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },
    hexToRgb: function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    setGradient: function($el, firstColor, secondColor, fallbackColor) {

        if (typeof fallbackColor == 'undefined') {
            fallbackColor = secondColor;
        }

        var mozBg = '-moz-linear-gradient(top,  ' + firstColor + ' 1%, ' + secondColor + ' 100%)';
        var webkitBgOld = '-webkit-gradient(linear, left top, left bottom, color-stop(1%,' + secondColor + '), color-stop(100%, ' + secondColor + '))';
        var webkitBg = '-webkit-linear-gradient(top,  ' + firstColor + ' 1%,' + secondColor + ' 100%)';
        var operaBg = '-o-linear-gradient(top,  ' + firstColor + ' 1%,' + secondColor + ' 100%)';
        var msBg = '-ms-linear-gradient(top,  ' + firstColor + ' 1%,' + secondColor + ' 100%)';
        var linearBg = 'linear-gradient(to bottom,  ' + firstColor + ' 1%,' + secondColor + ' 100%)';
        var filterBg = "progid:DXImageTransform.Microsoft.gradient( startColorstr='" + firstColor + "', endColorstr='" + secondColor + "',GradientType=0 )";
        $el.css('background', fallbackColor)
                .css('background', mozBg)
                .css('background', webkitBgOld)
                .css('background', webkitBg)
                .css('background', operaBg)
                .css('background', msBg)
                .css('background', linearBg)
                .css('filter', filterBg);
    },
    getGradientStyle: function(elSelector, firstColor, secondColor, fallbackColor) {
        if (typeof fallbackColor == 'undefined') {
            fallbackColor = secondColor;
        }

        var style = elSelector + '{';
        style += 'background: ' + fallbackColor + ';';
        style += 'background: -moz-linear-gradient(top,  ' + firstColor + ' 1%, ' + secondColor + ' 100%);';
        style += 'background: -webkit-gradient(linear, left top, left bottom, color-stop(1%,' + secondColor + '), color-stop(100%, ' + secondColor + '));';
        style += 'background: -webkit-linear-gradient(top,  ' + firstColor + ' 1%,' + secondColor + ' 100%);';
        style += 'background: -o-linear-gradient(top,  ' + firstColor + ' 1%,' + secondColor + ' 100%);';
        style += 'background: -ms-linear-gradient(top,  ' + firstColor + ' 1%,' + secondColor + ' 100%);';
        style += 'background: linear-gradient(to bottom,  ' + firstColor + ' 1%,' + secondColor + ' 100%);';
        style += "background: progid:DXImageTransform.Microsoft.gradient( startColorstr='" + firstColor + "', endColorstr='" + secondColor + "',GradientType=0 );";
        style += '}';
        return style;
    }
};

/*
** Tidio Chat API
*/

var tidioChatApi = {
	
	chat_is_ready: false,
	
	chat_is_ready_queue: [],
	
	chat_display: true,

	// Map of function which we can trigger,
	// 0 - means that function is trigger immediately
	// 1 - we waiting to moment when everything else is loaded
	function_map: {
		'setColorPallete': 1,
		'languageSet': 0,
		'badgeShow': 0,
		'badgeHide': 0,
		'messageFromVisitor': 0,
		'messageFromOperator': 0,
		'popUpOpen': 0,
		'popUpHide': 0,
		'chatDisplay': 1
	},

	$iframe: null,

	$iframe_chat: null,

	$iframeJQ: null,
	
	listeners: {},
	
	language: {},
	
	init: function(){
		
		tidioChatRender.listener('chatIsReady', function(){
			if(tidioChatApi.chat_is_ready){
				return false;
			}
			//
			
			tidioChatApi.chat_is_ready = true;
			tidioChatApi.$iframe = document.getElementById('tidio-chat').contentWindow.document;
			tidioChatApi.$iframeJQ = tidioChatApi.$iframe.jQuery;
					
			
			tidioChatApi.chatIsReadyQueueTrigger();
		}, true);

		
	},
	
	// Function is checking if chat is ready, if not it push function to queue, and queue is trigger when everything is loaded
	chatIsReadyPush: function(_func){
		if(tidioChatApi.chat_is_ready){
			_func();
			return true;
		}
		
		//
				
		this.chat_is_ready_queue.push(_func);
		return false;
	},
	
	chatIsReadyQueueTrigger: function(){
		
		for(var i=0,c=this.chat_is_ready_queue.length;i<c;++i){
			this.chat_is_ready_queue[i]();
		}
		
	},
	
	//
	
	method: function(id, a, b){
			
		if(typeof this.function_map[id]=='undefined'){
			return false;
		}
		
		var map = this.function_map[id];
				
		if(map===1){
			tidioChatApi[id](a,b);
			return false;
		} else {
			this.chatIsReadyPush(function(){
				tidioChatApi[id](a,b);
			});
		}
				
	},
	
	on: function(id, a, b){
		
		if(typeof a=='function'){

			if(!this.listeners[id]){
				this.listeners[id] = [];
			}
			
			this.listeners[id].push(a);
			
			return true;
		}

		if(!this.listeners[id]){
			return false;
		}
		
		if(typeof a=='undefined')
			a = null;
			
		if(typeof b=='undefined')
			b = null;
		
		for(var i=0,c=this.listeners[id].length;i<c;++i){
			this.listeners[id][i](a,b)
		}
		
		return true;
		
	},
	
	/*
	** Language
	*/
	
	languageSet: function(lang){
		
		this.language = lang;
		
	},

	/*
	** Badge 
	*/
	
	badgeShow: function(){
		tidioChatApi.$iframe.tidioChat.badgeDisplay(true);
	},
	
	badgeHide: function(){
		tidioChatApi.$iframe.tidioChat.badgeDisplay(false);
	},
	
	/*
	** Chat Display 
	*/
	
	chatDisplay: function(display){
		
		// rendering chat if was previous blocked
		if(display && typeof tidioChatRender=='object' && !this.chat_display && !tidioChatRender.chat_created){
			this.chat_display = true;
			tidioChatRender.create(tidioChatRender.chat_data);
			return '3';
		}
		
		if(this.chat_is_ready && typeof tidioChatRender=='object'){
						
			if(display){
				document.getElementById('tidio-chat').style.display = 'block';
			} else {
				document.getElementById('tidio-chat').style.display = 'none';
			}
			
			return false;
			
		}
		
		if(typeof tidioChatRender=='undefined'){
			this.chat_display = display;
			return false;
		}
		
		this.chatIsReadyPush(function(){
			tidioChatApi.chatDisplay(display);
		});
		
		
	},

	/*
	** Message 
	*/
	
	messageFromVisitor: function(msg){
						
		tidioChatApi.$iframe.tidioChat.onMessageFromVisitor(msg, true);
	},
	
	messageFromOperator: function(msg){
		
		tidioChatApi.$iframe.tidioChat.onMessageFromOperator({
			message: msg
		});
			
	},
	
	/*
	** PopUp 
	*/
	
	popUpOpen: function(){
		tidioChatApi.$iframe.tidioChat.popupShow();	
	},
	
	popUpHide: function(){
		tidioChatApi.$iframe.tidioChat.popupHide();
	},
	
	/*
	** Color Customization (extends: tidioChatApiColor)
	*/
	
	setColorPallete: function(color1, color2){
		
		var pallete_css = tidioChatApiColor.renderChatColors(color1, color2);
		
		this.setApiGlobalData('colorPallete', pallete_css);
		
		//
		
		this.chatIsReadyPush(function(){
						
			var ele_head = tidioChatRender._iframe_doc.querySelector('head'),
				ele_style = document.createElement('style');
				
			ele_style.innerHTML = pallete_css;
			
			ele_head.appendChild(ele_style);
			
		});
		
	},
	
	setApiGlobalData: function(id, value){
		
		if(!document.tidioChatGlobalData){
			document.tidioChatGlobalData = {};
		}
		
		document.tidioChatGlobalData[id] = value;
		
	}
	
};


document.tidioChatApi = tidioChatApi;
