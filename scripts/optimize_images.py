"""Generate responsive images without altering the original photographs.

Requires Pillow with WebP support. Run: python scripts/optimize_images.py
Originals remain in docs/ for rollback and high-resolution exports.
"""
from io import BytesIO
from pathlib import Path
from PIL import Image

docs = Path(__file__).resolve().parents[1] / 'docs'
output = docs / 'images'
output.mkdir(exist_ok=True)
for original, name, widths, lossless in [
    ('photo-site-urgence-osteo-dourges.png', 'accueil', [640, 960, 1280, 1920], False),
    ('image1.jpg', 'portrait', [400, 800, 1200], False),
    ('image2.png', 'consultation', [570], True),
    ('Favicon.png', 'logo', [192], True),
]:
    image = Image.open(docs / original)
    for width in widths:
        resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        resized.save(buffer, format='WEBP', lossless=lossless, quality=92, method=6)
        (output / f'{name}-{width}.webp').write_bytes(buffer.getvalue())
for size in [16, 32, 180, 192]:
    image = Image.open(docs / 'Favicon.png').resize((size, size), Image.Resampling.LANCZOS)
    buffer = BytesIO()
    image.save(buffer, format='PNG', optimize=True)
    (output / f'icone-{size}.png').write_bytes(buffer.getvalue())
