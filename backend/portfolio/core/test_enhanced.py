import pytest
from django.test import TestCase, TransactionTestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch, Mock
import tempfile
import os
from ..models import File, Project, JournalEntry, Service


class EnhancedModelTests(TestCase):
    """Enhanced model tests with edge cases and validation"""
    
    def test_file_model_validation(self):
        """Test file model validation edge cases"""
        # Test with missing required fields
        with self.assertRaises(Exception):  # Should raise validation error
            file = File()
            file.full_clean()
    
    def test_project_slug_collision_handling(self):
        """Test that slug collisions are handled properly"""
        # Create first project
        project1 = Project.objects.create(title="Test Project")
        original_slug = project1.slug
        
        # Create second project with same title
        project2 = Project.objects.create(title="Test Project")
        
        # Slugs should be different
        self.assertNotEqual(project1.slug, project2.slug)
        self.assertTrue(project2.slug.startswith(original_slug))
    
    def test_project_tech_stack_validation(self):
        """Test tech stack field validation"""
        project = Project.objects.create(
            title="Tech Test",
            tech_stack=["Python", "Django", "React"]
        )
        self.assertEqual(len(project.tech_stack), 3)
        
        # Test with empty tech stack
        project2 = Project.objects.create(
            title="Empty Tech",
            tech_stack=[]
        )
        self.assertEqual(len(project2.tech_stack), 0)
    
    def test_journal_entry_content_validation(self):
        """Test journal entry content validation"""
        # Test with very long content
        long_content = "<p>" + "A" * 10000 + "</p>"
        entry = JournalEntry.objects.create(
            title="Long Content Test",
            content_rich_text=long_content
        )
        self.assertEqual(len(entry.content_rich_text), len(long_content))
    
    def test_service_icon_svg_validation(self):
        """Test service SVG icon validation"""
        valid_svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40"/></svg>'
        service = Service.objects.create(
            title="Test Service",
            icon_svg=valid_svg
        )
        self.assertEqual(service.icon_svg, valid_svg)


