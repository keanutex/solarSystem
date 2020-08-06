
//JSON Data taken from https://gist.github.com/IDdesigner/25073bdf92b8bcae7c0b224bb0decb2e
//colour palettes taken from https://www.color-hex.com
//Orbit speed taken from https://nssdc.gsfc.nasa.gov/planetary/factsheet/

var Xcentre, Ycentre;
var sunSize;
var time;
var D3rotation;
planets = [];
var count = 101;
var randoms = [];
tempColours = [];
var zoomIndex = 0;
var speedIndex = 0;
var pauseValue = 1;
var whiteScheme = false;

//Load JSON File in Data
function preload() {
  data = loadJSON("myFile.json");
}

function setup() {
  time = 0;
  sunSize = 20;
  canvasSizeX = 2400;
  canvasSizeY = 1200;
  sizeScale = 0.001;
  distanceScale = 0.9;
  speedScale = 500;
  Xcentre = canvasSizeX / 2;
  Ycentre = canvasSizeY / 2;
  D3rotation = true;
  createCanvas(canvasSizeX, canvasSizeY);

  frameRate(60);


  //references created to input values and assigns default values
  nameInput = document.getElementsByName("planetName")[0];
  sizeInput = document.getElementsByName("size")[0];
  distanceFromSun = document.getElementsByName("distance")[0];
  speedInput = document.getElementsByName("speed")[0];

  colourPicker1 = document.getElementsByName("colour1")[0];
  colourPicker1.value = "#5d7190";
  colourPicker2 = document.getElementsByName("colour2")[0];
  colourPicker2.value = "#98a65f";
  colourPicker3 = document.getElementsByName("colour3")[0];
  colourPicker3.value = "#a48974";
  moonsInput = document.getElementsByName("moons")[0];
  nameInput.value = "Example Planet";
  sizeInput.value = 62756;
  distanceFromSun.value = 500;
  moonsInput.value = 5;
  speedInput.value = 1000;

  //Changes label colour based on colour scheme
  if (whiteScheme) {
    document.getElementById("nameLabel").style.color = 'black';
    document.getElementById("sizeLabel").style.color = 'black';
    document.getElementById("colourLabel").style.color = 'black';
    document.getElementById("speedLabel").style.color = 'black';
    document.getElementById("distanceLabel").style.color = 'black';
    document.getElementById("moonsLabel").style.color = 'black';
  } else {
    document.getElementById("nameLabel").style.color = 'white';
    document.getElementById("sizeLabel").style.color = 'white';
    document.getElementById("colourLabel").style.color = 'white';
    document.getElementById("speedLabel").style.color = 'white';
    document.getElementById("distanceLabel").style.color = 'white';
    document.getElementById("moonsLabel").style.color = 'white';
  }

  //fills an array of Planets objects from the JSON file, then adds moon Objects to the Planet Objects
  for (num in data) {

    tempColours[0] = data[num].colours.colour1;
    tempColours[1] = data[num].colours.colour2;
    tempColours[2] = data[num].colours.colour3;

    planets[num] = new Planet(data[num].distanceFromSun * distanceScale, data[num].distanceFromSun * distanceScale, data[num].diameter * sizeScale, data[num].planet, tempColours, data[num].distanceFromSun, data[num].moons, (1 / data[num].speed) * speedScale);
    tempColours = [];
  }
  for (var i = 0; i < planets.length; i++) {
    planets[i].FillMoons();
  }

  //made pluto a bit bigger because it wasn't noticeable
  planets[8].diameter *= 10;

}

