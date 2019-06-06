var fs = require('fs'),
    Collection = require('postman-collection').Collection,
    originCollection,
    updatedCollection;

// updatedCollection : 스웨거에서 변환 된 컬렉션 (추가/삭제/수정 된 API가 있을 수 있음)
// originCollection : 기존 컬렉션 (테스트 코드, 요청 등이 셋팅 되어져 있음)
originCollection = new Collection(JSON.parse(fs.readFileSync('./collection_folder/origin collection.postman_collection.json').toString()));
updatedCollection = new Collection(JSON.parse(fs.readFileSync('./collection_folder/swagger collection.postman_collection.json').toString()));

console.log('기존 컬렉션: ');
originList = [];
originCollection.forEachItem(item => originList.push(item));
originCollection.forEachItem(item => console.log(item.request.url.getRaw()));
console.log('');

console.log('스웨거에서 가져온 컬렉션: ');
updatedList = [];
updatedCollection.forEachItem(item => updatedList.push(item));
updatedCollection.forEachItem(item => console.log(item.request.url.getRaw()));
console.log('');

console.log('추가된 리퀘스트: ');
addedList = updatedList.filter(d => !originList.find(m => m.request.url.getRaw() == d.request.url.getRaw()));
addedList.forEach(add => console.log(add.request.url.getRaw()));
console.log('');

console.log('삭제된 리퀘스트: ');
deletedList = originList.filter(d => !updatedList.find(m => m.request.url.getRaw() == d.request.url.getRaw()));
deletedList.forEach(item => console.log(item.request.url.getRaw()));
console.log('');

addedList.forEach(added => originCollection.items.add(added));
deletedList.forEach(deleted => originCollection.items.remove(deleted.id));
// originCollection.items.assimilate(updatedCollection.items, true);

console.log('최신화된 컬렉션: ');
originCollection.forEachItem(item => console.log(item.request.url.getRaw()));
console.log('');

fs.writeFileSync('./collection_folder/merged_collection.json', JSON.stringify(originCollection));
