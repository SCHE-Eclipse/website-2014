'use strict';
//Physijs.scripts.worker = 'js/libs/physijs_worker.js';
//Physijs.scripts.ammo = 'ammo.js';

var frameRequest = ( window.mozRequestAnimationFrame ||
                     window.webkitRequestAnimationFrame ||
                     window.requestAnimationFrame );

var scene, camera, renderer, controls, render_stats, physics_stats;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var backgroundColor = 0x444444;
var Gamepads = [];
var webkitGamepad = ( navigator.webkitGetGamepads ? true : false );
var gamepad = null;

var activeSection = 1;
var maxPower = 1000;
var maxSpeed = 20;
var chickens = [];
var smMasts = [];
var lgMasts = [];
var gates = [];
var smbOpenedAngles = [ 0, -2*Math.PI/3, 2*Math.PI/3 ];
var smbClosedAngles = [ 0, 2.5*Math.PI/180, -2.5*Math.PI/180 ];
var smBladeHubs = [];
var smBlades = [];
var smNacelles = [];
var smMastLock = [ false, false, false, false ];
var lgMastLock = [ false, false, false, false ];
var smBladesLock = [ false, false, false, false ];
var gateLock = [ false, false, false, false ];
var cameraLock = false;
var robot = {};
var grippedItem = null;

var wood1Tex = new THREE.ImageUtils.loadTexture('images/wood1.jpg');
var wood2Tex = new THREE.ImageUtils.loadTexture('images/wood2.jpg');
var wood3Tex = new THREE.ImageUtils.loadTexture('images/wood3.jpg');

//var wood1Mat = new THREE.MeshLambertMaterial( { color: 0x886644 } );
var foamMat = new THREE.MeshLambertMaterial( { color: 0x888888 } );
var woodMat = new THREE.MeshLambertMaterial( { map: wood1Tex } );
var stoneMat = new THREE.MeshLambertMaterial( { color: 0x666666 } );
var pvcMat = new THREE.MeshLambertMaterial( { color: 0xAAAAAA } );
var pvcMatDS = new THREE.MeshLambertMaterial( { color: 0xAAAAAA,
                                                side: THREE.DoubleSide } );
var invisibleMat = new THREE.MeshBasicMaterial( { visible: false } );

//var woodSurf = Physijs.createMaterial( woodMat, 0.5, 0.2 );
//var pvcSurf = Physijs.createMaterial( pvcMat, 0.8, 0.2 );
//var invisibleSurf = Physijs.createMaterial( invisibleMat, 0, 0 );

var gameOver, gamePaused;
var cbScore, score = 0;
var gameClock = {
    startTime: null,
    interval: null
};
var scoreKeeper = {
    score: 0,
    interval: null
};

/*function showReadyClock() {
    gamePaused = true;
    var startTime = Date.now();
    var docElem = document.getElementById("alert");
    docElem.innerHTML = "Ready...";
    docElem.style.visibility = "visible";
    setTimeout(function() {
        docElem.innerHTML = "Set...";
    }, 3000);
    setTimeout(function() {
        docElem.innerHTML = "Go!";
    }, 5000);
    setTimeout(function() {
        docElem.style.visibility = "hidden";
        // Start updating the timer
        console.log("Starting the timer.");
        startGameClock();
    }, 6000);
};
*/
function startGameClock() {
    document.getElementById("time").innerHTML = "3:00";
    gameClock.startTime = Date.now();
    gameClock.interval = setInterval(updateGameClock, 1000);
    scoreKeeper.interval = setInterval(updateScore, 1000);
    gameOver = false;
    gamePaused = false;
    scene.onSimulationResume();
}

function stopGameClock() {
    if (!gamePaused) {
        clearInterval(gameClock.interval);
        clearInterval(scoreKeeper.interval);
        gameOver = true;
        gamePaused = true;
    }
}

function pauseGameClock() {
    if (!gamePaused) {
        clearInterval(gameClock.interval);
        clearInterval(scoreKeeper.interval);
        gamePaused = true;
    }
}

function resumeGameClock() {
    if (!gameOver && gamePaused) {
        gameClock.interval = setInterval(updateGameClock, 1000);
        scoreKeeper.interval = setInterval(updateScore, 1000);
        gamePaused = false;
        scene.onSimulationResume();
    }
}

