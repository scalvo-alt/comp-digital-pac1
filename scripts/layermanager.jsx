#include "./utils.jsx";

function LayerManager(layer) {
    this.layer = layer;
}

LayerManager.prototype.centerAnchorPoint = function () {
    var comp = this.layer.containingComp;
    var curTime = comp.time;
    var rect = this.layer.sourceRectAtTime(curTime, false);
    var layerAnchor = this.layer.anchorPoint.value;
    /* find center by bounding box of the layer */
    var x = rect.width / 2;
    var y = rect.height / 2;
    x += rect.left;
    y += rect.top;
    var xAdd = (x - layerAnchor[0]) * (this.layer.scale.value[0] / 100);
    var yAdd = (y - layerAnchor[1]) * (this.layer.scale.value[1] / 100);
    /* set new anchor point*/
    this.layer.anchorPoint.setValue([x, y]);
    var layerPosition = this.layer.position.value;
    /* fix position with adjustments */
    this.layer.position.setValue([layerPosition[0] + xAdd, layerPosition[1] + yAdd, layerPosition[2]]);
    return {
        anchorPoint: this.layer.anchorPoint,
        anchor_x: this.layer.anchorPoint.value[0],
        anchor_y: this.layer.anchorPoint.value[1],
        rect: rect
    }
};

LayerManager.prototype.getBounds = function () {
    return this.layer.sourceRectAtTime(this.layer.containingComp.time, true);
}

LayerManager.prototype.positionAnchorPoint = function (position) {
    position = position || LayerManager.CENTER;
    var anchorPointOb = this.centerAnchorPoint();
    var rect = anchorPointOb.rect;
    var half_width = rect.width / 2;
    var half_height = rect.height / 2;
    var anchor_x = anchorPointOb.anchor_x;
    var anchor_y = anchorPointOb.anchor_y;
    var x = null, y = null;
    switch (position) {
        case LayerManager.CENTER:
            //default
            break;
        case LayerManager.TOP_LEFT:
            x = anchor_x - half_width;
            y = anchor_y - half_height;
            break;
        case LayerManager.BOTTOM_LEFT:
            x = anchor_x - half_width;
            y = anchor_y + half_height;
            break;
        case LayerManager.MIDDLE_LEFT:
            x = anchor_x - half_width;
            y = anchor_y;
            break;
        case LayerManager.TOP_RIGHT:
            x = anchor_x + half_width;
            y = anchor_y - half_height;
            break;
        case LayerManager.BOTTOM_RIGHT:
            x = anchor_x + half_width;
            y = anchor_y + half_height;
            break;
        case LayerManager.MIDDLE_RIGHT:
            x = anchor_x + half_width;
            y = anchor_y;
            break;

    }
    if (x !== null && y !== null) {
        this.layer.anchorPoint.setValue([x, y]);
    }
};

LayerManager.prototype.setPosition = function (posArray) {
    this.layer.position.setValue(posArray);
};

LayerManager.prototype.setPositionAtTime = function (t, posArray) {
    this.layer.position.setValueAtTime(t, posArray);
};

LayerManager.prototype.setOpacity = function (opacity) {
    this.layer.opacity.setValue(opacity);
};

LayerManager.prototype.setOpacityAtTime = function (t, opacity) {
    this.layer.opacity.setValueAtTime(t, opacity);
};

LayerManager.prototype.setStartTime = function (t) {
    this.layer.startTime = t;
};

LayerManager.prototype.setDuration = function (t) {
    if (this.layer.numLayers != null) {
        this.layer.source.duration = t;
    } else {
        this.layer.outPoint = this.layer.inPoint + t;
    }

};


LayerManager.CENTER = 0;
LayerManager.TOP_LEFT = 1;
LayerManager.BOTTOM_LEFT = 2;
LayerManager.MIDDLE_LEFT = 3;
LayerManager.TOP_RIGHT = 4;
LayerManager.BOTTOM_RIGHT = 5;
LayerManager.MIDDLE_RIGHT = 6;

function TextLayerManager(layer, textVal) {
    LayerManager.call(this, layer);
    var myTextDocument = layer.property("ADBE Text Properties").property("ADBE Text Document");
    var textDocumentValue = myTextDocument.value;
    textDocumentValue.text = textVal;
    myTextDocument.setValue(textDocumentValue);
    this.textDocument = myTextDocument;
    this.textDocumentValue = textDocumentValue;
    this.textVal = textVal;
}

TextLayerManager.prototype = Object.create(LayerManager.prototype);


TextLayerManager.prototype.setFontProperties = function (fontProperties) {
    var txtDoc = this.textDocumentValue;
    if (typeof (fontProperties) !== 'object') {
        fontProperties = {};
    }
    txtDoc.resetCharStyle();
    txtDoc.fontSize = fontProperties.fontSize || 90;
    txtDoc.fillColor = fontProperties.fillColor || fromRGB(255, 0, 0);
    txtDoc.strokeColor = fontProperties.strokeColor || fromRGB(1, 1, 1);
    txtDoc.strokeWidth = fontProperties.strokeWidth || 1;
    txtDoc.font = fontProperties.font || "Lucida Grande";
    txtDoc.strokeOverFill = fontProperties.strokeOverFill || true;
    txtDoc.applyStroke = fontProperties.applyStroke || true;
    txtDoc.applyFill = fontProperties.applyFill || true;
    this.textDocument.setValue(txtDoc);
};

TextLayerManager.prototype.getAnimator = function (n) {
    var anim;
    var layer = this.layer;
    n = n || 1;
    try {
        if (layer.Text.Animators.numProperties > 0) {
            anim = layer.text.animator(1);
        } else {
            anim = layer.Text.Animators.addProperty("ADBE Text Animator");
        }
    } catch (e) {
        print(e.message)
        anim = layer.Text.Animators.addProperty("ADBE Text Animator");
    }
    return anim;
}
TextLayerManager.prototype.setColorAtTime = function (t, colorArray) {
    var anim = this.getAnimator();
    var color = anim.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
    color.setValueAtTime(t, colorArray);
};
