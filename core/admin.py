from django.contrib import admin
from django.utils.html import format_html
from .models import (
    HeroSection, AboutSection, Service, Project,
    ProjectImage, Testimonial, ClientLogo, SiteSettings
)


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Text Content', {
            'fields': ('subtitle', 'title_line1', 'title_highlight', 'description')
        }),
        ('Image', {
            'fields': ('hero_image',)
        }),
        ('Call to Action', {
            'fields': ('cta_text', 'cta_url')
        }),
    )

    def has_add_permission(self, request):
        # Only allow one instance
        return not HeroSection.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Text Content', {
            'fields': ('caption', 'title', 'description_1', 'description_2')
        }),
        ('Image', {
            'fields': ('image',)
        }),
        ('Statistics', {
            'fields': (
                ('projects_count', 'projects_suffix', 'projects_label'),
                ('clients_count', 'clients_suffix', 'clients_label'),
                ('years_count', 'years_suffix', 'years_label'),
            )
        }),
    )

    def has_add_permission(self, request):
        return not AboutSection.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_visible')
    list_editable = ('order', 'is_visible')
    list_display_links = ('title',)
    ordering = ('order',)
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'order', 'is_visible')
        }),
        ('Icon (SVG)', {
            'fields': ('icon_svg',),
            'classes': ('collapse',),
            'description': 'Paste the full SVG element code for the service icon.'
        }),
    )


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 3
    fields = ('image', 'alt_text', 'order', 'image_preview')
    readonly_fields = ('image_preview',)
    ordering = ('order',)

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px; border-radius:4px;" />', obj.image.url)
        return "—"
    image_preview.short_description = "Preview"


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_category_label', 'order', 'is_visible', 'has_video', 'teaser_preview')
    list_editable = ('order', 'is_visible')
    list_display_links = ('title',)
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('order',)
    inlines = [ProjectImageInline]
    fieldsets = (
        ('Project Info', {
            'fields': ('title', 'slug', 'category', 'category_display', 'description')
        }),
        ('Teaser Image', {
            'fields': ('teaser_image',)
        }),
        ('Video', {
            'fields': ('has_video', 'video_url'),
            'classes': ('collapse',),
        }),
        ('Display', {
            'fields': ('order', 'is_visible')
        }),
    )

    def teaser_preview(self, obj):
        if obj.teaser_image:
            return format_html('<img src="{}" style="height:50px; border-radius:4px;" />', obj.teaser_image.url)
        return "—"
    teaser_preview.short_description = "Teaser"


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author', 'role', 'order', 'is_visible', 'short_text')
    list_editable = ('order', 'is_visible')
    list_display_links = ('author',)
    ordering = ('order',)

    def short_text(self, obj):
        return obj.text[:80] + '...' if len(obj.text) > 80 else obj.text
    short_text.short_description = "Text Preview"


@admin.register(ClientLogo)
class ClientLogoAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'is_visible', 'logo_preview')
    list_editable = ('order', 'is_visible')
    list_display_links = ('name',)
    ordering = ('order',)

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="height:40px;" />', obj.logo.url)
        return "—"
    logo_preview.short_description = "Logo"


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Contact Info', {
            'fields': ('email', 'phone')
        }),
        ('Social Media', {
            'fields': ('instagram_url', 'facebook_url', 'whatsapp_url')
        }),
        ('Forms & Links', {
            'fields': ('tally_form_url',)
        }),
        ('Footer', {
            'fields': ('footer_description', 'copyright_text', 'partners_caption')
        }),
        ('Branding', {
            'fields': ('favicon',)
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


# Customize admin site header
admin.site.site_header = "COSMOS Media Admin"
admin.site.site_title = "COSMOS Media"
admin.site.index_title = "Content Management"
