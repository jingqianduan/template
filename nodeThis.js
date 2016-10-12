var http = require('http')
var fs = require('fs')
var path = require('path')


<<<<<<< HEAD

=======
>>>>>>> 95e781a036e716c9ab32c6c7bfbf6a5b575227d0
var server = http.createServer(function(request, response) {
    var url = request.url
    if (url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', function(err, base){
            if (err) {
                return response.end(err.message)
            }
            response.writeHead(200, 'ok', {"content-Type": "text/html; charset=utf-8"})
            response.end(base)
        })
    } else if (url.indexOf('.css') > -1){
        var saftPath = path.join(__dirname, url)
        fs.readFile(saftPath, function(err, data){
            if (err) {
                return response.end(err.message)
            }
            response.writeHead(200, 'ok', {"content-Type": "text/css; charset=utf-8"})
            response.end(data)
        })
    } else {
        var saftPath = path.join(__dirname, url)
        fs.readFile(saftPath, function(err, data){
            if (err) {
                return response.end(err.message)
            }
            response.end(data)
        })
    }
})
<<<<<<< HEAD


=======
>>>>>>> 95e781a036e716c9ab32c6c7bfbf6a5b575227d0
server.listen(2000,function(){
    console.log("localServer Ready http://127.0.0.1:2000")
         
})






