from pathlib import Path
import hashlib
import math
import subprocess

from PIL import Image, ImageDraw, ImageEnhance, ImageOps
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
TMP = ROOT / "tmp" / "pdfs" / "portfolio"
OUT = ROOT / "output" / "pdf" / "youkai-portfolio.pdf"
FFMPEG = ROOT / "node_modules" / "@ffmpeg-installer" / "win32-x64" / "ffmpeg.exe"

PAGE_W, PAGE_H = landscape(A4)
MARGIN = 28
BG = colors.HexColor("#070809")
PANEL = colors.HexColor("#14171b")
PANEL_2 = colors.HexColor("#191d22")
TEXT = colors.HexColor("#eef2f5")
MUTED = colors.HexColor("#a0a6ad")
SOFT = colors.HexColor("#666e76")
LINE = colors.Color(1, 1, 1, alpha=0.16)
ACCENT = colors.HexColor("#ff3b3f")


def setup():
    TMP.mkdir(parents=True, exist_ok=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("MSYH", "C:/Windows/Fonts/msyh.ttc"))
    pdfmetrics.registerFont(TTFont("MSYH-Bold", "C:/Windows/Fonts/msyhbd.ttc"))


def asset(path):
    return PUBLIC / path


def safe_name(path):
    return hashlib.md5(str(path).encode("utf-8")).hexdigest()


def video_frame(video_path):
    out = TMP / f"{safe_name(video_path)}.jpg"
    if out.exists():
        return out
    seed = int(hashlib.md5(video_path.name.encode("utf-8")).hexdigest()[:4], 16)
    second = 0.8 + (seed % 22) / 10
    subprocess.run(
        [
            str(FFMPEG),
            "-y",
            "-ss",
            f"{second:.1f}",
            "-i",
            str(video_path),
            "-frames:v",
            "1",
            "-vf",
            "scale=1200:-2",
            "-q:v",
            "3",
            str(out),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    return out if out.exists() else None


def rounded_image(path, w, h, darken=0.86, radius=24, center=(0.5, 0.5)):
    out = TMP / f"{safe_name(path)}_{int(w)}x{int(h)}_{int(radius)}.png"
    if out.exists():
        return out
    size = (max(10, int(w * 2)), max(10, int(h * 2)))
    img = Image.open(path).convert("RGB")
    img = ImageOps.fit(img, size, method=Image.Resampling.LANCZOS, centering=center)
    img = ImageEnhance.Color(img).enhance(0.88)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    img = ImageEnhance.Brightness(img).enhance(darken)
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=int(radius * 2), fill=255)
    rgba = Image.new("RGBA", size, (0, 0, 0, 0))
    rgba.paste(img, (0, 0), mask)
    rgba.save(out)
    return out


def bg(c):
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(colors.Color(1, 0.1, 0.12, alpha=0.07))
    c.circle(PAGE_W * 0.74, PAGE_H * 0.58, 182, fill=1, stroke=0)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.025))
    for x in range(0, int(PAGE_W), 54):
        c.rect(x, 0, 0.45, PAGE_H, fill=1, stroke=0)
    for y in range(0, int(PAGE_H), 54):
        c.rect(0, y, PAGE_W, 0.45, fill=1, stroke=0)


def text(c, x, y, value, size=12, color=TEXT, font="MSYH", leading=None):
    c.setFillColor(color)
    c.setFont(font, size)
    leading = leading or size * 1.35
    for i, line in enumerate(str(value).split("\n")):
        c.drawString(x, y - i * leading, line)


def right_text(c, x, y, value, size=10, color=MUTED, font="MSYH"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawRightString(x, y, value)


def title(c, cn, en, page):
    text(c, MARGIN, PAGE_H - 31, en.upper(), 7.5, ACCENT, "MSYH-Bold")
    text(c, MARGIN, PAGE_H - 56, cn, 23, TEXT, "MSYH-Bold")
    right_text(c, PAGE_W - MARGIN, PAGE_H - 34, f"YOUKAI PORTFOLIO / {page:02d}", 7.6, SOFT, "MSYH-Bold")


def card(c, x, y, w, h, fill=PANEL):
    c.setFillColor(fill)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.75)
    c.roundRect(x, y, w, h, 16, fill=1, stroke=1)


