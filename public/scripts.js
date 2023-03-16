// scripts.js

let angle = 0;
let petalCount = 12;
let flowers = [];
let fibonacciSequence = [1, 1, 2, 3, 5, 8, 13];
let currentFibIndex = 0;
let goldenAngle = 137.5;
let scale = 70;
let oscillationSpeed = 1.01;

let timeSlider;
let petalSlider;

let numSpirals = 3;
let minSpirals = 3;
let flowerAppearanceInterval = 180;
let flowerState = 'ascending';

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    colorMode(HSB);
    noStroke();

    timeSlider = createSlider(1, 100, 50);
    timeSlider.id('timeSlider');
    timeSlider.position(10, 10);

    petalSlider = createSlider(4, 50, 12);
    petalSlider.id('petalSlider');
    petalSlider.position(10, 40);

    initializeSpirals();
}

function initializeSpirals() {
    for (let i = 0; i < numSpirals; i++) {
        for (let j = 0; j < fibonacciSequence.length; j++) {
            let centerX = random(width);
            let centerY = random(height);
            let startingAngle = (360 / numSpirals) * i;

            let radius = scale * sqrt(fibonacciSequence[j]);
            let flowerAngle = j * goldenAngle + startingAngle;
            let flowerX = centerX + cos(flowerAngle) * radius;
            let flowerY = centerY + sin(flowerAngle) * radius;

            flowers.push(new Flower(fibonacciSequence[j] * 10, flowerX, flowerY));
        }
    }
}

function draw() {
    background(0);

    flowers.forEach((flower) => {
        flower.update();
        flower.display();
    });

    if (frameCount % flowerAppearanceInterval === 0) {
        if (flowerState === 'ascending') {
            addFlower();
        } else {
            removeFlower();
        }
    }

    // Update flower appearance interval and petal count based on slider input
    flowerAppearanceInterval = map(timeSlider.value(), 1, 100, 360, 30);
    petalCount = petalSlider.value();
}

function addFlower() {
    if (currentFibIndex < fibonacciSequence.length) {
        for (let j = 0; j < numSpirals; j++) {
            let centerX = random(width);
            let centerY = random(height);
            let startingAngle = (360 / numSpirals) * j;

            let radius = scale * sqrt(fibonacciSequence[currentFibIndex]);
            let flowerAngle = currentFibIndex * goldenAngle + startingAngle;
            let flowerX = centerX + cos(flowerAngle) * radius;
            let flowerY = centerY + sin(flowerAngle) * radius;

            flowers.push(new Flower(fibonacciSequence[currentFibIndex] * 10, flowerX, flowerY));
        }
        currentFibIndex++;

        if (currentFibIndex === fibonacciSequence.length) {
            flowerState = 'descending';
        }
    }
}

function removeFlower() {
    if (flowers.length > minSpirals * numSpirals) {
        for (let j = 0; j < numSpirals; j++) {
            flowers.pop();
        }
        currentFibIndex--;

        if (currentFibIndex === 0) {
            flowerState = 'ascending';
        }
    } else {
        flowerState = 'ascending';
    }
}

function drawPetal(x, y, size, baseHue) {
    let petalWidth = size / 4;
    let petalHeight = size;
    let hue = (baseHue + frameCount) % 255;

    fill(hue, 255, 255);
    ellipse(x, y - petalHeight / 2, petalWidth, petalHeight);
}

class Flower {
    constructor(size, x, y) {
        this.size = size;
        this.pos = createVector(x, y);
        this.oscillation = 0;
        this.baseHue = random(255);
    }

    update() {
        this.oscillation += oscillationSpeed;
        angle = map(sin(this.oscillation), -1, 1, -5, 5);
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y);
        for (let i = 0; i < petalCount; i++) {
            push();
            rotate((360 / petalCount) * i + angle);
            drawPetal(0, -this.size / 2, this.size, this.baseHue);
            pop();
        }
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}