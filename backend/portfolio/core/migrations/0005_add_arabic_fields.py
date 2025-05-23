# Generated migration for Arabic language support

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_service_slug_unique'),
    ]

    operations = [
        migrations.AddField(
            model_name='journalentry',
            name='title_ar',
            field=models.CharField(blank=True, help_text='Arabic title', max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='journalentry',
            name='excerpt_ar',
            field=models.TextField(blank=True, help_text='Arabic excerpt', null=True),
        ),
        migrations.AddField(
            model_name='journalentry',
            name='content_rich_text_ar',
            field=models.TextField(blank=True, help_text='Arabic content', null=True),
        ),
        migrations.AddField(
            model_name='journalentry',
            name='language',
            field=models.CharField(choices=[('en', 'English'), ('ar', 'Arabic'), ('both', 'Both')], default='en', max_length=10),
        ),
        migrations.AddField(
            model_name='journalentry',
            name='tags_ar',
            field=models.JSONField(blank=True, help_text='Arabic tags', null=True),
        ),
        migrations.AddField(
            model_name='service',
            name='title_ar',
            field=models.CharField(blank=True, help_text='Arabic title', max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='service',
            name='description_rich_text_ar',
            field=models.TextField(blank=True, help_text='Arabic description', null=True),
        ),
    ]