# Generated by Django 2.2.19 on 2021-04-08 03:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0009_fieldworkactivitytype_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fieldworkactivitytype',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='types', to='ilm_server_2.FieldworkActivityTypeCategory'),
        ),
    ]
