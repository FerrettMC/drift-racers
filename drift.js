const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
const headerRef = document.getElementsByTagName("header")[0];
const instructionsRef = document.getElementsByClassName("instructions")[0];
const carRef = document.getElementsByClassName("car")[0];
const carRef2 = document.getElementsByClassName("car2")[0];
const arrowUpRef = document.getElementsByClassName("arrow-up")[0];
const WRef = document.getElementsByClassName("arrow-up")[0];
const ARef = document.getElementsByClassName("arrow-left")[0];
const SRef = document.getElementsByClassName("arrow-right")[0];
const DRef = document.getElementsByClassName("arrow-down")[0];
const arrowDownRef = document.getElementsByClassName("arrow-down")[0];
const arrowRightRef = document.getElementsByClassName("arrow-right")[0];
const arrowLeftRef = document.getElementsByClassName("arrow-left")[0];
const mobileControlsRef = document.getElementsByClassName("mobile-controls")[0];
const clearTireMarksRef = document.getElementsByClassName("freedrive")[0];
const carWidth = carRef.offsetWidth;
const carHeight = carRef.offsetHeight;
const carWidth2 = carRef2.offsetWidth;
const carHeight2 = carRef2.offsetHeight;
document.querySelector('.rect').style.display = "none";
document.querySelector('.performance').style.display = "none";
document.querySelector('.mute').style.display = "none";
document.querySelector('.dif').style.display = "none";
document.querySelector('.freedrive').style.display = "none";
document.querySelector('.changetrack').style.display = "none";
document.querySelector('.players').style.display = "none";
document.querySelector('.cleartracks').style.display = "none";
document.querySelector('.size').style.display = "none";
let score = 0;
let settings = false;
let started = false;
let audio = false;
let started2 = false;
let hasTouchScreen = false;
let showMobileControls = false;
let freedrive = false;
let hideTitle = false;
let lapCooldown = false;
let lapCooldown2 = false;
let shown = true;
const music = document.getElementById("music");
// Environmental data
const dragFactor = 0.98;
const frictionFactor = 0.94;
let tireMarkCooldown = 0;
let bestscore = 0;
let track = 1;
let laps = 0;
let laps2 = 0;
let performance = false;
let twoplayer = false;
let speedlabel = 0;
// car
const car = {
  xPos: canvas.width / 2,
  yPos: 90,
  xSpeed: 0,
  ySpeed: 0,
  speed: 2,
  driftAngle: 0,
  angle: -90,
  angularVelocity: 0,
  isTurning: false,
  isTurningLeft: false,
  isTurningRight: false,
  isReversing: false,
};
// reset for car
const resetPosition = {
  x: canvas.width / 2,
  speed: 2,
  y: 90,
  angle: -90
};
let level = "medium";
document.querySelector('.dif').style.backgroundColor = "rgba(255, 239, 61, 1)";
let carMaxSpeed = 6; // Default speed

function setDifficulty(level) {
  if (level === "easy") carMaxSpeed = 4;
  else if (level === "medium") carMaxSpeed = 5;
  else if (level === "hard") carMaxSpeed = 7;
}
setDifficulty(level);

// Constant car data
const carConstants = {
  maxReverseSpeed: -4,
  accelerationFactor: 0.2,
  decelerationFactor: 0.1,
  driftFactor: 0.75,
  turnFactor: 0.15,
};
// automatically sets canvas size (for boundaries to work correctly)
canvas.width = 1280;
canvas.height = 720;

// track boundaries for each track
const trackBounds1 = {
  left: 262,
  right: canvas.width - 200,
  top: 25,
  bottom: canvas.height - 90,

  leftmid: 390,
  topmid: 150,
  bottommid: canvas.height - 207,
  rightmid: canvas.width - 475,

  leftsmall: 780,
  rightsmall: canvas.width - 327,
  bottomsmall: canvas.height -410,
  topsmall: 150,

  leftapart: 922,
  rightapart: canvas.width - 180,
  bottomapart: canvas.height -90,
  topapart: 415,
};


const trackBounds2 = {
  
  left: 300,
  right: canvas.width - 230,
  top: 42,
  bottom: canvas.height - 110,

  leftmid: 440,
  topmid: 185,
  bottommid: canvas.height - 245,
  rightmid: canvas.width - 457,

  leftsmall: 730,
  rightsmall: canvas.width - 370,
  bottomsmall: canvas.height -245,
  topsmall: 405,

  leftapart: 955,
  rightapart: canvas.width - 180,
  bottomapart: canvas.height -445,
  topapart: 70,
};

const trackBounds3 = {
  left: 216,
  right: canvas.width - 163,
  top: 63,
  bottom: canvas.height - 107,

  leftmid: 365,
  topmid: 205,
  bottommid: canvas.height - 440,
  rightmid: canvas.width - 305,
  
  leftsmall: 888,
  rightsmall: canvas.width - 313,
  bottomsmall: canvas.height -250,
  topsmall: 230,
  

  leftleft: 367,
  rightleft: canvas.width - 832,
  bottomleft: canvas.height -250,
  topleft: 230,
  

  leftright: 600,
  rightright: canvas.width - 540,
  bottomright: canvas.height -80,
  topright: 421,
  
};

const lapBounds1 = {
  right: canvas.width - 490,
  left: 750,
  top: 25,
  bottom: canvas.width - 1110,
};

const lapBounds2 = {
  right: canvas.width - 490,
  left: 750,
  top: 50,
  bottom: canvas.width - 1080,
};

const lapBounds3 = {
  right: canvas.width - 490,
  left: 750,
  top: 70,
  bottom: canvas.width - 1055,
};

// function to draw and test track boundaries
function drawTrackBoundsOutline() {
  ctx.strokeStyle = "rgba(0, 255, 0, 0.6)"; // translucent green outline
  ctx.lineWidth = 2;

  const width = lapBounds3.right - lapBounds3.left;
  const height = lapBounds3.bottom - lapBounds3.top;

  ctx.strokeRect(lapBounds3.left, lapBounds3.top, width, height);
}


// funct to get a random number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
canvas.addEventListener('mousedown', (event) => {
  if (!twoplayer) {
    controller.Space.pressed = true;
  }
});

canvas.addEventListener('mouseup', (event) => {
  controller.Space.pressed = false;

});

