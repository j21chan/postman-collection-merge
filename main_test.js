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
originList = [];
originCollection.forEachItem(item => originList.push(item));
originCollection.forEachItem(item => console.log(item.request.url.getRaw()));
console.log('');

console.log('스웨거에서 변화된 컬렉션: ');
updatedList = [];
updatedCollection.forEachItem(item => updatedList.push(item));
updatedCollection.forEachItem(item => console.log(item.request.url.getRaw()));
console.log('');

console.log('추가된 리퀘스트: ');
addedList = updatedList.filter(d => !originList.find(m => m.request.url.getRaw() == d.request.url.getRaw()));
addedList.forEach(add => console.log(add.request.url.getRaw()));
console.log('');

addedList.forEach(t => {
    originCollection.items.add(t);
});

console.log('삭제된 리퀘스트: ');
deletedIdList = [];
deletedList = originList.filter(d => !updatedList.find(m => m.request.url.getRaw() == d.request.url.getRaw()));
console.log(deletedList[0].id + ' : ' + deletedList[0].request.url.getRaw());
console.log('');

removeDeletedItem(originCollection.items, deletedList[0].id);

function removeDeletedItem(items, targetId) {
    
    console.log('삭제할 아이디: ' + targetId);

    try {
        items.remove(targetId);
    } catch(e) {
        console.log('에러 발생: ' + e);
    }
    try {
        items.each(item => removeDeletedItem(item, targetId));
    } catch (e) {
        console.log('에러 발생: ' + e);
    }
}

console.log('');
originCollection.forEachItem(item => {
    console.log(item.id + ' : ' + item.request.url.getRaw());
});

console.log('');
console.log('최종 컬렉션: ');
originCollection.forEachItem(item => {
    console.log(item.request.url.getRaw());
});

fs.writeFileSync('./collection_folder/merged_collection.json', JSON.stringify(originCollection));
console.log('FIN');