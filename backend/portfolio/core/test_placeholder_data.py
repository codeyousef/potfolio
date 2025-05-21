from django.test import TestCase, override_settings
from django.db import connection
from django.db.utils import OperationalError
from unittest.mock import patch

from portfolio.core.models import Project, JournalEntry, Service
from portfolio.core import create_placeholder_data

class PlaceholderDataTest(TestCase):
    """Test the placeholder data creation functionality."""

    def setUp(self):
        """Set up the test environment."""
        # Clear any existing data
        Project.objects.all().delete()
        JournalEntry.objects.all().delete()
        Service.objects.all().delete()

    def test_create_placeholder_data_when_empty(self):
        """Test that placeholder data is created when no records exist."""
        # Verify that there are no records initially
        self.assertEqual(Project.objects.count(), 0)
        self.assertEqual(JournalEntry.objects.count(), 0)
        self.assertEqual(Service.objects.count(), 0)

        # Call the function to create placeholder data
        create_placeholder_data()

        # Verify that placeholder data was created
        self.assertEqual(Project.objects.count(), 6)
        self.assertEqual(JournalEntry.objects.count(), 12)
        self.assertEqual(Service.objects.count(), 3)

        # Check some details of the created data
        projects = Project.objects.all()
        self.assertEqual(projects[0].title, "Placeholder Project 1")
        self.assertEqual(projects[0].status, "published")

        journal_entries = JournalEntry.objects.all()
        self.assertEqual(journal_entries[0].title, "Placeholder Blog Post 1")
        self.assertEqual(journal_entries[0].status, "published")

        services = Service.objects.all()
        self.assertEqual(services[0].title, "Web Development")
        self.assertEqual(services[0].status, "published")

    def test_no_creation_when_records_exist(self):
        """Test that placeholder data is not created when records already exist."""
        # Create one record of each type
        Project.objects.create(title="Existing Project")
        JournalEntry.objects.create(title="Existing Journal Entry")
        Service.objects.create(title="Existing Service")

        # Verify that there is one record of each type
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(JournalEntry.objects.count(), 1)
        self.assertEqual(Service.objects.count(), 1)

        # Call the function to create placeholder data
        create_placeholder_data()

        # Verify that no additional records were created
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(JournalEntry.objects.count(), 1)
        self.assertEqual(Service.objects.count(), 1)

    def test_partial_creation(self):
        """Test that placeholder data is created only for empty models."""
        # Create records for only one model
        Project.objects.create(title="Existing Project")

        # Verify initial state
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(JournalEntry.objects.count(), 0)
        self.assertEqual(Service.objects.count(), 0)

        # Call the function to create placeholder data
        create_placeholder_data()

        # Verify that placeholder data was created only for empty models
        self.assertEqual(Project.objects.count(), 1)  # No change
        self.assertEqual(JournalEntry.objects.count(), 12)  # Created
        self.assertEqual(Service.objects.count(), 3)  # Created