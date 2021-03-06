#include "./utils.jsx"
#include "./layermanager.jsx"
#include "./ease-and-wizz-helper.jsx";


var PROPORTION = 0.5;
var VIDEO_WIDTH = 1920;
var VIDEO_HEIGHT = 1080;

function removeLayers() {
    if (app.project && app.project.activeItem) {
        var length = app.project.activeItem.numLayers;
        var i = 1;
        if(length <1){
            return;
        }
        do {
            var layer = app.project.activeItem.layer(1);
            layer.remove();
            i++;
        } while (layer && i <= length);
    }
}

function getVideoFormat(){
    return {width: VIDEO_WIDTH * PROPORTION,
            height: VIDEO_HEIGHT * PROPORTION,
            frameRate: 24};
}

function getActiveCompOrCreate(name) {
    var myProject = app.project;
    if (myProject.activeItem) {
        return myProject.activeItem;
    }

    var compName = name || "dummy_" + Math.floor(Math.random() * 1000000);
    var videoFormat = getVideoFormat();
    var myComposition = myProject.items.addComp(compName, videoFormat.width, videoFormat.height, 1.0, 30, videoFormat.frameRate);
    myComposition.openInViewer();
    return myComposition;
}

function loadCsv(fileName) {
    var curDir = $.fileName.replace('/scripts/main.jsx', '');
    var file = new File(curDir + '/assets/'+fileName);
    file.encoding = 'UTF8';
    file.lineFeed = 'Macintosh';
    file.open('r', undefined, undefined)
    var content = file.read();
    file.close();
    var lines = content.split('\n');
    var data = [];
    var keys = lines[0].split(';');

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var cells = lines[i].split(';');
        obj[keys[0]] = cells[0] || '';
        obj[keys[1]] = parseFloat(cells[1]) || -1;
        if(obj[keys[1]] !== -1 && !isNaN(obj[keys[1]])){
            data.push(obj);
        }
    }
    return data;
}

function loadCompositionAudio(audioName) {
    var compItem = getActiveCompOrCreate(audioName);
    var curDir = $.fileName.replace('/scripts/main.jsx', '');
    var audioFile = new File(curDir + '/assets/' + audioName);
    var myImportOptions = new ImportOptions();
    myImportOptions.file = audioFile;
    var myAudio = app.project.importFile(myImportOptions);
    var n = app.project.numItems;
    var pos = 1;
    var audioItem = null;
    do {
        audioItem = app.project.item(pos);
        if (pos === n) {
            break;
        }
        pos++;
    } while (!audioItem.hasAudio);
    if (!audioItem.hasAudio) {
        alert("An audio source is required");
    } else {
        //add an extra second
        compItem.duration = audioItem.duration + 5;
        return compItem.layers.add(audioItem);
    }
    return null;
}

function createTextLayer(textVal) {
    var myProject = app.project;
    var myComposition = myProject.activeItem;
    var myTextLayer = myComposition.layers.addText("new_text_layer");
    textVal = textVal || "my dummy text";
    var txtLayerManager = new TextLayerManager(myTextLayer, textVal);
    return txtLayerManager;
}

function orginizeTextLayersOnCanvas(layers){
    var h = app.project.activeItem.height;
    var w = app.project.activeItem.width;
    var l = layers.length;
    if( l<1 ) {
        return;
    }
    var layer = null;
    var fontSize = 90 * PROPORTION;
    var blankSpace = Math.floor(w / 100);
    var lineHeight = 20 * PROPORTION;//Math.floor(h / 100);
    var rightMargin = 20 * PROPORTION;
    var x1 = rightMargin, y1 = fontSize + lineHeight;
    var bounds, top, left, right, bottom;
    var crank = false;
    for(var i=0; i<l; i++){
        layer = layers[i];
        bounds = layer.getBounds();
        left = x1 + bounds.width + blankSpace;
        bottom = y1 + bounds.height + lineHeight;
        if(left > w) {
            if(bottom > h){
                x1 = rightMargin;
                y1 = bounds.height;
            } else {
                x1 = rightMargin;
                y1 = bottom;
            }
            left = bounds.width + blankSpace * 2;
        }
        layer.setPosition([x1,y1]);
        x1 = left;
    }
}

function addFadeToLayer(txtLayerManager, startTime, fadeDuration){
    try {
        fadeDuration = fadeDuration || 1;
        txtLayerManager.setOpacityAtTime(startTime, 0);
        txtLayerManager.setOpacityAtTime(startTime + fadeDuration, 100);
    } catch (e) {
        var erMsg = ""
        erMsg += e.fileName ? e.fileName + " " + e.line + "\n" + e.message : e.message || "Unknown error";
        print(erMsg);
    }
}

function addRandomFadeInToLayer(txtLayerManager, startTime, fadeDuration) {
    try {
        var randomN = randomInt(0, ease_and_wizz_helper.fileNames.length - 1);
        var randomFile = ease_and_wizz_helper.fileNames[randomN];
        var expressionCode = ease_and_wizz_helper.getFileContents(randomFile);
        fadeDuration = fadeDuration || 1;
        txtLayerManager.setOpacityAtTime(startTime, 0);
        txtLayerManager.setOpacityAtTime(startTime + fadeDuration, 100);
        txtLayerManager.layer.opacity.expression = expressionCode;

    } catch (e) {
        var erMsg = ""
        erMsg += e.fileName ? e.fileName + " " + e.line + "\n" + e.message : e.message || "Unknown error";
        print(erMsg);
    }
}