//Colour scheme function to change switch colors
function ToggleColourScheme() {
  whiteScheme = !whiteScheme;

  if (whiteScheme) {
    document.getElementById("nameLabel").style.color = 'black';
    document.getElementById("sizeLabel").style.color = 'black';
    document.getElementById("colourLabel").style.color = 'black';
    document.getElementById("speedLabel").style.color = 'black';
    document.getElementById("distanceLabel").style.color = 'black';
    document.getElementById("moonsLabel").style.color = 'black';
  } else {
    document.getElementById("nameLabel").style.color = 'white';
    document.getElementById("sizeLabel").style.color = 'white';
    document.getElementById("colourLabel").style.color = 'white';
    document.getElementById("speedLabel").style.color = 'white';
    document.getElementById("distanceLabel").style.color = 'white';
    document.getElementById("moonsLabel").style.color = 'white';
  }
}

//Changes the value of pauseValue, which the Planet objects use to determine rotation speed
function PauseSpeed() {
  if (pauseValue == 1) {
    pauseValue = 0;
  } else {
    pauseValue = 1;
  }
}

//increase the planet objects speed factor
function IncreaseSpeed() {
  for (var i = 0; i < planets.length; i++) {
    planets[i].speed += planets[i].speed * 0.1;
    speedIndex++;
  }
}
//decrease the planet objects speed factor
function DecreaseSpeed() {
  for (var i = 0; i < planets.length; i++) {
    planets[i].speed -= planets[i].speed * 0.1;
    speedIndex--;
  }
}

function draw() {

  //Zooms into the canvas using the planets sizes
  if (keyIsDown(81) && zoomIndex < 1000) {
    for (var i = 0; i < planets.length; i++) {
      planets[i].x *= 1.01;
      planets[i].y *= 1.01;
      planets[i].diameter *= 1.01;
      planets[i].radius = planets[i].diameter / 2;
      sunSize += 0.01;
      zoomIndex++;
    }
  }

  if (keyIsDown(87) && zoomIndex > -10000) {
    for (var i = 0; i < planets.length; i++) {
      planets[i].x /= 1.01;
      planets[i].y /= 1.01;
      planets[i].diameter /= 1.01;
      planets[i].radius = planets[i].diameter / 2;
      sunSize -= 0.01;
      zoomIndex--;
    }
  }


  //Changes colour of background based on colour scheme
  if (whiteScheme) {
    background(255);
  } else {
    background('#003366');
  }


  DrawSun();



  if (count < 100) {
    Stars(randoms);
    count++;
  } else {

    count = 0;

    for (var i = 0; i < 20; i++) {
      randoms[i] = random();
    }
    Stars(randoms);
  }

  for (var i = 0; i < planets.length; i++) {
    planets[i].DrawOrbit();
  }

  //Used to draw moons over the planets when needed
  for (var i = 0; i < planets.length; i++) {
    for (var j = 0; j < planets[i].moon.length; j++) {
      if (!planets[i].moon[j].overPlanet) {
        planets[i].moon[j].DisplayMoon();

      }
    }
  }
  //Displays the planets from the array and updates the moons reference to the planets
  for (var i = 0; i < planets.length; i++) {
    planets[i].Display();
    planets[i].Rollover(mouseX, mouseY);
    for (var j = 0; j < planets[i].moon.length; j++) {
      planets[i].moon[j].planetX = planets[i].Xpos;
      planets[i].moon[j].planetY = planets[i].Ypos;
    }


  }
  //used to draw moons under the planets when needed
  for (var i = 0; i < planets.length; i++) {
    for (var j = 0; j < planets[i].moon.length; j++) {
      if (planets[i].moon[j].overPlanet) {
        planets[i].moon[j].DisplayMoon();
      }
    }
  }

  noFill();
  if (whiteScheme) {
    stroke(0);
  } else {
    stroke(255);
  }

  strokeWeight(4);
  //border for canvas;
  rect(0, 0, canvasSizeX, canvasSizeY);

}
//functions used to add a new planet from the users input values
function AddPlanet() {

  //unzooms the canvas when a new planet is added to maintain scale and distance ratios
  while (zoomIndex < 0) {
    for (var i = 0; i < planets.length; i++) {
      planets[i].x *= 1.01;
      planets[i].y *= 1.01;
      planets[i].diameter *= 1.01;
      planets[i].radius = planets[i].diameter / 2;
      sunSize += 0.01;
      zoomIndex++;
    }
  }

  while (zoomIndex > 0) {
    for (var i = 0; i < planets.length; i++) {
      planets[i].x /= 1.01;
      planets[i].y /= 1.01;
      planets[i].diameter /= 1.01;
      planets[i].radius = planets[i].diameter / 2;
      sunSize -= 0.01;
      zoomIndex--;
    }
  }
  //resets planets speed to maintain speed ratios between planets
  while (speedIndex < 0) {
    for (var i = 0; i < planets.length; i++) {
      planets[i].speed += planets[i].speed * 0.1;
      speedIndex++;
    }
  }

  while (speedIndex > 0) {
    for (var i = 0; i < planets.length; i++) {
      planets[i].speed -= planets[i].speed * 0.1;
      speedIndex--;
    }
  }


  tempColours2 = [];
  tempColours2[0] = colourPicker1.value;
  tempColours2[1] = colourPicker2.value;
  tempColours2[2] = colourPicker3.value;
  //creates a new planet object in the planets arrays and uses the input values to fill the constructor
  planets.push(new Planet(distanceFromSun.value * distanceScale, distanceFromSun.value * distanceScale, sizeInput.value * sizeScale, nameInput.value, tempColours2, distanceFromSun.value, moonsInput.value, (1 / speedInput.value) * speedScale));
  //adds moons to the newly created planet
  planets[planets.length - 1].FillMoons();
  //empties the array of colours
  tempColours2 = [];
}

