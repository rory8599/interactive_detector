function ParticleDraw(type, number)
{
    this.type = type;  
    this.sign = (Math.random() - 0.5 >= 0)? 1 : -1;
    this.length = 0;
    this.direction = 0;
    this.cpy1 = 0;
    this.cpy2 = 0;
    this.alpha = 1;
    this.radius = 1;

    var main = game.level.main.displayValue;
    //(number + Math.random())*Math.PI*2/main

    switch (this.type.name){
        case 'photon':
            this.length = detector.radius.siliconSpace * 1.2 * detector.ratio + (detector.radius.ecal * detector.ratio - detector.radius.siliconSpace * detector.ratio) * 0.4 * Math.random();
            this.direction = (0.1 + number + 0.8*Math.random())*Math.PI*2/main;
            this.cpy1 = 0;
            this.muon = false;
            break;
        case 'electron':
            this.length = detector.radius.siliconSpace * 1.2 * detector.ratio + (detector.radius.ecal * detector.ratio - detector.radius.siliconSpace * detector.ratio) * 0.4 * Math.random();
            this.direction = (number + Math.random())*Math.PI*2/main;
            this.cpy1 = this.length/(Math.max(4, Math.ceil(8*Math.random())));
            this.muon = false;
            break;
        case 'muon':
            this.length = 2 * detector.radius.magnet
            this.direction = (number + Math.random())*Math.PI*2/main;
            this.cpy1 = this.length/(Math.max(4, Math.ceil(10*Math.random())));
            this.cpy2 = -this.length/(Math.max(4, Math.ceil(10*Math.random())));
            this.muon = true;
            break;
        case 'nhadron':
            this.length = detector.radius.ecalSpace * 1.2 * detector.ratio + (detector.radius.hcal * detector.ratio - detector.radius.ecalSpace * detector.ratio) * 0.6 * Math.random();
            this.direction = (number + Math.random())*Math.PI*2/main;
            this.cpy1 = 0;
            this.muon = false;
            break;
        case 'chadron':
            this.length = detector.radius.ecalSpace * 1.2 * detector.ratio + (detector.radius.hcal * detector.ratio - detector.radius.ecalSpace * detector.ratio) * 0.6 * Math.random();
            this.direction = (number + Math.random())*Math.PI*2/main;
            this.cpy1 = this.length/(Math.max(4, Math.ceil(8*Math.random())));
            this.muon = false;
            break;    
    }
    //calls the function below
    this.draw(16, true)
};

ParticleDraw.prototype.draw = function(duration, init){
    init = typeof init !== 'undefined' ? init : false;

    var ctx = detector.events.ctx;
    var cx = detector.width/2;
    var cy = detector.height/2;
    var width = 2.5 * (1 + (window.screen.availWidth > 992 ? 0 : 1));

    ctx.save();

    if(this.radius<800){
        this.radius += 5;
        var rad = ctx.createRadialGradient(cx, cy, this.radius, cx, cy, this.radius+1);
        rad.addColorStop(0, this.type.color);
        rad.addColorStop(this.radius/850, "rgba(247,247,247,0)");    
        ctx.strokeStyle = rad;
    }else{
        ctx.strokeStyle = this.type.color;
    }
        
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.type.color;
    ctx.lineWidth = width;

    ctx.translate(cx, cy);
    ctx.rotate(this.direction);
    ctx.translate(-cx, -cy);

    ctx.beginPath();
    ctx.moveTo(cx,cy);

    if(this.muon){
        ctx.bezierCurveTo(
        cx + this.length/2,
        cy + this.sign * (this.cpy1),
        cx + this.length/2,
        cy + this.sign * (this.cpy2),
        cx + this.length,
        cy) 
    } else{
        ctx.quadraticCurveTo(
        cx + this.length/2,
        cy + this.sign * (this.cpy1),
        cx + this.length,
        cy)
    }
 
    ctx.stroke();
    ctx.restore();

    //controls how long the tracks stay for here
    let index, difficulty, time;
    index = game.level.main.displayValue;
    difficulty = game.difficulty;
    time = 100*Math.min((index + 2), 5) + 300*Math.max((index - 3), 0);

    if(!init){
        if(this.radius>800){
            this.alpha -= ((0.008 - Math.min((0.00001*time), 0.0079)) * difficulty)/16*duration;
        }
    }    
}