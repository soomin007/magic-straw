"""배치 안내 그림 만들기.

src/layout.js의 숫자를 그대로 읽어서, 이미지 생성 에이전트에게 구도 참고 이미지로 넘길 PNG를 만든다.
글자는 넣지 않고 색으로만 구분한다(색의 뜻은 docs/art-brief.md의 "배치 안내 그림" 절에 있다).
Pillow 없이 numpy와 표준 라이브러리만 쓴다.

사용법: python -I tools/make-layout-guide.py <저장소 경로>
"""
import json
import struct
import sys
import zlib
from pathlib import Path

import numpy as np

SCALE = 2  # 960 x 540 장면을 1920 x 1080으로 키운다

TONES = {
    'window': (47, 59, 82),
    'table': (217, 184, 143),
    'edge': (140, 95, 60),
    'mine': (108, 195, 160),
    'theirs': (217, 83, 74),
    'light': (242, 230, 207),
    'laptop': (160, 163, 170),
    'partition': (207, 216, 211),
}
EMPTY_PUZZLE = (255, 0, 200)   # 퍼즐 칸 자리: 아무것도 그리지 않는다
EMPTY_OUTLET = (0, 200, 255)   # 칸막이 칸 자리: 아무것도 그리지 않는다
GRID_LINE = (60, 40, 30)


def read_layout(root):
    text = (root / 'src' / 'layout.js').read_text(encoding='utf-8')
    start = text.index('=', text.index('window.SCENE_LAYOUT')) + 1
    end = text.rindex(';')
    return json.loads(text[start:end])


def fill_rect(image, x, y, width, height, color):
    x0, y0 = max(0, int(x * SCALE)), max(0, int(y * SCALE))
    x1, y1 = min(image.shape[1], int((x + width) * SCALE)), min(image.shape[0], int((y + height) * SCALE))
    image[y0:y1, x0:x1] = color


def fill_ellipse(image, x, y, width, height, color):
    rows, cols = np.ogrid[:image.shape[0], :image.shape[1]]
    cx, cy = (x + width / 2) * SCALE, (y + height / 2) * SCALE
    rx, ry = width / 2 * SCALE, height / 2 * SCALE
    mask = ((cols - cx) / rx) ** 2 + ((rows - cy) / ry) ** 2 <= 1
    image[mask] = color


def fill_round(image, x, y, width, height, color):
    radius = min(width, height) * 0.35
    fill_rect(image, x + radius, y, width - 2 * radius, height, color)
    fill_rect(image, x, y + radius, width, height - 2 * radius, color)
    for corner_x in (x, x + width - 2 * radius):
        for corner_y in (y, y + height - 2 * radius):
            fill_ellipse(image, corner_x, corner_y, 2 * radius, 2 * radius, color)


def outline_rect(image, x, y, width, height, color, thickness=3):
    fill_rect(image, x, y, width, thickness, color)
    fill_rect(image, x, y + height - thickness, width, thickness, color)
    fill_rect(image, x, y, thickness, height, color)
    fill_rect(image, x + width - thickness, y, thickness, height, color)


def hatch_rect(image, x, y, width, height, color):
    """빈 자리는 대각선 빗금으로 표시한다."""
    x0, y0 = int(x * SCALE), int(y * SCALE)
    x1, y1 = int((x + width) * SCALE), int((y + height) * SCALE)
    rows, cols = np.ogrid[y0:y1, x0:x1]
    stripes = ((rows + cols) // 14) % 4 == 0
    region = image[y0:y1, x0:x1]
    region[stripes] = color


def draw_boxes(image, boxes):
    for box in boxes:
        color = TONES[box['tone']]
        draw = {'rect': fill_rect, 'ellipse': fill_ellipse, 'round': fill_round}[box['shape']]
        draw(image, box['x'], box['y'], box['width'], box['height'], color)


def draw_board(image, left, top, columns, rows, cell_width, row_height):
    puzzle_width = (columns - 1) * cell_width
    hatch_rect(image, left, top, puzzle_width, rows * row_height, EMPTY_PUZZLE)
    for column in range(columns - 1):
        for row in range(rows):
            outline_rect(image, left + column * cell_width, top + row * row_height, cell_width, row_height, GRID_LINE, 1)
    outline_rect(image, left, top, puzzle_width, rows * row_height, EMPTY_PUZZLE, 4)
    tower_left = left + puzzle_width
    hatch_rect(image, tower_left, top, cell_width, rows * row_height, EMPTY_OUTLET)
    outline_rect(image, tower_left, top, cell_width, rows * row_height, EMPTY_OUTLET, 4)


def write_png(path, image):
    height, width, _ = image.shape
    raw = b''.join(b'\x00' + image[row].tobytes() for row in range(height))

    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data) & 0xffffffff)

    header = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    path.write_bytes(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', header) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))


def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.')
    layout = read_layout(root)
    scale = layout['scale']
    out = root / 'docs' / 'layout-guide'
    out.mkdir(parents=True, exist_ok=True)

    # 탑뷰: 7열(퍼즐 6칸과 칸막이 1칸), 3줄
    top = np.zeros((540 * SCALE, 960 * SCALE, 3), dtype=np.uint8)
    draw_boxes(top, layout['top']['boxes'])
    draw_board(top, layout['top']['gridLeft'], layout['top']['gridTop'], 7, 3, scale['cellWidthPx'], scale['rowHeightPx'])
    write_png(out / 'scene-top.png', top)

    # 숙인 시점: 7열, 높이 3칸(정사각형 칸), 바 윗면(floor) 위로
    side = np.zeros((540 * SCALE, 960 * SCALE, 3), dtype=np.uint8)
    draw_boxes(side, layout['side']['boxes'])
    floor = layout['side']['floor']
    cell = scale['cellWidthPx']
    draw_board(side, layout['top']['gridLeft'], floor - 3 * cell, 7, 3, cell, cell)
    write_png(out / 'scene-side.png', side)
    print('saved', out / 'scene-top.png', out / 'scene-side.png')


if __name__ == '__main__':
    main()
