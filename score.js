function computeScore() {
    if (!OSOWPushed) return 0;
    var score = 0;
    score += computeChickenScore(chicks);
    score += computeSBladesScore();
    score += computeSNacelleScore();
    score += computeLBladeScore();
    score += computeOSOWScore();
    score += computeGateScore();
    if(score < 0) score = 0;
    return score;
}

function computeChickenScore(Chickens) { //chickens are done!
    var chicks = [];
    for(var i=0;i<3;i++){
	var c = {
	    alive: 
	    safe: ((chickens[i].position.x>111)&&(chickens[i].position.y<-87))
	};
	chicks.push(c);
    }
    
    var score=0;
    for (var i=0; i<3; i++){
	var alive = (chicken[i].matrixWorld.elements[6] > 0.5);
	var safe = false;
	if (activeSession == 0) {
	    safe = ( chicken[i].position.x < -87 && chicken[i].position.y < -111 );
	}
	else if ( activeSession == 1) {
	    safe = ( chicken[i].position.x > 111 && chicken[i].position.y < -87 );
	}
	else if ( activeSession == 2) {
	    safe = ( chicken[i].position.x > 87 && chicken[i].position.y > 111 );
	}
	else if ( activeSession == 3 ) {
	    safe = ( chicken[i].position.x < -111 && chicken[i].position.y > 87 );
	}
		      
        if(alive) {
	    score+=4;
	    if (chicks[i].safe) {
		score+=6;
	    }
	}
	else {
	    score-=10;
	}
    }
    return score;
}

function computeSBladesScore(SBlades) {
    var SBlades = { 
	trans: (SBlades[i].position.y > 0)
	installed: 
    };
    SBlades.push(c)
}

    var score=0;
    var trans = false;
    var installed = false;
    if (activeSession == 0) {
	trans = (SBlades.position.y < 0 && SBlades.position.x < 0 );
    }
    
    else if (activeSession == 1) {
	trans = (SBlades.position.y < 0 && SBlades.position.x > 0 );
    }

    else if (activeSession == 2) {
	trans = (SBlades.position.y > 0 && SBlades.position.x > 0 );
    }

    else if (activeSession == 3) {
	trans = (SBlades.position.y > 0 && SBlades.position.x < 0 );
    }
    
    if(SBlades.trans) {
	score+=30;
	if(SNacelle.installed && SBlades.installed){
	    score+=30;
	    if (smMasts[s].rotation.y == smRaisedAngles.y){
		score+=20;
	    }
	}
    }
    return score;
}

function computeSNacelleScore(SNacelle) {
    var SNacelle = {
	trans: (SNacelle[i].position.y > 0),
	installed: 
    };
    SNacelle.push(c);
}

    var score=0;
    var trans = false;
    var installed = false;
    if (activeSession == 0) {
	trans = (SNacelle.position.y < 0 && SNacelle.position.x < 0 );
    }
    
    else if (activeSession == 1) {
	trans = (SNacelle.position.y < 0 && SNacelle.position.x > 0 );
    }
    
    else if (activeSession == 2) {
	trans = (SNacelle.position.y > 0 && SNacelle.position.x > 0 );
    }
    
    else if (activeSession == 3) {
	trans = (SNacelle.position.y > 0 && SNacelle.position.x < 0 );
    }

    if(SNacelle.trans) {
	score=+30;
	if(SNacelle.installed) {
	    score+=30;
	    if (smMasts[s].rotation.y == smRaisedAngles.y){
		score+=20;
	    }
	}
    }
    return score;
}

function computeLBladeScore(LBlade) {
    var LBlade = [];
    for (var i=0; i<3; i++){
	var c = {
	    trans:(LBlade[i].position.y > 0),
	     pos1: false,
	     pos2: false 
	    };
	c.trans = false; //(LBlade[i].position.x > 0);
	LBlade.push(c);
    }
  
    var score=0;
    var trans = false;
    var pos1 = false;
    var pos2 = false;
    if (activeSession == 0) {
	trans = (LBlade.position.y < 0 && LBlade.position.x < 0 );
    }
    
    else if (activeSession == 1) {
	trans = (LBlade.position.y < 0 && LBlade.position.x > 0 );
    }
    
    else if (activeSession == 2) {
	trans = (LBlade.position.y > 0 && LBlade.position.x > 0 );
    }
    
    else if (activeSession == 3) {
	trans = (LBlade.position.y > 0 && LBlade.position.x < 0 );
    }
    for (var i=0; i<3; i++){
	if(LBlade[i].trans){
	    score+=10;
	    if (LBlade[i].pos1){
		score+=30;
		if (lgMasts[s].rotation.y == lgRaisedAngles.y){
		score+=20;
		}
	    }
	    else if (LBlade[i].pos2){   
		score+=50;
	    }
	}
    }  
    return score;
}

function computeOSOWScore(OSOW) {
    var OSOW = {
	if OSOW
    };
    OSOW.push(c);
}
    var score=0;
    var on = false;
    if (activeSession == 0) {
	on = (Robot.position.y > -20 && Robot.position.y < 0 && Robot.position.x < -100 && Robot.position.x > -130 );
	
    }
    else if (activeSession == 1) {
	on = (Robot.position.y < 20 && Robot.position.y > 0 && Robot.position.x > 100 && Robot.position.x < 130 );
	
    }
    else if (activeSession == 2) {
	on = (Robot.position.y < 20 && Robot.position.y > 0 && Robot.position.x > 111 && Robot.position.x < 150 );
	
    }
    else if (activeSession == 3) {
	on = (Robot.position.y < 20 && Robot.position.y > 0 && Robot.position.x < -111 && Robot.position.x > -150 );
	
    }
    
    if(OSOW.on){
	score+=5;
    }
    return score;
}

function computeGateScore(Gate) {
    var Gate= [];
    for (var i=0; i<2; i++) {
    var c = {
	open: ( gates[s][i].rotation.x == gateRaisedAngles[i]*Math.cos(phi))
    };                                                                         
    Gate.push(c);
}
    var score=0;
        var on = false;
    if (activeSession == 0) {
	open = ( Robot.position.y > -20 && Robot.position.y < 0 && Robot.position.x < -50 && Robot.position.x > -100 );
	
    }
    else if (activeSession == 1) {
		on = ( Robot.position.y > -20 && Robot.position.y < 0 && Robot.position.x > 50 && Robot.position.x < 100 );
	
    }
    else if (activeSession == 2) {
	on = ( Robot.position.y < 20 && Robot.position.y > 0 && Robot.position.x > 50 && Robot.position.x < 100 );
	
	
    }
    else if (activeSession == 3) {
	on = ( Robot.position.y < 20 && Robot.position.y > 0 && Robot.position.x < -50 && Robot.position.x > -100 );
	
    }

    for (var i=0; i<2; i++) {
	if(Gate[i].open){
	    score+=5;
	}
    }
    return score;	
}

