# Generated by Django 2.2.24 on 2021-06-13 23:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0038_case_interaction_issara_staff'),
    ]

    operations = [
        migrations.RenameField(
            model_name='case',
            old_name='interaction_type',
            new_name='interactiontype',
        ),
    ]
