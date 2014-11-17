// The scene object keeps track of everything to be rendered.
function initArena() {
    // Use the Physijs.Scene to add physics
    /* scene = new THREE.Scene(); */
		scene = new Physijs.Scene();
    scene.fog = new THREE.FogExp2( backgroundColor, 0.0002 );
    // Set up some global physics parameters
		scene.setGravity(new THREE.Vector3( 0, 0, -30 ));
		scene.addEventListener( 'update', function() {
            scene.simulate( undefined, 2 );
            physics_stats.update();
        } );
		
    // The camera is the user's eye(s) into our scene
    camera = new THREE.PerspectiveCamera(60, WIDTH/HEIGHT, 0.1, 1000);
		camera.position.set( -140, -160, 70 );
    camera.up.set(0, 0, 1);
		scene.add( camera );
		
		// Lights - required for shading objects and casting shadows
		var light = new THREE.DirectionalLight( 0xFFFFFF );
		light.position.set( 20, 40, 55 );
		light.target.position.copy( scene.position );
		light.castShadow = true;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 2048;
		light.shadowDarkness = .7;
		scene.add( light );

    initStaticBodies();
    initDynamicBodies();
}

