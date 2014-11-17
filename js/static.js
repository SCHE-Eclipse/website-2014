function initStaticBodies() {
    initGround();
    initWalls();
    for (var i=0; i<4; ++i) {
        makeBridge(i);
        makeOSOW(i);
        makeSmallTurbineBase(i);
        makeLargeTurbineBase(i);
    }
}

// Create the surfaces on which the robot will be driving
function initGround() {
    // Materials
    var groundTex = THREE.ImageUtils.loadTexture( 'floor.png' );
    //var groundTex = THREE.ImageUtils.loadTexture( 'arena.png' );
    var groundMat = new THREE.MeshLambertMaterial( { map: groundTex } );
    
    // Ground
    var groundPlane = new THREE.PlaneGeometry(270, 270);
    var ground = new THREE.Mesh( groundPlane, groundMat );
    ground.visible = true;
    ground.receiveShadow = true;
    scene.add( ground );
    
    var road = makeBadRoad(activeSection);
    road.position.set(0, 0, 0.125);
    scene.add(road);
    for (var i=0; i<4; ++i) {
        var theta = i*Math.PI/2;
        road = makeBadRoad(i);
        road.position.set( 36*Math.sin(theta), 36*Math.cos(theta), 0.125);
        scene.add(road);
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
        var wallMesh1 = new THREE.Mesh( wallGeom1, woodMat);
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
        var wallMesh2 = new THREE.Mesh( wallGeom2, woodMat );
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
        var wallMesh3 = new THREE.Mesh( wallGeom3, woodMat);
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
//    var roadMat = Physijs.createMaterial( roadMat, 0.8, 0.2 );
    var roadMesh;
    roadMesh = new THREE.BoxMesh( roadGeom, roadMat);

    roadMesh.position.z = 0.125;
    roadMesh.receiveShadow = true;

    var bumpGeom = new THREE.CylinderGeometry(0.5, 0.5, 8.0);
    var bumpMat = new THREE.MeshLambertMaterial({color: 0x442200});
//    var bumpMat = Physijs.createMaterial( bumpMat, 0.8, 0.2 );
    var bump;
    var offset = 4.5*Math.cos(Math.PI/4)-17.5;
    for (var i=0; i<4; ++i) {
        for (var j=0; j<4; ++j);
            bump = new THREE.Mesh(bumpGeom, bumpMat);
            bump.rotation.z = Math.PI/4;
            bump.position.set(offset+9.5*i, offset+9.5*j, 0.25);
            bump.receiveShadow = true;
            roadMesh.add(bump);
        }
    }
    offset += 4.75;
    for (var i=0; i<3; ++i) {
        for (var j=0; j<3; ++j) {
            bump = new THREE.Mesh(bumpGeom, bumpMat);

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
    var gateGeom = new THREE.BoxGeometry(0.75, 60, 2);

    var center, ramp1, ramp2, up1, up2, bar1, bar2;
    center = new THREE.Mesh(plankGeom, woodMat);
    ramp1 = new THREE.Mesh(plankGeom, woodMat);
    ramp2 = new THREE.Mesh(plankGeom, woodMat);
    up1 = new THREE.Mesh(uprightGeom, woodMat);
    up2 = new THREE.Mesh(uprightGeom, woodMat);
    bar1 = new THREE.Mesh(gateGeom, woodMat);
    bar2 = new THREE.Mesh(gateGeom, woodMat);
 
    center.castShadow = true;
    ramp1.castShadow = true;
    ramp2.castShadow = true;
    up1.castShadow = true;
    up2.castShadow = true;
    bar1.castShadow = true;
    bar2.castShadow = true;

    center.receiveShadow = true;
    ramp1.receiveShadow = true;
    ramp2.receiveShadow = true;
    up1.receiveShadow = false;
    up2.receiveShadow = false;
    bar1.receiveShadow = true;
    bar2.receiveShadow = true;

    ramp1.rotation.y = -19*Math.PI/180;
    ramp1.position.set(-11.8, 0, -2);
    center.add(ramp1);

    ramp2.rotation.y = 19*Math.PI/180;
    ramp2.position.set( 11.8, 0, -2);
    center.add(ramp2);

    up1.position.set( 0, -20, 14);
    up2.position.set( 0,  20, 14);

    var gate1 = new THREE.Mesh(new THREE.BoxGeometry(0, 96, 1.5),
                               new THREE.MeshBasicMaterial({visible: false}));
    var gate2 = new THREE.Mesh(new THREE.BoxGeometry(0, 96, 1.5),
                               new THREE.MeshBasicMaterial({visible: false}));

    bar1.position.y =  18;
    bar2.position.y = -18;

    gate1.add(bar1);
    gate1.rotation.x = -28*Math.PI/180;
    gate1.position.set(  1, 0, 15);
    up1.add(gate1);
    center.add(up1);

    gate2.add(bar2);
    gate2.rotation.x =  28*Math.PI/180;
    gate2.position.set( -1, 0, 15);
    up2.add(gate2);
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
    backPlane = new THREE.Mesh(backPlaneGeom, woodMat);
    base = new THREE.Mesh(baseGeom, woodMat);
    foot1 = new THREE.Mesh(footGeom, woodMat);
    foot2 = new THREE.Mesh(footGeom, woodMat);
    arm = new THREE.Mesh(armGeom, woodMat);
    button = new THREE.Mesh(buttonGeom, woodMat);
    
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
    backPlane.rotation.z = phi;
    backPlane.position.set( 116.5*Math.sin(phi), 116.5*Math.cos(phi), 20);
    scene.add(backPlane);
}

function makeSmallTurbineBase (section) {
    var phi = section * Math.PI/2;
    var baseGeom = new THREE.BoxGeometry(18, 24, 0.75);
    var slabGeom = new THREE.BoxGeometry(16, 16, 1);
    var baseMesh, slabMesh;
    baseMesh = new THREE.Mesh(baseGeom, woodMat);
    slabMesh = new THREE.Mesh(slabGeom, stoneMat);

    slabMesh.position.set(0, 8, 0.875);
    baseMesh.add(slabMesh);

    var x = 26, y = -106, z = 0.375;
    var r = Math.sqrt(x*x + y*y);
    var theta = Math.atan2(y, x);
    baseMesh.rotation.z = phi;
    baseMesh.position.set(r*Math.cos(theta+phi),
                          r*Math.sin(theta+phi), z);

    scene.add(baseMesh);
}

function makeLargeTurbineBase (section) {
    var phi = section * Math.PI/2;
    var baseGeom = new THREE.BoxGeometry(18, 24, 0.75);
    var slabGeom = new THREE.BoxGeometry(16, 16, 1);
    var baseMesh, slabMesh;
    baseMesh = new THREE.Mesh(baseGeom, woodMat);
    slabMesh = new THREE.Mesh(slabGeom, stoneMat);
    slabMesh.position.set(0, 8, 0.875);
    baseMesh.add(slabMesh);

    var x = 95, y = -110, z = 0.375;
    var r = Math.sqrt(x*x + y*y);
    var theta = Math.atan2(y, x);
    baseMesh.rotation.z = phi+Math.PI/4;
    baseMesh.position.set(r*Math.cos(theta+phi),
                          r*Math.sin(theta+phi), z);

    scene.add(baseMesh);
}

