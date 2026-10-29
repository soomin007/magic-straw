"""콘센트 빌런 도감의 배치 안내 그림 만들기.

proto/villain/layout.js의 숫자와 판 지도를 그대로 읽어서, Codex에게 배경 구도 참고 이미지로 넘길 PNG(1920 x 1080)를 만든다.
글자는 넣지 않고 색으로만 구분한다. 색의 뜻은 docs/concept-villains.md의 "배치 안내 그림" 절에 있다.
Pillow 없이 numpy와 표준 라이브러리만 쓴다.

사용법: python -I proto/villain/make-guide.py <저장소 경로>
"""
import json
import struct
import sys
import zlib
from pathlib import Path

import numpy as np

BACK_WALL = (47, 59, 82)      # 판 위쪽 카페 안쪽 벽과 카운터
SIDE_WALL = (88, 100, 124)    # 판 좌우 옆벽과 창. 곧은 세로 띠로 그린다
UI_STRIP = (20, 20, 20)       # 버튼 줄 자리. 비워 둔다
FLOOR = (232, 232, 228)       # 빈 바닥 칸
GRID = (150, 150, 150)
TABLE = (160, 110, 70)        # T: 테이블(배경)
PLANT = (70, 140, 90)         # L: 화분(배경)
VILLAIN = (217, 83, 74)       # V: 빌런이 앉는 칸. 빌런은 따로 그리므로 배경에는 의자만 그린다
GOAL = (240, 190, 0)          # *: 진동벨을 놓을 칸. 배경에는 평범한 바닥으로 그린다
MOVABLE = (255, 0, 200)       # P, b, c: 움직이는 것의 처음 자리. 배경에는 그리지 않는다(바닥만)
OUTLET = (0, 200, 255)        # 빌런 자리 위 벽의 콘센트 자리. 콘센트는 따로 그리므로 배경에는 그리지 않는다


def read_layout(root):
    text = (root / 'proto' / 'villain' / 'layout.js').read_text(encoding='utf-8')
    start = text.index('=', text.index('window.VILLAIN_LAYOUT')) + 1
    end = text.rindex(';')
    return json.loads(text[start:end])


def fill(image, x, y, width, height, color):
    image[max(0, y):y + height, max(0, x):x + width] = color


def outline(image, x, y, width, height, color, thickness=3):
    fill(image, x, y, width, thickness, color)
    fill(image, x, y + height - thickness, width, thickness, color)
    fill(image, x, y, thickness, height, color)
    fill(image, x + width - thickness, y, thickness, height, color)


def hatch(image, x, y, width, height, color):
    rows, cols = np.ogrid[y:y + height, x:x + width]
    stripes = ((rows + cols) // 12) % 4 == 0
    region = image[y:y + height, x:x + width]
    region[stripes] = color


def write_png(path, image):
    height, width, _ = image.shape
    raw = b''.join(b'\x00' + image[row].tobytes() for row in range(height))

    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff)

    header = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    path.write_bytes(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', header) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))


def draw_level(art, level):
    tile = art['tile']
    left, top = art['originX'], art['originY']
    columns, rows = art['columns'], art['rows']
    image = np.zeros((art['height'], art['width'], 3), dtype=np.uint8)
    fill(image, 0, 0, art['width'], top, BACK_WALL)
    fill(image, 0, top, left, art['uiTop'] - top, SIDE_WALL)
    fill(image, left + columns * tile, top, art['width'] - left - columns * tile, art['uiTop'] - top, SIDE_WALL)
    fill(image, 0, art['uiTop'], art['width'], art['height'] - art['uiTop'], UI_STRIP)

    for y, line in enumerate(level['map']):
        for x, char in enumerate(line):
            px, py = left + x * tile, top + y * tile
            fill(image, px, py, tile, tile, FLOOR)
            if char == 'T':
                fill(image, px, py, tile, tile, TABLE)
            elif char == 'L':
                fill(image, px + 12, py + 12, tile - 24, tile - 24, PLANT)
            elif char == 'V':
                fill(image, px, py, tile, tile, VILLAIN)
                # 콘센트는 언제나 판 밖 -1번 줄의 벽, 빌런과 같은 열에 붙는다.
                fill(image, px + tile // 2 - 9, top - tile, 18, tile, OUTLET)
                outline(image, px, top - tile, tile, tile, OUTLET, 4)
            elif char == '*':
                hatch(image, px, py, tile, tile, GOAL)
            elif char in 'Pbc':
                hatch(image, px, py, tile, tile, MOVABLE)
            outline(image, px, py, tile, tile, GRID, 2)
    return image


def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
    layout = read_layout(root)
    out = root / 'docs' / 'layout-guide'
    out.mkdir(parents=True, exist_ok=True)
    for level in layout['levels']:
        path = out / f"villain-{level['id']}.png"
        write_png(path, draw_level(layout['art'], level))
        print('saved', path)


if __name__ == '__main__':
    main()
