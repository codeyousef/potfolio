from django.core.management.base import BaseCommand
from portfolio.core import create_placeholder_data

class Command(BaseCommand):
    help = 'Creates placeholder data for projects, journal entries, and services if they do not exist'

    def handle(self, *args, **options):
        self.stdout.write('Creating placeholder data...')
        create_placeholder_data()
        self.stdout.write(self.style.SUCCESS('Placeholder data created successfully'))