from datetime import timedelta
from storages.backends.gcloud import GoogleCloudStorage


class PrivateGcloudStorage(GoogleCloudStorage):
    def __init__(self, **settings):
        super().__init__(**settings)
        self.bucket_name='ilm-private'
        self.location='media'
        self.expiration=timedelta(minutes=15)


class PublicGcloudStorage(GoogleCloudStorage):
    def __init__(self, **settings):
        super().__init__(**settings)
        self.bucket_name='ilm-public'


class StaticGcloudStorage(PublicGcloudStorage):
    def __init__(self, **settings):
        super().__init__(**settings)
        self.location = 'static'
