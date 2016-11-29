var PORT = 3000;

var http = require('http');
var url=require('url');
var fs=require('fs');

var path=require('path');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
    target: 'http://10.10.3.68:8080',   //接口地址
    // 下面的设置用于https
    // ssl: {
    //     key: fs.readFileSync('server_decrypt.key', 'utf8'),
    //     cert: fs.readFileSync('server.crt', 'utf8')
    // },
    // secure: false
});


proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    console.log(err);
    res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    //var realPath = path.join("main-pages", pathname); // 指定根目录
    var realPath = path.join("./", pathname);
    
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    //判断如果是接口访问，则通过proxy转发
    if(pathname.indexOf("jupai/") > 0){
        proxy.web(request, response);
        return;
    }

    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    var resurl = request.url
                    if (resurl === '/') {
                        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', function(err, base){
                            if (err) {
                                return response.end(err.message)
                            }
                            response.writeHead(200, 'ok', {"content-Type": "text/html; charset=utf-8"})
                            response.end(base)
                        })
                    } else if (resurl.indexOf('.css') > -1){
                        var saftPath = path.join(__dirname, resurl)
                        fs.readFile(saftPath, function(err, data){
                            if (err) {
                                return response.end(err.message)
                            }
                            response.writeHead(200, 'ok', {"content-Type": "text/css; charset=utf-8"})
                            response.end(data)
                        })
                    } else {
                        var saftPath = path.join(__dirname, resurl)
                        fs.readFile(saftPath, function(err, data){
                            if (err) {
                                return response.end(err.message)
                            }
                            
                            response.end(data)
                        })
                    }
                    
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});






server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

mine = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml",
  "woff": "application/x-woff",
  "woff2": "application/x-woff2",
  "tff": "application/x-font-truetype",
  "otf": "application/x-font-opentype",
  "eot": "application/vnd.ms-fontobject"
};
