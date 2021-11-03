# Generated by Django 2.2.20 on 2021-05-14 03:21

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ilm_server_2', '0021_auto_20210514_0312'),
    ]

    operations = [
        migrations.CreateModel(
            name='KpiEmailNotification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('type', models.CharField(choices=[('I', 'internal'), ('SP', 'partners')], default='I', max_length=2)),
                ('days', models.IntegerField(blank=True, null=True)),
                ('days_gt', models.IntegerField(blank=True, null=True)),
                ('days_lt', models.IntegerField(blank=True, null=True)),
                ('subject', models.CharField(max_length=256)),
                ('text', models.TextField()),
                ('email_to', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
                ('kpi_status', models.ManyToManyField(to='ilm_server_2.SupplierKpiUpdateStatus')),
            ],
        ),
        migrations.DeleteModel(
            name='KpiEmailNotificationType',
        ),
    ]
