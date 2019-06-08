var fs = require('fs'),
    Collection = require('postman-collection').Collection,
    originCollection,
    updatedCollection;

// originCollection : 기존 컬렉션 (테스트 코드, 요청 등이 셋팅 되어져 있음)
// updatedCollection : 스웨거에서 변환 된 컬렉션 (추가/삭제/수정 된 API가 있을 수 있음)
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

// 추가된 request 추가
addedList.forEach(added => {
    var isAdded = false;
    originCollection.forEachItemGroup(originGroup => {
        // sub directory 안에 만들어진 경우
        if(originGroup.name === added.parent().name && !isAdded) {
            originGroup.items.add(added);
            isAdded = true;
        }
    });
    // root directory에 만들어진 경우
    if(!isAdded) {
        originCollection.items.add(added);
    }
});
// 삭제된 request 삭제 - root 디렉토리
deletedList.forEach(deleted => originCollection.items.remove(deleted.id));
// 삭제된 request 삭제 - sub 디렉토리
deletedList.forEach(item => item.forEachParent(parent => parent.items.remove(item.id)));

console.log('최신화된 컬렉션: ');
originCollection.forEachItem(item => console.log(item.request.url.getRaw()));
console.log('');

fs.writeFileSync('./collection_folder/merged_collection.json', JSON.stringify(originCollection));
