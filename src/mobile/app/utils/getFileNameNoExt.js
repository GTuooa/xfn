export default function getFileNameNoExt(filepath) {
    if (filepath != "") {
        var names = filepath.split("\\");
        var pos = names[names.length - 1].lastIndexOf(".");
        return names[names.length - 1].substring(0, pos);
    }
}
