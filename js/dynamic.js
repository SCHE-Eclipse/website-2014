function initDynamicBodies() {
    for (var i=0; i<4; ++i) {
        var active = (i == activeSection);
        var phi = i*Math.PI/2;

        initChickens(i);
        initLargeBlades(i);

        x = -30;
        y = -120;
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        makeSmallBladeHub(i, r*Math.cos(theta+phi),
                          r*Math.sin(theta+phi), 2);

        x = -70;
        y = -125;
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        smNacelles[i] = makeSmallNacelle();
        smNacelles[i].rotation.z = phi-Math.PI/2;
        smNacelles[i].position.set(r*Math.cos(theta+phi),
                                   r*Math.sin(theta+phi), 10);
        
        scene.add(smNacelles[i]);
    }
}

function initChickens(section) {
    var s = ( section === undefined ? activeSection : section );
    var phi = s * Math.PI/2;
    var active = (section == activeSection);
    var lowerGeom = new THREE.CylinderGeometry(2, 2, 7, 16);
    var upperGeom = new THREE.CylinderGeometry(2.25, 2.25, 3, 16);
    for (var j=0; j<3; ++j) {
        var x=-20, y=j*34-108, z = 3.5;
        var r = Math.sqrt(x*x + y*y);
        var theta = Math.atan2(y, x);
        var lower = new THREE.Mesh(lowerGeom, pvcMat);
        lower.castShadow = true;
        lower.receiveShadow = true;
        lower.rotation.x = Math.PI/2;
        lower.position.set(r*Math.cos(theta+phi), r*Math.sin(theta+phi), z);

        var upper = new THREE.Mesh(upperGeom, pvcMat);
        upper.castShadow = true;
        upper.receiveShadow = true;
        upper.position.set(0, 3.5, 0);
        lower.add(upper);
        scene.add(lower);
        if (active) {
            chickens[j] = lower;
        }
    }
}


function initLargeBlades(section) {
    var s = ( section === undefined ? activeSection : section );
    var x = [ -50, -73, -47, -66, -40, -63 ];
    var y = [ -60, -87, -67, -90, -70, -97 ];
    var z = [ 0.75, 3.25, 0.75, 3.25, 0.75, 3.25 ];
    var phi = s * Math.PI/2;
    for (var i=0; i<6; ++i) {
        r = Math.sqrt(x[i]*x[i] + y[i]*y[i]);
        theta = Math.atan2(y[i], x[i]);
        var lgBlade = makeLargeTurbineBlade();
        lgBlade.rotation.z = phi + Math.cos(i*Math.PI/2)*Math.PI - Math.PI/4;
        lgBlade.position.set(r*Math.cos(theta+phi),
                             r*Math.sin(theta+phi),
                             z[i]);
        scene.add(lgBlade);
    }
}

function makeLargeTurbineBlade() {
    var blade = new THREE.Group();

    var foamGeom = new THREE.CylinderGeometry(1.5, 1.5, 32, 16);
    var endCapGeom = new THREE.CylinderGeometry(1.25, 1.25, 1.5, 16);
    var tubeGeom = new THREE.CylinderGeometry(1.0, 1.0, 2.0, 16);
    var crossGeom = new THREE.CylinderGeometry(1.25, 1.25, 4.0, 16);
    var stemGeom = new THREE.CylinderGeometry(1.25, 1.25, 4.0, 16);

    var foamMesh = new THREE.Mesh(foamGeom, foamMat);
    var endMesh1 = new THREE.Mesh(endCapGeom, pvcMat);
    var endMesh2 = new THREE.Mesh(endCapGeom, pvcMat);
    var tubeMesh1 = new THREE.Mesh(tubeGeom, pvcMat);
    var tubeMesh2 = new THREE.Mesh(tubeGeom, pvcMat);
    var crossMesh = new THREE.Mesh(crossGeom, pvcMat);
    var stemMesh = new THREE.Mesh(endCapGeom, pvcMat);

    crossMesh.rotation.z = Math.PI/2;
    blade.add(crossMesh);

    stemMesh.position.y = 1.25;
    blade.add(stemMesh);

    tubeMesh1.rotation.z = Math.PI/2;
    tubeMesh1.position.x = -3.0;
    blade.add(tubeMesh1);

    tubeMesh2.rotation.z = Math.PI/2;
    tubeMesh2.position.x =  3.0;
    blade.add(tubeMesh2);

    foamMesh.position.y = 18;
    blade.add(foamMesh);

    endMesh1.rotation.z = Math.PI/2;
    endMesh1.position.x = -4.0;
    blade.add(endMesh1);

    endMesh2.rotation.z = Math.PI/2;
    endMesh2.position.x =  4.0;
    blade.add(endMesh2);

    return blade;
}

