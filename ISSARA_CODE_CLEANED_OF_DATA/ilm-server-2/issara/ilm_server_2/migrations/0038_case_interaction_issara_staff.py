# Generated by Django 2.2.24 on 2021-06-12 01:33

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ilm_server_2', '0037_auto_20210612_0132'),
    ]

    operations = [
        migrations.AddField(
            model_name='case',
            name='interaction_issara_staff',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cases_interactions_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
