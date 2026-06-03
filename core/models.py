from django.db import models
from django.utils.text import slugify


class HeroSection(models.Model):
    """Editable hero section on the homepage."""
    subtitle = models.CharField(max_length=200, default="Produtora de Fotografia & Vídeo")
    title_line1 = models.CharField(max_length=200, default="CRIAMOS IMAGENS COM")
    title_highlight = models.CharField(max_length=100, default="AUTORIDADE")
    description = models.TextField(default="Transformamos a tua visão em imagens com História.\nFotografia e vídeo de alta qualidade que deixam marca.")
    hero_image = models.ImageField(upload_to='hero/', blank=True, null=True, help_text="Hero background image")
    cta_text = models.CharField(max_length=100, default="Pedir Orçamento")
    cta_url = models.URLField(default="https://tally.so/r/w4eqKd")

    class Meta:
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Section"

    def __str__(self):
        return "Hero Section"


class AboutSection(models.Model):
    """Editable 'Sobre Nós' section."""
    caption = models.CharField(max_length=100, default="Sobre Nós")
    title = models.CharField(max_length=300, default="Do frame ao legado. Criamos autoridade.")
    description_1 = models.TextField(
        default="Na COSMOS Media, transformamos ideias em conteúdo visual único, de alta qualidade, para empresas, marcas e pessoas que vão além do comum."
    )
    description_2 = models.TextField(
        default="Do conceito ao resultado final, trabalhamos lado a lado com os nossos clientes para comunicar de forma eficaz a sua história e a criação de valor no mercado onde atua."
    )
    image = models.ImageField(upload_to='about/', blank=True, null=True)
    projects_count = models.PositiveIntegerField(default=100)
    projects_suffix = models.CharField(max_length=10, default="+")
    projects_label = models.CharField(max_length=100, default="Projetos Entregues")
    clients_count = models.PositiveIntegerField(default=40)
    clients_suffix = models.CharField(max_length=10, default="+")
    clients_label = models.CharField(max_length=100, default="Clientes Satisfeitos")
    years_count = models.PositiveIntegerField(default=6)
    years_suffix = models.CharField(max_length=10, default="")
    years_label = models.CharField(max_length=100, default="Anos de Experiência")

    class Meta:
        verbose_name = "About Section"
        verbose_name_plural = "About Section"

    def __str__(self):
        return "About Section"


class Service(models.Model):
    """Individual service card."""
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon_svg = models.TextField(help_text="Paste the full SVG code for the icon", blank=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Service"
        verbose_name_plural = "Services"

    def __str__(self):
        return self.title


class Project(models.Model):
    """Portfolio project."""
    CATEGORY_CHOICES = [
        ('video_institucional', 'Vídeo Institucional'),
        ('campanha_marca', 'Campanha de Marca'),
        ('aftermovie', 'Aftermovie de Participação'),
        ('cobertura_evento', 'Cobertura de Evento'),
        ('producao_corporativa', 'Produção Corporativa'),
        ('outro', 'Outro'),
    ]

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='outro')
    category_display = models.CharField(
        max_length=100,
        blank=True,
        help_text="Override the category display text (optional)"
    )
    teaser_image = models.ImageField(upload_to='projects/teasers/', blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)
    has_video = models.BooleanField(default=False, help_text="Show play button overlay on teaser")
    video_url = models.URLField(blank=True, help_text="Optional: embed video URL for the project page")
    description = models.TextField(blank=True, help_text="Optional project description")

    class Meta:
        ordering = ['order']
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_category_label(self):
        if self.category_display:
            return self.category_display
        return dict(self.CATEGORY_CHOICES).get(self.category, self.category)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    """Gallery image belonging to a project."""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/gallery/')
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Project Image"
        verbose_name_plural = "Project Images"

    def __str__(self):
        return f"{self.project.title} - Image {self.order}"


class Testimonial(models.Model):
    """Client testimonial."""
    text = models.TextField()
    author = models.CharField(max_length=200)
    role = models.CharField(max_length=200, help_text="e.g. CEO, Company Name")
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.author} - {self.role}"


class ClientLogo(models.Model):
    """Client logo for the scrolling marquee."""
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='clients/')
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Client Logo"
        verbose_name_plural = "Client Logos"

    def __str__(self):
        return self.name


class SiteSettings(models.Model):
    """Global site settings — only one instance should exist."""
    email = models.EmailField(default="cosmosmediapt@gmail.com")
    phone = models.CharField(max_length=50, default="+351 933 693 817")
    instagram_url = models.URLField(default="https://www.instagram.com/cosmosmediapt/")
    facebook_url = models.URLField(default="https://www.facebook.com/cosmosmediapt")
    whatsapp_url = models.URLField(default="https://wa.me/351933693817")
    tally_form_url = models.URLField(default="https://tally.so/r/w4eqKd", help_text="URL for the 'Pedir Orçamento' form")
    footer_description = models.TextField(
        default="Produtora de Fotografia e Vídeo especializada em criar imagens de alta qualidade com autoridade."
    )
    copyright_text = models.CharField(max_length=200, default="© 2026 COSMOS media. Todos os direitos reservados.")
    partners_caption = models.CharField(max_length=200, default="ALGUNS PARCEIROS QUE CRESCERAM CONNOSCO")
    favicon = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Site favicon (recommended: .ico or .png, 32x32 or 64x64)")

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        # Enforce singleton — only one instance allowed
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