def img_card(c, path, x, y, w, h, label=None, darken=0.86, center=(0.5, 0.5)):
    card(c, x, y, w, h, fill=PANEL_2)
    if path and Path(path).exists():
        img = rounded_image(path, w - 3, h - 3, darken=darken, radius=14, center=center)
        c.drawImage(ImageReader(str(img)), x + 1.5, y + 1.5, w - 3, h - 3, mask="auto")
    c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.22))
    c.roundRect(x, y, w, h, 16, fill=0, stroke=1)
    if label:
        c.setFillColor(colors.Color(0, 0, 0, alpha=0.55))
        c.roundRect(x + 10, y + h - 28, 82, 18, 8, fill=1, stroke=0)
        text(c, x + 17, y + h - 23, label, 7.1, TEXT, "MSYH-Bold")


def footer(c, page):
    c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.12))
    c.line(MARGIN, 22, PAGE_W - MARGIN, 22)
    text(c, MARGIN, 12, "AI SHORT DRAMA / CGI / SPATIAL VISUAL DESIGN", 6.8, SOFT, "MSYH-Bold")
    right_text(c, PAGE_W - MARGIN, 12, f"{page:02d}", 7, SOFT, "MSYH-Bold")


def stat(c, x, y, num, label):
    card(c, x, y, 94, 54, fill=colors.Color(1, 1, 1, alpha=0.035))
    text(c, x + 13, y + 31, num, 20, TEXT, "MSYH-Bold")
    text(c, x + 13, y + 15, label, 7.4, MUTED)


def video_frames(folder):
    frames = []
    for video in sorted(folder.glob("*.mp4")):
        frame = video_frame(video)
        if frame:
            frames.append(frame)
    return frames


def grid_page(c, page, cn, en, intro, imgs, count=9):
    bg(c)
    title(c, cn, en, page)
    text(c, MARGIN, PAGE_H - 84, intro, 9.8, MUTED)
    usable_w = PAGE_W - MARGIN * 2
    gap = 10
    cols = 3
    rows = math.ceil(count / cols)
    cell_w = (usable_w - gap * (cols - 1)) / cols
    cell_h = 96 if rows >= 3 else 128
    start_y = 48
    for i, img in enumerate(imgs[:count]):
        col = i % cols
        row = rows - 1 - i // cols
        x = MARGIN + col * (cell_w + gap)
        y = start_y + row * (cell_h + gap)
        img_card(c, img, x, y, cell_w, cell_h, f"{i + 1:02d}", 0.84)
    footer(c, page)
    c.showPage()


