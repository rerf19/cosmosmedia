import json
from django.shortcuts import render, get_object_or_404
from .models import (
    HeroSection, AboutSection, Service, Project,
    Testimonial, ClientLogo, SiteSettings
)


def home(request):
    """Homepage view."""
    hero = HeroSection.objects.first()
    about = AboutSection.objects.first()
    services = Service.objects.filter(is_visible=True)
    projects = Project.objects.filter(is_visible=True)
    testimonials = Testimonial.objects.filter(is_visible=True)
    client_logos = ClientLogo.objects.filter(is_visible=True)
    settings = SiteSettings.get()

    # Serialize testimonials to JSON for JavaScript
    testimonials_data = [
        {
            'text': t.text,
            'author': t.author,
            'role': t.role,
        }
        for t in testimonials
    ]

    context = {
        'hero': hero,
        'about': about,
        'services': services,
        'projects': projects,
        'testimonials': testimonials,
        'testimonials_json': json.dumps(testimonials_data),
        'client_logos': client_logos,
        'settings': settings,
    }
    return render(request, 'index.html', context)


def portfolio_detail(request, slug):
    """Individual project gallery page."""
    project = get_object_or_404(Project, slug=slug, is_visible=True)
    images = project.images.all()
    settings = SiteSettings.get()

    context = {
        'project': project,
        'images': images,
        'settings': settings,
    }
    return render(request, 'portfolio_detail.html', context)
