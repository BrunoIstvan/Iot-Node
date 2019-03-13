var express = require('express');
var app = express();

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.3.8.37')

var five = require("johnny-five");
var board = new five.Board({'port': 'COM3'});

var vermelho; 
var amarelo;
var verde;

board.on("ready", function() {

  // Create a standard `led` component instance
  vermelho = new five.Led(10);
  amarelo = new five.Led(9);
  verde = new five.Led(8);

  // "blink" the led in 500ms
  // on-off phase periods
  //led.blink(1000);

});


app.put('/led/ligar', (req, res) => {
    vermelho.stop();
    vermelho.on();
    client.publish('led_status_bruno_app_02', '1')
    res.send("Led Ligado");
});

app.put('/led/desligar', (req, res) => {
    vermelho.stop();
    vermelho.off();
    client.publish('led_status_bruno_app_02', '0')
    res.send("Led Desligado");
});

app.put('/led/blink', (req, res) => {
    vermelho.stop();
    vermelho.blink(500);
    res.send("Led Piscando");
});

app.put('/semaforo/ligar', (req, res) => {
    vermelho.stop();
    amarelo.stop();
    verde.stop();

    setTimeout(acende, 5000, 'VO');
    
    res.send("Semáforo Ligado");
});

function acende(cor) {

    vermelho.stop();    
    amarelo.stop();
    verde.stop();

    vermelho.off();    
    amarelo.off();
    verde.off();

    if(cor == 'VO') { vermelho.on(); setTimeout(acende, 5000, 'VE'); }
    if(cor == 'VE') { verde.on(); setTimeout(acende, 5000, 'AO'); }
    if(cor == 'AO') { amarelo.on(); setTimeout(acende, 2500, 'VO'); }

}

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});