// updates track when button is pressed (or goes into freedrive mode)
const updateBackground = () => {
if (freedrive) {
  let randomInteger = getRandomInt(1, 5);
  if (randomInteger == 1) {
    document.body.style.backgroundImage = "url('freedrive-track.png')";
  }
  else if (randomInteger == 2) {
    document.body.style.backgroundImage = "url('freedrive3.png')";
  }
  else if (randomInteger == 3) {
    document.body.style.backgroundImage = "url('freedrive4.png')";
  }
  else if (randomInteger == 4) {
    document.body.style.backgroundImage = "url('freedrive2.png')";
  }
  else if (randomInteger == 5) {
    document.body.style.backgroundImage = "url('freedrive5.png')";
  }
  document.body.classList.add("freedrive-mode");
} else {
  document.body.classList.remove("freedrive-mode");
  document.querySelector(".player2-laps").style.display = "block";

  switch (track) {
    case 1:
      document.body.style.backgroundImage = "url('racetrack.png')";
      break;
    case 2:
      document.body.style.backgroundImage = "url('racetrack2.png')";
      break;
    case 3:
      document.body.style.backgroundImage = "url('racetrack3.png')";
      break;
    default:
      document.body.style.backgroundImage = "url('racetrack.png')"; // fallback
      break;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
};

document.querySelector('.speed').addEventListener('click', () => {
  if (shown) {
    shown = false;
    document.querySelector(".speedcar").style.display = "none";
  } else {
    document.querySelector(".speedcar").style.display = "block";
    shown = true;
  }
});

// sets the track

  document.querySelector('.changetrack').addEventListener('click', () => {
    if (!freedrive) {
      if (track == 1) {
        track = 2;
        updateBackground()
        car.xPos = resetPosition.x;
        car.yPos = 110;
        car2.xPos = resetPosition2.x;
        car2.yPos = 115;
      } else if (track == 2) {
        track = 3;
        updateBackground()
        car.xPos = resetPosition.x;
        car.yPos = 130;
        car2.xPos = resetPosition2.x;
        car2.yPos = 135;
      } else if (track == 3) {
        track = 1;
        updateBackground()
        car.xPos = resetPosition.x;
        car.yPos = resetPosition.y;
        car2.xPos = resetPosition2.x;
        car2.yPos = resetPosition2.y;
      }
    } else {
      let randomInteger = getRandomInt(1, 4);
      if (randomInteger == 1) {
        document.body.style.backgroundImage = "url('freedrive-track.png')";
      }
      else if (randomInteger == 2) {
        document.body.style.backgroundImage = "url('freedrive3.png')";
      }
      else if (randomInteger == 3) {
        document.body.style.backgroundImage = "url('freedrive4.png')";
      }
      else if (randomInteger == 4) {
        document.body.style.backgroundImage = "url('freedrive2.png')";
      }
      document.body.classList.add("freedrive-mode");
    } 
    laps = 0;
  });

// settings button, hides and unhides certain elements
document.querySelector('.settings').addEventListener('click', () => {
  if (settings) {
    settings = false;
    headerRef.style.display = "none";
    hideTitle = true; 
    document.querySelector('.size').style.display = "none";
    document.querySelector('.performance').style.display = "none";
    document.querySelector('.rect').style.display = "none";
    document.querySelector('.dif').style.display = "none";
    document.querySelector('.mute').style.display = "none";
    document.querySelector('.freedrive').style.display = "none";
    document.querySelector('.changetrack').style.display = "none";
    document.querySelector('.players').style.display = "none";
    document.querySelector('.cleartracks').style.display = "none";
    document.querySelector('.settings').style.backgroundColor = "rgba(179, 179, 179, 0.86)";
  } else {
    settings = true;
    headerRef.style.display = "flex";
    hideTitle = false; 
    document.querySelector('.size').style.display = "block";
    document.querySelector('.performance').style.display = "block";
    document.querySelector('.mute').style.display = "block";
    document.querySelector('.dif').style.display = "block";
    document.querySelector('.rect').style.display = "block";
    document.querySelector('.freedrive').style.display = "block";
    document.querySelector('.changetrack').style.display = "block";
    document.querySelector('.players').style.display = "block";
    document.querySelector('.cleartracks').style.display = "block";
    document.querySelector('.settings').style.backgroundColor = "rgba(40, 255, 47, 1)";
  }
});

// settings if esc key pressed
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    if (settings) {
      settings = false;
      headerRef.style.display = "none";
      hideTitle = true; 
      document.querySelector('.size').style.display = "none";
      document.querySelector('.performance').style.display = "none";
      document.querySelector('.mute').style.display = "none";
      document.querySelector('.rect').style.display = "none";
      document.querySelector('.dif').style.display = "none";
      document.querySelector('.freedrive').style.display = "none";
      document.querySelector('.changetrack').style.display = "none";
      document.querySelector('.players').style.display = "none";
      document.querySelector('.cleartracks').style.display = "none";
      document.querySelector('.settings').style.backgroundColor = "rgba(179, 179, 179, 0.86)";
    } else {
      settings = true;
      headerRef.style.display = "flex";
      hideTitle = false; 
      document.querySelector('.size').style.display = "block";
      document.querySelector('.mute').style.display = "block";
      document.querySelector('.performance').style.display = "block";
      document.querySelector('.dif').style.display = "block";
      document.querySelector('.rect').style.display = "block";
      document.querySelector('.freedrive').style.display = "block";
      document.querySelector('.changetrack').style.display = "block";
      document.querySelector('.players').style.display = "block";
      document.querySelector('.cleartracks').style.display = "block";
      document.querySelector('.settings').style.backgroundColor = "rgba(40, 255, 47, 1)";
    }
  }
});

// Makes the performance button green when toggled
document.querySelector('.performance').addEventListener('click', () => {
  if (performance) {
    
    performance = false;
    if (!twoplayer) {
      document.querySelector(".speedcar").style.display = "block";
    }
    document.querySelector('.performance').style.backgroundColor = "rgba(255, 255, 255, 1)";
  } else {
    
    performance = true;
    
    document.querySelector(".speedcar").style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector('.performance').style.backgroundColor = "rgba(40, 255, 47, 1)";
  }
});

