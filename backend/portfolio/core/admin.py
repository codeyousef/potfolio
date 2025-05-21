from django.contrib import admin
from .models import File, Project, JournalEntry, Service

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'filename_disk', 'mime_type', 'filesize')
    search_fields = ('title', 'filename_disk', 'description')
    list_filter = ('mime_type',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'category', 'year', 'created_at', 'updated_at')
    list_filter = ('status', 'category', 'year')
    search_fields = ('title', 'description', 'long_description_html')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('gallery_images',)

@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'publication_date', 'created_at', 'updated_at')
    list_filter = ('status', 'publication_date')
    search_fields = ('title', 'excerpt', 'content_rich_text')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'publication_date'

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'sort', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('title', 'description_rich_text')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('sort',)