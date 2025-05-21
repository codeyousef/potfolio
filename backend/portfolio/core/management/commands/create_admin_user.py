from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction


class Command(BaseCommand):
    help = 'Creates the admin user if it does not exist'

    def handle(self, *args, **options):
        with transaction.atomic():
            # Check if admin user already exists
            if User.objects.filter(username='admin').exists():
                self.stdout.write(self.style.SUCCESS('Admin user already exists'))
                return

            # Create admin user
            User.objects.create_superuser(
                username='admin',
                email='admin@test.com',
                password='admin'
            )
            self.stdout.write(self.style.SUCCESS('Admin user created successfully'))
