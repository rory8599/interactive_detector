/*
The javascript for this has to be alittle different as it's actually animated.
Based on the particle clicker script we need an initalisation function (init),
a draw function, and final lines requesting the animation frame.
*/

//use object intializer to give this variable properties
var detector = {

    core:{
        canvas: null,
        ctx: null
    },

    visible: true,

    width: 400,
    height: 400,

    ratio: 1,

    colours:
    {
        silicon: '#F4E8CB',
        ecal: '#9AD35F',   
        hcal: '#D6EB58',
        magnet:'#89877B',
        background: 'rgb(236, 236, 236)'
    },
//radius here goes to the outer edge of the respective subdetector boundary
    radius:
    {
        silicon: 104,
        siliconSpace: 108,
        ecal: 156,
        ecalSpace: 160,
        hcal: 236,
        hcalSpace: 246,
        magnet: 280
    },

    //Below is in the particle clicker game, and I guess it devides the time tracks are shown for
        //but I'm usng something else for that
/*    lastRender: 0,

    animate: function(time)
    {
        var duration = typeof time !== 'undefined' ? time - detector.lastRender : 16;
        detector.lastRender = time;

        requestAnimFrame(detector.animate);
        detector.draw(duration);
    },
*/

//this is creating a function as a property of an object (called a method)
    //In this method we are initalising the detector
init: function(baseSize){
    detector.core.canvas = document.getElementById('detector-core');
    detector.core.ctx = detector.core.canvas.getContext('2d');

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = detector.core.ctx.webkitBackingStorePixelRatio ||
                            detector.core.ctx.mozBackingStorePixelRatio ||
                            detector.core.ctx.msBackingStorePixelRatio ||
                            detector.core.ctx.oBackingStorePixelRatio ||
                            detector.core.ctx.backingStorePixelRatio || 1;

    var ratio = devicePixelRatio/backingStoreRatio;

    detector.core.ratio = baseSize/400;

    detector.core.width = baseSize;
    detector.core.height = baseSize;

    detector.core.canvas.width = baseSize;
    detector.core.canvas.height = baseSize;

    if (devicePixelRatio !== backingStoreRatio) {
        var oldWidth = detector.core.canvas.width;
        var oldHeight = detector.core.canvas.height;

        detector.core.canvas.width = oldWidth*ratio;
        detector.core.canvas.height = oldHeight*ratio;
        detector.core.canvas.style.width = oldWidth + 'px';
        detector.core.canvas.style.height = oldHeight + 'px';

        detector.core.ctx.scale(ratio, ratio);


    }

    detector.coreDraw();
    //detector.animate();

},

coreDraw: function()
{
    
    
    var ctx = detector.core.ctx;
    //redefine origin 0,0 to be the bottom left corner, use restore function if need to return to original
    //ctx.save();
    //ctx.translate(0, detector.height);
    //ctx.scale(1,-1);

    ctx.clearRect(0, 0, detector.width, detector.height);

    //muon tracker
    muontracker_image = new Image();
    muontracker_image.src = 'assets/muon-square.png';
    muontracker_image.onload = function(){
        ctx.drawImage(muontracker_image, 0, 0, detector.width, detector.height);
    }

    //magnet
    ctx.beginPath();
    ctx.fillStyle = detector.colours.magnet;
    ctx.arc(0, detector.height, detector.radius.magnet*detector.ratio, 0, Math.PI/2, true);
    ctx.fill();

    //magnet gap
    ctx.beginPath();
    ctx.fillStyle = detector.colours.background;
    ctx.arc(0, detector.height, detector.radius.hcalSpace*detector.ratio, 0, Math.PI/2, true);
    ctx.fill();

    //hcal
    ctx.beginPath();
    ctx.fillStyle = detector.colours.hcal;
    ctx.arc(0, detector.height, detector.radius.hcal*detector.ratio, 0, Math.PI/2, true);
    ctx.fill();

    //hcal gap
    ctx.beginPath();
    ctx.fillStyle = detector.colours.background;
    ctx.arc(0, detector.height, detector.radius.ecalSpace*detector.ratio, 0, Math.PI/2, true);
    ctx.fill();

    //ecal
    ctx.beginPath();
    ctx.fillStyle = detector.colours.ecal;
    ctx.arc(0, detector.height, detector.radius.ecal*detector.ratio, 0, Math.PI/2, true);
    ctx.fill();

    //ecal gap
    ctx.beginPath();
    ctx.fillStyle = detector.colours.background;
    ctx.arc(0, detector.height, detector.radius.siliconSpace*detector.ratio, 0, Math.PI/2, true);
    ctx.fill();

    //silicon
    ctx.beginPath();
    ctx.fillStyle = detector.colours.silicon;
    ctx.arc(0, detector.height, detector.radius.silicon*detector.ratio, 0, Math.PI/2, true);
    ctx.fill();
}

};

(function() { detector.init(400); $('#detector').width(400).height(400); })();