// changes car speed when pressed
document.querySelector('.dif').addEventListener('click', () => {
  if (level == "easy") {
    level = "medium";
    setDifficulty(level);
    document.querySelector('.dif').style.backgroundColor = "rgba(255, 239, 61, 1)";
    document.querySelector(".dif").textContent = "Speed: Medium";
  } else if (level == "medium") {
    level = "hard";
    setDifficulty(level);
    document.querySelector('.dif').style.backgroundColor = "rgba(250, 56, 35, 1)";
    document.querySelector(".dif").textContent = "Speed: Fast";
  } else {
    level = "easy";
    document.querySelector('.dif').style.backgroundColor = "rgba(122, 255, 61, 1)";
    setDifficulty(level);
    document.querySelector(".dif").textContent = "Speed: Slow";
  }
});
let size = 1;
document.querySelector('.size').addEventListener('click', () => {
  const buttons = document.querySelectorAll('.control-button');

  if (size === 1) {
    size = 2;
    document.querySelector('.size').style.backgroundColor = "yellow";
    buttons.forEach(btn => {
      btn.style.width = "6.5rem";
      btn.style.height = "6.5rem";
    });
  } else if (size === 2) {
    size = 3;
    document.querySelector('.size').style.backgroundColor = "limegreen";
    buttons.forEach(btn => {
      btn.style.width = "8rem";
      btn.style.height = "8rem";
    });
  } else {
    size = 1;
    document.querySelector('.size').style.backgroundColor = "red";
    buttons.forEach(btn => {
      btn.style.width = "5rem";
      btn.style.height = "5rem";
    });
  }
});


// changes amt of players
document.querySelector('.players').addEventListener('click', () => {
  if (twoplayer) {
    document.querySelector(".speedcar").style.display = "block";
    twoplayer = false;
    document.querySelector('.mobile-controls').style.display = "flex";
    started2 = false;
    laps2 = 0;
    car2.xPos = resetPosition2.x;
    car2.yPos = resetPosition2.y;
    car2.speed = 2;
    car2.driftAngle = 0;
    car2.angle = resetPosition2.angle;
    car2.angularVelocity = 0;
    document.querySelector(".players").textContent = "Players: 1";
  } else {
    twoplayer = true;
    document.querySelector(".speedcar").style.display = "none";
    document.querySelector('.mobile-controls').style.display = "none";
    document.querySelector(".players").textContent = "Players: 2";
  }
});

// button to clear tracks
document.querySelector('.cleartracks').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.querySelector('.mute').addEventListener('click', () => {
  
  if (audio) {
    audio = false;
    music.pause();
    document.querySelector('.mute').style.backgroundColor = "rgba(250, 56, 35, 1)";

  } else {
    audio = true;
    music.play();
    document.querySelector('.mute').style.backgroundColor = "rgba(122, 255, 61, 1)";
  }
});

//animates the button
const button = document.querySelector('.changetrack');
const button1 = document.querySelector('.freedrive');
const button2 = document.querySelector('.performance');
const button3 = document.querySelector('.dif')
const button4 = document.querySelector('.players');
const button5 = document.querySelector('.cleartracks');
const button6 = document.querySelector('.settings');
const button7 = document.querySelector('.mute');
const button8 = document.querySelector('.size');
button.addEventListener('click', () => {
  button.classList.add('pop-effect');

  // Remove the class after animation ends so it can be triggered again
  setTimeout(() => {
    button.classList.remove('pop-effect');
  }, 200); // match animation duration
});

button1.addEventListener('click', () => {
  button1.classList.add('pop-effect');

  // Remove the class after animation ends so it can be triggered again
  setTimeout(() => {
    button1.classList.remove('pop-effect');
  }, 200); // match animation duration
});

button2.addEventListener('click', () => {
  button2.classList.add('pop-effect');

  // Remove the class after animation ends so it can be triggered again
  setTimeout(() => {
    button2.classList.remove('pop-effect');
  }, 200); // match animation duration
});

button3.addEventListener('click', () => {
  button3.classList.add('pop-effect');

  setTimeout(() => {
    button3.classList.remove('pop-effect');
  }, 200); 
});

button4.addEventListener('click', () => {
  button4.classList.add('pop-effect');

  setTimeout(() => {
    button4.classList.remove('pop-effect');
  }, 200); 
});

button5.addEventListener('click', () => {
  button5.classList.add('pop-effect');

  setTimeout(() => {
    button5.classList.remove('pop-effect');
  }, 200); 
});
button6.addEventListener('click', () => {
  button6.classList.add('pop-effect');

  setTimeout(() => {
    button6.classList.remove('pop-effect');
  }, 200); 
});
button7.addEventListener('click', () => {
  button7.classList.add('pop-effect');

  setTimeout(() => {
    button7.classList.remove('pop-effect');
  }, 200); 
});

button8.addEventListener('click', () => {
  button8.classList.add('pop-effect');

  setTimeout(() => {
    button8.classList.remove('pop-effect');
  }, 200); 
});
// draws red X
function drawRedX(x, y, size = 20) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x - size / 2, y - size / 2);
  ctx.lineTo(x + size / 2, y + size / 2);
  ctx.moveTo(x + size / 2, y - size / 2);
  ctx.lineTo(x - size / 2, y + size / 2);
  ctx.stroke();
}

// Determine if device is mobile
if ("maxTouchPoints" in navigator) {
  hasTouchScreen = navigator.maxTouchPoints > 0;
}



// Display touch controls for mobile
if (hasTouchScreen) {
  instructionsRef.innerHTML = "Drift and Race! Use space and arrow keys. Don't slow too much or get off the track. Press Free Drive to drive freely. (Use fullscreen on a computer for best gameplay)67(Game may run differently on larger screens)";

  mobileControlsRef.style.display = "flex";

  window.oncontextmenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  
  // boring controller stuff that needs to be here lol
  if (!twoplayer) {
    arrowUpRef.addEventListener("touchstart", () => {
        controller.Space.pressed = true;
    });
  }
  if (!twoplayer) {
    arrowUpRef.addEventListener("touchend", () => {
      
        controller.Space.pressed = false;
      
    });
  }
  arrowDownRef.addEventListener("touchstart", () => {
    if (started) {
      controller.ArrowDown.pressed = true;
    }
  });

  arrowDownRef.addEventListener("touchend", () => {
    
    controller.ArrowDown.pressed = false;
  });

  arrowRightRef.addEventListener("touchstart", () => {
    controller.ArrowRight.pressed = true;
  });

  arrowRightRef.addEventListener("touchend", () => {
    controller.ArrowRight.pressed = false;
  });

  arrowLeftRef.addEventListener("touchstart", () => {
    controller.ArrowLeft.pressed = true;
  });

  arrowLeftRef.addEventListener("touchend", () => {
    controller.ArrowLeft.pressed = false;
  });
} else {
  instructionsRef.innerHTML = "Drift and Race! Use space and arrow keys. Don't slow too much or get off the track. Press Free Drive to drive freely. (Use fullscreen on a computer for best gameplay) (Game may run differently on larger screens)";
}

