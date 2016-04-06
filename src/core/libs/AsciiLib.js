namespace("core.tools.Ascii");
core.tools.Ascii = {
	encode : function(str){
		// check to see if param is a string
		if (typeof str == 'string' || str instanceof String) {
			//console.log("encoding data");
			//return (str + '').replace(/'/g, "&#39;").replace(/\\/g, "&#92;").replace(/\(/g, "&#40;").replace(/\)/g, "&#41;").replace(/=/g, "&#61;");
			return (str + '').replace(/'/g, "&#39;").replace(/\\/g, "&#92;").replace(/\(/g, "&#40;").replace(/\)/g, "&#41;");
			// Replace symbols with ASCII equivalent
			// Symbols: ' \ ( ) =
		} else {
			console.log("Cannot encode, it's not a string");
		}
    },
	encodeHtml : function(str){
		// check to see if param is a string
		if (typeof str == 'string' || str instanceof String) {
			//console.log("encoding data");
			return (str + '').replace(/</g, "&#60;").replace(/>/g, "&#62;");
			// Replace symbols with ASCII equivalent
			// Symbols: ' \ ( ) =
		} else {
			console.log("Cannot encode, it's not a string");
		}
    },
	decode : function(str){
		if (typeof str == 'string' || str instanceof String) {
			//console.log("decoding data");
			return (str + '').replace(/&#39;/g, "'").replace(/&#92;/g, "\\").replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&#61;/g, "=").replace(/&#60;/g, "<").replace(/&#62;/g, ">");
		} else {
			console.log("Cannot decode, it's not a string");
		}
    }
};	