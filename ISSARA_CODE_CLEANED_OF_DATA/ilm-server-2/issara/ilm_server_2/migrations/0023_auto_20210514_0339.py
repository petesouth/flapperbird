# Generated by Django 2.2.20 on 2021-05-14 03:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0022_auto_20210514_0321'),
    ]

    operations = [
        migrations.RenameField(
            model_name='kpiemailnotification',
            old_name='days',
            new_name='days_et',
        ),
        migrations.AlterField(
            model_name='kpiemailnotification',
            name='type',
            field=models.CharField(choices=[('I', 'Internal'), ('SP', 'Partners')], default='I', max_length=2),
        ),
    ]
