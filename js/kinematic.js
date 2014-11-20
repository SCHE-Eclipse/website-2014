function initKinematicBodies() {
    for (var i=0; i<4; ++i) {
        var phi = i*Math.PI/2;

        //------------------------------------------------------------
        // Create the small turbine mast
        smMasts[i] = makeTurbineMast();
        // Position the mast with respect to its base
        smMasts[i].position.set(0, -2.5, 0);
        // Indicate that the mast is currently raised
        smMasts[i].userData.raised = true;
        // Create the small turbine base
        var smBase = makeTurbineBase();
        // Add the mast to the base
        smBase.add(smMasts[i]);
        // Position the base on the play field in section i
        x = 26, y = -106, z = 0.375; // coordinates with respect to section 0
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        smBase.rotation.z = phi;
        smBase.position.set(r*Math.cos(theta+phi),
                            r*Math.sin(theta+phi), z);
        // Add the base to the scene
        scene.add(smBase);

        //------------------------------------------------------------
        // Create the large turbine nacelle
        var lgNacelle = makeLargeTurbineNacelle();
        // Position the nacelle with respect to its mast
        lgNacelle.rotation.z = -Math.PI/2;
        lgNacelle.position.set(-8, -6.5, 34.5);
        // Create the large turbine mast
        lgMasts[i] = makeTurbineMast();
        // Add the nacelle to the mast
        lgMasts[i].add(lgNacelle);
        // Position the mast with respect to its base
        lgMasts[i].position.set(0, -2.5, 0);
        // Indicate that the mast is currently raised
        lgMasts[i].userData.raised = true;
        // Create the large turbine base
        var lgBase = makeTurbineBase();
        // Add the mast to the base
        lgBase.add(lgMasts[i]);
        // Position the base on the play field in sectino i
        x = 95, y = -110, z = 0.375; // Coordinates with respect to section 0
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        lgBase.rotation.z = phi + Math.PI/4;
        lgBase.position.set(r*Math.cos(theta+phi),
                            r*Math.sin(theta+phi), z);
        // Add the base to the scene
        scene.add(lgBase);

        //------------------------------------------------------------
        gates[i] = buildGates(i);
        x0 = 1;
        y0 = -96;
        z0 = 33;
        r0 = Math.sqrt(x0*x0 + y0*y0);
        theta0 = Math.atan2(y0, x0);
        gates[i][0].rotation.z = phi;
        gates[i][0].position.set(r0*Math.cos(theta0+phi),
                                 r0*Math.sin(theta0+phi),
                                 z0);
        scene.add(gates[i][0]);

        x1 = -1;
        y1 = -56;
        z1 = 33;
        r1 = Math.sqrt(x1*x1 + y1*y1);
        theta1 = Math.atan2(y1, x1);
        gates[i][1].rotation.z = phi;
        gates[i][1].position.set(r1*Math.cos(theta1+phi),
                                 r1*Math.sin(theta1+phi),
                                 z1);
        scene.add(gates[i][1]);
    }
}

function makeTurbineBase () {
    var baseGeom = new THREE.BoxGeometry(18, 24, 0.75);
    var slabGeom = new THREE.BoxGeometry(16, 16, 1);
    var baseMesh, slabMesh;
    baseMesh = new THREE.Mesh(baseGeom, woodMat);
    slabMesh = new THREE.Mesh(slabGeom, stoneMat);
    slabMesh.position.set(0, 8, 0.875);
    baseMesh.add(slabMesh);

    return baseMesh;
}

function makeTurbineMast() {
    var mast = new THREE.Object3D();

    var mastbackGeom = new THREE.BoxGeometry(4, 0.75, 36);
    var mastback = new THREE.Mesh(mastbackGeom, woodMat);
    mastback.castShadow = true;
    mastback.receiveShadow = true;
    mastback.position.set(0, -9.875, 18);
    mast.add(mastback);

    var mastbottomGeom = new THREE.BoxGeometry(15, 8, 0.75);
    var mastbottom = new THREE.Mesh(mastbottomGeom, woodMat);
    mastbottom.castShadow = true;
    mastbottom.receiveShadow = true;
    mastbottom.position.set(0, -4, 1.125);
    mast.add(mastbottom);

    var postGeom = new THREE.CylinderGeometry(2, 2, 36, 16, 1, true);
    var post = new THREE.Mesh(postGeom, pvcMatDS);
    post.castShadow = true;
    post.receiveShadow = true;
    post.rotation.x = Math.PI/2;
    post.position.set(0, -4, 19.5);
    mast.add(post);

    return mast;
}

