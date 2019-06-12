function itemNameFixer(itemName) {
    var retVal = itemName;
    return itemName.toLowerCase().replace(/ /g, "_");
}

module.exports.itemNameFixer = itemNameFixer;