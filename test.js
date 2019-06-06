var parentSet = {};
originCollection.forEachItem(item => {
    deletedList.forEach(ditem => {
        if(Item.isItem(item)) {
            if(item.id == ditem.id) {
                if(item.parent() !== 'undefined') {
                    var parentList = [];
                    var parent = item.parent();
                    var flag = true;
                    do {
                        parentList.push(parent);
                        try {
                            parent = parent.parent();
                        } catch (error) {
                            flag = false;
                        }
                    } while(flag);
                    //console.log(parentList);
                    parentSet[item.id] = parentList;
                }
                console.log(item.id + ' : ' + ditem.id);
                originCollection.items.remove(item.id);
                console.log('deleted!');
            }
        }
    });
});

////////////

originCollection.items.remove(oi => {
    var flag = false;
    deletedList.forEach(di => {
        flag = findDeletedItem(oi, di);
    });
    return flag;
});

function findDeletedItem(items, targetId) {
    var flag = false;
    if(Item.isItem(items)) {
        if(items.id == targetId) {
            console.log('item deleted!');
            flag = true;
        }
    } else {
        items.items.remove(item => {
            if(Item.isItem(item)) {
                if(item.id == targetId) {
                    console.log('sub folder item deleted!');
                    flag = true;
                }
            } else {
                findDeletedItem(item.items, targetId);
            }
        });
    }
    return flag;
}