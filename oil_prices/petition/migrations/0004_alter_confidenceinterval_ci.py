# Generated by Django 3.2.3 on 2021-07-06 19:53

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('petition', '0003_confidenceinterval'),
    ]

    operations = [
        migrations.AlterField(
            model_name='confidenceinterval',
            name='ci',
            field=django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.ArrayField(base_field=django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=None), size=None), size=None),
        ),
    ]