function makeSmallNacelle() {
    var lgPvcGeom = new THREE.CylinderGeometry(.5, .5, 18, 16, 1, true);
    var smNacelle = new THREE.Mesh(lgPvcGeom, pvcMatDS);

    var smPvcGeom = new THREE.CylinderGeometry(.5, .5, 12, 16, 1, true);
    // inner ring
    var r  = 1;
    for (var l = 0; l < 6; l++) {
	      var theta = l * Math.PI / 3 + Math.PI / 6;
	      var x = r * Math.sin(theta);
	      var z = r * Math.cos(theta);
	      var mesh = new THREE.Mesh(smPvcGeom, pvcMatDS);
	      mesh.castShadow = true;
	      mesh.receiveShadow = false;
	      mesh.position.set(x, -2, z);
	      smNacelle.add(mesh);
    };
    // outer ring
    r = Math.sqrt(3);
    for (var j = 0; j < 6; j++) {
	      var theta = j * Math.PI / 3;
	      var x = r * Math.sin(theta);
	      var z = r * Math.cos(theta);
	      var mesh = new THREE.Mesh(smPvcGeom, pvcMatDS);
	      mesh.castShadow = true;
	      mesh.receiveShadow = false;
	      mesh.position.set(x, -2, z);
	      smNacelle.add(mesh);
    };
    
    var joinGeom = new THREE.CylinderGeometry(0.5, 0.5, 5, 16, 1, true);
    var join = new THREE.Mesh(joinGeom, pvcMatDS);
    join.rotation.z = 90*Math.PI/180;
    join.position.set(4.5, 0, -0.5);
    smNacelle.add(join);

    var bottomGeom = new THREE.BoxGeometry(4, 12, .25);
    var bottom = new THREE.Mesh(bottomGeom, woodMat);
    bottom.position.set(0, -2, -1.5);
    smNacelle.add(bottom);

    var sideGeom = new THREE.BoxGeometry(-2.25, 12, .25);
    var side = new THREE.Mesh(sideGeom, woodMat);
    side.rotation.y = 90*Math.PI/180;
    side.position.set(2.5, -2, -0.5);
    smNacelle.add(side);

    //wheels
    var wheelGeom = new THREE.SphereGeometry(.75, 8, 6);
    var x = [1.5, -1.5, -1.5, 1.5];
    var y = [2.5, 2.5, -6.5, -6.5];
    for (var n = 0; n < 4; n++) {
	      var wheel = new THREE.Mesh(wheelGeom, pvcMat);
	      wheel.position.set(x[n], y[n], -2.25);
	      smNacelle.add(wheel);
    }

    return smNacelle;
}

var QuarterCircle = THREE.Curve.create( 
    function(scale) {
        this.scale = ( scale===undefined ? 1 : scale );
    },
    function(t) {
        var tx = 1.0-Math.cos(Math.PI*t/2);
        var ty = Math.sin(Math.PI*t/2);
        var tz = 0.0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
);

function makeSmallBladeHub(section) {
    var s = ( section === undefined ? activeSection : section );
    var path = new QuarterCircle(2);
    var smHubGeom = new THREE.CylinderGeometry(3.5, 3.5, 2.0, 6);
    var smbMountGeom = new THREE.CylinderGeometry(0.75, 0.75, 3, 16);
    var smbElbowGeom = new THREE.TubeGeometry(path, 10, 0.75, 16, false);
    var smCapGeom = new THREE.CylinderGeometry(0.75, 0.75, 0.5, 16);
    var smBladeGeom = new THREE.CylinderGeometry(0.5, 0.5, 20);

    smHub = new THREE.Mesh(smHubGeom, woodMat);
    smBlades[s] = [];
    for (var j=0; j<3; ++j) {
        var x = 2.125*Math.cos(j*2*Math.PI/3);
        var y = -0.5;
        var z = 2.125*Math.sin(j*2*Math.PI/3);
        var smbMount = new THREE.Mesh(smbMountGeom, pvcMat);
        smbMount.position.set(x, y, z);
        
        var smElbow = new THREE.Mesh(smbElbowGeom, pvcMat);
        smElbow.rotation.y = smbClosedAngles[j];
        smElbow.position.set(0, 1.5, 0);
        smbMount.add(smElbow);

        var smCap = new THREE.Mesh(smCapGeom, pvcMat);
        smCap.rotation.z = Math.PI/2;
        smCap.position.set(2.25, 2, 0);
        smElbow.add(smCap);

        var smBlade = new THREE.Mesh(smBladeGeom, pvcMat);
        smBlade.rotation.z = Math.PI/2;
        smBlade.position.set(11, 2, 0);
        smElbow.add(smBlade);

        smBlades[s][j] = smElbow;
        smHub.add(smbMount);
    }
    return smHub;
}
