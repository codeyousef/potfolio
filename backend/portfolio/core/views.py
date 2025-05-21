from rest_framework import viewsets, filters, pagination
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import File, Project, JournalEntry, Service
from .serializers import (
    FileSerializer, 
    ProjectSerializer, ProjectListSerializer,
    JournalEntrySerializer, JournalEntryListSerializer,
    ServiceSerializer, ServiceListSerializer
)

class JournalPagination(pagination.PageNumberPagination):
    """Custom pagination class for journal entries."""
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 12

class FileViewSet(viewsets.ModelViewSet):
    """ViewSet for the File model."""
    queryset = File.objects.all()
    serializer_class = FileSerializer

class ProjectPagination(pagination.PageNumberPagination):
    """Custom pagination class for projects."""
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 12

class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for the Project model."""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category', 'tech_stack', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'title', 'sort']
    ordering = ['-created_at']
    pagination_class = ProjectPagination

    def get_queryset(self):
        """Filter queryset based on parameters."""
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        tech_stack = self.request.query_params.get('tech_stack')
        tag = self.request.query_params.get('tag')

        print("get_queryset called with status:", status, "tech_stack:", tech_stack, "and tag:", tag)
        print("Initial queryset count:", queryset.count())

        if status:
            queryset = queryset.filter(status=status)
            print("After status filter, queryset count:", queryset.count())

        if tech_stack:
            # Filter by tech_stack (JSONField contains)
            queryset = queryset.filter(tech_stack__contains=[tech_stack])
            print("After tech_stack filter, queryset count:", queryset.count())

        if tag:
            # Filter by tag (JSONField contains)
            queryset = queryset.filter(tags__contains=[tag])
            print("After tag filter, queryset count:", queryset.count())

        return queryset

    def get_serializer_class(self):
        """Return appropriate serializer class based on action."""
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    @action(detail=False, methods=['get'])
    def published(self, request):
        """Return only published projects."""
        print("Published action called with query params:", request.query_params)

        # Get the queryset from get_queryset, which will apply any filters from query_params
        queryset = self.get_queryset()

        # Filter by status='published' if not already filtered by status
        if 'status' not in request.query_params:
            queryset = queryset.filter(status='published')

        print("Queryset count:", queryset.count())

        # Use pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ProjectListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ProjectListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_slug(self, request):
        """Get a project by its slug."""
        slug = request.query_params.get('slug')
        if not slug:
            return Response({'error': 'Slug parameter is required'}, status=400)

        project = get_object_or_404(Project, slug=slug, status='published')
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

class JournalEntryViewSet(viewsets.ModelViewSet):
    """ViewSet for the JournalEntry model."""
    queryset = JournalEntry.objects.all()
    serializer_class = JournalEntrySerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'excerpt', 'content_rich_text', 'tags']
    ordering_fields = ['publication_date', 'created_at', 'updated_at', 'title', 'sort']
    ordering = ['-publication_date', '-created_at']
    pagination_class = JournalPagination

    def get_queryset(self):
        """Filter queryset based on parameters."""
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        tag = self.request.query_params.get('tag')

        print("get_queryset called with status:", status, "and tag:", tag)
        print("Initial queryset count:", queryset.count())

        if status:
            queryset = queryset.filter(status=status)
            print("After status filter, queryset count:", queryset.count())

        if tag:
            # Filter by tag (JSONField contains)
            queryset = queryset.filter(tags__contains=[tag])
            print("After tag filter, queryset count:", queryset.count())

        return queryset

    def get_serializer_class(self):
        """Return appropriate serializer class based on action."""
        if self.action == 'list':
            return JournalEntryListSerializer
        return JournalEntrySerializer

    @action(detail=False, methods=['get'])
    def published(self, request):
        """Return only published journal entries."""
        print("Published action called with query params:", request.query_params)

        # Get the queryset from get_queryset, which will apply any filters from query_params
        queryset = self.get_queryset()

        # Filter by status='published' if not already filtered by status
        if 'status' not in request.query_params:
            queryset = queryset.filter(status='published')

        print("Queryset count:", queryset.count())

        # Use pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = JournalEntryListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = JournalEntryListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_slug(self, request):
        """Get a journal entry by its slug."""
        slug = request.query_params.get('slug')
        if not slug:
            return Response({'error': 'Slug parameter is required'}, status=400)

        entry = get_object_or_404(JournalEntry, slug=slug, status='published')
        serializer = JournalEntrySerializer(entry)
        return Response(serializer.data)

class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for the Service model."""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description_rich_text']
    ordering_fields = ['created_at', 'updated_at', 'title', 'sort']
    ordering = ['sort', 'title']

    def get_queryset(self):
        """Filter queryset based on status parameter."""
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    def get_serializer_class(self):
        """Return appropriate serializer class based on action."""
        if self.action == 'list':
            return ServiceListSerializer
        return ServiceSerializer

    @action(detail=False, methods=['get'])
    def published(self, request):
        """Return only published services."""
        queryset = self.get_queryset().filter(status='published')
        serializer = ServiceListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_slug(self, request):
        """Get a service by its slug."""
        slug = request.query_params.get('slug')
        if not slug:
            return Response({'error': 'Slug parameter is required'}, status=400)

        service = get_object_or_404(Service, slug=slug, status='published')
        serializer = ServiceSerializer(service)
        return Response(serializer.data)
