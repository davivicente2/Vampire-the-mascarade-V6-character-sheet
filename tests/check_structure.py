"""Check local dependencies and architecture without external packages."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
errors = []
graph = {}


def local_target(source, reference):
    target = (source.parent / reference).resolve()
    if not target.is_relative_to(ROOT) or not target.is_file():
        errors.append(f"{source.relative_to(ROOT)}: missing local file {reference}")
    return target


for source in sorted(ROOT.rglob('*.js')):
    text = source.read_text()
    imports = re.findall(r'(?:import|export)\s+[^;]*?\bfrom\s*[\"\']([^\"\']+)[\"\']', text)
    graph[source] = []
    for reference in imports:
        if not reference.startswith('.'):
            errors.append(f"{source.relative_to(ROOT)}: non-relative module {reference}")
            continue
        target = local_target(source, reference)
        graph[source].append(target)
        relative = source.relative_to(ROOT).as_posix()
        destination = target.relative_to(ROOT).as_posix() if target.is_relative_to(ROOT) else str(target)
        if relative.startswith('data/') and not destination.startswith('data/'):
            errors.append(f"{relative}: catalog must not depend on {destination}")
        if relative.startswith('js/model/') and destination.startswith('js/') and not destination.startswith('js/model/'):
            errors.append(f"{relative}: model must not depend on {destination}")
        if relative.startswith('js/ui/') and destination in ['js/app.js', 'js/sheet.js']:
            errors.append(f"{relative}: section must use callbacks instead of importing its entry point")
    if source.is_relative_to(ROOT / 'js/model') and re.search(r'\b(?:document|window|localStorage)\s*\.', text):
        errors.append(f"{source.relative_to(ROOT)}: model must not access browser state")

visited = set()
active = set()


def visit(source):
    if source in active:
        errors.append(f"Circular module dependency: {source.relative_to(ROOT)}")
        return
    if source in visited:
        return
    active.add(source)
    for target in graph.get(source, []):
        visit(target)
    active.remove(source)
    visited.add(source)


for source in graph:
    visit(source)
for source in (ROOT / 'css').rglob('*.css'):
    for reference in re.findall(r'@import\s+url\([\"\']([^\"\']+)', source.read_text()):
        local_target(source, reference)
for reference in re.findall(r'(?:src|href)="([^\"]+)"', (ROOT / 'index.html').read_text()):
    if not reference.startswith(('#', 'http:', 'https:')):
        local_target(ROOT / 'index.html', reference)

if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(graph)} JavaScript modules; local paths and dependency boundaries valid.')
