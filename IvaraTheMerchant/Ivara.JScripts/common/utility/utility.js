function itemNameFixer(itemName) {
    return "" + itemName.toLowerCase().replace(/ /g, "_");
}

module.exports.itemNameFixer = itemNameFixer;