
docker run -d -v $(pwd)/.env:/.env -v $(pwd)/.env:/build/.env --publish 8080:8080 --name=api_server2 api_server2