function makeLargeTurbineNacelle() {
    var nacelle = new THREE.Object3D();
    var LTBmedPVCGeom = new THREE.CylinderGeometry(1, 1, 10, 16, 1, true);
    var LTBsmlPVCGeom = new THREE.CylinderGeometry(0.5, 0.5, 10, 16, 1, true);
    var radius  = Math.sqrt(1.25) + Math.sqrt(3);
    for (var l = 0; l < 6; l++) {
	      var theta = l * Math.PI / 3 + Math.PI / 6;
	      var x = Math.sin(theta) * radius;
	      var z = 6 + Math.cos(theta) * radius;
	      var mesh2 = new THREE.Mesh(LTBsmlPVCGeom, pvcMatDS);
	      mesh2.castShadow = true;
	      mesh2.receiveShadow = true;
	      mesh2.position.set(x, 8, z);
	      nacelle.add(mesh2);
    }
    var r = 2;
    for (var j = 0; j < 6; j++) {
	      var theta = j * Math.PI / 3;
	      var x = Math.sin(theta) * r;
	      var z = 6 + Math.cos(theta) * r;
	      var mesh = new THREE.Mesh(LTBmedPVCGeom, pvcMatDS);
	      mesh.castShadow = true;
	      mesh.receiveShadow = true;
	      mesh.position.set(x, 8, z);
	      nacelle.add(mesh);
    }

    var LTBlgPVCGeom = new THREE.CylinderGeometry(1, 1, 17, 16, 1, false);
    var LTBlgPVC = new THREE.Mesh(LTBlgPVCGeom, pvcMat);
    LTBlgPVC.castShadow = true;
    LTBlgPVC.receiveShadow = true;
    LTBlgPVC.position.z = 6;
    LTBlgPVC.position.y = 6;
    nacelle.add( LTBlgPVC );

    var LTBcollarGeom = new THREE.CylinderGeometry(1.5, 1.5, 2, 16, 1, false);
    var LTBcollar = new THREE.Mesh(LTBcollarGeom, pvcMat);
    LTBcollar.castShadow = true;
    LTBcollar.receiveShadow = true;
    LTBcollar.position.z = 6;
    LTBcollar.position.y = 2;
    nacelle.add( LTBcollar );

    var LTBbladehubGeom = new THREE.CylinderGeometry(7, 7, 2, 6, 1, false);
    var LTBbladehub =  new THREE.Mesh(LTBbladehubGeom, woodMat);
    LTBbladehub.castShadow = true;
    LTBbladehub.receiveShadow = true;
    //LTBbladehub.rotation.y = Math.PI/6;
    LTBbladehub.position.z = 6;
    LTBbladehub.position.y = 0;
    nacelle.add( LTBbladehub );

    var LTBbottomGeom = new THREE.BoxGeometry(6, 10, 0.25);
    var LTBbottom = new THREE.Mesh(LTBbottomGeom, woodMat);
    LTBbottom.castShadow = true;
    LTBbottom.receiveShadow = true;
    LTBbottom.position.z = 3;
    LTBbottom.position.y = 8;
    nacelle.add( LTBbottom );
    return nacelle
}

function buildGates(section) {
    var phi = section * Math.PI/2;

    var gateGeom = new THREE.BoxGeometry(0.75, 60, 2);
    var bar1 = new THREE.Mesh(gateGeom, woodMat);
    var bar2 = new THREE.Mesh(gateGeom, woodMat);

    var gate1 = new THREE.Mesh(new THREE.BoxGeometry(0, 96, 1.5),
                               new THREE.MeshBasicMaterial({visible: false}));
    var gate2 = new THREE.Mesh(new THREE.BoxGeometry(0, 96, 1.5),
                               new THREE.MeshBasicMaterial({visible: false}));

    bar1.position.y =  18;
    bar1.castShadow = true;
    bar1.receiveShadow = true;

    bar2.position.y = -18;
    bar2.castShadow = true;
    bar2.receiveShadow = true;

    gate1.add(bar1);
    gate1.rotation.x = -28*Math.PI/180*Math.cos(phi);
    gate1.rotation.y = -28*Math.PI/180*Math.sin(phi);
    
    gate2.add(bar2);
    gate2.rotation.x =  28*Math.PI/180*Math.cos(phi);
    gate2.rotation.y =  28*Math.PI/180*Math.sin(phi);

    return [gate1, gate2];
}

//====================================================================
// Control the appearance of kinematic objects through explicit
// manipulation of their positions and orientations.
//====================================================================

