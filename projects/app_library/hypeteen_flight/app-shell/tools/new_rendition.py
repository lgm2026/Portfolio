#!/usr/bin/env python3
"""Make a new rendition of the app shell in one step.

    python3 tools/new_rendition.py presets/my-app.json ../my-app [--zip]

What it does:
  1. copies web/ and qa/ from this shell into the new folder (never touches the shell itself)
  2. writes web/js/rendition.js from the preset JSON (every key is deep-merged over js/config.js at runtime)
  3. copies any files listed in the preset's "_files" map into web/  (e.g. a logo or a backdrop)
  4. checks the preset: a unique id, cards that point at scenes/pages that exist, assets that exist
  5. optionally zips the result

Preset keys starting with "_" are for this script only and are not written to rendition.js:
  "_files": {"assets/logo.png": "art/my-logo.png"}   (destination inside web/ : source, relative to the preset file)
  "_modules": ["mod_board.js"]                        (module files to KEEP; others in web/js/mod_*.js are dropped.
                                                       omit to keep them all)
  "_scripts": ["mod_world.js", "my_data.js"]          (extra js files in web/js to load, in this order, after the
                                                       modules - e.g. the world module or files copied in by _files)
"""
import json, os, re, shutil, sys, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
SHELL = os.path.dirname(HERE)


def fail(msg):
    print('ERROR: ' + msg)
    sys.exit(1)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if len(args) != 2:
        print(__doc__)
        sys.exit(1)
    preset_path, out = args
    do_zip = '--zip' in sys.argv
    force = '--force' in sys.argv
    with open(preset_path) as f:
        preset = json.load(f)
    pdir = os.path.dirname(os.path.abspath(preset_path))

    pid = preset.get('id')
    if not pid or pid == 'appshell':
        fail('give the preset its own "id" (letters/numbers) - it namespaces saved accounts and data')
    if not re.match(r'^[a-z0-9_]+$', pid):
        fail('"id" must be lowercase letters, numbers or _')

    if os.path.exists(out):
        if not force:
            fail(out + ' already exists (add --force to replace it)')
        shutil.rmtree(out)
    shutil.copytree(os.path.join(SHELL, 'web'), os.path.join(out, 'web'))
    if os.path.isdir(os.path.join(SHELL, 'qa')):
        shutil.copytree(os.path.join(SHELL, 'qa'), os.path.join(out, 'qa'), ignore=shutil.ignore_patterns('shots', 'node_modules'))
    web = os.path.join(out, 'web')

    # 3. files (logo, backdrop, songs...)
    for dest, src in (preset.get('_files') or {}).items():
        s = os.path.join(pdir, src)
        if not os.path.exists(s):
            fail('file not found: ' + s)
        d = os.path.join(web, dest)
        os.makedirs(os.path.dirname(d), exist_ok=True)
        shutil.copy(s, d)

    # modules to keep
    index_p = os.path.join(web, 'index.html')
    index = open(index_p).read()
    keep = preset.get('_modules')
    if keep is not None:
        for f in os.listdir(os.path.join(web, 'js')):
            if f.startswith('mod_') and f not in keep:
                os.remove(os.path.join(web, 'js', f))
                index = re.sub(r'\s*<script src="js/' + re.escape(f) + r'"></script>', '', index)
        for k in keep:
            if not os.path.exists(os.path.join(web, 'js', k)):
                fail('module not found: ' + k)
    # extra scripts (shell modules that aren't on by default, like mod_world.js, or the rendition's own js files)
    for sc in preset.get('_scripts') or []:
        if not os.path.exists(os.path.join(web, 'js', sc)):
            fail('script not found: web/js/' + sc + ' (copy it in with "_files")')
        tag = '<script src="js/%s"></script>' % sc
        if tag not in index:
            index = index.replace('<script>window.addEventListener', tag + '\n<script>window.addEventListener', 1)
    open(index_p, 'w').write(index)

    # 2. rendition.js
    body = {k: v for k, v in preset.items() if not k.startswith('_')}
    js = ('/* THIS RENDITION - written by tools/new_rendition.py from ' + os.path.basename(preset_path) + '.\n'
          '   Deep-merged over js/config.js. Edit here (or edit the preset and run the tool again). */\n'
          'window.CONFIG_MERGE(window.CONFIG, ' + json.dumps(body, indent=2, ensure_ascii=False) + ');\n')
    open(os.path.join(web, 'js', 'rendition.js'), 'w').write(js)

    # 4. checks
    scenes = set()
    for f in os.listdir(os.path.join(web, 'js')):
        if f.endswith('.js'):
            scenes |= set(re.findall(r'G\.scenes\.([A-Za-z0-9_]+)\s*=', open(os.path.join(web, 'js', f)).read()))
    base_cfg = open(os.path.join(web, 'js', 'config.js')).read()
    pages = set((preset.get('pages') or {}).keys())
    if 'pages' not in preset:
        pages.add('about')
    warn = []
    for c in preset.get('cards') or []:
        if c.get('scene') and c['scene'] not in scenes:
            warn.append('card "%s" opens scene "%s", which no js file defines yet' % (c.get('id'), c['scene']))
        if c.get('page') and c['page'] not in pages:
            warn.append('card "%s" opens page "%s", which is not in "pages"' % (c.get('id'), c['page']))
    for a in preset.get('assets') or []:
        if not os.path.exists(os.path.join(web, a['src'])):
            warn.append('asset "%s" not found at web/%s' % (a['name'], a['src']))
    for w in warn:
        print('WARNING: ' + w)

    if do_zip:
        zp = out.rstrip('/') + '.zip'
        with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
            for root, _, files in os.walk(out):
                for f in files:
                    p = os.path.join(root, f)
                    z.write(p, os.path.relpath(p, os.path.dirname(out.rstrip('/')) or '.'))
        print('zipped -> ' + zp)
    print('rendition "%s" ready in %s  (serve it: cd %s && python3 -m http.server 8777)' % (pid, out, web))


if __name__ == '__main__':
    main()
