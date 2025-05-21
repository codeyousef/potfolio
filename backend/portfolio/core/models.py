from django.db import models
from django.utils.text import slugify

class BaseModel(models.Model):
    """Base model with common fields for all models."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class File(models.Model):
    """Model for storing files and images."""
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    filename_disk = models.CharField(max_length=255, blank=True, null=True)
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)
    filesize = models.BigIntegerField(blank=True, null=True)
    mime_type = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title or self.file.name

class Project(BaseModel):
    """Model for portfolio projects."""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    long_description_html = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    main_image = models.ForeignKey(
        File, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='project_main_images'
    )
    gallery_images = models.ManyToManyField(
        File, 
        blank=True,
        related_name='project_gallery_images'
    )
    category = models.CharField(max_length=255, blank=True, null=True)
    year = models.CharField(max_length=4, blank=True, null=True)
    tech_stack = models.JSONField(blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    repo_url = models.URLField(blank=True, null=True)
    sort = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Check if the slug already exists
            original_slug = self.slug
            counter = 1
            while Project.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

class JournalEntry(BaseModel):
    """Model for journal/blog entries."""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    excerpt = models.TextField(blank=True, null=True)
    content_rich_text = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    publication_date = models.DateTimeField(blank=True, null=True)
    featured_image = models.ForeignKey(
        File, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='journal_featured_images'
    )
    tags = models.JSONField(blank=True, null=True)
    sort = models.IntegerField(default=0)

    class Meta:
        ordering = ['-publication_date', '-created_at']
        verbose_name_plural = 'Journal Entries'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Check if the slug already exists
            original_slug = self.slug
            counter = 1
            while JournalEntry.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

class Service(BaseModel):
    """Model for services offered."""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description_rich_text = models.TextField(blank=True, null=True)
    icon_svg = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    featured_image = models.ForeignKey(
        File, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='service_featured_images'
    )
    sort = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort', 'title']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Check if the slug already exists
            original_slug = self.slug
            counter = 1
            while Service.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
