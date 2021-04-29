function ParticleDraw(type, submitted)
{
    this.type = type;  
    this.sign = (Math.random() - 0.5 >= 0)? 1 : -1;
    this.length = 0;
    this.direction = 0;
    this.cpy1 = 0;
    this.cpy2 = 0;
    this.alpha = 1;

    switch (this.type.name){
        case 'photon':
            this.length = detector.radius.siliconSpace * 1.2 * detector.ratio + (detector.radius.ecal * detector.ratio - detector.radius.siliconSpace * detector.ratio) * 0.6 * Math.random();
            this.direction = Math.random()*Math.PI*2;
            this.cpy1 = 0;
            this.cpy2 = 0;
            break;
        case 'electron':
            this.length = detector.radius.siliconSpace * 1.2 * detector.ratio + (detector.radius.ecal * detector.ratio - detector.radius.siliconSpace * detector.ratio) * 0.6 * Math.random();
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
            this.length = detector.radius.ecalSpace * 1.2 * detector.ratio + (detector.radius.hcal * detector.ratio - detector.radius.ecalSpace * detector.ratio) * 0.6 * Math.random();
            this.direction = Math.random()*Math.PI*2;
            this.cpy1 = 0;
            this.cpy2 = 0;
            break;
        case 'chadron':
            this.length = detector.radius.ecalSpace * 1.2 * detector.ratio + (detector.radius.hcal * detector.ratio - detector.radius.ecalSpace * detector.ratio) * 0.6 * Math.random();
            this.direction = Math.random()*Math.PI*2;
            this.cpy1 = this.length/(Math.max(4, Math.ceil(10*Math.random())));
            this.cpy2 = this.length/(Math.max(4, Math.ceil(10*Math.random())));
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
    var width = 5 * (1 + (window.screen.availWidth > 992 ? 0 : 1));

    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = this.type.color;
    ctx.fillStyle = this.type.color;
    ctx.lineWidth = width;
    
    ctx.translate(cx, cy);
    ctx.rotate(this.direction);
    ctx.translate(-cx, -cy);

    ctx.beginPath();
    ctx.moveTo(cx,cy);

    ctx.bezierCurveTo(
        cx + this.length/2,
        cy + this.sign * (this.cpy1),
        cx + this.length/2,
        cy + this.sign * (this.cpy2),
        cx + this.length,
        cy
    )
    
    ctx.stroke();
    ctx.restore();

    //control how long the tracks stay for here
    let index, subLevel, sum, time;
    index = game.level.main.displayValue;
    subLevel = game.level.sub.displayValue;
    sum = index + subLevel;
    time = 100*Math.min((index + 2), 5) + 400*Math.max((index - 4), 0);
        //this makes sure the very first track stays up longer than normal
        //a makeshift way to handle with the long load time after clicking start
    if(!init){
        this.alpha -= 0.0005/16*duration;
    }
}