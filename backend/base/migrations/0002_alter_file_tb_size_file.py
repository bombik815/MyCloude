# Generated by Django 4.1.3 on 2022-12-13 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file_tb',
            name='size_file',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
