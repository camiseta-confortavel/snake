'use strict';

const menu = document.querySelector('main');
const snakeColor = document.querySelector('#snakeColor');
const foodColor = document.querySelector('#foodColor');
const snakeSpeed = document.querySelector('#snakeSpeed');
const buttonPlay = document.querySelector('#buttonPlay');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const pads = document.querySelector('.mobile');
const panelGameOver = document.querySelector('.gameOver');
const panelPoints = document.querySelector('.panelPoints');
const buttonRestart = document.querySelector('#buttonRestart');

const game = {

    settings: {interval: null, intervalTime: null, size: 10},
    snake: [[0, 0]],
    food: [],
    keys: {w: false, a: false, s: false, d: false},
    currentKey: null,

    running: function() {
        this.settings.interval = setInterval(() => {
            this.clear();
            this.draw(this.snake, snakeColor.value);
            this.draw(this.food, foodColor.value);
            this.ifEat();
            this.ifHitHimself();
            this.followTrail(this.snake);
            this.choseDirection(this.currentKey);
            this.movement();
            this.outOfmap();
        }, this.settings.intervalTime);
    },

    clear: () => {     context.clearRect(0, 0, canvas.width, canvas.height);     },

    draw: function (entity, color) {
        context.fillStyle = color;
        for(let chunk of entity) context.fillRect(chunk[0], chunk[1], this.settings.size, this.settings.size);
    },

    movement: function() {
        if(this.keys['w']) this.snake[0][1] -= this.settings.size;
        if(this.keys['a']) this.snake[0][0] -= this.settings.size;
        if(this.keys['s']) this.snake[0][1] += this.settings.size;
        if(this.keys['d']) this.snake[0][0] += this.settings.size;
    },

    followTrail: (entity) => {     for(let index = entity.length - 1; index > 0; entity[index] = [...entity[--index]]);     },

    outOfmap: function() {
        if(this.snake[0][1] < 0) this.snake[0][1] = canvas.height - this.settings.size;
        if(this.snake[0][0] < 0) this.snake[0][0] = canvas.width - this.settings.size;
        if(this.snake[0][1] > canvas.height - this.settings.size) this.snake[0][1] = 0;
        if(this.snake[0][0] > canvas.width - this.settings.size) this.snake[0][0] = 0;
    },

    ifEat: function() {
        if(this.food.length > 0) if(this.snake[0][0] === this.food[0][0] && this.snake[0][1] === this.food[0][1]) {
            this.snake.push([0, 0]);
            this.food.pop();
            this.generateFood();
        }
    },

    generateFood: function() {
        let [x, y] = [Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)];
        this.food.push([x - x % this.settings.size, y - y % this.settings.size]);
    },

    initialDirection: function(key) {    for(let current of Object.keys(this.keys)) this.keys[current] = (current === key);    },

    choseDirection: function(key) {
        if(key === 'w' && !this.keys['s'] || key === 's' && !this.keys['w'] || key === 'a' && !this.keys['d'] || key === 'd' && !this.keys['a']) for(let pad of Object.keys(this.keys)) this.keys[pad] = (pad === key);
    },

    ifHitHimself: function() {
        for(let chunk = 1; chunk < this.snake.length; chunk++) if(this.snake[chunk][0] === this.snake[0][0] && this.snake[chunk][1] === this.snake[0][1]) this.gameOver();
    },

    gameOver: function() {
        clearInterval(this.settings.interval);
        panelGameOver.style.display = 'flex';
        panelPoints.innerHTML = `Pontos: ${this.snake.length}`;
    },

    configBody: () => {    document.body.style.display = 'block';    },

    generateCanvas: function() {
        let [widht, height] = [window.innerWidth - (window.innerWidth % this.settings.size), window.innerHeight - (window.innerHeight % this.settings.size)];

        let generate = value => {    canvas.style.width = `${value}px`;    canvas.style.height = `${value}px`;    }

        generate((widht < height ? widht : height));
    },

    start:  function() {
        menu.style.display = 'none';
        canvas.style.display = 'block';
        this.configBody();
        this.generateCanvas();
        this.initialDirection('d');
        this.settings.intervalTime = Number(snakeSpeed.value);
        this.generateFood();
        this.running();
    },

    restart: function() {
        this.clear();
        this.snake = [[0, 0]];
        this.food = [];
        this.generateFood();
        this.initialDirection('d');
        this.running();
        panelGameOver.style.display = 'none';
    }
}

buttonPlay.addEventListener('click', e => {     game.start();     });

for(let current of pads.children) current.addEventListener('click', e => {    game.currentKey = current.getAttribute('value');    });

window.addEventListener('keypress', e => {    if(Object.keys(game.keys).indexOf(e.key.toLowerCase()) !== -1) game.currentKey = e.key.toLowerCase();    });

buttonRestart.addEventListener('click', e => {    game.restart();    });