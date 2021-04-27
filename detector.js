var detector = {

    core:{
        canvas: null,
        ctx: null
    },

    events:
    {
        canvas: null,
        ctx: null,
        list: [],
        submitted: false
    },

    visible: true,

    width: 1200,
    height: 1200,

    ratio: 1,

    colours:
    {
        silicon: '#F4E8CB',
        ecal: '#9AD35F',   
        hcal: '#D6EB58',
        magnet:'#89877B',
        background: 'rgb(250, 255, 255)'
    },
    //radius here goes to the outer edge of the respective subdetector boundary
    //change the detector to show the full thing instead of quarter sector (so radius is halved)
    radius:
    {
        silicon: 0.11*1200,
        siliconSpace: 0.116*1200,
        ecal: 0.168*1200,
        ecalSpace: 0.172*1200,
        hcal: 0.254*1200,
        hcalSpace: 0.265*1200,
        magnet: 0.302*1200,
        magnetSpace: 0.312*1200,
        muon: 0.49*1200
    },

    tracks:
    [
        {
            name: 'photon',
            color: '#0016EA'
        },
        
        {
            name: 'electron',
            color: '#0016EA'
        },
        
        {
            name: 'muon',
            color: '#775400'
        },

        {
            name: 'nhadron',
            color: '#0B7700'
        },

        {
            name: 'chadron',
            color: '#0B7700'
        }
    ],

    lastRender: 0,

    animate: function(time)
    {
        var duration = typeof time !== 'undefined' ? time - detector.lastRender : 16;
        detector.lastRender = time;

        requestAnimFrame(detector.animate);
        detector.draw(duration);
    },

    init: function(baseSize){
        detector.core.canvas = document.getElementById('detector_core');
        detector.core.ctx = detector.core.canvas.getContext('2d');

        detector.events.canvas = document.getElementById('detector_events');
        detector.events.ctx = detector.events.canvas.getContext('2d');

        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = detector.core.ctx.webkitBackingStorePixelRatio ||
                                detector.core.ctx.mozBackingStorePixelRatio ||
                                detector.core.ctx.msBackingStorePixelRatio ||
                                detector.core.ctx.oBackingStorePixelRatio ||
                                detector.core.ctx.backingStorePixelRatio || 1;

        var ratio = devicePixelRatio/backingStoreRatio;

        detector.ratio = baseSize/1200;

        detector.width = baseSize;
        detector.height = baseSize;

        detector.core.canvas.width = baseSize;
        detector.core.canvas.height = baseSize;

        detector.events.canvas.width = baseSize;
        detector.events.canvas.height = baseSize;

        if (devicePixelRatio !== backingStoreRatio) {
            var oldWidth = detector.core.canvas.width;
            var oldHeight = detector.core.canvas.height;

            detector.core.canvas.width = oldWidth*ratio;
            detector.core.canvas.height = oldHeight*ratio;
            detector.core.canvas.style.width = oldWidth + 'px';
            detector.core.canvas.style.height = oldHeight + 'px';

            detector.events.canvas.width = oldWidth * ratio;
            detector.events.canvas.height = oldHeight * ratio;
            detector.events.canvas.style.width = oldWidth + 'px';
            detector.events.canvas.style.height = oldHeight + 'px';

            detector.core.ctx.scale(ratio, ratio);
            detector.events.ctx.scale(ratio, ratio);
        }

        detector.coreDraw();
        detector.animate();
    },

    coreDraw: function()
    {
        
        
        var ctx = detector.core.ctx;
        var cx = detector.width/2
        var cy = detector.height/2

        ctx.clearRect(0, 0, detector.width, detector.height);

        muontracker_image = new Image();
        muontracker_image.src = 'assets/MuonTracker_whole1.png';
        muontracker_image.onload = function(){
            ctx.drawImage(muontracker_image, 0, 0, detector.width, detector.height);
        }

        //magnet
        ctx.beginPath();
        ctx.fillStyle = detector.colours.magnet;
        ctx.arc(cx, cy, detector.radius.magnet*detector.ratio, 0, Math.PI*2, true);
        ctx.fill();

        //magnet gap
        ctx.beginPath();
        ctx.fillStyle = detector.colours.background;
        ctx.arc(cx, cy, detector.radius.hcalSpace*detector.ratio, 0, Math.PI*2, true);
        ctx.fill();

        //hcal
        ctx.beginPath();
        ctx.fillStyle = detector.colours.hcal;
        ctx.arc(cx, cy, detector.radius.hcal*detector.ratio, 0, Math.PI*2, true);
        ctx.fill();

        //hcal gap
        ctx.beginPath();
        ctx.fillStyle = detector.colours.background;
        ctx.arc(cx, cy, detector.radius.ecalSpace*detector.ratio, 0, Math.PI*2, true);
        ctx.fill();

        //ecal
        ctx.beginPath();
        ctx.fillStyle = detector.colours.ecal;
        ctx.arc(cx, cy, detector.radius.ecal*detector.ratio, 0, Math.PI*2, true);
        ctx.fill();

        //ecal gap
        ctx.beginPath();
        ctx.fillStyle = detector.colours.background;
        ctx.arc(cx, cy, detector.radius.siliconSpace*detector.ratio, 0, Math.PI*2, true);
        ctx.fill();

        //silicon
        ctx.beginPath();
        ctx.fillStyle = detector.colours.silicon;
        ctx.arc(cx, cy, detector.radius.silicon*detector.ratio, 0, Math.PI*2, true);
        ctx.fill();
    },

    //draw the events here!
    handleQuestion: function(){
        var question = game.question;
        var particles = [];
        var sNumber = question.toString();
        for (var i = 0, len = sNumber.length; i < len; i ++){
            particles.push(+sNumber.charAt(i));
        }

        for (var j = 0, len1 = particles.length; j<len1; j++){
            var index = particles.shift();
            var event = new ParticleDraw(detector.tracks[index]);
            detector.events.list.push(event)
        }
    },


    draw: function(duration){
        detector.events.ctx.clearRect(0, 0, detector.width, detector.height);
        var del = -1;
            for (var e in detector.events.list){
                if(detector.events.list[e].alpha>0){
                    if(detector.events.submitted){
                        for(var i = 0; i < (detector.events.list.length - game.level.main.displayValue); i++){
                            detector.events.list[i].alpha = 0;
                        }
                    }
                    detector.events.list[e].draw(duration);
                }
                else{
                    del = e;
                }
            }

        if (del > 0){
            detector.events.list.splice(0, del);
        }
    }
};


window.requestAnimFrame =(function(){
    return window.requestAnimationFrame         ||
           window.webkitRequestAnimationFrame   ||
           window.mozRequestAnimationFrame      ||
           window.oRequestAnimationFrame        ||
           window.msRequestAnimationFrame       ||
           function(callback, element){
               window.setTimeout(callback, 1000/60);
           };
})();

//below the function is wrapped in () to make it an immediately invoked function expressions (or self-executing)
(function() { detector.init(1200); $('#detector').width(1200).height(1200); })();
