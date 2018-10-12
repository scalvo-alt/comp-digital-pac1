if (typeof Object.create === 'undefined') {
    Object.create = function (o) {
        function F() {
        }

        F.prototype = o;
        return new F();
    };
}

function print(txt) {
    $.writeln(txt);
}

function printProps(item) {
    if (item) {
        // The activeItem is the active composition
        print('---------')
        var prop;
        for (var p in item) {
            try {
                prop = item[p] ? item[p] : "null property";
                print(p + " " + prop.toString());
            } catch (e) {
                print("Error " + e.message);
            }

        }
        print('---------')
    } else {
        print("no item")
    }
}

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

function fromRGB(r, g, b){
    return [r/255, g/255, b/255];
}

function toRGB(ceroOneAr){
    var r = Math.round(ceroOneAr[0] * 255),
        g = Math.round(ceroOneAr[1] * 255),
        b = Math.round(ceroOneAr[2] * 255);
    return [r,g,b]
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
var props = ["ADBE Mask Parade",
    "ADBE Slider Control",
    "ADBE Effect Parade",
    "ADBE MTrackers",
    "Anch",
    "Position",
    "Scale",
    "Rotation",
    "Z Rotation",
    "Opacity",
    "Marker",
    "Time Remap",
    "Audio Levels",
    "Zoom",
    "Depth of Field",
    "Focus Distance",
    "Aperture",
    "Blur Level",
    "Intensity",
    "Col",
    "Cone Angle",
    "Cone Feather",
    "Shadow Darkness",
    "Shadow Diffusion",
    "Casts Shadows",
    "Accepts Shadows",
    "Accepts Lights",
    "Ambient",
    "Diffuse",
    "Specular",
    "Light Transmission",
    "Metal",
    "X Rotation",
    "Y Rotation",
    "Orientation",
    "Source Text",
    "ADBE Mask Atom",
    "ADBE Mask Shape",
    "ADBE Mask Feather",
    "ADBE Mask Opacity",
    "ADBE Mask Offset"];
*/
