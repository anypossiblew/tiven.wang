/* Spinner Class */
(function(t,e){if(typeof exports=="object")module.exports=e();else if(typeof define=="function"&&define.amd)define(e);else t.Spinner=e()})(this,function(){"use strict";var t=["webkit","Moz","ms","O"],e={},i;function o(t,e){var i=document.createElement(t||"div"),o;for(o in e)i[o]=e[o];return i}function n(t){for(var e=1,i=arguments.length;e<i;e++)t.appendChild(arguments[e]);return t}var r=function(){var t=o("style",{type:"text/css"});n(document.getElementsByTagName("head")[0],t);return t.sheet||t.styleSheet}();function s(t,o,n,s){var a=["opacity",o,~~(t*100),n,s].join("-"),f=.01+n/s*100,l=Math.max(1-(1-t)/o*(100-f),t),u=i.substring(0,i.indexOf("Animation")).toLowerCase(),d=u&&"-"+u+"-"||"";if(!e[a]){r.insertRule("@"+d+"keyframes "+a+"{"+"0%{opacity:"+l+"}"+f+"%{opacity:"+t+"}"+(f+.01)+"%{opacity:1}"+(f+o)%100+"%{opacity:"+t+"}"+"100%{opacity:"+l+"}"+"}",r.cssRules.length);e[a]=1}return a}function a(e,i){var o=e.style,n,r;i=i.charAt(0).toUpperCase()+i.slice(1);for(r=0;r<t.length;r++){n=t[r]+i;if(o[n]!==undefined)return n}if(o[i]!==undefined)return i}function f(t,e){for(var i in e)t.style[a(t,i)||i]=e[i];return t}function l(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var o in i)if(t[o]===undefined)t[o]=i[o]}return t}function u(t){var e={x:t.offsetLeft,y:t.offsetTop};while(t=t.offsetParent)e.x+=t.offsetLeft,e.y+=t.offsetTop;return e}function d(t,e){return typeof t=="string"?t:t[e%t.length]}var p={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:1/4,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};function c(t){if(typeof this=="undefined")return new c(t);this.opts=l(t||{},c.defaults,p)}c.defaults={};l(c.prototype,{spin:function(t){this.stop();var e=this,n=e.opts,r=e.el=f(o(0,{className:n.className}),{position:n.position,width:0,zIndex:n.zIndex}),s=n.radius+n.length+n.width,a,l;if(t){t.insertBefore(r,t.firstChild||null);l=u(t);a=u(r);f(r,{left:(n.left=="auto"?l.x-a.x+(t.offsetWidth>>1):parseInt(n.left,10)+s)+"px",top:(n.top=="auto"?l.y-a.y+(t.offsetHeight>>1):parseInt(n.top,10)+s)+"px"})}r.setAttribute("role","progressbar");e.lines(r,e.opts);if(!i){var d=0,p=(n.lines-1)*(1-n.direction)/2,c,h=n.fps,m=h/n.speed,y=(1-n.opacity)/(m*n.trail/100),g=m/n.lines;(function v(){d++;for(var t=0;t<n.lines;t++){c=Math.max(1-(d+(n.lines-t)*g)%m*y,n.opacity);e.opacity(r,t*n.direction+p,c,n)}e.timeout=e.el&&setTimeout(v,~~(1e3/h))})()}return e},stop:function(){var t=this.el;if(t){clearTimeout(this.timeout);if(t.parentNode)t.parentNode.removeChild(t);this.el=undefined}return this},lines:function(t,e){var r=0,a=(e.lines-1)*(1-e.direction)/2,l;function u(t,i){return f(o(),{position:"absolute",width:e.length+e.width+"px",height:e.width+"px",background:t,boxShadow:i,transformOrigin:"left",transform:"rotate("+~~(360/e.lines*r+e.rotate)+"deg) translate("+e.radius+"px"+",0)",borderRadius:(e.corners*e.width>>1)+"px"})}for(;r<e.lines;r++){l=f(o(),{position:"absolute",top:1+~(e.width/2)+"px",transform:e.hwaccel?"translate3d(0,0,0)":"",opacity:e.opacity,animation:i&&s(e.opacity,e.trail,a+r*e.direction,e.lines)+" "+1/e.speed+"s linear infinite"});if(e.shadow)n(l,f(u("#000","0 0 4px "+"#000"),{top:2+"px"}));n(t,n(l,u(d(e.color,r),"0 0 1px rgba(0,0,0,.1)")))}return t},opacity:function(t,e,i){if(e<t.childNodes.length)t.childNodes[e].style.opacity=i}});function h(){function t(t,e){return o("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',e)}r.addRule(".spin-vml","behavior:url(#default#VML)");c.prototype.lines=function(e,i){var o=i.length+i.width,r=2*o;function s(){return f(t("group",{coordsize:r+" "+r,coordorigin:-o+" "+-o}),{width:r,height:r})}var a=-(i.width+i.length)*2+"px",l=f(s(),{position:"absolute",top:a,left:a}),u;function p(e,r,a){n(l,n(f(s(),{rotation:360/i.lines*e+"deg",left:~~r}),n(f(t("roundrect",{arcsize:i.corners}),{width:o,height:i.width,left:i.radius,top:-i.width>>1,filter:a}),t("fill",{color:d(i.color,e),opacity:i.opacity}),t("stroke",{opacity:0}))))}if(i.shadow)for(u=1;u<=i.lines;u++)p(u,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(u=1;u<=i.lines;u++)p(u);return n(e,l)};c.prototype.opacity=function(t,e,i,o){var n=t.firstChild;o=o.shadow&&o.lines||0;if(n&&e+o<n.childNodes.length){n=n.childNodes[e+o];n=n&&n.firstChild;n=n&&n.firstChild;if(n)n.opacity=i}}}var m=f(o("group"),{behavior:"url(#default#VML)"});if(!a(m,"transform")&&m.adj)h();else i=a(m,"animation");return c});
/* END Spinner Class */

/**
 * CoreLoader.js
 * -------------
 * fast responding SAPUI5 and OpenUI5 Core(-Library) Loader
 *
 * @author Danilo Vorpahl / Inwerken AG
 * @version 1.0
 *
 * @github https://github.com/InwerkenAG/ui5-CoreLoader.js
 */
var CoreLoader = (function () {

	var _spinnerOptions = [{ lines:16, length: 13, width: 1, radius: 12, speed: 1 },
	                       { lines:16, length: 13, width: 1, radius: 12, speed: 2 }];
	
	var _customCSS = 'html, body { height: 100%; width:100%; margin:0; }'
					+'#coreloader { display: block; box-sizing: border-box; z-index:16777270;top:0;bottom:0;left:0;right:0; min-height:100%;height:100%; text-align:center; background:#fff;'
					+'background-image: -moz-linear-gradient(top, rgba(255, 255, 255, 0.3) 0, rgba(0, 124, 192, 0.2) 100%); background-image: -ms-linear-gradient(top, rgba(255, 255, 255, 0.3) 0, rgba(0, 124, 192, 0.2) 100%);'
					+'background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0, rgba(0, 124, 192, 0.2) 100%); background-repeat: repeat; background-position: left top; background-size: auto; position: absolute;';
	
	// spinner object
	var _spinner = null;
	
	// function to execute when core is loaded 
	var _fnReady = null;
	
	// self state (1: loading; 2: coreLoaded; 3: call _fnReady function; 4: done!)
	var loaderState = null;
	
	
	/**
	 * get all "data-sap" attributes from script-Tag
	 * 
	 * @param   {Object} domElement coreLoader script-Tag
	 * @returns {Object} Object with Attributes for script-Tag
	 * 
	 * @private
	 * @function
	 */
    function getConfig(domElement) {
    	
		var oConfig = {};

		for(var attr in domElement.attributes) {
			var currentAttr = domElement.attributes[attr];
			if (currentAttr.name && currentAttr.name.lastIndexOf('data-sap')===0) {
				oConfig[currentAttr.name]=currentAttr.value;
			}
		}
		return oConfig;
    };
    
    /**
     * prepare the Document DOM, insert style
	 * 
	 * @private
	 * @function
     */
    function prepareDocument() {
    	
    	var head = document.head || document.getElementsByTagName('head')[0],
        	body = document.body || document.getElementsByTagName('body')[0];
        
        // style
        var styleTag = document.createElement('style');
    		styleTag.type = 'text/css';
    	
		if (styleTag.styleSheet) { styleTag.styleSheet.cssText = _customCSS; }
		else { styleTag.appendChild(document.createTextNode(_customCSS)); }
		
		head.appendChild(styleTag);

		// spinner
    	var spinnerDiv = document.createElement('div');    	
    		spinnerDiv.id  = 'coreloader';

    	body.appendChild(spinnerDiv);
		
    	// attach the Spinner
		_spinner = new Spinner(_spinnerOptions[0]).spin(spinnerDiv);
		_spinner.elm = spinnerDiv;
    };
    
    /**
     * load the Core (only once!)
	 *
	 * @private
	 * @function
     */
    function loadCore() {
    	
    	if(loaderState) return false;
    	
    	prepareDocument();
    	
		var coreLoaderScriptTag =  document.getElementById('util-coreloader');
		if(!coreLoaderScriptTag) throw "No Element with ID:'util-coreloader' found!";

		// get the original configuration
		var oConfig = getConfig(coreLoaderScriptTag);


		// loading begins
		loaderState = 1;
		var targetScriptTag = document.createElement('script');
		
		targetScriptTag.id   = 'sap-ui-bootstrap';
		targetScriptTag.type = 'text/javascript';
		targetScriptTag.src  = coreLoaderScriptTag.getAttribute('data-loader-src');
		
		targetScriptTag.onload =
		targetScriptTag.onreadystatechange = function() {
			
			if ( loaderState === 1 && (!this.readyState || this.readyState == 'complete') ){
				loaderState = 2;
				
				for(var i in _spinnerOptions[1]) _spinner.opts[i] = _spinnerOptions[1][i];
				_spinner.spin(_spinner.elm);
				
				if(_fnReady) {
					var fnWaitForCore = function() {
						if(!window.sap || !window.sap.ui) {
							alert('Do you use CacheBuster? This will not work, yet.')
							setTimeout(fnWaitForCore, 3000);
						}
						else {
							loaderState = 3;
							_fnReady();
						}
					}
					fnWaitForCore();
				}
				else loaderState = 4;

				waitForDone();
			}
		};
			
		for(var attr in oConfig) {
			targetScriptTag.setAttribute(attr,oConfig[attr]);
		}
		
		setTimeout(function(){
			coreLoaderScriptTag.parentElement.insertBefore(targetScriptTag, coreLoaderScriptTag);
			coreLoaderScriptTag.parentNode.removeChild(coreLoaderScriptTag);
		}(this));
		
		return true;
    };
	
    /**
     * wait for .ready() loop
	 *
	 * @private
	 * @function
     */
    function waitForDone() {
    	
    	if(loaderState !== 4) {
    		setTimeout(waitForDone,1000);
    	}
    	else {
    		setTimeout(function() {
    			$('#coreloader').fadeOut(300, function(){
    				$(this).delay(20).remove();
    			});
    		},500);
    	}
    };
    

    // attach event to run the CoreLoader
    document.onreadystatechange = function () {
    	var state = document.readyState;
    	if (state == 'interactive') {
    		// console.log('coreloader: waiting for Document readyState');

    	}
    	else if (state == 'complete') {
    		// console.log('coreloader: Document readyState complete');
    		loadCore();
    	}
    };
    
 
    return {
    	
    	ready: function() {
    		// everything should be ready now
    		loaderState = 4;
    		return true;
    	},
    	
    	onReadyState : function(fnExec) {
    		if(typeof(fnExec) == 'function') {
    			_fnReady = fnExec;
        		return true;
    		}
    		return false;
    	}
    };
    
})();