def build_pdf():
    setup()
    c = canvas.Canvas(str(OUT), pagesize=(PAGE_W, PAGE_H))

    profile = asset("images/profile-portrait.jpg")
    ai = video_frames(asset("works/ai-shorts"))
    cgi = video_frames(asset("works/product-cgi"))
    stage = video_frames(asset("works/stage-visual"))
    commercial = sorted(asset("works/commercial-space").glob("*.jpg"))

    page = 1
    bg(c)
    text(c, MARGIN, PAGE_H - 70, "YOU", 76, TEXT, "MSYH-Bold")
    text(c, MARGIN + 150, PAGE_H - 70, "游凯", 40, ACCENT, "MSYH-Bold")
    text(c, MARGIN + 248, PAGE_H - 70, "KAI", 76, TEXT, "MSYH-Bold")
    text(c, MARGIN, PAGE_H - 142, "AI 漫剧 / AIGC 影视 / 三维 CG 视觉作品集", 18, TEXT, "MSYH-Bold")
    text(c, MARGIN, PAGE_H - 178, "面向 AI 动态漫短剧岗位的复合型视觉能力展示", 11, MUTED)
    c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.18))
    c.line(MARGIN, PAGE_H - 205, PAGE_W - MARGIN, PAGE_H - 205)
    text(
        c,
        MARGIN,
        PAGE_H - 250,
        "核心方向",
        10,
        ACCENT,
        "MSYH-Bold",
    )
    text(
        c,
        MARGIN,
        PAGE_H - 282,
        "从小说/脚本、角色设定、AI 生图生视频、动态漫剪辑，到字幕配音和账号发布，\n"
        "能够把 AIGC 工具链转化为稳定的短剧内容生产流程。",
        19,
        TEXT,
        "MSYH-Bold",
        30,
    )
    text(
        c,
        MARGIN,
        164,
        "TOOLS: C4D / Blender / After Effects / Premiere / Substance Painter / AIGC\n"
        "OUTPUT: AI Comic Short Drama / Product CGI / Stage Screen Visual / Commercial Space\n"
        "WEBSITE: https://aikk.pages.dev/",
        9.2,
        MUTED,
        "MSYH-Bold",
        17,
    )
    stat(c, PAGE_W - 426, 70, "5+", "年视觉经验")
    stat(c, PAGE_W - 322, 70, "30+", "商业项目")
    stat(c, PAGE_W - 218, 70, "1.9w", "账号获赞")
    stat(c, PAGE_W - 114, 70, "2800+", "粉丝积累")
    footer(c, page)
    c.showPage()

    page += 1
    bg(c)
    title(c, "AI 漫剧岗位匹配", "AI Short Drama Profile", page)
    img_card(c, profile, MARGIN, 72, 182, 248, "PROFILE", 0.76, center=(0.48, 0.44))
    text(c, 244, 302, "以 AIGC 动态漫短剧为核心，\n整合三维视觉、镜头审美与内容运营。", 24, TEXT, "MSYH-Bold", 33)
    text(
        c,
        246,
        200,
        "能独立完成：选题策划 / 小说脚本改编 / 角色人设 / AI 批量资产生成 /\n"
        "视频动态剪辑 / 字幕配音 / 发布运营。适合需要兼具内容理解、\n"
        "画面完成度和生产效率的 AI 漫剧岗位。",
        10.2,
        MUTED,
        "MSYH",
        18,
    )
    stat(c, 246, 96, "AIGC", "工作流")
    stat(c, 350, 96, "CG", "画面审美")
    stat(c, 454, 96, "运营", "内容反馈")
    stat(c, 558, 96, "交付", "独立闭环")
    footer(c, page)
    c.showPage()

    page += 1
    grid_page(c, page, "AI 漫画短剧自媒体", "AI Comic Short Drama", "代表作《全球高武：平A加血条，万拳之后我无敌》 / 选题、角色、AI 生图生视频、剪辑与发布", ai, 6)

    page += 1
    grid_page(c, page, "产品 CGI 宣传短片", "Product CGI Films", "汽车与工业产品视觉 / 结构建模、机械动画、写实灯光与成片输出", cgi, 9)

    page += 1
    grid_page(c, page, "舞美大屏 CG 视觉", "Stage Screen Visuals", "国风场景、粒子流体、循环播放素材与舞台氛围影像", stage, 6)

    page += 1
    grid_page(c, page, "商业美陈与沉浸空间 01", "Commercial Space", "商业美陈、展陈装置与沉浸式空间视觉方案", commercial[:9], 9)

    page += 1
    grid_page(c, page, "商业美陈与沉浸空间 02", "Commercial Space Extension", "商业空间视觉方案延展 / 场景、装置、动线与落地效果", commercial[9:18], 9)

    page += 1
    grid_page(c, page, "商业美陈与沉浸空间 03", "Commercial Space Archive", "更多商业空间视觉与三维场景方案", commercial[18:27], 9)

    page += 1
    grid_page(c, page, "商业美陈与沉浸空间 04", "Commercial Space Archive", "更多商业空间视觉与三维场景方案", commercial[27:36], 9)

    page += 1
    bg(c)
    title(c, "联系与合作", "Contact", page)
    text(c, MARGIN, 300, "期待与你合作，\n把 AI 漫剧内容推进到更稳定、\n更具视觉辨识度的生产流程。", 26, TEXT, "MSYH-Bold", 36)
    text(c, MARGIN, 156, "187 1702 7073\n782550606@qq.com\n重庆", 14, MUTED, "MSYH", 24)
    text(c, MARGIN, 78, "AI SHORT DRAMA / AIGC FILM / 3D CG VISUAL DESIGN", 9, ACCENT, "MSYH-Bold")
    footer(c, page)
    c.showPage()

    c.save()
    print(OUT)


if __name__ == "__main__":
    build_pdf()
