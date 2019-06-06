var fs = require('fs'),
    Collection = require('postman-collection').Collection,
    Item = require('postman-collection').Item,
    PropertyList = require('postman-collection').PropertyList,
    originCollection,
    updatedCollection;

// updatedCollection : 스웨거에서 변환 된 컬렉션 (추가/삭제/수정 된 API가 있을 수 있음)
// originCollection : 기존 컬렉션 (테스트 코드, 요청 등이 셋팅 되어져 있음)
updatedCollection = new Collection(JSON.parse(fs.readFileSync('merge_collection.json').toString()));
originCollection = new Collection(JSON.parse(fs.readFileSync('added_collection.json').toString()));

originCollection.forEachItem(item => console.log(item.id + ' : ' + item.request.url.getRaw()));

templist = [];
originCollection.forEachItem(item => {
    templist.push(item);
});

originCollection.items.remove(templist[2].id);

originCollection.forEachItem(item => console.log(item.id + ' : ' + item.request.url.getRaw()));