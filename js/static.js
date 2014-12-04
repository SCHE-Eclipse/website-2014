function initStaticBodies() {
    initGround();
    initWalls();
    for (var i=0; i<4; ++i) {
        makeBridge(i);
        makeOSOW(i);
    }
}

// Create the surfaces on which the robot will be driving
function initGround() {
    // Materials
    var groundTex = THREE.ImageUtils.loadTexture( 'images/floor.png' );
    //var groundTex = THREE.ImageUtils.loadTexture( 'arena.png' );
    var groundMat = new THREE.MeshLambertMaterial( { map: groundTex } );
    
    // Ground
    var groundPlane = new THREE.PlaneGeometry(270, 270);
    var ground = new Physijs.BoxMesh( groundPlane, groundMat );
    ground.visible = true;
    ground.receiveShadow = true;
    scene.add( ground );
    
    var road = makeBadRoad(activeSection);
    road.position.set(0, 0, 0.125);
    scene.add(road);
    for (var i=0; i<4; ++i) {
        var phi = i*Math.PI/2;
        road = makeBadRoad(i);
        road.position.set( 36*Math.sin(phi), 36*Math.cos(phi), 0.125);
        scene.add(road);

        var cactus = makeCactus();
        var x = -18, y=-18;
        var r = Math.sqrt(x*x + y*y);
        var theta = Math.atan2(y, x);
        cactus.position.set( r*Math.cos(phi+theta),
                             r*Math.sin(phi+theta),
                             18 );
        cactus.rotation.z = phi + theta + Math.PI;
        scene.add(cactus);
    }
}

function initWalls(section) {
    // Borders
    var wallGeom1 = new THREE.BoxGeometry( 271.5, 1.5, 3.5 );
    var wallGeom2 = new THREE.BoxGeometry( 24, 1.5, 3.5 );
    var wallGeom3 = new THREE.BoxGeometry( 158.4, 1.5, 3.5 );
    for (var i=0; i<4; ++i) {
        var theta = i*Math.PI/2;

        var x1 = 0.75;
        var y1 = 135.75;
        var r1 = Math.sqrt(x1*x1 + y1*y1);
        var theta1 = Math.atan2(y1, x1);
        var wallMesh1 = new Physijs.BoxMesh( wallGeom1, woodMat);
        wallMesh1.rotation.z = theta;
        wallMesh1.position.set( r1*Math.cos(theta + theta1),
                                r1*Math.sin(theta + theta1),
                                1.85 );
        wallMesh1.castShadow = true;
        wallMesh1.receiveShadow = true;
        scene.add( wallMesh1 );

        var x2 = 123.0;
        var y2 = 111.0;
        var r2 = Math.sqrt(x2*x2 + y2*y2);
        var theta2 = Math.atan2(y2, x2);
        var wallMesh2 = new Physijs.BoxMesh( wallGeom2, woodMat );
        wallMesh2.rotation.z = theta;
        wallMesh2.position.set( r2*Math.cos(theta + theta2),
                                r2*Math.sin(theta + theta2),
                                1.85 );
        wallMesh2.castShadow = true;
        wallMesh2.receiveShadow = true;
        scene.add( wallMesh2 );
        
        var x3 = 56.0;
        var y3 = 56.0;
        var r3 = Math.sqrt(x3*x3 + y3*y3);
        var theta3 = Math.atan2(y3, x3);
        var wallMesh3 = new Physijs.BoxMesh( wallGeom3, woodMat);
        wallMesh3.rotation.z = theta + Math.PI/4;
        wallMesh3.position.set( r3*Math.cos(theta + theta3),
                                r3*Math.sin(theta + theta3),
                                1.85 );
        wallMesh3.castShadow = true;
        wallMesh3.receiveShadow = true;
        scene.add( wallMesh3 );
    }
}

function makeBadRoad(section) {
    var active = (section == activeSection);

    var roadGeom = new THREE.BoxGeometry(36, 36, 0.25);
    var roadMat = new THREE.MeshLambertMaterial({color: 0x664422});
    var roadMat = Physijs.createMaterial( roadMat, 0.8, 0.2 );
    var roadMesh = new THREE.Mesh( roadGeom, roadMat);

    roadMesh.position.z = 0.125;
    roadMesh.receiveShadow = true;

    var bumpGeom = new THREE.CylinderGeometry(0.5, 0.5, 8.0);
    var bumpMat = new THREE.MeshLambertMaterial({color: 0x442200});
    var bumpMat = Physijs.createMaterial( bumpMat, 0.8, 0.2 );
    var bump;
    var offset = 4.5*Math.cos(Math.PI/4)-17.5;
    for (var i=0; i<4; ++i) {
        for (var j=0; j<4; ++j) {
            bump = new Physijs.BoxMesh(bumpGeom, bumpMat);
            bump.rotation.z = Math.PI/4;
            bump.position.set(offset+9.5*i, offset+9.5*j, 0.25);
            bump.receiveShadow = true;
            roadMesh.add(bump);
        }
    }
    offset += 4.75;
    for (var i=0; i<3; ++i) {
        for (var j=0; j<3; ++j) {
            bump = new Physijs.BoxMesh(bumpGeom, bumpMat);
	    
            bump.rotation.z = -Math.PI/4;
            bump.position.set(offset+9.5*i, offset+9.5*j, 0.25);
            bump.receiveShadow = true;
            roadMesh.add(bump);
        }
    }
    return roadMesh;
}

