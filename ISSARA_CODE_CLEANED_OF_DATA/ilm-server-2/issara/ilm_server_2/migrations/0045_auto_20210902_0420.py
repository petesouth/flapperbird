# Generated by Django 2.2.24 on 2021-09-02 04:20

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0044_auto_20210715_2102'),
    ]

    operations = [
        migrations.AddField(
            model_name='kpiemailnotificationtemplate',
            name='level_eq',
            field=models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(4)]),
        ),
        migrations.AddField(
            model_name='kpiemailnotificationtemplate',
            name='level_gte',
            field=models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(4)]),
        ),
        migrations.AddField(
            model_name='kpiemailnotificationtemplate',
            name='level_lte',
            field=models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(4)]),
        ),
    ]
