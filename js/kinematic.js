function initKinematicBodies() {
    for (var i=0; i<4; ++i) {
        var phi = i*Math.PI/2;

        x = 26;
        y = -108.5;
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        smMasts[i] = makeTurbineMast();
        smMasts[i].rotation.z = phi;
        smMasts[i].position.set(r*Math.cos(theta+phi),
                                r*Math.sin(theta+phi), 0.375);
        smMasts[i].userData.lowered = false;
        smMasts[i].userData.raised = true;
        scene.add(smMasts[i]);

        x = 97.77;
        y = -111.77;
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        lgMasts[i] = makeTurbineMast();
        lgMasts[i].rotation.z = phi;
        lgMasts[i].rotateOnAxis(new THREE.Vector3(0,0,1), Math.PI/4);
        lgMasts[i].position.set(r*Math.cos(theta+phi),
                                r*Math.sin(theta+phi), 0);
        lgMasts[i].userData.raised = false;
        // Add large turbine nacelle to it's mast
        var lgNacelle = makeLargeTurbineNacelle();
        lgNacelle.rotation.z = -Math.PI/2;
        lgNacelle.position.set(-8, -6.5, 34.5);
        lgMasts[i].add(lgNacelle);
        scene.add(lgMasts[i]);

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

function makeTurbineMast() {
    var mast = new THREE.Object3D();

    var LTBmastbackgeo = new THREE.BoxGeometry(4, 0.75, 36);
    var LTBmastback = new THREE.Mesh(LTBmastbackgeo, woodMat);
    LTBmastback.castShadow = true;
    LTBmastback.receiveShadow = true;
    LTBmastback.position.set(0, -9.875, 18);
    mast.add(LTBmastback);

    var LTBmastbottomgeo = new THREE.BoxGeometry(15, 8, 0.75);
    var LTBmastbottom = new THREE.Mesh(LTBmastbottomgeo, woodMat);
    LTBmastbottom.castShadow = true;
    LTBmastbottom.receiveShadow = true;
    LTBmastbottom.position.set(0, -4, 1.125);
    mast.add(LTBmastbottom);

    var LTBmastgeo = new THREE.CylinderGeometry(2, 2, 36, 16, 1, true);
    var LTBmast = new THREE.Mesh(LTBmastgeo, pvcMatDS);
    LTBmast.castShadow = true;
    LTBmast.receiveShadow = true;
    LTBmast.rotation.x = Math.PI/2;
    LTBmast.position.set(0, -4, 19.5);
    mast.add(LTBmast);

    return mast;
}

function makeLargeTurbineNacelle() {
    var nacelle = new THREE.Object3D();
    var LTBmedPVCgeo = new THREE.CylinderGeometry(1, 1, 10, 16, 1, true);
    var LTBsmlPVCgeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16, 1, true);
    var radius  = Math.sqrt(1.25) + Math.sqrt(3);
    for (var l = 0; l < 6; l++) {
	      var theta = l * Math.PI / 3 + Math.PI / 6;
	      var x = Math.sin(theta) * radius;
	      var z = 6 + Math.cos(theta) * radius;
	      var mesh2 = new THREE.Mesh(LTBsmlPVCgeo, pvcMatDS);
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
	      var mesh = new THREE.Mesh(LTBmedPVCgeo, pvcMatDS);
	      mesh.castShadow = true;
	      mesh.receiveShadow = true;
	      mesh.position.set(x, 8, z);
	      nacelle.add(mesh);
    }

    var LTBlgPVCgeo = new THREE.CylinderGeometry(1, 1, 17, 16, 1, false);
    var LTBlgPVC = new THREE.Mesh(LTBlgPVCgeo, pvcMat);
    LTBlgPVC.castShadow = true;
    LTBlgPVC.receiveShadow = true;
    LTBlgPVC.position.z = 6;
    LTBlgPVC.position.y = 6;
    nacelle.add( LTBlgPVC );

    var LTBcollargeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 16, 1, false);
    var LTBcollar = new THREE.Mesh(LTBcollargeo, pvcMat);
    LTBcollar.castShadow = true;
    LTBcollar.receiveShadow = true;
    LTBcollar.position.z = 6;
    LTBcollar.position.y = 2;
    nacelle.add( LTBcollar );

    var LTBbladehubgeo = new THREE.CylinderGeometry(7, 7, 2, 6, 1, false);
    var LTBbladehub =  new THREE.Mesh(LTBbladehubgeo, woodMat);
    LTBbladehub.castShadow = true;
    LTBbladehub.receiveShadow = true;
    //LTBbladehub.rotation.y = Math.PI/6;
    LTBbladehub.position.z = 6;
    LTBbladehub.position.y = 0;
    nacelle.add( LTBbladehub );

    var LTBbottomgeo = new THREE.BoxGeometry(6, 10, 0.25);
    var LTBbottom = new THREE.Mesh(LTBbottomgeo, woodMat);
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
// Control the appearance of kinematic object through explicit
// manipulation of their positions and orientations.
//====================================================================

//--------------------------------------------------------------------
// Raise/Lower the small turbine mast in the given section
//--------------------------------------------------------------------
var smRaisedAngles = { x: 0, y: 0, z: Math.PI/2 };
var smLoweredAngles = { x: 0, y: -Math.PI/2, z: Math.PI/2 };

function toggleSmallMast(section) {
    smMastLock = false;
    // If no section is provided, use the currently active section
    var s = ( section === undefined ? activeSection : section );
    var tween = new TWEEN.Tween( smMasts[s].rotation );
    var target = {
        x: ( smMasts[s].rotation.x == smRaisedAngles.x ?
             smLoweredAngles.x : smRaisedAngles.x ),
        y: ( smMasts[s].rotation.y == smRaisedAngles.y ?
             smLoweredAngles.y : smRaisedAngles.y ),
        z: ( smMasts[s].rotation.z == smRaisedAngles.z ?
             smLoweredAngles.z : smRaisedAngles.z )
    };
    tween.to( target, 1000 );
    tween.onComplete( function() {
        smMastLock = true;
    } );
    tween.start();
}

//--------------------------------------------------------------------
// Raise/Lower the large turbine mast in the given section
//--------------------------------------------------------------------
var lgRaisedAngles = { x: 0, y: 0, z: 3*Math.PI/4 };
var lgLoweredAngles = { x: Math.PI/2, y: -Math.PI/4, z: Math.PI };

function toggleLargeMast(section) {
    lgMastLock = false;
    // If no section is provided, use the currently active section
    var s = ( section === undefined ? activeSection : section );
    var tween = new TWEEN.Tween( lgMasts[s].rotation );
    var target = {
        x: ( lgMasts[s].rotation.x == lgRaisedAngles.x ?
             lgLoweredAngles.x : lgRaisedAngles.x ),
        y: ( lgMasts[s].rotation.y == lgRaisedAngles.y ?
             lgLoweredAngles.y : lgRaisedAngles.y ),
        z: ( lgMasts[s].rotation.z == lgRaisedAngles.z ?
             lgLoweredAngles.z : lgRaisedAngles.z )
    };
    tween.to( target, 1000 );
    tween.onComplete( function() {
        lgMastLock = true;
    } );
    tween.start();
}

//--------------------------------------------------------------------
// Open/Close the blades on the small turbine hub in the given section.
//--------------------------------------------------------------------
function toggleSmallBlades(section) {
    smBladesLock = false;
    // If no section is provided, use the currently active section
    var s = ( section === undefined ? activeSection : section );
    for (var i=1; i<3; ++i) {
        var tween = new TWEEN.Tween( smBlades[s][i].rotation );
        var target = {
            y: ( smBlades[s][i].rotation.y == smbOpenedAngles[i] ?
                 smbClosedAngles[i] : smbOpenedAngles[i] )
        };
        tween.to( target, 1000 );
        tween.onComplete( function() {
            smBladesLock = true;
        } );
        tween.start();
    }
}

//--------------------------------------------------------------------
// Open/Close the gates on the bridge in the given section.
//--------------------------------------------------------------------
var gateRaisedAngles = [  28*Math.PI/180, -28*Math.PI/180 ];
var gateLoweredAngles = [ -28*Math.PI/180, 28*Math.PI/180 ];

function toggleGates(section) {
    gateLock = false;
    var phi = section * Math.PI/2;
    // If no section is provided, use the currently active section
    var s = ( section === undefined ? activeSection : section );
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
            gateLock = true;
        } );
        tween.start();
    }
}
