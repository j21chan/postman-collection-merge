var fs = require('fs'),
    Collection = require('postman-collection').Collection,
    Item = require('postman-collection').Item,
    PropertyList = require('postman-collection').PropertyList,
    originCollection,
    updatedCollection;

// updatedCollection : 스웨거에서 변환 된 컬렉션 (추가/삭제/수정 된 API가 있을 수 있음)
// originCollection : 기존 컬렉션 (테스트 코드, 요청 등이 셋팅 되어져 있음)
updatedCollection = new Collection(JSON.parse(fs.readFileSync('./collection_folder/merge_collection.json').toString()));
originCollection = new Collection(JSON.parse(fs.readFileSync('./collection_folder/added_collection.json').toString()));

console.log('기존 컬렉션: ');
originCollection.forEachItem(item => console.log(item.id + ' : ' + item.request.url.getRaw()));

console.log('');

console.log('업데이트 된 컬렉션: ');
updatedCollection.forEachItem(item => console.log(item.id + ' : ' + item.request.url.getRaw()));

originCollection.items.assimilate(updatedCollection.items, true);

// templist = [];
// originCollection.forEachItem(item => {
//     templist.push(item);
// });

// console.log('');
// console.log(templist[0].id);
// console.log(originCollection.items.has(templist[0].id));

console.log('\n삭제된 컬렉션: ');
originCollection.forEachItem(item => console.log(item.id + ' : ' + item.request.url.getRaw()));