//function to add stars randomly on the canvas
function Stars(rand) {
  stroke(255);
  strokeWeight(1);
  fill(255);

  for (var i = 0; i < rand.length; i++) {
    ellipse(rand[i] * width, rand[i + 1] * height, 1, 1);
  }
}

//draws a sun at the centre of the screen
function DrawSun() {
  if (whiteScheme) {
    stroke(0);
  } else {
    stroke(255);
  }

  fill('#ffff00');
  ellipse(Xcentre, Ycentre, sunSize, sunSize);
}

//Planet class which all created planets use. Allows the program to keep a references of mainly their position and size
class Planet {
  constructor(x, y, diameter, name, colour, distanceFromSun, noOfMoons, speed) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = diameter / 2;
    this.name = name;
    this.colour = colour;
    this.over = false;
    this.distanceFromSun = distanceFromSun;
    this.noOfMoons = noOfMoons;
    this.moon = [];
    this.Xpos = 0;
    this.Ypos = 0;
    this.speed = speed;


  }
  //function used to detect whether the mouse is over the planet or not
  Rollover(px, py) {
    let d = dist(px, py, this.Xpos, this.Ypos);
    this.over = d < this.radius;
  }

  DrawOrbit() {
    //orbit path
    noFill();
    if (whiteScheme) {
      stroke(this.colour[1]);
    } else {
      stroke(255);
    }

    strokeWeight(2);
    ellipse(Xcentre, Ycentre, this.x * 2, this.y * 2);
  }

  //function used to draw the planets along an orbit
  Display() {
    //calculates the x and y position of the planet using the distance from the sun as the radius and a parametric equation based on the framecount of the canvas
    this.Xpos = (this.x) * cos(radians(frameCount * this.speed * pauseValue)) + Xcentre;
    this.Ypos = (this.y) * sin(radians(frameCount * this.speed * pauseValue)) + Ycentre;
    strokeWeight(1);
    if (whiteScheme) {
      stroke(0);
    } else {
      stroke(255);
    }
    //fills the planets with 3 different colours based on differently drawn arcs which make up a circle
    fill(this.colour[0]);
    ellipse(this.Xpos, this.Ypos, this.diameter, this.diameter);

    fill(this.colour[1]);
    arc(this.Xpos, this.Ypos, this.diameter, this.diameter, PI * 1.9, PI * 1.1, CHORD);

    fill(this.colour[2]);
    arc(this.Xpos, this.Ypos, this.diameter, this.diameter, PI * 0.1, PI * 0.9, CHORD);

    //displays the planets name if the mouse is over the planet
    if (this.over) {
      if (whiteScheme) {
        fill(0);
      } else {
        fill(255);
      }

      textAlign(CENTER);
      text(this.name, this.Xpos, this.Ypos + this.diameter + 10);
    }

    this.UpdateMoons();
  }

  //adds moons to the planet based on how many moons there are on the object
  FillMoons() {
    for (var i = 0; i < this.noOfMoons; i++) {
      var randomNum = Math.random() * 0.5
      this.moon[i] = new Moon(this.diameter / 10, 0, this.x, this.y, this.radius);
    }
  }
  //keeps the moons to scale with the planet
  UpdateMoons() {
    for (var i = 0; i < this.moon.length; i++) {
      this.moon[i].diameter = this.diameter / 10;
      this.moon[i].planetRadius = this.radius;

    }
  }
  //runs through all the moons on the planet and displays them using the moon display function
  DisplayMoons() {

    stroke(0);
    noFill();
    strokeWeight(1);

    for (var i = 0; i < this.noOfMoons; i++) {
      this.moon[i].DisplayMoon();
    }
  }
}

