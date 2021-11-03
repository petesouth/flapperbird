
docker run  -d \
 -v $(pwd)/.env:/.env \
 -v $(pwd)/.env:/build/.env \
--publish 8084:8084 \
--name=client_app2 client_app2
