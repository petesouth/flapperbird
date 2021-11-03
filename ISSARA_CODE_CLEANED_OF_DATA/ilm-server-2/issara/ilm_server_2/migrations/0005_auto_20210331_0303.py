# Generated by Django 2.2.19 on 2021-03-31 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0004_auto_20210331_0252'),
    ]

    operations = [
        migrations.CreateModel(
            name='PersonContact',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=1024)),
                ('email', models.CharField(blank=True, max_length=1024, null=True)),
                ('phone', models.CharField(blank=True, max_length=1024, null=True)),
                ('description', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'PersonContacts',
                'db_table': 'person_contacts',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='supplier',
            name='additional_contacts',
            field=models.ManyToManyField(blank=True, to='ilm_server_2.PersonContact'),
        ),
    ]