function updateGameClock() {
    var curr = new Date();
    var elapsed = new Date(curr - gameClock.startTime);
    var minutes = 2 - elapsed.getMinutes();
    var seconds = 59 - elapsed.getSeconds();
    var display = document.getElementById("time");
    if (minutes < 0) {
        stopGameClock();
        display.innerHTML = "0:00";
        var alertDisp = document.getElementById("alert");
        alertDisp.innerHTML = "GAME OVER";
        alertDisp.style.visibility = "visible";
        gameOver = true;
    }
    else if (seconds < 10) {
        display.innerHTML = minutes.toString() + ":0" + seconds.toString();
    }
    else {
        display.innerHTML = minutes.toString() + ":" + seconds.toString();
    }
};

function updateScore() {
    scoreKeeper.score = computeScore();
    var display = document.getElementById("score");
    display.innerHTML = scoreKeeper.score.toString();
};

function computeScore() {
    score = 0;
    // How are the chickens faring?
    for (var i=0; i<3; ++i) {
        var chicken = chickens[i];
        var alive = (chicken.matrixWorld.elements[6] > 0.5);
        var safe = !(chicken.position.x < -135 ||
                     chicken.position.x > -111 ||
                     chicken.position.y < -135 ||
                     chicken.position.y > -111);
        if (alive) {
            if (safe) {
                score += 10;
            }
            else {
                score += 4;
            }
        }
        else {
            score -= 10;
        }
    }
    // Unfortunately no negative score is allowed.
    if (score < 0) {
        score = 0;
    }
    return score;
}

function initBladeRunner() {
  //  if (!Detector.webgl) { Detector.addGetWebGLMessage(); }

    gamePaused = true;
    gameOver = false;

    var phi = activeSection*Math.PI/2;
    var x0 = -120;
    var y0 = -122.5;
    var r0 = Math.sqrt(x0*x0 + y0*y0);
    var theta = Math.atan2(y0, x0);
    
    initGUI();
    initScene();
  //  initRobot( r0*Math.cos(theta + phi), r0*Math.sin(theta + phi) );
    initControls();

    // Give the ready.. set.. go.. countdown.
 //   showReadyClock();

    // Launch the animation loop
    animate();
}

// Initialize the visible elements displayed on the web page
function initGUI() {
    var container = document.createElement('div');
    document.body.appendChild(container);

    // Graph that displays the rate at which the scene is rendering.
		render_stats = new Stats();
		render_stats.domElement.style.position = 'absolute';
		render_stats.domElement.style.top = '0px';
		render_stats.domElement.style.zIndex = 100;
		container.appendChild( render_stats.domElement );

/*
		// Graph that diplays the rate at which the simulation is running.
		physics_stats = new Stats();
		physics_stats.domElement.style.position = 'absolute';
		physics_stats.domElement.style.top = '50px';
		physics_stats.domElement.style.zIndex = 100;
		container.appendChild( physics_stats.domElement );
*/
    // The main viewport where the scene will be rendered.
		renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor( backgroundColor, 1 );
    renderer.setSize(WIDTH, HEIGHT);
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
    container.appendChild(renderer.domElement);

}

// The scene object keeps track of everything to be rendered.
function initScene() {
    // Use the Physijs.Scene to add physics
    scene = new THREE.Scene();
  //  scene = new Physijs.Scene();
    scene.fog = new THREE.FogExp2( backgroundColor, 0.0002 );
    // Set up some global physics parameters
//		scene.setGravity(new THREE.Vector3( 0, 0, -30 ));
/*    
		scene.addEventListener( 'update', function() {
        if (!gamePaused) {
            if ( scene.simulate( undefined, 2 ) ) {
                physics_stats.update();
            }
        }
    } );
*/	
    // The camera is the user's eye(s) into our scene
    camera = new THREE.PerspectiveCamera(60, WIDTH/HEIGHT, 0.1, 1000);
    camera.up.set(0, 0, 1);
		scene.add( camera );
		resetCamera();

		// Lights - required for shading objects and casting shadows
		var light = new THREE.DirectionalLight( 0xFFFFFF );
		light.position.set( 200, 400, 550 );
		light.target.position.copy( scene.position );
		light.castShadow = true;
    light.shadowCameraNear = 10;
    light.shadowCameraFar = camera.far;
    light.ShadowCameraFov = 60;
		light.shadowBias = 0.0001
		light.shadowDarkness = 0.5;
		light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
		scene.add( light );

    //var ambient = new THREE.AmbientLight( 0x222222 );
    //scene.add( ambient );

    initStaticBodies();
    initDynamicBodies();
    initKinematicBodies();
}

