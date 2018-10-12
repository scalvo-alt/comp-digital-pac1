#include "./utils.jsx";

/**
 * This file is a copy paste of some functions in the ease and wizz plugin.
 * They are only used to simplify the usage of that library outside of the plugin
 */

function ew_getPathToEasingFolder() {
    // much simpler, thanks Jeff
    var folderObj = new Folder((new File($.fileName).parent).fsName + "/ease-and-wizz-2.5.3/" + "easingExpressions");
    return folderObj;
};

var ew_readFile = function (filename) {
    var the_code;
    var easing_folder = ew_getPathToEasingFolder();
    var file_handle = new File(easing_folder.fsName + "/" + filename);

    if (!file_handle.exists) {
        throw new Error("I can't find this file: '" + filename + "'. \n\nI looked in here: '" + easing_folder.fsName + "'. \n\nPlease refer to the installation guide and try installing again, or go to:\n\nhttp://aescripts.com/ease-and-wizz/\n\nfor more info.");
    }

    try {
        file_handle.open("r");
        the_code = file_handle.read();
    } catch (e) {
        throw new Error("I couldn't read the easing equation file: " + e);
    } finally {
        file_handle.close();
    }

    return (the_code);
};

function getEaseAndWizzFileNames(){
	var folder = ew_getPathToEasingFolder();
	var files = folder.getFiles();
	var fileNames = [];
	for(var i = 0; i < files.length; i++){
	    fileNames.push( files[i].name );
	}
	return fileNames;
}
var ease_and_wizz_helper = {};
ease_and_wizz_helper.fileNames = getEaseAndWizzFileNames();
ease_and_wizz_helper.getFileContents = function(fileName){
    return ew_readFile(fileName);
};
