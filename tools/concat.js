importPackage(java.io);
importPackage(java.net);
importPackage(java.util);
importPackage(java.lang);

var BUILDCONFIG=null;

var Koncat = {
    Build: function(source, savePath){
    	var finished = false;
	    var reg 	 = /\/\/\=\s*require\s([0-9A-Za-z\-\_\.\/\\]*)/im; ///\'@require\s([0-9A-Za-z\-\_\.\/\\]*)\'/im;
	    var usages   = {};

        var code = (source instanceof File) ? 
        	Koncat.Read(source) : source;
        do {
        	code = code.replace(reg, function(fullmatch, namespace, index, match){
                var path = Koncat.ResolvePath(namespace);
                var file = Koncat.File(path);
                if (file) {
                	if(!usages[path]) {
                		BUILDCONFIG.Verbos && 
                		print("Scanning Loadpaths For: " + path);
						usages[path] = true;
						code = Koncat.Read(file) + "\n";
					} else {code=""}
				} else {
                    print("Unable to locate file: " + path);
                }
                return code;
            });
            finished = (!reg.test(code)) ? 1:0; 
        }
        while (!finished);
        return code
    },
    
    ResolvePath: function(nsPath){
        var path = (/\.js$/.test(nsPath)) ? 
        	nsPath : (nsPath.replace(/\./ig, "/") + ".js");
        return path;
    },
    
    Read: function(file){
        var stream, line, lineno, lines = [];
        if (!BufferedReader || !FileReader) {
            throw new Error("This operation requires Mozilla Rhino.");
        }
        stream = new BufferedReader(new FileReader(file));
        lineno = 1;
        while ((line = stream.readLine()) !== null) {
            lines.push(line);
        }
        stream.close();
        return lines.join("\n");
    },
    
    File: function(filename){
        filename = filename.replace(/\.js$/, "") + ".js";
      	
        var file, location, index = 0;
        while ((location = BUILDCONFIG.LoadPaths[index++])) {
            file = new File(location + "/", filename);
            //print("location: " + (location + "/", filename));
            if (file && file.isFile()) {
                break;
            }
		};
        return file;
    },
    
    DumpSource: function(data, destination){
        var directory, stream;
        if (!File || !BufferedWriter || !FileWriter) {
            throw new Error("This operation requires Mozilla Rhino.");
        }
        if (!(destination && destination instanceof File)) {
            destination = new File(destination);
        }
        destination = new File(destination).getCanonicalFile();
        directory = destination.getParent();
        if (!directory) {
            throw new Error("The destination directory '" + directory.getPath() + "' could not be created.");
        }
        stream = new BufferedWriter(new FileWriter(destination));
        stream.write(data);
        stream.close();
        return true;
    },
    
    MakeSourcePath : function(){
    	var sourceFileDir = new File(BUILDCONFIG.Output.SourcePath.substr(0,BUILDCONFIG.Output.SourcePath.lastIndexOf("/")+1)).mkdirs();
    	return sourceFileDir;
    },
    
    Compress : function(){
    	var OS = java.lang.System.getProperty("os.name").toLowerCase();
    	try {
            var cmd = "java -jar tools/yuicompressor-2.4.2.jar " + BUILDCONFIG.Output.SourcePath + " -o " + BUILDCONFIG.Output.CompressedPath + " --line-break 200 --nomunge --preserve-semi --disable-optimizations";
			(OS.indexOf("mac") >= 0) ? 
				runCommand("sh",  "-c", cmd) :
				runCommand("cmd", "/C", cmd);
        }
        catch (e) {
            if(BUILDCONFIG.Verbos){print("WARNING: Build OK, but unable to compress output.")}
        }
    },
    
    Log : function(){
    	var sourceFile = new File(BUILDCONFIG.Output.SourcePath).getCanonicalFile();
		var compressedFile = new File(BUILDCONFIG.Output.CompressedPath).getCanonicalFile();
		
		if (sourceFile && sourceFile.isFile()) {
			print("\nSUCCESSFULL");
			print("source >> " + BUILDCONFIG.Output.SourcePath + " -- " + (Math.round(sourceFile.length() / 1024)) + "KB");
		}
		
		if (compressedFile && compressedFile.isFile()) {
			if(BUILDCONFIG.Verbos){print("compressed >> " + BUILDCONFIG.Output.CompressedPath + " -- " + (Math.round(compressedFile.length() / 1024)) + "KB\n\n");}
		}
    },
    
    Configure : function(){
    	var configFile;
		try{configFile = new File(arguments[0]+"/", "-buildconfig.js");}catch(ex){}
		
		if(configFile.isFile() && configFile.exists()) {
			load(arguments[0] + "/-buildconfig.js");
			if(BUILDCONFIG.Verbos){print("using " + (arguments[0]+"/") + "-buildconfig.js")}
			
			for(var j=0; j<=BUILDCONFIG.LoadPaths.length-1; j++) {
				BUILDCONFIG.LoadPaths[j] = arguments[0] + "/" + BUILDCONFIG.LoadPaths[j];
			};
			BUILDCONFIG.Output.SourcePath =  arguments[0] + "/" + BUILDCONFIG.Output.SourcePath;
			BUILDCONFIG.Output.CompressedPath =  arguments[0] + "/" + BUILDCONFIG.Output.CompressedPath;
			BUILDCONFIG.ApplicationFolderName = arguments[0];
			if(!BUILDCONFIG.Input) {
				BUILDCONFIG.Input = arguments[0] + "/main.js";
			}
		}
		else {
			print("missing -buildconfig.js: " + arguments[0] + "/")
		}
    }
};


function main(p) {
	try{ 
		Koncat.Configure(p);
		var file = Koncat.File(BUILDCONFIG.Input);
		var newcode = Koncat.Build(file);
		Koncat.MakeSourcePath();
		Koncat.DumpSource(newcode, BUILDCONFIG.Output.SourcePath);
		Koncat.Compress();
		Koncat.Log();
	} catch(e) {
		print("BUILD ERROR:\n" + e.message);
	}
};

main(arguments[0]);