function resetCamera() {
    // If the camera is currently being moved then discard request
    if (cameraLock) return;
    // Indicate that we are now moving the camera
    cameraLock = true;

    var pos = camera.position;
    var r0 = Math.sqrt(pos.x*pos.x + pos.y*pos.y);
    var theta0 = Math.atan2(pos.y, pos.x);
    var phi0 = Math.atan2(pos.z, r0);

    var x1 = -50;
    var y1 = -220;
    var z1 = 200;
    var tgt = new THREE.Vector3(x1, y1, z1);
    var r1 = Math.sqrt(x1*x1 + y1*y1);
    var theta1 = activeSection*Math.PI/2 + Math.atan2(y1, x1);
    if (theta1 - theta0 > Math.PI) {
        theta1 -= 2*Math.PI;
    }
    else if (theta1 - theta0 < -Math.PI) {
        theta1 += 2*Math.PI;
    }
    var phi1 = Math.atan2(z1, r1);
    var tween = new TWEEN.Tween( { r: pos.length(),
                                   theta: theta0,
                                   phi: phi0 } )
        .to( { r: tgt.length(),
               theta: theta1,
               phi: phi1 }, 1000 )
        .onUpdate( function() {
            var x = this.r*Math.cos(this.theta)*Math.cos(this.phi);
            var y = this.r*Math.sin(this.theta)*Math.cos(this.phi);
            var z = this.r*Math.sin(this.phi);
            camera.position.set(x, y, z);
            camera.lookAt(scene.position);
        } )
        .onComplete( function() {
            cameraLock = false;
        } )
        .start();
}

function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.damping = 0.2;
    controls.maxPolarAngle = 0.49*Math.PI;

		document.addEventListener( 'keydown', function( ev ) {
        switch( ev.key ) {
/*
        case 'a':
            // Left
            robot.axleL.configureAngularMotor(0, 1, 0,  maxSpeed, maxPower);
            robot.axleR.configureAngularMotor(0, 1, 0, -maxSpeed, maxPower);
            robot.axleL.enableAngularMotor( 0 );
            robot.axleR.enableAngularMotor( 0 );
						break;
				case 'd':
						// Right
            robot.axleL.configureAngularMotor(0, 1, 0, -maxSpeed, maxPower);
            robot.axleR.configureAngularMotor(0, 1, 0,  maxSpeed, maxPower);
            robot.axleL.enableAngularMotor( 0 );
            robot.axleR.enableAngularMotor( 0 );
						break;
				case 'w':
						// Up
            robot.axleL.configureAngularMotor(0, 1, 0, -maxSpeed, maxPower);
            robot.axleR.configureAngularMotor(0, 1, 0, -maxSpeed, maxPower);
            robot.axleL.enableAngularMotor( 0 );
            robot.axleR.enableAngularMotor( 0 );
						break;
				case 's':
						// Down
            robot.axleL.configureAngularMotor(0, 1, 0,  maxSpeed, maxPower);
            robot.axleR.configureAngularMotor(0, 1, 0,  maxSpeed, maxPower);
            robot.axleL.enableAngularMotor( 0 );
            robot.axleR.enableAngularMotor( 0 );
						break;
*/
        case 's':
            toggleSmallMast(activeSection);
            break;
        case 'l':
            toggleLargeMast(activeSection);
            break;
        case 'g':
            toggleGates(activeSection);
            break;
        case 'b':
            toggleSmallBlades(activeSection);
            break;
        case '0':
        case '4':
            activeSection = 0; resetCamera();
            break;
        case '1':
            activeSection = 1; resetCamera();
            break;
        case '2':
            activeSection = 2; resetCamera();
            break;
        case '3':
            activeSection = 3; resetCamera();
            break;
				}
		} );

		document.addEventListener( 'keyup', function( ev ) {
				switch( ev.key ) {
/*
				case 'a':
						// Left
						robot.axleL.disableAngularMotor( 0 );
						robot.axleR.disableAngularMotor( 0 );
						break;
					
					case 'd':
						// Right
						robot.axleL.disableAngularMotor( 0 );
						robot.axleR.disableAngularMotor( 0 );
						break;
					
					case 'w':
						// Up
						robot.axleL.disableAngularMotor( 0 );
						robot.axleR.disableAngularMotor( 0 );
						break;
					
					case 's':
						// Down
						robot.axleL.disableAngularMotor( 0 );
						robot.axleR.disableAngularMotor( 0 );
						break;
*/
				}
			}
		);

    window.addEventListener('resize', onWindowResize, false);
    
    window.addEventListener('gamepadconnected', function(e) {
        gamepad = navigator.getGamepads()[e.gamepad.index];
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                    gamepad.index, gamepad.id,
                    gamepad.buttons.length,
                    gamepad.axes.length);
    });

    window.addEventListener('gamepaddisconnected', function(e) {
        console.log("Gamepad disconnected at index %d:", e.gamepad.index);
        gamepad = null;
    });

}
//====================================================================
// You shouldn't have to change anything else below this point.
//--------------------------------------------------------------------
function onWindowResize(event) {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(WIDTH, HEIGHT);

    render();
}