// Tests if the window is big enough to run the game smoothly
setInterval(() => {
  if (window.innerWidth < 1100 || window.innerHeight < 600) {
    alert("This game works in fullscreen and/or on a larger screen.");
  }
}, 10000); // 10000 ms = 10 seconds



const renderCar = () => {
  // Move and rotate the car (div)
  carRef.style.transform = `translate(${car.xPos}px, ${car.yPos}px) rotate(${
    car.angle + car.driftAngle
  }deg)`;
  document.addEventListener("keydown", (e) => {
  });
  // Conditionally render tire marks (when accelerating at low speeds or drifting)
  if (!performance && !twoplayer) {
    if (
      (car.speed > 1 && Math.abs(car.driftAngle) > 10) ||
      (controller.Space.pressed && car.speed < 4) ||
      (controller.ArrowUp.pressed && car.speed < 4) ||
      (controller.ArrowDown.pressed && car.speed > -2)
    ) {
      ctx.fillStyle = "hsl(0 0% 100% / 75%)";

      // Calculate back tire positions and add a mark
      
      ctx.fillRect(
        car.xPos -
          Math.cos(
            (Math.PI / 180) * (car.angle + car.driftAngle) + (3 * Math.PI) / 2
          ) *
            10 +
          Math.cos((Math.PI / 180) * (car.angle + car.driftAngle) + Math.PI) * 7 +
          10,
        car.yPos -
          Math.sin(
            (Math.PI / 180) * (car.angle + car.driftAngle) + (3 * Math.PI) / 2
          ) *
            10 +
          Math.sin((Math.PI / 180) * (car.angle + car.driftAngle) + Math.PI) * 7 +
          20,
        2,
        2
      );

      ctx.fillRect(
        car.xPos -
          Math.cos(
            (Math.PI / 180) * (car.angle + car.driftAngle) + (3 * Math.PI) / 2
          ) *
            10 +
          Math.cos((Math.PI / 180) * (car.angle + car.driftAngle) + 2 * Math.PI) *
            7 +
          10,
        car.yPos -
          Math.sin(
            (Math.PI / 180) * (car.angle + car.driftAngle) + (3 * Math.PI) / 2
          ) *
            10 +
          Math.sin((Math.PI / 180) * (car.angle + car.driftAngle) + 2 * Math.PI) *
            7 +
          20,
        2,
        2
      );
    }
  }  
  // Displays the score
  document.querySelector(".score-display").textContent = `Score: ${score}`;

};


// car functions
const accelerate = () => {
  if (car.speed < carMaxSpeed) {
    car.speed += carConstants.accelerationFactor;
  }
};

const decelerate = () => {
  if (car.speed > carConstants.maxReverseSpeed && started) {
    car.speed -= carConstants.decelerationFactor;
  }
};

const left = () => {
  car.isTurning = true;
  car.angularVelocity -=
    carConstants.turnFactor * (car.speed / carMaxSpeed) * 2;
};

const right = () => {
  car.isTurning = true;
  car.angularVelocity +=
    carConstants.turnFactor * (car.speed / carMaxSpeed) * 2;
};
// Car 2
const accelerate2 = () => {
  if (car2.speed < carMaxSpeed) {
    car2.speed += carConstants.accelerationFactor;
  }
};

const decelerate2 = () => {
  if (car2.speed > carConstants.maxReverseSpeed && started2) {
    car2.speed -= carConstants.decelerationFactor;
  }
};

const left2 = () => {
  car2.isTurning = true;
  car2.angularVelocity -=
    carConstants.turnFactor * (car2.speed / carMaxSpeed) * 2;
};

const right2 = () => {
  car2.isTurning = true;
  car2.angularVelocity +=
    carConstants.turnFactor * (car2.speed / carMaxSpeed) * 2;
};

// Controller to allow for simultaneous keypresses
const controller = {
  
  ArrowDown: { pressed: false, func: decelerate },
  ArrowLeft: { pressed: false, func: left },
  ArrowRight: { pressed: false, func: right },
  Space: { pressed: false, func: accelerate },
  ArrowUp: { pressed: false, func: accelerate },
};

//listens for keys pressed 
document.addEventListener("keydown", (e) => {
  if (controller[e.code]) controller[e.code].pressed = true;
  if (controller2[e.code]) controller2[e.code].pressed = true;
});

document.addEventListener("keyup", (e) => {
  if (controller[e.code]) controller[e.code].pressed = false;
  if (controller2[e.code]) controller2[e.code].pressed = false;
});



document.addEventListener("keyup", (e) => {
  if (Object.keys(controller).includes(e.key)) {
    controller[e.key].pressed = false;
  }
});

// turns freedrive button green when toggled
clearTireMarksRef.addEventListener("click", () => {
  if (freedrive) {
    document.querySelector('.freedrive').style.backgroundColor = "rgba(255, 255, 255, 1)";
    freedrive = false;
    updateBackground();
  }
  else {
    document.querySelector('.freedrive').style.backgroundColor = "rgba(40, 255, 47, 1)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    freedrive = true;
    laps = 0;
    updateBackground();
  }
});




// updates the car

