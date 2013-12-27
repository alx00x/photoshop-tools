#target photoshop

// groupLayers.jsx
// 
// Name: groupLayers
// Version: 0.1
// 
// Description:     
// This script  creates a groop for each of the selected layers.The name
// of the newly created groups is taken from the layes themselves.
//  

main();

function main() {
    if (!documents.length) return;
    var doc = app.activeDocument;
    var selLayer = getSelectedLayersIdx();
    var sLayers = new Array();
    for (var z in selLayer) {
        sLayers.push(getLayerID(Number(selLayer[z])));
    }
    for (var a in sLayers) {
        selectLayerById(Number(sLayers[a]));
        var activeLayer = doc.activeLayer;
        var newLayerSet = doc.layerSets.add();
        newLayerSet.move(activeLayer, ElementPlacement.PLACEBEFORE);
        var newLayerSetIdx = getLayersetIdx();
        
        newLayerSet.name = getLayerNameByID(Number(sLayers[a])) + "_comp";
        
        selectLayerById(Number(sLayers[a]));

        if (activeLayer instanceof LayerSet) {
            moveLayerset(activeLayer.name, newLayerSetIdx);
        } else if (app.activeDocument.activeLayer instanceof ArtLayer ) {
            activeLayer.move(newLayerSet, ElementPlacement.INSIDE);
        }
    }
};

function selectLayerById(ID, add) {
    add = (add == undefined) ? add = false : add;
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID('Lyr '), ID);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID('null'), ref);
    if (add) {
        desc.putEnumerated(stringIDToTypeID('selectionModifier'), stringIDToTypeID('selectionModifierType'), stringIDToTypeID('addToSelection'));
    }
    desc.putBoolean(charIDToTypeID('MkVs'), false);
    executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
}

function getLayerNameByID(id) {
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID("Lyr "), id);
    return executeActionGet(ref).getString(charIDToTypeID("Nm  "));
};

function getLayerIDX(ID) {
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID('Lyr '), ID);
    try {
        activeDocument.backgroundLayer;
        return executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1;
    } catch (e) {
        return executeActionGet(ref).getInteger(charIDToTypeID("ItmI"));
    }
};

function getLayerID(IDX) {
    var ref = new ActionReference();
    if (IDX == undefined) {
        ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    } else {
        ref.putIndex(charIDToTypeID('Lyr '), IDX);
    }
    var desc = executeActionGet(ref);
    return desc.getInteger(stringIDToTypeID('layerID'));
};

function getSelectedLayersIdx() {
    var selectedLayers = new Array;
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
        desc = desc.getList(stringIDToTypeID('targetLayers'));
        var c = desc.count
        var selectedLayers = new Array();
        for (var i = 0; i < c; i++) {
            try {
                activeDocument.backgroundLayer;
                selectedLayers.push(desc.getReference(i).getIndex());
            } catch (e) {
                selectedLayers.push(desc.getReference(i).getIndex() + 1);
            }
        }
    } else {
        var ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        try {
            activeDocument.backgroundLayer;
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
        } catch (e) {
            selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")));
        }
        var vis = app.activeDocument.activeLayer.visible;
        if (vis == true) app.activeDocument.activeLayer.visible = false;
        var desc9 = new ActionDescriptor();
        var list9 = new ActionList();
        var ref9 = new ActionReference();
        ref9.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        list9.putReference(ref9);
        desc9.putList(charIDToTypeID('null'), list9);
        executeAction(charIDToTypeID('Shw '), desc9, DialogModes.NO);
        if (app.activeDocument.activeLayer.visible == false) selectedLayers.shift();
        app.activeDocument.activeLayer.visible = vis;
    }
    return selectedLayers;
};

function getLayersetIdx() {
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    var idx = desc.getInteger(charIDToTypeID("ItmI"));
    return idx - 1;
}

function moveLayerset(groupName, idx) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putName(charIDToTypeID("Lyr "), groupName);
    desc.putReference(charIDToTypeID("null"), ref);
    var ref1 = new ActionReference();
    ref1.putIndex(charIDToTypeID("Lyr "), idx);
    desc.putReference(charIDToTypeID("T   "), ref1);
    desc.putBoolean(charIDToTypeID("Adjs"), false);
    executeAction(charIDToTypeID("move"), desc, DialogModes.NO);
};