function loopAnimBetweenTimes(anim, begin, end, period, minLoop){
    var t1 = begin, t2 = end;
    var loops = 0;
    minLoop = minLoop || 0;
    while(t2 - t1 >= period){
        loops++;
        anim(t1, t2);
        t1 += period;
    }
    if(loops === 0 && t2 > t1 && t2-t1 >= minLoop){
        anim(t1, t2);
    }
}

function createLayersFromCsv(csvName) {
    var audioWords = loadCsv(csvName);
    var compItem = getActiveCompOrCreate(csvName);
    var defaultDuration = 25;
    var l, remaining, layerDuration; //default duration 15
    var layers = [];
    var fontSize = 90;
    var r,g,b;

    var animColor = function(t1, t2){
        if(!l) return;
        l.setColorAtTime(t1, fromRGB(randomInt(150, 255), randomInt(150, 255), randomInt(150, 255)));
        l.setColorAtTime(t2, fromRGB(randomInt(150, 255), randomInt(150, 255), randomInt(150, 255)));
        // l.setColorAtTime(t1, fromRGB(255, 255, 255));
        // l.setColorAtTime(t2, fromRGB(255, 255, 255));
    }
    //
    for(var i = 0; i < audioWords.length; i++){
        l = createTextLayer(audioWords[i].word);
        l.setStartTime(audioWords[i].time);
        remaining = compItem.duration - audioWords[i].time;
        layerDuration = remaining > defaultDuration ? defaultDuration : remaining;
        l.setDuration(layerDuration);
        l.setFontProperties({ fontSize: Math.floor(fontSize * PROPORTION)});
        loopAnimBetweenTimes(animColor, audioWords[i].time, audioWords[i].time + layerDuration - 0.1, 2, 1)
        //addRandomFadeInToLayer(l, audioWords[i].time);
        addFadeToLayer(l, audioWords[i].time);
        layers.push(l);
    }
    return layers;
}

function getSolidLayer(_name, color){
    var comp = getActiveCompOrCreate();
    var rndColor = color || fromRGB(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
    var name = _name || "solid_"+ (++getSolidLayer.called);
    var solidLayer = comp.layers.addSolid(rndColor, name, 1920, 1080, 1.0);
    return solidLayer
}
getSolidLayer.called = 0;

function generateBackgroundLayer(){
    var comp = getActiveCompOrCreate();
    var r = randomInt(10, 120);
    var g = randomInt(10, 120);
    var b = randomInt(10, 120);
    var rndColor = fromRGB(r, g, b);
    //rndColor = fromRGB(0, 0, 0);
    var name = 'solid_'+r+'_'+g+'_'+b;
    var solid = getSolidLayer(name, rndColor);
    var startTime = 0.1;
    var endTime = comp.duration - 0.5;
    var period = 2;
    var fillEffect = solid.property("Effects").addProperty("ADBE Fill");
    var flareEffect = solid.property("Effects").addProperty("ADBE Lens Flare");
    var fill = solid.effect(1);
    var flare = solid.effect(2);

    var animFlare = function(t1, t2){
        if(!flareEffect) return;
        flare("Brillo del destello").setValueAtTime(t1, randomInt(40, 90));
        flare("Brillo del destello").setValueAtTime(t2, randomInt(40, 90));
        flare("Centro del destello").setValueAtTime(t1, [randomInt(0, VIDEO_WIDTH/2),randomInt(0, VIDEO_HEIGHT/2)]);
        flare("Centro del destello").setValueAtTime(t2, [randomInt(0, VIDEO_WIDTH/2),randomInt(0, VIDEO_HEIGHT/2)]);
        flare("Fusionar con el original").setValueAtTime(t1, randomInt(40, 90));
        flare("Fusionar con el original").setValueAtTime(t2, randomInt(40, 90));
        fill("Color").setValueAtTime(t1, fromRGB(randomInt(10, 70), randomInt(10, 70), randomInt(10, 70)));
        fill("Color").setValueAtTime(t2, fromRGB(randomInt(10, 70), randomInt(10, 70), randomInt(10, 70)));
    }
    loopAnimBetweenTimes(animFlare, startTime, endTime, period, 1);
    return solid;
}

function createTextLayers(csvName){
    var textLayers = createLayersFromCsv(csvName);
    orginizeTextLayersOnCanvas(textLayers);
    return textLayers;
}

function makeMyName(){
    var myName = createTextLayer('Santi Calvo');
    var fontSize = 90;
    myName.setFontProperties({ fontSize: Math.floor(fontSize)});
    var h = app.project.activeItem.height;
    var w = app.project.activeItem.width;
    var bounds = myName.getBounds();
    var x1 = w/2 - bounds.width/2;
    var y1 = h/2;
    print(x1+" "+y1+" "+bounds.width+" "+w+" "+h)
    myName.setPosition([x1,y1]);
    myName.setDuration(4)
    myName.setOpacityAtTime(0.1, 0);
    myName.setOpacityAtTime(1.5, 100);
    myName.setOpacityAtTime(4, 0);
}

function main() {
    removeLayers();
    var projectName = 'pac1';
    var compItem = getActiveCompOrCreate(projectName);
    var csvName = projectName +'.csv';
    var wavFile = projectName + '.wav';
    var audioLayer = loadCompositionAudio(wavFile);
    var backgroundLayer = generateBackgroundLayer();
    makeMyName();
    var textLayers = createTextLayers(csvName);

}

main();