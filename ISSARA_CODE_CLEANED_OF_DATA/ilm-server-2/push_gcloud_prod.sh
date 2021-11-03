
cp issara/.env_prod issara/.env

gcloud config set project ilm-app-staging
gcloud app deploy --quiet


echo BYE BYE