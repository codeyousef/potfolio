# This file contains initialization code for the core app.

def create_placeholder_data():
    """
    Check if there are any projects, blog posts, or services already.
    If not, create 12 placeholder blog posts, 6 projects, and 3 services.
    """
    from django.db import transaction
    from .models import Project, JournalEntry, Service

    # Check if there are any existing records
    has_projects = Project.objects.exists()
    has_journal_entries = JournalEntry.objects.exists()
    has_services = Service.objects.exists()

    # If there are already records, don't create placeholders
    if has_projects and has_journal_entries and has_services:
        return

    with transaction.atomic():
        # Create placeholder projects if needed
        if not has_projects:
            for i in range(1, 7):
                Project.objects.create(
                    title=f"Placeholder Project {i}",
                    description=f"This is a placeholder description for project {i}.",
                    long_description_html=f"<p>This is a detailed placeholder description for project {i}.</p>",
                    status="published",
                    category=f"Category {(i % 3) + 1}",
                    year=f"{2020 + (i % 5)}",
                    tech_stack=["Python", "Django", "React", "Next.js"],
                    tags=["placeholder", f"tag{i}"],
                    sort=i
                )

        # Create placeholder journal entries if needed
        if not has_journal_entries:
            from django.utils import timezone
            import datetime

            for i in range(1, 13):
                # Create entries with publication dates spread over the last year
                publication_date = timezone.now() - datetime.timedelta(days=30 * (12 - i))

                JournalEntry.objects.create(
                    title=f"Placeholder Blog Post {i}",
                    excerpt=f"This is a placeholder excerpt for blog post {i}.",
                    content_rich_text=f"<p>This is placeholder content for blog post {i}.</p><p>It includes multiple paragraphs to make it look more realistic.</p>",
                    status="published",
                    publication_date=publication_date,
                    tags=["placeholder", f"tag{i}"],
                    sort=i
                )

        # Create placeholder services if needed
        if not has_services:
            service_titles = ["Web Development", "UI/UX Design", "Content Creation"]
            service_descriptions = [
                "<p>Professional web development services using the latest technologies.</p>",
                "<p>Creative UI/UX design to enhance user experience and engagement.</p>",
                "<p>High-quality content creation for your digital presence.</p>"
            ]
            service_icons = [
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-4V4h4v6zm-4 4h4v6h-4v-6z"/><rect x="2" y="4" width="8" height="16" rx="1"/></svg>',
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
            ]

            for i in range(3):
                Service.objects.create(
                    title=service_titles[i],
                    description_rich_text=service_descriptions[i],
                    icon_svg=service_icons[i],
                    status="published",
                    sort=i+1
                )

# Import Django's AppConfig to use ready() method
from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'portfolio.core'

    def ready(self):
        """
        Method called when the app is ready.
        This is where we call our placeholder data creation function and create admin user.
        """
        # Call the function to create placeholder data
        # Avoid circular import by calling the function directly
        create_placeholder_data()

        # Create admin user if it doesn't exist
        try:
            from django.contrib.auth.models import User
            from django.db import transaction
            with transaction.atomic():
                if not User.objects.filter(username='admin').exists():
                    User.objects.create_superuser('admin', 'admin@test.com', 'admin')
                    print('Admin user created successfully')
        except Exception as e:
            # Log the error but don't crash the application
            print(f"Error creating admin user: {e}")

# Configure the default app config
default_app_config = 'portfolio.core.CoreConfig'
