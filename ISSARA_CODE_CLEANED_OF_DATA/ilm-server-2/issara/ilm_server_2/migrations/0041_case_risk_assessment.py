# Generated by Django 2.2.24 on 2021-06-21 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0040_auto_20210621_1759'),
    ]

    operations = [
        migrations.AddField(
            model_name='case',
            name='risk_assessment',
            field=models.TextField(blank=True, null=True),
        ),
    ]
