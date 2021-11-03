# Get client version on the server incremented by one to be used in the build
#curl -X GET 'https://ilm-app-staging.appspot.com/api/v2/increment-client-version' -o src/ilm-config.json

cp .env_prod.template .env

rm -rf build
npm run compile
gcloud config set project ilm-client-staging
gcloud config get-value project
gcloud app deploy --quiet 

# Increment client version on the server after build
#curl -X POST 'https://ilm-app-staging.appspot.com/api/v2/increment-client-version'
