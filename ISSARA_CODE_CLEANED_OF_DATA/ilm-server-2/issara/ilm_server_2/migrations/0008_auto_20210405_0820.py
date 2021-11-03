# Generated by Django 2.2.19 on 2021-04-05 08:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ilm_server_2', '0007_auto_20210402_2343'),
    ]

    operations = [
        migrations.CreateModel(
            name='FieldworkActivityPrimaryFocus',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=256, null=True)),
            ],
            options={
                'verbose_name_plural': 'Fieldwork Activity Primary Focuses',
                'db_table': 'fieldwork_primary_focuses',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='FieldworkActivityTypeCategory',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=256, null=True)),
            ],
            options={
                'verbose_name_plural': 'Fieldwork Activity Type Categories',
                'db_table': 'fieldwork_type_categories',
                'managed': True,
            },
        ),
        migrations.RenameField(
            model_name='fieldworkactivity',
            old_name='fieldwork_notes',
            new_name='notes',
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='cambodian_workers_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='female_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='female_workers_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='lao_workers_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='male_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='male_workers_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='myanmar_workers_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='other_workers_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='primary_focus_other_description',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='strategic_partners',
            field=models.ManyToManyField(blank=True, to='ilm_server_2.StrategicPartner'),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='thai_workers_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='total_people_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='total_workers_reached',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fieldworkactivity',
            name='primary_focus',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='ilm_server_2.FieldworkActivityPrimaryFocus'),
        ),
    ]