//moon class
class Moon {
  constructor(diameter, colour, planetX, planetY, planetRadius) {
    this.diameter = diameter;
    this.radius = diameter / 2;
    this.planetX = planetX;
    this.planetY = planetY;
    this.planetRadius = planetRadius;
    this.randomAngle = Math.random() * 360;
    this.randomDistance = 1;
    this.randomNum = (Math.random() * 0.5) + 0.01;
    this.Xpos = 0;
    this.Ypos = 0;
    var value = Math.random() * 0xFF | 0;
    var grayscale = (value << 16) | (value << 8) | value;
    this.colour = '#' + grayscale.toString(16);
    this.randomEllipse = (Math.random() * 5) + 1;
    this.randEllipseChance = Math.random();
    this.overPlanet = false;
    this.angle = 0;
  }


  DisplayMoon() {
    strokeWeight(1);
    stroke(0);
    if (whiteScheme) {
      fill(this.colour);
    } else {

      fill(255);
    }

    //defines a random angle along an ellipse path to create variety in rotation
    this.angle = radians(frameCount * this.randomNum) + this.randomAngle;

    if (D3rotation) {

      if (this.randEllipseChance < 0.5) {//checks whether the ellipse should be scale along the x or y axis
        this.Xpos = this.randomDistance * this.planetRadius * 1.5 / this.randomEllipse * cos((this.angle)) + this.planetX;
        this.Ypos = this.randomDistance * this.planetRadius * 1.5 * sin((this.angle)) + this.planetY;
        if (cos(this.angle) < 0) {//checks whether the moon should be drawn infront of or behind the planet
          this.overPlanet = true;
        } else {
          this.overPlanet = false;
        }
      } else {
        this.Xpos = this.randomDistance * this.planetRadius * 1.5 * cos((this.angle)) + this.planetX;
        this.Ypos = this.randomDistance * this.planetRadius * 1.5 / this.randomEllipse * sin((this.angle)) + this.planetY;

        if (sin((this.angle)) < 0) {
          this.overPlanet = true;
        } else {
          this.overPlanet = false;
        }
      }


      //draws the moon based on previous parameters
      ellipse(this.Xpos, this.Ypos, this.planetRadius / 10, this.planetRadius / 10);

    } else {
      //draws them simply if the 3D rotation option isn't picked
      this.Xpos = this.randomDistance * this.planetRadius * 1.5 * cos((this.angle)) + this.planetX;
      this.Ypos = this.randomDistance * this.planetRadius * 1.5 * sin((this.angle)) + this.planetY;
      ellipse(this.Xpos, this.Ypos, this.planetRadius / 10, this.planetRadius / 10);
    }
  }
}

