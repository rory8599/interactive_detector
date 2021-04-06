
function ParticleDraw(type)
{
    this.type = type;  
    this.sign = (Math.random() - 0.5 >= 0)? 1 : -1;
    this.length = 0;
    this.direction = 0;
    this.cpy1 = 0;
    this.cpy2 = 0;
    this.alpha = 1;

    //declare the length, radius and direction for each of the 5 types
        //length
    switch (this.type.name){
        case 'photon':
            this.length = detector.radius.siliconSpace * detector.ratio + (detector.radius.ecal * detector.ratio - detector.radius.siliconSpace * detector.ratio)*Math.random();
            this.direction = Math.random()*Math.PI*2;
            this.cpy1 = 0;
            this.cpy2 = 0;
            break;
        case 'electron':
            this.length = detector.radius.siliconSpace * detector.ratio + (detector.radius.ecal * detector.ratio +10 - detector.radius.siliconSpace * detector.ratio)*Math.random();
            this.direction = Math.random()*Math.PI*2;
            this.cpy1 = this.length/(Math.max(4, Math.ceil(10*Math.random())));
            this.cpy2 = this.length/(Math.max(4, Math.ceil(10*Math.random())));
            break;
        case 'muon':
            this.length = 2 * detector.radius.magnet
            this.direction = Math.random()*Math.PI*2;
            this.cpy1 = this.length/(Math.max(4, Math.ceil(10*Math.random())));
            this.cpy2 = -this.length/(Math.max(4, Math.ceil(10*Math.random())));
            break;
        case 'nhadron':
            this.length = detector.radius.ecalSpace * detector.ratio + (detector.radius.hcal * detector.ratio - detector.radius.ecalSpace * detector.ratio)*Math.random();
            this.direction = Math.random()*Math.PI*2;
            this.cpy1 = 0;
            this.cpy2 = 0;
            break;
        case 'chadron':
            this.length = detector.radius.ecalSpace * detector.ratio + (detector.radius.hcal * detector.ratio - detector.radius.ecalSpace * detector.ratio)*Math.random();
            this.direction = Math.random()*Math.PI*2;
            this.cpy1 = this.length/(Math.max(4, Math.ceil(10*Math.random())));
            this.cpy2 = this.length/(Math.max(4, Math.ceil(10*Math.random())));
            break;    
    }

    //unsure of this
    this.draw(time, true)
};

//unsure what the difference this function has with the one in the detector.js file
ParticleDraw.prototype.draw = function(duration, init){
    //also not sure what this is doing here
    init = typeof init !== 'undefined' ? init : false;

    var ctx = detector.events.ctx;
    var cx = detector.width/2;
    var cy = detector.height/2;

    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = this.type.color;
    ctx.fillStyle = this.type.color;
    ctx.lineWidth = 2;

    ctx.translate(cx, cy);
    ctx.rotate(this.direction);
    ctx.translate(-cx, -cy);

    ctx.beginPath();

    ctx.bezierCurveTo(
        this.length/2,
        this.sign * this.cpy1,
        this.length/2,
        this.sign * this.cpy2,
        cx + this.length,
        cy
    )

    ctx.stroke();
    ctx.restore();

    //not sure what this is for, and don't think it's necessary??
    if(!init){
        this.alpha -= 0.03/16*duration
    }
}