const updateCar = () => {
  speedlabel = Math.abs(Math.round(car.speed * 10 * (carMaxSpeed * .2)));
  document.querySelector(".speed").innerHTML = `Speed:<br>${speedlabel}mph`;
  if (!settings) {
    Object.keys(controller).forEach((key) => {
      if (controller[key].pressed) {
        if (key === "Space" && twoplayer) return;
        controller[key].func();

        if (!hideTitle) {
          headerRef.style.display = "none";
          hideTitle = true; 
        }
      

      }
    });
    absy = Math.abs(car.angle);
    document.querySelector(".speedcar").style.top = (car.yPos - 25) + "px";
    document.querySelector(".speedcar").style.left = (car.xPos - 19) + "px";
    document.querySelector(".speedcar").textContent = `${speedlabel}mph`;
    if (twoplayer) {
      document.querySelector(".bestscore").textContent = `Best Score: 0`;
      document.querySelector(".prevscore").textContent = `Previous Score: 0`;
    }
    
    car.isReversing = car.speed >= 0 ? false : true;

    // Apply drag and update speed and angle
    car.angularVelocity *= frictionFactor;
    if (!car.isReversing)
      car.driftAngle += carConstants.driftFactor * car.angularVelocity;
    car.driftAngle *= frictionFactor;
    car.angle += car.angularVelocity;
    car.speed =
      car.speed * dragFactor -
      (car.isReversing ? -1 : 1) *
        ((Math.abs(car.driftAngle) * car.speed) / 1000);

    // Calculate vertical and horizontal speeds
    car.xSpeed =
      Math.sin((Math.PI / 180) * (car.angle - car.driftAngle)) *
      car.speed *
      (car.isTurning ? frictionFactor : 1);
    car.ySpeed =
      Math.cos((Math.PI / 180) * (car.angle - car.driftAngle)) *
      car.speed *
      (car.isTurning ? frictionFactor : 1);

    // Update coordinates and handle driving off the canvas/screen
    car.xPos += car.xSpeed;
    if (car.xPos > canvas.width) {
      car.xPos = 0;
    } else if (car.xPos < 0) {
      car.xPos = canvas.width;
    }

    car.yPos -= car.ySpeed;
    if (car.yPos > canvas.height) {
      car.yPos = 0;
    } else if (car.yPos < 0) {
      car.yPos = canvas.height;
    }

    const isDrifting = Math.abs(car.driftAngle) > 10 && car.speed > 1;
    //1st track
    const offTrack1 =
    car.xPos < trackBounds1.left ||
    car.xPos > trackBounds1.right ||
    car.yPos < trackBounds1.top ||
    car.yPos > trackBounds1.bottom ||
    (
      car.xPos > trackBounds1.leftmid &&
      car.xPos < trackBounds1.rightmid &&
      car.yPos < trackBounds1.bottommid &&
      car.yPos > trackBounds1.topmid
    ) ||
    (
      car.xPos > trackBounds1.leftsmall &&
      car.xPos < trackBounds1.rightsmall &&
      car.yPos < trackBounds1.bottomsmall &&
      car.yPos > trackBounds1.topsmall
    ) ||
    (
      car.xPos > trackBounds1.leftapart &&
      car.xPos < trackBounds1.rightapart &&
      car.yPos < trackBounds1.bottomapart &&
      car.yPos > trackBounds1.topapart
    );
  //2nd track
  const offTrack2 =
    car.xPos < trackBounds2.left ||
    car.xPos > trackBounds2.right ||
    car.yPos < trackBounds2.top ||
    car.yPos > trackBounds2.bottom ||
    (
      car.xPos > trackBounds2.leftmid &&
      car.xPos < trackBounds2.rightmid &&
      car.yPos < trackBounds2.bottommid &&
      car.yPos > trackBounds2.topmid
    ) ||
    (
      car.xPos > trackBounds2.leftsmall &&
      car.xPos < trackBounds2.rightsmall &&
      car.yPos < trackBounds2.bottomsmall &&
      car.yPos > trackBounds2.topsmall
    ) ||
    (
      car.xPos > trackBounds2.leftapart &&
      car.xPos < trackBounds2.rightapart &&
      car.yPos < trackBounds2.bottomapart &&
      car.yPos > trackBounds2.topapart
    );

  //3rd track
  const offTrack3 =
    car.xPos < trackBounds3.left ||
    car.xPos > trackBounds3.right ||
    car.yPos < trackBounds3.top ||
    car.yPos > trackBounds3.bottom ||
    (
      car.xPos > trackBounds3.leftmid &&
      car.xPos < trackBounds3.rightmid &&
      car.yPos < trackBounds3.bottommid &&
      car.yPos > trackBounds3.topmid
    ) ||
    (
      car.xPos > trackBounds3.leftsmall &&
      car.xPos < trackBounds3.rightsmall &&
      car.yPos < trackBounds3.bottomsmall &&
      car.yPos > trackBounds3.topsmall
    ) ||
    (
      car.xPos > trackBounds3.leftleft &&
      car.xPos < trackBounds3.rightleft &&
      car.yPos < trackBounds3.bottomleft &&
      car.yPos > trackBounds3.topleft
    )
    ||
    (
      car.xPos > trackBounds3.leftright &&
      car.xPos < trackBounds3.rightright &&
      car.yPos < trackBounds3.bottomright &&
      car.yPos > trackBounds3.topright
    );


    const lapcheck1 = 
      car.xPos > lapBounds1.left &&
      car.xPos < lapBounds1.right &&
      car.yPos < lapBounds1.bottom &&
      car.yPos > lapBounds1.top
      
    const lapcheck2 = 
      car.xPos > lapBounds2.left &&
      car.xPos < lapBounds2.right &&
      car.yPos < lapBounds2.bottom &&
      car.yPos > lapBounds2.top

    const lapcheck3 = 
      car.xPos > lapBounds3.left &&
      car.xPos < lapBounds3.right &&
      car.yPos < lapBounds3.bottom &&
      car.yPos > lapBounds3.top

    if (track === 1 && lapcheck1 && !lapCooldown && !freedrive) {
      laps += 1;
      document.querySelector(".player1-laps").textContent = `Player 1 Laps: ${laps}`;
      lapCooldown = true;

      setTimeout(() => {
        lapCooldown = false;
      }, 1000); // 1 second cooldown
    }
    if (track === 2 && lapcheck2 && !lapCooldown && !freedrive) {
      laps += 1;
      document.querySelector(".player1-laps").textContent = `Player 1 Laps: ${laps}`;
      lapCooldown = true;

      setTimeout(() => {
        lapCooldown = false;
      }, 1000); // 1 second cooldown
    }

    if (track === 3 && lapcheck3 && !lapCooldown && !freedrive) {
      laps += 1;
      document.querySelector(".player1-laps").textContent = `Player 1 Laps: ${laps}`;
      lapCooldown = true;

      setTimeout(() => {
        lapCooldown = false;
      }, 1000); // 1 second cooldown
    }

    
    if (controller.Space.pressed || controller.ArrowUp.pressed) {
      
      if (car.speed >= 2) {
        started = true;
      }
      
    }
    // constants for the drifting stuff
    const driftMeterRef = document.querySelector(".drift-meter-fill");
    const driftIntensity = Math.min(Math.abs(car.driftAngle), 45); // cap at 45°
    const meterPercent = ((driftIntensity + 1) * 1.8) + carMaxSpeed * 1.1 * car.speed;
    
    // drift meter (if performance is off)
    if (!performance && (!twoplayer)){
      document.querySelector('.drift-meter-container').style.height = "300px";
      driftMeterRef.style.height = `${meterPercent}%`;
    }
    else {
      document.querySelector('.drift-meter-container').style.height = "0px";
    }

    // starts over when the car is off the track
    if (!freedrive && started == true) {
      if (offTrack1 && track == 1) {
        started = false;
        laps = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRedX(car.xPos + 15, car.yPos + 20);
        
        car.xPos = resetPosition.x;
        car.yPos = resetPosition.y;
        car.speed = 2;
        
        
        car.driftAngle = 0;
        car.angle = resetPosition.angle;
        car.angularVelocity = 0;
        document.querySelector(".prevscore").textContent = `Previous Score: ${score}`;
        if (score > bestscore) {
          document.querySelector(".bestscore").textContent = `Best Score: ${score}`;
          bestscore = score;
        }
        score = 0;
        document.querySelector(".score-display").textContent = `Score: ${score}`;

      }
      if (offTrack2 && track == 2) {
        started = false;
        laps = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRedX(car.xPos + 15, car.yPos + 20);
        
        car.xPos = resetPosition.x;
        car.yPos = 110;
        car.speed = 2;
        
        
        car.driftAngle = 0;
        car.angle = resetPosition.angle;
        car.angularVelocity = 0;
        document.querySelector(".prevscore").textContent = `Previous Score: ${score}`;
        if (score > bestscore) {
          document.querySelector(".bestscore").textContent = `Best Score: ${score}`;
          bestscore = score;
        }
        score = 0;
        document.querySelector(".score-display").textContent = `Score: ${score}`;

      }
      if (offTrack3 && track == 3) {
        started = false;
        laps = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRedX(car.xPos + 15, car.yPos + 20);
        
        car.xPos = resetPosition.x;
        car.yPos = 130;
        car.speed = 2;
        
        
        car.driftAngle = 0;
        car.angle = resetPosition.angle;
        car.angularVelocity = 0;
        document.querySelector(".prevscore").textContent = `Previous Score: ${score}`;
        if (score > bestscore) {
          document.querySelector(".bestscore").textContent = `Best Score: ${score}`;
          bestscore = score;
        }
        score = 0;
        document.querySelector(".score-display").textContent = `Score: ${score}`;

      }
    }


    // Restarts when the car slows too slow
    if (!freedrive && started == true) {
      if (car.speed < 2 && driftIntensity <= 25) {
      started = false;
      laps = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRedX(car.xPos + 15, car.yPos + 20);
      if (track == 1){
        car.xPos = resetPosition.x;
        car.yPos = resetPosition.y;
      }
      if (track == 2) {
        car.xPos = resetPosition.x;
        car.yPos = 110;
      }
      if (track == 3) {
        car.xPos = resetPosition.x;
        car.yPos = 130;
      }
      car.speed = resetPosition.speed; // or set to 5 directly
      car.driftAngle = 0;
      car.angle = resetPosition.angle;
      car.angularVelocity = 0;
      document.querySelector(".prevscore").textContent = `Previous Score: ${score}`;
      if (score > bestscore) {
          document.querySelector(".bestscore").textContent = `Best Score: ${score}`;
          bestscore = score;
        }
      score = 0;
      document.querySelector(".score-display").textContent = `Score: ${score}`;
      }
    }
    
    document.querySelector(".player1-laps").textContent = `Player 1 Laps: ${laps}`;

    // calculate score
    if (isDrifting) {
      if (!freedrive && car.speed > 4 && !twoplayer) {
        score += Math.floor(Math.abs(car.driftAngle) * car.speed * 0.015);
        
      }
    }
    // Turn direction signalling
    if (car.angularVelocity > 0) {
      car.isTurningRight = true;
      car.isTurningLeft = false;
    } else if (car.angularVelocity < 0) {
      car.isTurningRight = false;
      car.isTurningLeft = true;
    }

    car.isTurning = false;
  }

};


