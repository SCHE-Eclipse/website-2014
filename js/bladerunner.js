var scene, camera, renderer, controls;
var SCREEN_WIDTH, SCREEN_HEIGHT;
var clock = new THREE.Clock();

function initBladeRunner() {
    //if (!Detector.webgl) { Detector.addGetWebGLMessage(); }

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    var container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, SCREEN_WIDTH/SCREEN_HEIGHT, 0.1, 1000);
    camera.position.y = -150;
    camera.position.z = 200;
    camera.up.set(0,0,1);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.noRotate = false;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener('change', render);

    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight(0x505050));

    var arena = buildArena();
    scene.add(arena);
    var robot= buildRobot();
    //scene.add(robot);
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    window.addEventListener('resize', onWindowResize, false);

    animate();
}

//====================================================================
// You shouldn't have to change anything else below this point.
//--------------------------------------------------------------------
function onWindowResize(event) {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    camera.aspect = (SCREEN_WIDTH/SCREEN_HEIGHT);
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    controls.handleResize();
    
    render();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    var delta = clock.getDelta();
    renderer.render( scene, camera );
    stats.update();
}


