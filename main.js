var fs = require('fs'),
    Collection = require('postman-collection').Collection,
    ItemGroup = require('postman-collection').ItemGroup,
    originCollection,
    updatedCollection;

// true 이면 스웨거에서 추가된 request를 original collection으로 넣을 때
// 폴더명을 기준으로 넣음
addedByFolderName = true;

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
templist = originList.filter(d => updatedList.find(m => m.request.url.getRaw() == d.request.url.getRaw()));
deletedList.forEach(item => console.log(item.request.url.getRaw() + ' : ' + item.id));
console.log('');

// 추가된 request 추가
addedList.forEach(added => {
    var isAdded = false;
    // sub 디렉토리에 만들어진 경우에 sub 디렉토리에 추가하도록 하는 기능
    // 폴더 명을 기준으로 추가
    if(addedByFolderName) {
        originCollection.forEachItemGroup(originGroup => {
            if((!isAdded) && (originGroup.name === added.parent().name)) {
                originGroup.items.add(added);
                isAdded = true;
            }
        });
    }
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
originCollection.forEachItem(item => console.log(item.request.url.getRaw() + ' : ' + item.id));
console.log('FIN');

fs.writeFileSync('./collection_folder/merged_collection.json', JSON.stringify(originCollection));