// Create the ramp/bridge geometry
function makeBridge(section) {
    var active = (section == activeSection);

    var plankGeom = new THREE.BoxGeometry(12,36,0.25);
    var uprightGeom = new THREE.BoxGeometry(0.75, 4, 36);

    var center, ramp1, ramp2, up1, up2;
    center = new Physijs.BoxMesh(plankGeom, woodMat);
    ramp1 = new Physijs.BoxMesh(plankGeom, woodMat);
    ramp2 = new Physijs.BoxMesh(plankGeom, woodMat);
    up1 = new Physijs.BoxMesh(uprightGeom, woodMat);
    up2 = new Physijs.BoxMesh(uprightGeom, woodMat);
 
    center.castShadow = true;
    ramp1.castShadow = true;
    ramp2.castShadow = true;
    up1.castShadow = true;
    up2.castShadow = true;

    center.receiveShadow = true;
    ramp1.receiveShadow = true;
    ramp2.receiveShadow = true;
    up1.receiveShadow = false;
    up2.receiveShadow = false;

    ramp1.rotation.y = -19*Math.PI/180;
    ramp1.position.set(-11.8, 0, -2);
    center.add(ramp1);

    ramp2.rotation.y = 19*Math.PI/180;
    ramp2.position.set( 11.8, 0, -2);
    center.add(ramp2);

    up1.position.set( 0, -20, 14);
    up2.position.set( 0,  20, 14);
    center.add(up1);
    center.add(up2);

    var phi = section * Math.PI/2;
    center.rotation.z = phi;
    center.position.set( 76*Math.sin(phi), 76*Math.cos(phi), 4);
    scene.add(center);
}

function makeOSOW (section) {
    active = (section == activeSection);
    var backPlaneGeom = new THREE.BoxGeometry( 0.25, 24.0, 32.0);
    var baseGeom = new THREE.BoxGeometry( 1.5, 35.25, 3.5);
    var footGeom = new THREE.BoxGeometry( 24.0, 0.75, 3.5);
    var armGeom = new THREE.BoxGeometry(0.75, 1.5, 24);
    var buttonGeom = new THREE.BoxGeometry(1.5, 1.5, 6);

    var backPlane, base, foot1, foot2, arm, button;
    backPlane = new Physijs.BoxMesh(backPlaneGeom, woodMat);
    base = new Physijs.BoxMesh(baseGeom, woodMat);
    foot1 = new Physijs.BoxMesh(footGeom, woodMat);
    foot2 = new Physijs.BoxMesh(footGeom, woodMat);
    arm = new Physijs.BoxMesh(armGeom, woodMat);
    button = new Physijs.BoxMesh(buttonGeom, woodMat);
    
    backPlane.position.set(0, 0, 20);
    backPlane.castShadow = true;
    backPlane.receiveShadow = true;

    //osowBase.position.set(0, 0, 1.75);
    base.position.set(0, 0, -18.25);
    base.castShadow = true;
    base.receiveShadow = true;
    backPlane.add(base);

    //osowFoot1.position.set(0, 18, 1.75);
    foot1.position.set(0, 18, -18.25);
    foot1.castShadow = true;
    foot1.receiveShadow = true;
    backPlane.add(foot1);

    //osowFoot1.position.set(0, 18, 1.75);
    foot2.position.set(0, -18, -18.25);
    foot2.castShadow = true;
    foot2.receiveShadow = true;
    backPlane.add(foot2);

    arm.position.set(0, -12.85, 4);
    arm.castShadow = true;
    arm.receiveShadow = true;
    backPlane.add(arm);

    button.position.set(1.125, -12.85, -5);
    button.castShadow = true;
    button.receiveShadow = true;
    backPlane.add(button);

    var phi = section * Math.PI/2;
    backPlane.rotation.z = -phi;
    backPlane.position.set( 116.5*Math.sin(phi), 116.5*Math.cos(phi), 20);
    scene.add(backPlane);
}

function makeCactus() {
    var c1Rgeom = new THREE.BoxGeometry(2,1,36);
    var c1Rmat = new THREE.MeshLambertMaterial( { color: 0x990000 } );
    var c1Rmesh = new THREE.Mesh(c1Rgeom, c1Rmat);
    c1Rmesh.position.z = 10;
    c1Rmesh.position.x = -10;
    c1Rmesh.position.y = -1;
    c1Rmesh.rotation.y = -Math.PI/5;

    var c1Lgeom = new THREE.BoxGeometry(2,1,24);
    var c1Lmat = new THREE.MeshLambertMaterial( { color: 0x000077 } );
    var c1Lmesh = new THREE.Mesh(c1Lgeom, c1Lmat);
    c1Lmesh.position.z = 9;
    c1Lmesh.position.x = 6;
    c1Lmesh.position.y = 1;
    c1Lmesh.rotation.y = Math.PI/5;

    var c1Bgeom = new THREE.BoxGeometry(4,1,36);
    var c1Bmat = new THREE.MeshLambertMaterial( { color: 0xAA8800 } );
    var c1Bmesh = new THREE.Mesh(c1Bgeom, c1Bmat);

    c1Bmesh.add(c1Rmesh);
    c1Bmesh.add(c1Lmesh);

    return c1Bmesh;
}
