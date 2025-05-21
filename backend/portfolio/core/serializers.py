from rest_framework import serializers
from .models import File, Project, JournalEntry, Service

class FileSerializer(serializers.ModelSerializer):
    """Serializer for the File model."""
    class Meta:
        model = File
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for the Project model."""
    main_image = FileSerializer(read_only=True)
    gallery_images = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = '__all__'

class JournalEntrySerializer(serializers.ModelSerializer):
    """Serializer for the JournalEntry model."""
    featured_image = FileSerializer(read_only=True)

    class Meta:
        model = JournalEntry
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    """Serializer for the Service model."""
    featured_image = FileSerializer(read_only=True)

    class Meta:
        model = Service
        fields = '__all__'

# Serializers for list views (with fewer fields for better performance)
class ProjectListSerializer(serializers.ModelSerializer):
    """Serializer for listing projects with minimal fields."""
    main_image = FileSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'status', 
            'created_at', 'updated_at', 'main_image', 
            'tech_stack', 'tags', 'category', 'year'
        ]

class JournalEntryListSerializer(serializers.ModelSerializer):
    """Serializer for listing journal entries with minimal fields."""
    featured_image = FileSerializer(read_only=True)

    class Meta:
        model = JournalEntry
        fields = [
            'id', 'title', 'slug', 'excerpt', 'status', 
            'publication_date', 'featured_image', 'tags'
        ]

class ServiceListSerializer(serializers.ModelSerializer):
    """Serializer for listing services with minimal fields."""
    featured_image = FileSerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'description_rich_text', 'icon_svg', 
            'status', 'featured_image'
        ]
