# Generated by Django 2.2.24 on 2021-09-10 17:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0046_auto_20210902_0423'),
    ]

    operations = [
        migrations.CreateModel(
            name='PartnerNewsUpdate',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=1024)),
                ('title', models.CharField(blank=True, max_length=1024, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('created', models.DateField(auto_now_add=True, null=True)),
                ('sort_number', models.IntegerField(blank=True, null=True)),
                ('strategic_partner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='ilm_server_2.StrategicPartner')),
            ],
            options={
                'verbose_name_plural': 'PartnerNewsUpdates',
                'db_table': 'partner_news_updates',
                'managed': True,
            },
        ),
    ]
