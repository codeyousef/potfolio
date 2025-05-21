from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.text import slugify
from .models import File, Project, JournalEntry, Service

class FileModelTest(TestCase):
    def setUp(self):
        # Create a test file
        self.file = File.objects.create(
            title="Test File",
            description="Test file description",
            file=SimpleUploadedFile("test_file.txt", b"file_content"),
            filename_disk="test_file.txt",
            width=100,
            height=100,
            filesize=1000,
            mime_type="text/plain"
        )

    def test_file_creation(self):
        """Test that a file can be created with all fields."""
        self.assertEqual(self.file.title, "Test File")
        self.assertEqual(self.file.description, "Test file description")
        self.assertEqual(self.file.filename_disk, "test_file.txt")
        self.assertEqual(self.file.width, 100)
        self.assertEqual(self.file.height, 100)
        self.assertEqual(self.file.filesize, 1000)
        self.assertEqual(self.file.mime_type, "text/plain")

    def test_file_str_method(self):
        """Test the string representation of a file."""
        self.assertEqual(str(self.file), "Test File")

class ProjectModelTest(TestCase):
    def setUp(self):
        # Create a test file for the project
        self.file = File.objects.create(
            title="Project Image",
            file=SimpleUploadedFile("project_image.jpg", b"image_content"),
            mime_type="image/jpeg"
        )
        
        # Create a test project
        self.project = Project.objects.create(
            title="Test Project",
            description="Test project description",
            long_description_html="<p>Test project long description</p>",
            status="published",
            main_image=self.file,
            category="Web Development",
            year="2023",
            tech_stack=["Python", "Django", "React"],
            tags=["portfolio", "web"],
            live_url="https://example.com",
            repo_url="https://github.com/example/test-project",
            sort=1
        )

    def test_project_creation(self):
        """Test that a project can be created with all fields."""
        self.assertEqual(self.project.title, "Test Project")
        self.assertEqual(self.project.slug, "test-project")
        self.assertEqual(self.project.description, "Test project description")
        self.assertEqual(self.project.long_description_html, "<p>Test project long description</p>")
        self.assertEqual(self.project.status, "published")
        self.assertEqual(self.project.main_image, self.file)
        self.assertEqual(self.project.category, "Web Development")
        self.assertEqual(self.project.year, "2023")
        self.assertEqual(self.project.tech_stack, ["Python", "Django", "React"])
        self.assertEqual(self.project.tags, ["portfolio", "web"])
        self.assertEqual(self.project.live_url, "https://example.com")
        self.assertEqual(self.project.repo_url, "https://github.com/example/test-project")
        self.assertEqual(self.project.sort, 1)

    def test_project_str_method(self):
        """Test the string representation of a project."""
        self.assertEqual(str(self.project), "Test Project")

    def test_project_slug_generation(self):
        """Test that a slug is automatically generated from the title."""
        project = Project.objects.create(
            title="Another Test Project"
        )
        self.assertEqual(project.slug, "another-test-project")

    def test_project_slug_uniqueness(self):
        """Test that slugs are unique."""
        # Create a project with the same title
        project2 = Project.objects.create(
            title="Test Project"
        )
        # The slug should be different
        self.assertNotEqual(project2.slug, self.project.slug)

class JournalEntryModelTest(TestCase):
    def setUp(self):
        # Create a test file for the journal entry
        self.file = File.objects.create(
            title="Journal Image",
            file=SimpleUploadedFile("journal_image.jpg", b"image_content"),
            mime_type="image/jpeg"
        )
        
        # Create a test journal entry
        self.entry = JournalEntry.objects.create(
            title="Test Journal Entry",
            excerpt="Test journal entry excerpt",
            content_rich_text="<p>Test journal entry content</p>",
            status="published",
            featured_image=self.file,
            tags=["journal", "test"],
            sort=1
        )

    def test_journal_entry_creation(self):
        """Test that a journal entry can be created with all fields."""
        self.assertEqual(self.entry.title, "Test Journal Entry")
        self.assertEqual(self.entry.slug, "test-journal-entry")
        self.assertEqual(self.entry.excerpt, "Test journal entry excerpt")
        self.assertEqual(self.entry.content_rich_text, "<p>Test journal entry content</p>")
        self.assertEqual(self.entry.status, "published")
        self.assertEqual(self.entry.featured_image, self.file)
        self.assertEqual(self.entry.tags, ["journal", "test"])
        self.assertEqual(self.entry.sort, 1)

    def test_journal_entry_str_method(self):
        """Test the string representation of a journal entry."""
        self.assertEqual(str(self.entry), "Test Journal Entry")

    def test_journal_entry_slug_generation(self):
        """Test that a slug is automatically generated from the title."""
        entry = JournalEntry.objects.create(
            title="Another Test Journal Entry"
        )
        self.assertEqual(entry.slug, "another-test-journal-entry")

class ServiceModelTest(TestCase):
    def setUp(self):
        # Create a test file for the service
        self.file = File.objects.create(
            title="Service Image",
            file=SimpleUploadedFile("service_image.jpg", b"image_content"),
            mime_type="image/jpeg"
        )
        
        # Create a test service
        self.service = Service.objects.create(
            title="Test Service",
            description_rich_text="<p>Test service description</p>",
            icon_svg="<svg>...</svg>",
            status="published",
            featured_image=self.file,
            sort=1
        )

    def test_service_creation(self):
        """Test that a service can be created with all fields."""
        self.assertEqual(self.service.title, "Test Service")
        self.assertEqual(self.service.description_rich_text, "<p>Test service description</p>")
        self.assertEqual(self.service.icon_svg, "<svg>...</svg>")
        self.assertEqual(self.service.status, "published")
        self.assertEqual(self.service.featured_image, self.file)
        self.assertEqual(self.service.sort, 1)

    def test_service_str_method(self):
        """Test the string representation of a service."""
        self.assertEqual(str(self.service), "Test Service")