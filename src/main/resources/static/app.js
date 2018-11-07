var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    function showGreeting(message) {
        $("#greetings").append("<tr><td>" + message + "</td></tr>");
    }

    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        


        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint"', function (eventbody) {
                var point =JSON.parse(eventbody.body);
                addPointToCanvas(point);
  
            });
        });

    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            
            //websocket connection

            connectAndSubscribe();
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);            
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            //alert("The POints, in x:"+px+"point in y: "+py);
            var dibujo= document.getElementById("canvas");
            var lienzo = dibujo.getContext("2d");
            lienzo.beginPath();
            lienzo.arc(px,py,1,0,2*Math.PI);
            lienzo.stroke();
            stompClient.send("/topic/newpoint", {}, JSON.stringify(pt)); 
     
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        },

    };
    
    function sendPoint(x,y) {
        stompClient.send("/topic/newpoint", {}, JSON.stringify({x:10,y:10}));
    }

    function showObject(pt) {
        stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));
        console.log("Que es"+pt.toString());
    }



})();