// CAR TWO CODE HERE

const car2 = {
  xPos: canvas.width / 2,
  yPos: 95,
  xSpeed: 0,
  ySpeed: 0,
  speed: 2,
  driftAngle: 0,
  angle: -90,
  angularVelocity: 0,
  isTurning: false,
  isTurningLeft: false,
  isTurningRight: false,
  isReversing: false,
};
// reset for car
const resetPosition2 = {
  x: canvas.width / 2,
  speed: 2,
  y: 95,
  angle: -90
};

const controller2 = {
  
  KeyS: { pressed: false, func: decelerate2 },
  KeyA: { pressed: false, func: left2 },
  KeyD: { pressed: false, func: right2 },
  KeyW: { pressed: false, func: accelerate2 },
};


// boring controller stuff that needs to be here lol
WRef.addEventListener("touchstart", () => {
  controller2.KeyW.pressed = true;
});

WRef.addEventListener("touchend", () => {
  controller2.KeyW.pressed = false;
});



SRef.addEventListener("touchend", () => {
  
  controller2.KeyS.pressed = false;
});

SRef.addEventListener("touchstart", () => {
  
  controller2.KeyS.pressed = true;
});

DRef.addEventListener("touchstart", () => {
    controller2.KeyD.pressed = true;
  
});

DRef.addEventListener("touchend", () => {
  controller2.KeyD.pressed = false;
});

ARef.addEventListener("touchstart", () => {
  controller2.KeyA.pressed = true;
});

ARef.addEventListener("touchend", () => {
  controller2.KeyA.pressed = false;
});

