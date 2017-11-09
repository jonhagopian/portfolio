var toutLibrary = {

	channel : '', // channel is selected via test page, usually 'hp - homepage' or 'ros - run of site'
	resources_path : '', // path to all resources according to environment, estabilished during setup
	adVars : '', // variables set from adtag, values entered on test page for standard/tout.html for iframe
	links : [], // set via double click formatting applied to urls from channels array

	setup : function(dfltChannel, adVars, channels) {
		// register adVars from tout.js
		var adHost = window.location.host; 
		this.adVars = adVars;
		this.resources_path = '//subscription-assets.timeinc.com/prod/assets/themes/magazines/SUBS/templates/velocity/site/' + adVars.name + '/resources/';
		if (/cmbuild-cmtools.ecommerce.timeinc.com|amazonaws.com/.test(adHost)){
			adHost = adHost + '/themes/magazines/';
			this.resources_path = this.resources_path.replace('subscription-assets.timeinc.com/prod/assets/themes/magazines/', adHost);
		} else if (/qa\/assets/.test(window.location.href)) {
			this.resources_path = this.resources_path.replace('.com/prod/assets/','.com/qa/assets/');
		}
		this.channel = adVars.TCMchannel;
		if (!(this.channel in channels)) {
			this.channel = dfltChannel;
		}
		this.buildLinks(channels);
	},

	buildLinks : function(channels) {
		for (var i = 0; i < channels[this.channel].length; i++) {
			this.links[i] = this.formatForDoubleClick(channels[this.channel][i], true);
		};
	},

	formatForDoubleClick : function(url, subsTracking) {
		var tcm_dfpGet = this.adVars.clickTracking.dartGet,
		extra_qs = "",
		qs_param, qs_val;
		if (tcm_dfpGet != "%c") {
			url = tcm_dfpGet + url.replace("://","%3a%2f%2f");
		}
		if (subsTracking) {
			for (qs_param in this.adVars.subs3Tracking) {
				qs_val = this.adVars.subs3Tracking[qs_param];
				if (/^%%PATTERN/.test(qs_val) || /^%s$/.test(qs_val)) {
					qs_val = "0000";
				}
				if (qs_val == "") qs_val = "null";
				extra_qs += "&" + qs_param + "=" + qs_val;
			}
		}
		// the first "&" should be a "?" unless the url provided already has a "?" in it
		if (url.indexOf("?") < 0) {
			extra_qs = extra_qs.replace("&", "?");
		}
		return url + extra_qs;
	},

	exposeTout : function(ad) { // exposes tcmAds object to parent window if iFrame
		tcmAds[this.adVars.name] = ad;
		if (this.inIframe()) {
			if (typeof window.parent.tcmAds !== 'undefined') {
				window.parent.tcmAds[this.adVars.name] = tcmAds[this.adVars.name];
			} else {
				window.parent.tcmAds = tcmAds;
			}
		}
	},

	// Breakout of iFrame, creative is moved from iFrame to parent
	getIframe : function() {
		return window.parent.document.getElementById(window.frameElement.id);
	},

	inIframe : function() {
		return (window.frameElement) ? true : false;
	},

	getFrameContents : function() {
		var iFrame =  window.parent.document.getElementById(window.frameElement.id);
		var iFrameBody;
		if ( iFrame.contentDocument ) { // FF
			iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
		}
		else if ( iFrame.contentWindow ) { // IE
			iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
		}
		return iFrameBody.innerHTML;
	},

	hide : function(iframe) {
		iframe.width = 0;
		iframe.height = 0;
		iframe.style.display = "none";
	},

	breakout : function(callback) {
		if (!this.inIframe()) { return; }
		var iframe = this.getIframe();
		var iFrame_container = iframe.parentNode;
		var new_div = document.createElement('div');
		new_div.id = 'breakoutDiv';
		new_div.innerHTML = this.getFrameContents();
		// Should tout insist on breakout after opening body tag place 'body' as parameter else it will appear after iframe it has originated from, this may help solve html/css layer issues with tout behind elements
		if (callback == 'body') {
			console.log('tout breakoutDiv after opening body tag');
			var theBody = window.parent.document.getElementsByTagName('body')[0];
			var topBodyLoc = theBody.childNodes[0];
			theBody.insertBefore(new_div, topBodyLoc);
		} else {
			iFrame_container.appendChild(new_div);
		}
		this.hide(iframe);
		// If we place our tout in iFrame and that is within the .com iFrame ALSO hide .com iFrame
		if (iFrame_container.nodeName == "IFRAME") {
			this.hide(iFrame_container);
		}

	},
	// End Breakout of iFrame

	// Common components
	createInput : function(inputName, inputPlaceholder, inputMaxlength) {
		var input = "<input type='text' name='" + inputName + "' placeholder='" + inputPlaceholder + "' maxlength='" + inputMaxlength + "' />";
		return input;
	}

}