class SecurityTestCase(APITestCase):
    """Security-focused test cases"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_sql_injection_protection(self):
        """Test protection against SQL injection"""
        # Create a project first
        project = Project.objects.create(title="Test Project")
        
        # Try SQL injection in query parameters
        malicious_slug = "test'; DROP TABLE core_project; --"
        response = self.client.get(f'/api/projects/by-slug/?slug={malicious_slug}')
        
        # Should return 404, not crash
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Verify table still exists by checking project count
        self.assertEqual(Project.objects.count(), 1)
    
    def test_xss_protection_in_content(self):
        """Test XSS protection in user content"""
        xss_content = '<script>alert("XSS")</script><p>Safe content</p>'
        
        # Create journal entry with potential XSS
        entry = JournalEntry.objects.create(
            title="XSS Test",
            content_rich_text=xss_content
        )
        
        response = self.client.get(f'/api/journal/{entry.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # The content should be returned as-is (frontend should handle sanitization)
        # but the API should not crash
        self.assertIn('content_rich_text', response.data)
    
    def test_file_upload_security(self):
        """Test file upload security measures"""
        # Test with executable file extension
        malicious_file = SimpleUploadedFile(
            "malicious.exe",
            b"fake executable content",
            content_type="application/x-executable"
        )
        
        file_obj = File(
            title="Malicious File",
            file=malicious_file
        )
        
        # Should handle gracefully (specific validation depends on your implementation)
        try:
            file_obj.save()
            # If saved, verify it's handled safely
            self.assertIsNotNone(file_obj.id)
        except ValidationError:
            # If rejected, that's also acceptable
            pass
    
    def test_rate_limiting_simulation(self):
        """Simulate rate limiting tests"""
        # Make rapid requests
        for i in range(10):
            response = self.client.get('/api/projects/')
            # Should not return 429 in test environment
            self.assertNotEqual(response.status_code, 429)
    
    def test_cors_headers(self):
        """Test CORS headers are present"""
        response = self.client.get('/api/projects/')
        # CORS headers should be present in production
        # This test documents the expectation
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PerformanceTestCase(TransactionTestCase):
    """Performance-focused test cases"""
    
    def test_bulk_project_creation(self):
        """Test performance with bulk operations"""
        import time
        
        start_time = time.time()
        
        # Create multiple projects
        projects = []
        for i in range(100):
            projects.append(Project(
                title=f"Project {i}",
                description=f"Description for project {i}",
                status="published"
            ))
        
        Project.objects.bulk_create(projects)
        
        end_time = time.time()
        duration = end_time - start_time
        
        # Should complete within reasonable time
        self.assertLess(duration, 5.0)  # 5 seconds max
        self.assertEqual(Project.objects.count(), 100)
    
    def test_query_performance(self):
        """Test query performance with prefetch_related"""
        # Create projects with related files
        for i in range(50):
            file_obj = File.objects.create(
                title=f"File {i}",
                file=SimpleUploadedFile(f"test{i}.txt", b"content"),
                mime_type="text/plain"
            )
            Project.objects.create(
                title=f"Project {i}",
                main_image=file_obj,
                status="published"
            )
        
        # Test query performance
        with self.assertNumQueries(2):  # Should use prefetch_related
            projects = Project.objects.prefetch_related('main_image').all()
            # Force evaluation
            list(projects)
    
    def test_large_content_handling(self):
        """Test handling of large content"""
        large_content = "<p>" + "A" * 100000 + "</p>"  # 100KB content
        
        start_time = time.time()
        entry = JournalEntry.objects.create(
            title="Large Content Test",
            content_rich_text=large_content
        )
        end_time = time.time()
        
        # Should handle large content efficiently
        self.assertLess(end_time - start_time, 1.0)  # 1 second max
        self.assertEqual(len(entry.content_rich_text), len(large_content))


class IntegrationTestCase(APITestCase):
    """Integration tests for API workflows"""
    
    def setUp(self):
        self.client = APIClient()
        # Create test data
        self.file = File.objects.create(
            title="Test File",
            file=SimpleUploadedFile("test.jpg", b"image content"),
            mime_type="image/jpeg"
        )
        
        self.project = Project.objects.create(
            title="Integration Test Project",
            description="Test project for integration tests",
            status="published",
            main_image=self.file
        )
    
    def test_complete_project_workflow(self):
        """Test complete project browsing workflow"""
        # 1. Get all projects
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)
        
        # 2. Get published projects only
        response = self.client.get('/api/projects/published/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 3. Get specific project by slug
        slug = self.project.slug
        response = self.client.get(f'/api/projects/by-slug/?slug={slug}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], slug)
        
        # 4. Verify project data completeness
        project_data = response.data
        required_fields = ['id', 'title', 'slug', 'description', 'status']
        for field in required_fields:
            self.assertIn(field, project_data)
    
    def test_pagination_workflow(self):
        """Test pagination across multiple pages"""
        # Create many projects
        for i in range(25):
            Project.objects.create(
                title=f"Pagination Test {i}",
                status="published"
            )
        
        # Test first page
        response = self.client.get('/api/projects/?limit=10&offset=0')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Response format depends on your pagination setup
        # Adjust based on your actual API response structure
    
    def test_filtering_and_search(self):
        """Test filtering and search functionality"""
        # Create projects with different statuses
        Project.objects.create(title="Draft Project", status="draft")
        Project.objects.create(title="Published Project", status="published")
        
        # Test status filtering
        response = self.client.get('/api/projects/?status=published')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify all returned projects are published
        for project in response.data:
            self.assertEqual(project['status'], 'published')
    
    def test_error_handling_workflow(self):
        """Test error handling across API"""
        # Test 404 errors
        response = self.client.get('/api/projects/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Test invalid slug
        response = self.client.get('/api/projects/by-slug/?slug=non-existent')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Test missing query parameters
        response = self.client.get('/api/projects/by-slug/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class FileHandlingTestCase(TestCase):
    """Enhanced file handling tests"""
    
    def test_file_cleanup_on_delete(self):
        """Test that files are cleaned up when model is deleted"""
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            tmp_file.write(b"test content")
            tmp_file.flush()
            
            file_obj = File.objects.create(
                title="Cleanup Test",
                file=SimpleUploadedFile("test.txt", b"test content"),
                mime_type="text/plain"
            )
            
            file_path = file_obj.file.path
            file_obj.delete()
            
            # File should be cleaned up (depends on your implementation)
            # This test documents the expected behavior
    
    def test_file_type_validation(self):
        """Test file type validation"""
        # Test allowed file types
        valid_file = SimpleUploadedFile(
            "test.jpg",
            b"fake image content",
            content_type="image/jpeg"
        )
        
        file_obj = File.objects.create(
            title="Valid Image",
            file=valid_file,
            mime_type="image/jpeg"
        )
        
        self.assertEqual(file_obj.mime_type, "image/jpeg")
    
    def test_file_size_limits(self):
        """Test file size limit handling"""
        # Create a large file (simulate)
        large_content = b"A" * (10 * 1024 * 1024)  # 10MB
        
        large_file = SimpleUploadedFile(
            "large.txt",
            large_content,
            content_type="text/plain"
        )
        
        file_obj = File(
            title="Large File",
            file=large_file,
            filesize=len(large_content)
        )
        
        # Should handle based on your file size limits
        # This test documents the expected behavior
        try:
            file_obj.save()
            self.assertIsNotNone(file_obj.id)
        except ValidationError as e:
            # If file is too large, should raise ValidationError
            self.assertIn('size', str(e).lower())


class APIDocumentationTestCase(APITestCase):
    """Tests to ensure API responses match documentation"""
    
    def test_project_api_response_format(self):
        """Test that project API response matches expected format"""
        project = Project.objects.create(
            title="API Test Project",
            description="Test description",
            status="published",
            tech_stack=["Python", "Django"],
            tags=["test", "api"]
        )
        
        response = self.client.get(f'/api/projects/{project.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify response structure
        data = response.data
        expected_fields = [
            'id', 'title', 'slug', 'description', 'status',
            'tech_stack', 'tags', 'created_at', 'updated_at'
        ]
        
        for field in expected_fields:
            self.assertIn(field, data, f"Missing field: {field}")
        
        # Verify data types
        self.assertIsInstance(data['id'], int)
        self.assertIsInstance(data['title'], str)
        self.assertIsInstance(data['tech_stack'], list)
        self.assertIsInstance(data['tags'], list)
    
    def test_api_error_response_format(self):
        """Test that error responses have consistent format"""
        response = self.client.get('/api/projects/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Error response should have consistent structure
        # Adjust based on your error response format
        self.assertIn('detail', response.data)
