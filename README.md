# postman-collection-merge
Swagger로 가져온 OpenAPI json을 Collection으로 변환되었다고 가정.
2개의 Collection을 1개의 Collection 으로 합치는 기능.
- ```Original Collection```에서 추가된 것은 ```Merged Collection```에 추가 됨
- ```Original Collection```에서 삭제된 것은 ```Merged Collection```에서 삭제 됨
> 추가 및 삭제의 기준은 URL
