#target photoshop

// lumaFromLayer.jsx
// 
// Name: lumaFromLayer
// Version: 0.2
// 
// Description:     
// Creates a luma layer for after effects. It considers both
// transparency and masks of currently selected layer.
//  

main();

function main() {
    var selectedLayersCount = getSelectedLayersCount();
    if (selectedLayersCount == 0) {
        alert("Please select a layer you want to create luma from.");
    } else if (selectedLayersCount > 1) {
        alert("Multiple layers are not supported.");
    } else if (selectedLayersCount == 1) {
        var selectedLayerName = app.activeDocument.activeLayer.name;
        var newLayer = app.activeDocument.activeLayer.duplicate();
        newLayer.name = selectedLayerName + "_luma";
        selectAbove();
        addColorOverlay(255,255,255);
        selectBelow();
        var bgLayer = makeSolidColorLayer (0,0,0);
        addToLayerSelection(newLayer);
        var mergedLayer = activeDocument.activeLayer.merge();
    }
}

function getSelectedLayersCount() {
    var res = new Number();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
        desc = desc.getList(stringIDToTypeID('targetLayers'));
        res = desc.count
    } else {
        var vis = app.activeDocument.activeLayer.visible;
        if (vis == true) app.activeDocument.activeLayer.visible = false;
        checkVisability();
        if (app.activeDocument.activeLayer.visible == true) {
            res = 1;
        } else {
            res = 0;
        }
        app.activeDocument.activeLayer.visible = vis;
    }
    return res;
}

function checkVisability() {
    var desc = new ActionDescriptor();
    var list = new ActionList();
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    list.putReference(ref);
    desc.putList(charIDToTypeID('null'), list);
    executeAction(charIDToTypeID('Shw '), desc, DialogModes.NO);
}

function makeSolidColorLayer (theR, theG, theB) {
// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref1 = new ActionReference();
        var idcontentLayer = stringIDToTypeID( "contentLayer" );
        ref1.putClass( idcontentLayer );
    desc3.putReference( idnull, ref1 );
    var idUsng = charIDToTypeID( "Usng" );
        var desc4 = new ActionDescriptor();
        var idType = charIDToTypeID( "Type" );
            var desc5 = new ActionDescriptor();
            var idClr = charIDToTypeID( "Clr " );
                var desc6 = new ActionDescriptor();
                var idRd = charIDToTypeID( "Rd  " );
                desc6.putDouble( idRd, theR );
                var idGrn = charIDToTypeID( "Grn " );
                desc6.putDouble( idGrn, theG );
                var idBl = charIDToTypeID( "Bl  " );
                desc6.putDouble( idBl, theB );
            var idRGBC = charIDToTypeID( "RGBC" );
            desc5.putObject( idClr, idRGBC, desc6 );
        var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
        desc4.putObject( idType, idsolidColorLayer, desc5 );
    var idcontentLayer = stringIDToTypeID( "contentLayer" );
    desc3.putObject( idUsng, idcontentLayer, desc4 );
executeAction( idMk, desc3, DialogModes.NO );
app.activeDocument.activeLayer.name = theR+"R_"+theG+"G_"+theB+"B"
return app.activeDocument.activeLayer
}

function addToLayerSelection(layer) {
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putName( charIDToTypeID('Lyr '), layer.name );
    desc.putReference( charIDToTypeID('null'), ref );
    desc.putEnumerated( stringIDToTypeID('selectionModifier'), stringIDToTypeID('selectionModifierType'), stringIDToTypeID('addToSelection') );
    desc.putBoolean( charIDToTypeID('MkVs'), false );
    executeAction( charIDToTypeID('slct'), desc, DialogModes.NO );
}

function selectAbove() {
    var idslct = charIDToTypeID("slct");
    var desc7 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref5 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idFrwr = charIDToTypeID("Frwr");
    ref5.putEnumerated(idLyr, idOrdn, idFrwr);
    desc7.putReference(idnull, ref5);
    var idMkVs = charIDToTypeID("MkVs");
    desc7.putBoolean(idMkVs, false);
    executeAction(idslct, desc7, DialogModes.NO);
}

function selectBelow() {
    var id3 = charIDToTypeID("slct");
    var desc2 = new ActionDescriptor();
    var id4 = charIDToTypeID("null");
    var ref1 = new ActionReference();
    var id5 = charIDToTypeID("Lyr ");
    var id6 = charIDToTypeID("Ordn");
    var id7 = charIDToTypeID("Bckw");
    ref1.putEnumerated(id5, id6, id7);
    desc2.putReference(id4, ref1);
    var id8 = charIDToTypeID("MkVs");
    desc2.putBoolean(id8, true);
    executeAction(id3, desc2, DialogModes.NO);
}

function addColorOverlay(r,g,b) {
    var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putProperty( charIDToTypeID('Prpr'), charIDToTypeID('Lefx') );
        ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    desc.putReference( charIDToTypeID('null'), ref );
        var effectsDesc = new ActionDescriptor();
        //effectsDesc.putUnitDouble( charIDToTypeID('Scl '), charIDToTypeID('#Prc'), 333.333333 );
            var colorfillDesc = new ActionDescriptor();
            colorfillDesc.putBoolean( charIDToTypeID('enab'), true );
            colorfillDesc.putEnumerated( charIDToTypeID('Md  '), charIDToTypeID('BlnM'), charIDToTypeID('Nrml') );
            colorfillDesc.putUnitDouble( charIDToTypeID('Opct'), charIDToTypeID('#Prc'), 100.000000 );
                var rgbcDesc = new ActionDescriptor();
                rgbcDesc.putDouble( charIDToTypeID('Rd  '), r );
                rgbcDesc.putDouble( charIDToTypeID('Grn '), g );
                rgbcDesc.putDouble( charIDToTypeID('Bl  '), b );
            colorfillDesc.putObject( charIDToTypeID('Clr '), charIDToTypeID('RGBC'), rgbcDesc );
        effectsDesc.putObject( charIDToTypeID('SoFi'), charIDToTypeID('SoFi'), colorfillDesc );
    desc.putObject( charIDToTypeID('T   '), charIDToTypeID('Lefx'), effectsDesc );
    executeAction( charIDToTypeID('setd'), desc, DialogModes.NO );
}