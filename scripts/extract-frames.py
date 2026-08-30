"""Extract a WebP frame sequence from the source clip for scroll-scrubbing."""

from __future__ import annotations

import json
import sys
from pathlib import Path

import cv2

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "media" / "luna2.mp4"
OUT = ROOT / "public" / "assets" / "frames"

COUNT = 240
WIDTH = 960
QUALITY = 78
PREFIX = "luna-"
EXT = "webp"


def main() -> int:
    if not SRC.exists():
        print(f"missing source video: {SRC}", file=sys.stderr)
        return 1

    cap = cv2.VideoCapture(str(SRC))
    if not cap.isOpened():
        print("could not open video", file=sys.stderr)
        return 1

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = float(cap.get(cv2.CAP_PROP_FPS) or 24)
    duration = total / fps if fps else 10.0

    wanted = []
    seen = set()
    for i in range(COUNT):
        fi = round(i * (total - 1) / (COUNT - 1))
        if fi not in seen:
            wanted.append(fi)
            seen.add(fi)

    wanted_set = set(wanted)
    OUT.mkdir(parents=True, exist_ok=True)

    for leftover in OUT.glob(f"{PREFIX}*.{EXT}"):
        leftover.unlink()
    for leftover in OUT.glob("_test*"):
        leftover.unlink()

    saved = 0
    idx = 0
    height = 0
    while saved < len(wanted):
        ok, frame = cap.read()
        if not ok:
            break
        if idx in wanted_set:
            h, w = frame.shape[:2]
            nh = int(round(h * WIDTH / w))
            if nh % 2:
                nh += 1
            height = nh
            small = cv2.resize(frame, (WIDTH, nh), interpolation=cv2.INTER_AREA)
            path = OUT / f"{PREFIX}{saved:03d}.{EXT}"
            ok_w = cv2.imwrite(
                str(path),
                small,
                [int(cv2.IMWRITE_WEBP_QUALITY), QUALITY],
            )
            if not ok_w:
                print(f"failed to write {path}", file=sys.stderr)
                cap.release()
                return 1
            saved += 1
        idx += 1

    cap.release()

    manifest = {
        "count": saved,
        "duration": round(duration, 3),
        "fps": round((saved - 1) / duration, 3) if duration else 12,
        "width": WIDTH,
        "height": height,
        "dir": "/assets/frames",
        "prefix": PREFIX,
        "ext": EXT,
        "pad": 3,
    }
    (OUT / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {saved} frames to {OUT}")
    print(json.dumps(manifest))
    return 0 if saved == len(wanted) else 1


if __name__ == "__main__":
    raise SystemExit(main())