const renderCar2 = () => { 
  // Move and rotate the car (div) 
  carRef2.style.transform = `translate(${car2.xPos}px, ${car2.yPos}px) rotate(${
    car2.angle + car2.driftAngle
  }deg)`;
  document.addEventListener("keydown", (e) => {
  });
  
  // Conditionally render tire marks (when accelerating at low speeds or drifting)
  if (!performance) {
    if (
      (car2.speed > 1 && Math.abs(car2.driftAngle) > 10) ||
      (controller2.KeyW.pressed && car2.speed < 4) ||
      (controller2.KeyS.pressed && car2.speed > -2)
    ) {
      ctx.fillStyle = "hsl(0 0% 100% / 75%)";

      /*
      ctx.fillRect(
        car2.xPos -
          Math.cos(
            (Math.PI / 180) * (car2.angle + car2.driftAngle) + (3 * Math.PI) / 2
          ) *
            10 +
          Math.cos((Math.PI / 180) * (car2.angle + car2.driftAngle) + Math.PI) * 7 +
          10,
        car2.yPos -
          Math.sin(
            (Math.PI / 180) * (car2.angle + car2.driftAngle) + (3 * Math.PI) / 2
          ) *
            10 +
          Math.sin((Math.PI / 180) * (car2.angle + car2.driftAngle) + Math.PI) * 7 +
          20,
        2,
        2
      );

      ctx.fillRect(
        car2.xPos -
          Math.cos(
            (Math.PI / 180) * (car2.angle + car2.driftAngle) + (3 * Math.PI) / 2
          ) *
            10 +
          Math.cos((Math.PI / 180) * (car2.angle + car2.driftAngle) + 2 * Math.PI) *
            7 +
          10,
        car2.yPos -
          Math.sin(
            (Math.PI / 180) * (car2.angle + car2.driftAngle) + (3 * Math.PI) / 2
          ) *
            10 +
          Math.sin((Math.PI / 180) * (car2.angle + car2.driftAngle) + 2 * Math.PI) *
            7 +
          20,
        2,
        2
      );
      */
    }
    
  }  


};



const updateCar2 = () => {
  if (!settings) {
    Object.keys(controller2).forEach((key) => {
      if (controller2[key].pressed) {
        controller2[key].func();

        if (!hideTitle) {
          headerRef.style.display = "none";
          hideTitle = true;
          
        }
      

      }
    });
    const drift2Intensity = Math.min(Math.abs(car2.driftAngle), 45);
    car2.isReversing = car2.speed >= 0 ? false : true;

    // Apply drag and update speed and angle
    car2.angularVelocity *= frictionFactor;
    if (!car2.isReversing)
      car2.driftAngle += carConstants.driftFactor * car2.angularVelocity;
    car2.driftAngle *= frictionFactor;
    car2.angle += car2.angularVelocity;
    car2.speed =
      car2.speed * dragFactor -
      (car2.isReversing ? -1 : 1) *
        ((Math.abs(car2.driftAngle) * car2.speed) / 1000);

    // Calculate vertical and horizontal speeds
    car2.xSpeed =
      Math.sin((Math.PI / 180) * (car2.angle - car2.driftAngle)) *
      car2.speed *
      (car2.isTurning ? frictionFactor : 1);
    car2.ySpeed =
      Math.cos((Math.PI / 180) * (car2.angle - car2.driftAngle)) *
      car2.speed *
      (car2.isTurning ? frictionFactor : 1);

    // Update coordinates and handle driving off the canvas/screen
    car2.xPos += car2.xSpeed;
    if (car2.xPos > canvas.width) {
      car2.xPos = 0;
    } else if (car2.xPos < 0) {
      car2.xPos = canvas.width;
    }

    car2.yPos -= car2.ySpeed;
    if (car2.yPos > canvas.height) {
      car2.yPos = 0;
    } else if (car2.yPos < 0) {
      car2.yPos = canvas.height;
    }

    const isDrifting2 = Math.abs(car2.driftAngle) > 10 && car2.speed > 1;
    //1st track
    const off2Track1 =
    car2.xPos < trackBounds1.left ||
    car2.xPos > trackBounds1.right ||
    car2.yPos < trackBounds1.top ||
    car2.yPos > trackBounds1.bottom ||
    (
      car2.xPos > trackBounds1.leftmid &&
      car2.xPos < trackBounds1.rightmid &&
      car2.yPos < trackBounds1.bottommid &&
      car2.yPos > trackBounds1.topmid
    ) ||
    (
      car2.xPos > trackBounds1.leftsmall &&
      car2.xPos < trackBounds1.rightsmall &&
      car2.yPos < trackBounds1.bottomsmall &&
      car2.yPos > trackBounds1.topsmall
    ) ||
    (
      car2.xPos > trackBounds1.leftapart &&
      car2.xPos < trackBounds1.rightapart &&
      car2.yPos < trackBounds1.bottomapart &&
      car2.yPos > trackBounds1.topapart
    );
  //2nd track
  const off2Track2 =
    car2.xPos < trackBounds2.left ||
    car2.xPos > trackBounds2.right ||
    car2.yPos < trackBounds2.top ||
    car2.yPos > trackBounds2.bottom ||
    (
      car2.xPos > trackBounds2.leftmid &&
      car2.xPos < trackBounds2.rightmid &&
      car2.yPos < trackBounds2.bottommid &&
      car2.yPos > trackBounds2.topmid
    ) ||
    (
      car2.xPos > trackBounds2.leftsmall &&
      car2.xPos < trackBounds2.rightsmall &&
      car2.yPos < trackBounds2.bottomsmall &&
      car2.yPos > trackBounds2.topsmall
    ) ||
    (
      car2.xPos > trackBounds2.leftapart &&
      car2.xPos < trackBounds2.rightapart &&
      car2.yPos < trackBounds2.bottomapart &&
      car2.yPos > trackBounds2.topapart
    );

  //3rd track
  const off2Track3 =
    car2.xPos < trackBounds3.left ||
    car2.xPos > trackBounds3.right ||
    car2.yPos < trackBounds3.top ||
    car2.yPos > trackBounds3.bottom ||
    (
      car2.xPos > trackBounds3.leftmid &&
      car2.xPos < trackBounds3.rightmid &&
      car2.yPos < trackBounds3.bottommid &&
      car2.yPos > trackBounds3.topmid
    ) ||
    (
      car2.xPos > trackBounds3.leftsmall &&
      car2.xPos < trackBounds3.rightsmall &&
      car2.yPos < trackBounds3.bottomsmall &&
      car2.yPos > trackBounds3.topsmall
    ) ||
    (
      car2.xPos > trackBounds3.leftleft &&
      car2.xPos < trackBounds3.rightleft &&
      car2.yPos < trackBounds3.bottomleft &&
      car2.yPos > trackBounds3.topleft
    )
    ||
    (
      car2.xPos > trackBounds3.leftright &&
      car2.xPos < trackBounds3.rightright &&
      car2.yPos < trackBounds3.bottomright &&
      car2.yPos > trackBounds3.topright
    );

  // done up to here
    const lap2check1 = 
      car2.xPos > lapBounds1.left &&
      car2.xPos < lapBounds1.right &&
      car2.yPos < lapBounds1.bottom &&
      car2.yPos > lapBounds1.top
      
    const lap2check2 = 
      car2.xPos > lapBounds2.left &&
      car2.xPos < lapBounds2.right &&
      car2.yPos < lapBounds2.bottom &&
      car2.yPos > lapBounds2.top

    const lap2check3 = 
      car2.xPos > lapBounds3.left &&
      car2.xPos < lapBounds3.right &&
      car2.yPos < lapBounds3.bottom &&
      car2.yPos > lapBounds3.top

    if (track === 1 && lap2check1 && !lapCooldown2 && !freedrive) {
      laps2 += 1;
      document.querySelector(".player2-laps").textContent = `Player 2 Laps: ${laps2}`;
      lapCooldown2 = true;

      setTimeout(() => {
        lapCooldown2 = false;
      }, 1000); // 1 second cooldown
    }
    if (track === 2 && lap2check2 && !lapCooldown2 && !freedrive) {
      laps2 += 1;
      document.querySelector(".player2-laps").textContent = `Player 2 Laps: ${laps2}`;
      lapCooldown2 = true;

      setTimeout(() => {
        lapCooldown2 = false;
      }, 1000); // 1 second cooldown
    }

    if (track === 3 && lap2check3 && !lapCooldown2 && !freedrive) {
      laps2 += 1;
      document.querySelector(".player2-laps").textContent = `Player 2 Laps: ${laps2}`;
      lapCooldown2 = true;

      setTimeout(() => {
        lapCooldown2 = false;
      }, 1000); // 1 second cooldown
    }

    
    if (controller2.KeyW.pressed) {
      
      if (car2.speed >= 2) {
        started2 = true;
      }
      
    }

    // starts over when the car is off the track
    if (!freedrive && started2 == true) {
      if (off2Track1 && track == 1) {
        started2 = false;
        laps2 = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRedX(car2.xPos + 15, car2.yPos + 20);
        
        car2.xPos = resetPosition2.x;
        car2.yPos = resetPosition2.y;
        car2.speed = 2;
        
        
        car2.driftAngle = 0;
        car2.angle = resetPosition2.angle;
        car2.angularVelocity = 0;
        

      }
      if (off2Track2 && track == 2) {
        started2 = false;
        laps2 = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRedX(car2.xPos + 15, car2.yPos + 20);
        
        car2.xPos = resetPosition2.x;
        car2.yPos = 115;
        car2.speed = 2;
        
        
        car2.driftAngle = 0;
        car2.angle = resetPosition2.angle;
        car2.angularVelocity = 0;
        

      }
      if (off2Track3 && track == 3) {
        started2 = false;
        laps2 = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRedX(car2.xPos + 15, car2.yPos + 20);
        
        car2.xPos = resetPosition2.x;
        car2.yPos = 135;
        car2.speed = 2;
        
        
        car2.driftAngle = 0;
        car2.angle = resetPosition2.angle;
        car2.angularVelocity = 0;
        

      }
    }

    
    // Restarts when the car slows too slow
    if (!freedrive && started2 == true) {
      if (car2.speed < 2 && drift2Intensity <= 25) {
      started2 = false;
      laps2 = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRedX(car2.xPos + 15, car2.yPos + 20);
      if (track == 1){
        car2.xPos = resetPosition2.x;
        car2.yPos = resetPosition2.y;
      }
      if (track == 2) {
        car2.xPos = resetPosition2.x;
        car2.yPos = 115;
      }
      if (track == 3) {
        car2.xPos = resetPosition2.x;
        car2.yPos = 135;
      }
      car2.speed = resetPosition2.speed; // or set to 5 directly
      car2.driftAngle = 0;
      car2.angle = resetPosition2.angle;
      car2.angularVelocity = 0;
      
      }
    }
    
    document.querySelector(".player2-laps").textContent = `Player 2 Laps: ${laps2}`;

  
    // Turn direction signalling
    if (car2.angularVelocity > 0) {
      car2.isTurningRight = true;
      car2.isTurningLeft = false;
    } else if (car2.angularVelocity < 0) {
      car2.isTurningRight = false;
      car2.isTurningLeft = true;
    }

    car2.isTurning = false;
  }
};


