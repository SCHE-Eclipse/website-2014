function buildRobot() {
    var robot=new THREE.Object3D();
    robot.position.x = 0;
    robot.position.y = 0;
    robot.position.z = 5;
    var bodyGeom = new THREE.CylinderGeometry(0,0,0);
    var bodyMat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    var bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    robot.add (bodyMesh);
    var b1Geom = new THREE.CylinderGeometry(0.5,0.5,10.25);
    var b1Mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    var b1Mesh = new THREE.Mesh(b1Geom,b1Mat);
    b1Mesh.position.x = -4.7;
    b1Mesh.position.y = 5;
    b1Mesh.position.z = -1;
    b1Mesh.rotation.z = 90*Math.PI/180;
    b1Mesh.rotation.y = -55*Math.PI/180;
    robot.add(b1Mesh);
    // robot.add (bodyMesh);
    var b2Geom = new THREE.CylinderGeometry(0.5,0.5, 10.25);
    var b2Mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    var b2Mesh = new THREE.Mesh(b2Geom,b2Mat);
    b2Mesh.position.x = -4.7;
    b2Mesh.position.y = -5;
    b2Mesh.position.z = -1;
    b2Mesh.rotation.z = 90*Math.PI/180;
    b2Mesh.rotation.y = -55*Math.PI/180;
    robot.add(b2Mesh);
    // robot.add (bodyMesh);
    var b4Geom = new THREE.CylinderGeometry(0.5,0.5,16);
    var b4Mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    var b4Mesh = new THREE.Mesh(b4Geom,b4Mat);
    b4Mesh.position.x = 4.15;
    b4Mesh.position.y = -5;
    b4Mesh.position.z = -0.5;
    b4Mesh.rotation.z = 90*Math.PI/180;
    b4Mesh.rotation.y = 35*Math.PI/180;
    robot.add(b4Mesh);
    var b3Geom = new THREE.CylinderGeometry(0.5,0.5,10.65);
    var b3Mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    var b3Mesh = new THREE.Mesh(b3Geom,b3Mat);
    b3Mesh.position.x = -7.5;
    b3Mesh.position.y = 0;
    b3Mesh.position.z = -4.25;
    robot.add(b3Mesh);
    var b5Geom = new THREE.CylinderGeometry(0.5,0.5,16.6);
    var b5Mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    var b5Mesh = new THREE.Mesh(b5Geom,b5Mat);
    b5Mesh.position.x = 4.15;
    b5Mesh.position.y = 5;
    b5Mesh.position.z = 0;
    b5Mesh.rotation.z = 90*Math.PI/180;
    b5Mesh.rotation.y = 35*Math.PI/180;
    robot.add(b5Mesh);
    var skid1Geom = new THREE.CylinderGeometry(0.5,0.5,1.5);
    var skid1Mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    var skid1Mesh = new THREE.Mesh(skid1Geom,skid1Mat);
    skid1Mesh.position.x = 11.3;
    skid1Mesh.position.y = 5;
    skid1Mesh.position.z = -4.5;
    skid1Mesh.rotation.z = 90*Math.PI/180;
    skid1Mesh.rotation.y = 170*Math.PI/180;
    robot.add(skid1Mesh);
    var skid2Geom = new THREE.CylinderGeometry(0.5,0.5,1.5);
    var skid2Mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    var skid2Mesh = new THREE.Mesh(skid2Geom,skid2Mat);
    skid2Mesh.position.x = 11.3;
    skid2Mesh.position.y = -5;
    skid2Mesh.position.z = -4.65;
    skid2Mesh.rotation.z = 90*Math.PI/180;
    skid2Mesh.rotation.y = 170*Math.PI/180;
    robot.add(skid2Mesh);
    var wheelgeom=new THREE.CylinderGeometry(5,5,0.5,16);
    var wheelmat = new THREE.MeshBasicMaterial( { color: 0x662200 } );
    var wheelmesh=new THREE.Mesh(wheelgeom, wheelmat);
    robot.add(bodyMesh);
    wheelmesh.position.x=0;
    wheelmesh.position.y=-6;
    wheelmesh.position.z=0;
    robot.add(wheelmesh);
    var wheelgeom2=new THREE.CylinderGeometry(5,5,0.5,16);
    var wheelmat2=new THREE.MeshBasicMaterial( { color: 0x662200 } );
    var wheelmesh2=new THREE.Mesh(wheelgeom2, wheelmat2);
    wheelmesh2.position.x=0;
    wheelmesh2.position.y=6;
    wheelmesh2.position.z=0;
    robot.add(wheelmesh2);
    var plankgeom=new THREE.BoxGeometry(14,10,0.5)
    var plankmat=new THREE.MeshBasicMaterial( { color:0x663300 } );
    var plankmesh=new THREE.Mesh(plankgeom,plankmat);
    plankmesh.position.x=4.3;
    plankmesh.position.y=0;
    plankmesh.position.z=0.5;
    plankmesh.rotation.y= 35*Math.PI/180;
    robot.add(plankmesh);
    var rodgeom=new THREE.BoxGeometry(15,3,1.5);
    var rodmat=new THREE.MeshBasicMaterial( { color: 0x773300 } );
    var rodmesh=new THREE.Mesh(rodgeom,rodmat);
    rodmesh.position.x=7.1;
    rodmesh.position.y=0;
    rodmesh.position.z=7;
    rodmesh.rotation.y=78;
    robot.add(rodmesh);
    window.addEventListener('keydown', function(e){
	var step = 1.5;//distance moved when a key is pressed.
	var deg = 10 //degrees to rotate when key pressed.
	var rot= deg*Math.PI/180;
	var theta = robot.rotation.z;
	var dx = Math.cos(theta);
	var dy = Math.sin(theta);
	switch(e.keyCode){
	case 87://w
	    robot.position.x += step*dx;
	    robot.position.y += step*dy;
	    break;
	case 65://a
	    robot.rotation.z+=rot;
	    break;
	case 83://s
	    robot.position.x -= step*dx;
	    robot.position.y -= step*dy;
	    break;
	case 68://d
	    robot.rotation.z-=rot;
	    break;
	}
	});
    return robot;
    //Thus sayeth the Chicken Chucker, "My fair brethren, what hast
    //ye done to me? Why shall I hurl chickens to yonder places,
    //when, indeed, I am supposed to save them, and bring the pitieous
    //prairie fowl to place of refuge? Why then, are ye so foolish as
    //to christen me this unbefitting name?"

    //                                         --From the desk of the
    //                                         Humble Scribe of his
    //                                         Majesty The Chicken
    //                                         Chucker

}
