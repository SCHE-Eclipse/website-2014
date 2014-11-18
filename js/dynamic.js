function initDynamicBodies() {
    for (var i=0; i<4; ++i) {
        var active = (i == activeSection);
        var phi = i*Math.PI/2;

        initChickens(i);

        x = 26;
        y = -108.5;
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        smMasts[i] = makeTurbineMast();
        smMasts[i].rotation.z = phi;
        //smMasts[i].rotation.x = -Math.PI/2 * Math.cos(phi);
        //smMasts[i].rotation.y = -Math.PI/2 * Math.sin(phi);
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
        
        x = -30;
        y = -130;
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        smBladeHubs[i] = makeSmallBladeHub(i);
        smBladeHubs[i].rotation.y = -phi;
        smBladeHubs[i].rotation.x = -Math.PI/2;
        smBladeHubs[i].position.set(r*Math.cos(theta+phi),
                                    r*Math.sin(theta+phi), 3.75);
        scene.add(smBladeHubs[i]);
        
        x = -55;
        y = -130;
        r = Math.sqrt(x*x + y*y);
        theta = Math.atan2(y, x);
        smNacelles[i] = makeSmallNacelle();
        smNacelles[i].rotation.z = phi+Math.PI/2;
        smNacelles[i].position.set(r*Math.cos(theta+phi),
                                   r*Math.sin(theta+phi), 3);
        
        scene.add(smNacelles[i]);
    }
}
/*
function initChickens() {
    for (var i=0; i<4; ++i) {
        var phi = i*Math.PI/2;
        chickens[i] = [];
        for (var j=0; j<3; ++j) {
            var x0 = 20;
            var y0 = 108-j*34;
            var z0 = 3.5;
            var r0 = Math.sqrt(x0*x0 + y0*y0);
            var theta = Math.atan2(y0,x0);
            var chicken = makeChicken(i);
            chicken.position.set(r0*Math.cos(theta+phi),
                                 r0*Math.sin(theta+phi), z0);
            chickens[i][j] = chicken;
            scene.add(chicken);
        }
    }
}
*/

function initChickens(section) {
    var phi = section * Math.PI/2;
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

function raiseSmallTurbineMast(section) {
    section = ( section === undefined ? activeSection : section );
    smMasts[section].userData.interval = setInterval( function() {
        if (section%2) {
            if (smMasts[section].rotation.y < 0) {
                smMasts[section].rotation.y += Math.PI/100;
                smMasts[section].userData.lowered = false;
            }
            else {
                smMasts[section].userData.raised = true;
                clearInterval(smMasts[section].userData.interval);
            }
        }
        else {
            if (smMasts[section].rotation.x < 0) {
                smMasts[section].rotation.x += Math.PI/100;
                smMasts[section].userData.lowered = false;
            }
            else {
                smMasts[section].userData.raised = true;
                clearInterval(smMasts[section].userData.interval);
            }
        }
    }, 10 );
}

function lowerSmallTurbineMast(section) {
    section = ( section === undefined ? activeSection : section );
    smMasts[section].userData.interval = setInterval( function() {
        if (section%2) {
            if (smMasts[section].rotation.y > -Math.PI/2) {
                smMasts[section].rotation.y -= Math.PI/100;
                smMasts[section].userData.raised = false;
            }
            else {
                smMasts[section].userData.lowered = true;
                clearInterval(smMasts[section].userData.interval);
            }
        }
        else {
            if (smMasts[section].rotation.x > -Math.PI/2) {
                smMasts[section].rotation.x -= Math.PI/100;
                smMasts[section].userData.raised = false;
            }
            else {
                smMasts[section].userData.lowered = true;
                clearInterval(smMasts[section].userData.interval);
            }
        }
    }, 10 );
}

function raiseLargeTurbineMast(section) {
    section = ( section === undefined ? activeSection : section );
    if (lgMasts[section].rotation.z < 1) {
        lgMasts[section].rotation.x += 0.02*Math.PI;
        lgMasts[section].rotation.y += 0.01*Math.PI;
        lgMasts[section].rotation.z += 0.01*Math.PI;
        lgMasts[section].__dirtyRotation = true;
    }
    else {
        lgMasts[section].userData.raised = false;
    }
}

function lowerLargeTurbineMast(section) {
    section = ( section === undefined ? activeSection : section );
    if (lgMasts[section].rotation.x > -Math.PI/2) {
        lgMasts[section].rotation.x -= 0.02*Math.PI;
        lgMasts[section].rotation.y -= 0.01*Math.PI;
        lgMasts[section].rotation.z -= 0.01*Math.PI;
        lgMasts[section].__dirtyRotation = true;
    }
    else {
        lgMasts[section].userData.raised = true;
    }
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

var smbOpenedAngles = [ 0, -2*Math.PI/3, 2*Math.PI/3 ];
var smbClosedAngles = [ 0, 2.5*Math.PI/180, -2.5*Math.PI/180 ];

function makeSmallBladeHub(i) {
    var path = new QuarterCircle(2);
    var smHubGeom = new THREE.CylinderGeometry(3.5, 3.5, 2.0, 6);
    var smbMountGeom = new THREE.CylinderGeometry(0.75, 0.75, 3, 16);
    var smbElbowGeom = new THREE.TubeGeometry(path, 10, 0.75, 16, false);
    var smCapGeom = new THREE.CylinderGeometry(0.75, 0.75, 0.5, 16);
    var smBladeGeom = new THREE.CylinderGeometry(0.5, 0.5, 20);

    smHub = new THREE.Mesh(smHubGeom, woodMat);
    smBlades[i] = [];
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

        smBlades[i][j] = smElbow;
        smBlades[i][j].userData.opened = false;
        smBlades[i][j].userData.closed = true;
        smHub.add(smbMount);
    }
    return smHub;
}

function openSmallBlades(i) {
    for (var j=1; j<3; ++j) {
        var begin = smBlades[i][j].rotation.clone();
        var end = smBlades[i][j].rotation.clone();
        end.y = smbOpenedAngles[j];
        smHubTweens[j] = new TWEEN.Tween( { blade: smBlades[i][j],
                                            rot: begin } );
        smHubTweens[j].to( { rot: end }, 2000 );
        smHubTweens[j].onUpdate( function() {
            smBlades[i][j].userData.closed = false;
            this.blade.rotation.y = this.rot.y;
            this.blade.__dirtyRotation = true;
        } );
        smHubTweens[j].onComplete( function() {
            smBlades[i][j].userData.opened = true;
            smHubTweens[j] = undefined;
        } );
        smHubTweens[j].start();
    }
}

function closeSmallBlades(index) {
    for (var i=1; i<3; ++i) {
        var begin = smHubs[index].children[i].rotation.clone();
        var end = smHubs[index].children[i].rotation.clone();
        end.y = smbClosedAngles[i];
        smHubTweens[i] = new TWEEN.Tween( { blade: smHubs[index].children[i],
                                            rot: begin } );
        smHubTweens[i].to( { rot: end }, 2000 );
        smHubTweens[i].onUpdate( function() {
            smHubs[index].children[i].userData.opened = false;
            this.blade.rotation.y += 0.001*(smbClosedAngles[i] - smbOpenedAngles[i]);
            this.blade.__dirtyRotation = true;
        } );
        smHubTweens[i].onComplete( function() {
            smHubTweens[i] = undefined;
            smHubs[index].children[i].userData.closed = true;
        } );
        smHubTweens[i].start();
    }
}