// Animation is tied to refresh rate so we need to force 60 FPS
const throttleAnimationLoop = (func) => {
  let then = new Date().getTime();
  let fps = 60;
  let interval = 1000 / fps;

  return (function loop() {
    let now = new Date().getTime();
    let delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);
      func();
    }

    requestAnimationFrame(loop);
  })();
};

const animationChecks = () => {
  
  if (twoplayer) {
    document.querySelector(".speed").style.display = "none";
    document.querySelector(".score-display").style.display = "none";
    document.querySelector(".prevscore").style.display = "none";
    document.querySelector(".bestscore").style.display = "none";
    document.querySelector(".player2-laps").style.display = "block";
    document.querySelector(".player1-laps").style.top = "5px";
    document.querySelector(".player2-laps").style.top = "45px";
    carRef2.style.display = twoplayer ? "block" : "none";
    updateCar2();
    renderCar2();
  } else if (!twoplayer) {
    document.querySelector(".speed").style.display = "block";
    document.querySelector(".player2-laps").style.display = "none";
    document.querySelector(".score-display").style.display = "block";
    document.querySelector(".prevscore").style.display = "block";
    document.querySelector(".bestscore").style.display = "block";
    document.querySelector(".player1-laps").style.top = "125px";
    carRef2.style.display = "none";
  }
  if (freedrive) {
    document.body.style.backgroundPosition = "0px center";
    document.querySelector(".score-display").style.display = "none";
    document.querySelector(".prevscore").style.display = "none";
    document.querySelector(".bestscore").style.display = "none";
    document.querySelector(".player2-laps").style.display = "none";
    document.querySelector(".player1-laps").style.display = "none";

  } else {
    document.body.style.backgroundPosition = "145px center";
    if (!twoplayer) {
      document.querySelector(".score-display").style.display = "block";
      document.querySelector(".prevscore").style.display = "block";
      document.querySelector(".bestscore").style.display = "block";
      document.querySelector(".player1-laps").style.display = "block";
      document.querySelector(".speed").style.display = "block";
    } else if (twoplayer) {
      document.querySelector(".player1-laps").style.display = "block";
      
    }
}
};

const animate = () => {
  if (audio) {
    music.play();
  }
  updateCar();
  renderCar();
  animationChecks();
  //drawTrackBoundsOutline()
};

throttleAnimationLoop(animate);

// if "i" pressed than clear canvas
document.addEventListener("keydown", (e) => {
  if (e.key === "i") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});