function updateJoystick() {
    gamepad = navigator.getGamepads()[0];
    if (!gamepad || !gamepad.connected) return;

    // Left stick
    var LX = gamepad.axes[0];
    var LY = gamepad.axes[1];
    // Right stick
    var RX = gamepad.axes[2];
    var RY = gamepad.axes[3];
    // Buttons
    var A = gamepad.buttons[0].pressed;
    var B = gamepad.buttons[1].pressed;
    var X = gamepad.buttons[2].pressed;
    var Y = gamepad.buttons[3].pressed;
    // Shoulder buttons
    var LB = gamepad.buttons[4];
    var RB = gamepad.buttons[5];
    // Triggers (analog)
    var LT = gamepad.buttons[6];
    var RT = gamepad.buttons[7];
    // 
    var BACK = gamepad.buttons[8];
    var START = gamepad.buttons[9];
    // Stick presses
    var LS = gamepad.buttons[10];
    var RS = gamepad.buttons[11];
    // D-pad
    var DN = gamepad.buttons[12];
    var DS = gamepad.buttons[13];
    var DW = gamepad.buttons[14];
    var DE = gamepad.buttons[15];

    // Right stick drives the robot
    var pL = maxPower;
    var pR = maxPower;
    var vL = maxSpeed*(RY-RX);
    var vR = maxSpeed*(RY+RX);
/*
    if (Math.abs(vL) > 0.1 || Math.abs(vR) > 0.1) {
		    robot.axleL.configureAngularMotor( 0, 1, 0, vL, pL );
		    robot.axleR.configureAngularMotor( 0, 1, 0, vR, pR );
		    robot.axleL.enableAngularMotor( 0 );
		    robot.axleR.enableAngularMotor( 0 );
    }
    else {
		    robot.axleL.disableAngularMotor( 0 );
		    robot.axleR.disableAngularMotor( 0 );
    }

    // Use A/B to activate the claw
    var fL = robot.fingerL.localToWorld(new THREE.Vector3(0,1.5,0));
    var fR = robot.fingerR.localToWorld(new THREE.Vector3(0,1.5,0));
    var r = new THREE.Vector3((fL.x+fR.x)/2,(fL.y+fR.y)/2,(fL.z+fR.z));
    if (A && !grippedItem) { // Pick something up
        for (var i=0; i<3; ++i) {
            // Get the world coordinates of the top of the chicken
            var s = chickens[i].localToWorld(new THREE.Vector3(0,5,0));
            // Get the location of the claw with respect to the chicken
            var d = s.sub(r);
            if (d.length() < 10) {
                console.log("Chicken " + i + " selected.");
                var tmp = new THREE.Matrix4();
                tmp.getInverse(robot.palm.matrixWorld);
                chickens[i].applyMatrix(tmp);
                scene.remove( chickens[i] );
                robot.palm.add( chickens[i] );
                grippedItem = chickens[i];
                break;
            }
        }
    }
    if (B && grippedItem) { // Drop something
        grippedItem.applyMatrix( robot.palm.matrixWorld );
        grippedItem.setLinearFactor(new THREE.Vector3(0,0,0));
        grippedItem.setAngularFactor(new THREE.Vector3(0,0,0));
        robot.palm.remove( grippedItem );
        scene.add( grippedItem );
        grippedItem.setLinearFactor(new THREE.Vector3(1,1,1));
        grippedItem.setAngularFactor(new THREE.Vector3(1,1,1));
        grippedItem = null;
    }
*/
    if (X) {
        toggleSmallMast(activeSection);
    }
    if (Y) {
        toggleLargeMast(activeSection);
    }
    if (B) {
        toggleSmallBlades(activeSection);
    }
    if (A) {
        toggleGates(activeSection);
    }
/*
    if (DN) {
        robot.arm.rotation.x -= 5*Math.PI/180;
    }
    if (DS) {
        robot.arm.rotation.x += 5*Math.PI/180;
    }
*/
/*
    // Left stick controls the camera
    if (LS) {
        controls.pan(LX, LY);
    }
    else {
        controls.rotateLeft(LX*Math.PI/180);
        controls.rotateUp(LY*Math.PI/180);
    }
    controls.update();
*/
}

function animate() {
    requestAnimationFrame(animate);
    updateJoystick();
    updateScore();

    render();
}

function render() {
    TWEEN.update();
    renderer.render( scene, camera );
    render_stats.update();
}
