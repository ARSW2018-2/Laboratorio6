var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var seson=null;
    
    var poligonObject='/topic/newpolygon.';
    
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
    var setSsion= function(sesion){
        console.info("QUE ASIGNA"+sesion);
        seson=sesion; 
    }
    var getSesion=function (){
        console.info("QUE RERTORNA"+seson);
        return{
            
          seson  
        };
    }
    
    publishPoint= function(px,py,seson){
            var pt=new Point(px,py);       
            console.log("puntos"+px);  
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            //alert("The POints, in x:"+px+"point in y: "+py);
            var dibujo= document.getElementById("canvas");
            var lienzo = dibujo.getContext("2d");
            lienzo.beginPath();
            lienzo.arc(px,py,1,0,2*Math.PI);
            lienzo.stroke();
            console.info("LA SESION ES"+seson);
            stompClient.send("/app/newpoint"+'.'+seson, {}, JSON.stringify(pt)); 
        }

    var connectAndSubscribe = function (seson) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            console.log("sesion que es "+seson);
            stompClient.subscribe('/topic/newpoint"'+'.'+ seson, function (eventbody) {
                var point =JSON.parse(eventbody.body);
                addPointToCanvas(point);
  
            });
        });

    };
    
    

    return {
        
         
         conectar: function(sesion){
            console.log("sesion que es "+sesion);  
            if(sesion===null||sesion=='' ){
                console.log("EEROR CUANTICO");
                alert("Id de sesion invalido");
                return;
            }
            seson= sesion;
            ser=null;
            setSsion(sesion);
            console.log("sesion que es "+seson);  
            connectAndSubscribe(seson);
            
            //$('#sendNum').prop('disabled',true);
            //$('#conec').prop('disabled',false);            
        },

        init: function () {
            var can = document.getElementById("canvas");
            
                canvas.addEventListener("mousedown",function (e){
                    point=getMousePosition(e);

                    var temp=getSesion();
                    if(temp==null || temp==''){
                        
                        alert("Id de sesion invalido");
                        return; 
                    }else{
                       publishPoint(point.x,point.y,temp);
                }
                    

                })
        
            //websocket connection

            //connectAndSubscribe();
        },

        
        publishPoint: function(px,py){
            var pt=new Point(px,py);       
            console.log("puntos"+px);  
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);
            //alert("The POints, in x:"+px+"point in y: "+py);
            var dibujo= document.getElementById("canvas");
            var lienzo = dibujo.getContext("2d");
            lienzo.beginPath();
            lienzo.arc(px,py,1,0,2*Math.PI);
            lienzo.stroke();
            console.info("LA SESION ES"+seson);
            stompClient.send("/topic/newpoint"+'.'+seson, {}, JSON.stringify(pt)); 
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        },

    };
    

})();
