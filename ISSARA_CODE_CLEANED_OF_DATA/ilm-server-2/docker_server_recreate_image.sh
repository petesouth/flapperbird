docker container stop api_server2

docker container rm api_server2 

docker rmi api_server2

docker images -a

docker container list

./docker_server_build_image.sh

echo 'Rember to run ./docker_server_run_image.sh.. But the build portion completed.. (Rebuilt)'
