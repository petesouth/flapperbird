docker container stop client_app2

docker container rm client_app2 

docker rmi client_app2

docker images -a

docker container list

./docker_client_build_image.sh

echo 'Rember to run ./docker_client_run_image.sh.. But the build portion completed.. (Rebuilt)'
