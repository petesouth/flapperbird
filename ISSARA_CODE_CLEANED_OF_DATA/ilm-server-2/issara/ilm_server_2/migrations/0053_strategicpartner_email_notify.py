# Generated by Django 2.2.24 on 2021-10-06 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0052_strategicpartneruser_email_notify'),
    ]

    operations = [
        migrations.AddField(
            model_name='strategicpartner',
            name='email_notify',
            field=models.BooleanField(default=False),
        ),
    ]