//--------------------------------------------------------------------
// Raise/Lower the small turbine mast in the given section
//--------------------------------------------------------------------
function toggleSmallMast(section) {
    // If no section is provided, use the currently active section
    var s = ( section === undefined ? activeSection : section );
    // If the mast is currently being raised or lowered then discard request
    if (smMastLock[s]) return;
    // Indicate that we are now raising or lowering the mast
    smMastLock[s] = true;

    var tween = new TWEEN.Tween( smMasts[s].rotation );
    var target = {
        x: ( smMasts[s].userData.raised ? -Math.PI/2 : 0 ),
    };
    tween.to( target, 1000 );
    tween.onUpdate( function() {
        smMasts[s].userData.raised = ( smMasts[s].rotation.x == 0 );
    } );
    tween.onComplete( function() {
        // Indicate that the operation has completed
        smMastLock[s] = false;
        console.log("STB masts raised: " +
                    smMasts[0].userData.raised + " " +
                    smMasts[1].userData.raised + " " +
                    smMasts[2].userData.raised + " " +
                    smMasts[3].userData.raised );
        console.log("STB masts locked: " +
                    smMastLock[0] + " " +
                    smMastLock[1] + " " +
                    smMastLock[2] + " " +
                    smMastLock[3] );
    } );
    tween.start();
}

//--------------------------------------------------------------------
// Raise/Lower the large turbine mast in the given section
//--------------------------------------------------------------------
function toggleLargeMast(section) {
    // If no section is provided, use the currently active section
    var s = ( section === undefined ? activeSection : section );
    // If the mast is currently being raised or lowered then discard request
    if (lgMastLock[s]) return;
    // Indicate that we are now raising or lowering the mast
    lgMastLock[s] = true;

    var tween = new TWEEN.Tween( lgMasts[s].rotation );
    var target = {
        x: ( lgMasts[s].userData.raised ? -Math.PI/2 : 0 ),
    };
    tween.to( target, 1000 );
    tween.onUpdate( function() {
        lgMasts[s].userData.raised = ( lgMasts[s].rotation.x == 0 );
    } );
    tween.onComplete( function() {
        // Indicate that the operation has completed
        lgMastLock[s] = false;
        console.log("LTB masts raised: " +
                    lgMasts[0].userData.raised + " " +
                    lgMasts[1].userData.raised + " " +
                    lgMasts[2].userData.raised + " " +
                    lgMasts[3].userData.raised );
        console.log("LTB masts locked: " +
                    lgMastLock[0] + " " +
                    lgMastLock[1] + " " +
                    lgMastLock[2] + " " +
                    lgMastLock[3] );
    } );
    tween.start();
}

//--------------------------------------------------------------------
// Open/Close the blades on the small turbine hub in the given section.
//--------------------------------------------------------------------
function toggleSmallBlades(section) {
    // If no section is provided, use the currently active section
    var s = ( section === undefined ? activeSection : section );
    // If the blades are currently being opened/closed then discard request
    if (smBladesLock[s]) return;
    //Indicate that we are now raising or lowering the gates
    smBladesLock[s] = false;
    // blade 0 does not move, so we only need to change blades 1 and 2
    var tween = new TWEEN.Tween( { y1: smBlades[s][1].rotation.y,
                                   y2: smBlades[s][2].rotation.y } );
    var target = {
        y1: ( smBlades[s][1].rotation.y == smbOpenedAngles[1] ?
              smbClosedAngles[1] : smbOpenedAngles[1] ),
        y2: ( smBlades[s][2].rotation.y == smbOpenedAngles[2] ?
              smbClosedAngles[2] : smbOpenedAngles[2] )
    };
    tween.to( target, 1000 );
    tween.onUpdate( function() {
        smBlades[s][1].rotation.y = this.y1;
        smBlades[s][2].rotation.y = this.y2;
    } );
    tween.onComplete( function() {
        // Indicate that the operation has completed
        smBladesLock[s] = false;
    } );
    tween.start();
}

//--------------------------------------------------------------------
// Open/Close the gates on the bridge in the given section.
//--------------------------------------------------------------------
var gateRaisedAngles = [  28*Math.PI/180, -28*Math.PI/180 ];
var gateLoweredAngles = [ -28*Math.PI/180, 28*Math.PI/180 ];

function toggleGates(section) {
    // If no section is provided, use the currently active section
    var s = ( section === undefined ? activeSection : section );
    if (gateLock[s]) return;
    gateLock[s] = true;
    var phi = section * Math.PI/2;
    for (var i=0; i<2; ++i) {
        var tween = new TWEEN.Tween( gates[s][i].rotation );
        var target = {
            x: ( gates[s][i].rotation.x == gateRaisedAngles[i]*Math.cos(phi) ?
                 gateLoweredAngles[i]*Math.cos(phi) :
                 gateRaisedAngles[i]*Math.cos(phi) ),
            y: ( gates[s][i].rotation.y == gateRaisedAngles[i]*Math.sin(phi) ?
                 gateLoweredAngles[i]*Math.sin(phi) :
                 gateRaisedAngles[i]*Math.sin(phi) )
        };
        tween.to( target, 1000 );
        tween.onComplete( function() {
            gateLock[s] = false;
        } );
        tween.start();
    }
}
