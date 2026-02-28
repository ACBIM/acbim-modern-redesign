#!/usr/bin/env python3
import re
from pathlib import Path
import sys

VOID_TAGS = {
    'area','base','br','col','embed','hr','img','input','link',
    'meta','param','source','track','wbr'
}

TAG_RE = re.compile(r'(<!--.*?-->|<![^>]*>|<[^>]+>)', re.DOTALL)

def tag_name(tag: str) -> str:
    if tag.startswith('</'):
        t = tag[2:-1].strip().split()[0].lower()
    elif tag.startswith('<') and not tag.startswith('<!--') and not tag.startswith('<!'):
        t = tag[1:-1].strip().split()[0].lower().rstrip('/')
    else:
        t = ''
    if t.startswith('?'):
        t = t[1:]
    return t

def is_self_closing(tag: str) -> bool:
    if tag.endswith('/>'):
        return True
    t = tag_name(tag)
    return t in VOID_TAGS

def pretty_html(html: str) -> str:
    parts = TAG_RE.split(html)
    out_lines = []
    indent = 0
    in_script = False
    in_style = False
    IND = '  '

    for part in parts:
        if not part:
            continue

        if part.startswith('<'):
            lower = part.lower()
            if lower.startswith('<!--') or lower.startswith('<!'):
                out_lines.append(IND*indent + part.strip())
                continue

            closing = lower.startswith('</')
            name = tag_name(part)

            if closing:
                if name in ('script',) and in_script:
                    in_script = False
                if name in ('style',) and in_style:
                    in_style = False
                indent = max(indent-1, 0)
                out_lines.append(IND*indent + part.strip())
                continue

            # opening or self-closing
            out_lines.append(IND*indent + part.strip())

            if name == 'script' and not is_self_closing(part):
                in_script = True
            if name == 'style' and not is_self_closing(part):
                in_style = True

            if not is_self_closing(part) and not in_script and not in_style:
                indent += 1
        else:
            text = part
            if in_script or in_style:
                # preserve script/style content as-is
                if text.strip():
                    for line in text.splitlines():
                        out_lines.append(IND*indent + line.rstrip())
            else:
                stripped = text.strip()
                if stripped:
                    # collapse internal whitespace
                    collapsed = re.sub(r'\s+', ' ', stripped)
                    out_lines.append(IND*indent + collapsed)

    return '\n'.join(out_lines) + '\n'

def main():
    if len(sys.argv) < 2:
        print('Usage: pretty_html.py <file>')
        sys.exit(1)
    p = Path(sys.argv[1])
    data = p.read_text(encoding='utf-8', errors='ignore')
    pretty = pretty_html(data)
    # backup original
    backup = p.with_suffix('.min.html')
    if not backup.exists():
        backup.write_text(data, encoding='utf-8')
    p.write_text(pretty, encoding='utf-8')
    print(f'Prettified {p} (backup saved to {backup.name})')

if __name__ == '__main__':
    main()

