from pathlib import Path
from textwrap import wrap

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT_PUBLIC = ROOT / "public" / "resume-youkai.pdf"
OUT_COPY = ROOT / "output" / "pdf" / "resume-youkai.pdf"

PAGE_W, PAGE_H = A4
MARGIN = 24 * mm

BG = (0.031, 0.035, 0.039)
PANEL = (0.075, 0.082, 0.092)
PANEL_2 = (0.105, 0.112, 0.125)
LINE = (0.22, 0.235, 0.25)
TEXT = (0.92, 0.94, 0.95)
MUTED = (0.62, 0.65, 0.68)
SOFT = (0.46, 0.49, 0.52)
ACCENT = (1.0, 0.23, 0.25)
ACCENT_DARK = (0.58, 0.1, 0.12)


def register_fonts():
    pdfmetrics.registerFont(TTFont("YaHei", r"C:\Windows\Fonts\msyh.ttc"))
    pdfmetrics.registerFont(TTFont("YaHeiBold", r"C:\Windows\Fonts\msyhbd.ttc"))
    pdfmetrics.registerFont(TTFont("SimHei", r"C:\Windows\Fonts\simhei.ttf"))


def set_fill(c, color):
    c.setFillColorRGB(*color)


def set_stroke(c, color):
    c.setStrokeColorRGB(*color)


def draw_round_rect(c, x, y, w, h, radius=10, fill=PANEL, stroke=LINE, line_width=0.65):
    set_fill(c, fill)
    set_stroke(c, stroke)
    c.setLineWidth(line_width)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def draw_bg(c, page_num):
    set_fill(c, BG)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    set_fill(c, ACCENT_DARK)
    c.setFillAlpha(0.22)
    c.circle(PAGE_W * 0.84, PAGE_H * 0.92, 120, stroke=0, fill=1)
    c.circle(PAGE_W * 0.04, PAGE_H * 0.18, 95, stroke=0, fill=1)
    c.setFillAlpha(1)
    set_stroke(c, (0.12, 0.13, 0.14))
    c.setLineWidth(0.35)
    for i in range(9):
        x = -80 + i * 92
        c.line(x, PAGE_H + 10, x + 250, -10)
    c.setFont("YaHeiBold", 8)
    set_fill(c, SOFT)
    c.drawRightString(PAGE_W - MARGIN, 16 * mm, f"YOUKAI VISUAL RESUME / 2026 / {page_num:02d}")


def text_width(text, font, size):
    return pdfmetrics.stringWidth(text, font, size)


def split_text(text, font, size, max_width):
    lines = []
    current = ""
    for char in text:
        test = current + char
        if text_width(test, font, size) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = char
    if current:
        lines.append(current)
    return lines


def draw_text(c, text, x, y, max_width, font="YaHei", size=9.5, leading=15, color=TEXT, max_lines=None):
    set_fill(c, color)
    c.setFont(font, size)
    output = []
    for raw in text.splitlines():
        raw = raw.strip()
        if not raw:
            output.append("")
            continue
        output.extend(split_text(raw, font, size, max_width))
    if max_lines:
        output = output[:max_lines]
    for line in output:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_label(c, label, x, y):
    set_fill(c, ACCENT)
    c.setFont("YaHeiBold", 8)
    c.drawString(x, y, label.upper())


def draw_section_title(c, title, x, y, width):
    draw_label(c, title[1] if isinstance(title, tuple) else "SECTION", x, y)
    y -= 16
    set_fill(c, TEXT)
    c.setFont("YaHeiBold", 17)
    c.drawString(x, y, title[0] if isinstance(title, tuple) else title)
    set_stroke(c, LINE)
    c.setLineWidth(0.7)
    c.line(x, y - 8, x + width, y - 8)
    return y - 24


def draw_chip(c, text, x, y, pad_x=8, h=18):
    w = text_width(text, "YaHeiBold", 7.5) + pad_x * 2
    draw_round_rect(c, x, y - h + 3, w, h, radius=8, fill=(0.12, 0.06, 0.065), stroke=(0.45, 0.14, 0.15), line_width=0.5)
    set_fill(c, (1, 0.76, 0.76))
    c.setFont("YaHeiBold", 7.5)
    c.drawString(x + pad_x, y - 9, text)
    return x + w + 6


def draw_stat(c, value, label, x, y, w):
    h = 44
    draw_round_rect(c, x, y - h, w, h, radius=10, fill=PANEL_2, stroke=LINE)
    value_size = 18
    label_size = 7.5
    value_y = y - 18
    label_y = y - 32
    set_fill(c, TEXT)
    c.setFont("YaHeiBold", value_size)
    c.drawString(x + (w - text_width(value, "YaHeiBold", value_size)) / 2, value_y, value)
    set_fill(c, MUTED)
    c.setFont("YaHei", label_size)
    c.drawString(x + (w - text_width(label, "YaHei", label_size)) / 2, label_y, label)


def draw_bullet(c, text, x, y, width, size=8.8, leading=13.2, color=MUTED):
    set_fill(c, ACCENT)
    c.circle(x + 2, y + 3, 1.7, fill=1, stroke=0)
    return draw_text(c, text, x + 10, y, width - 10, size=size, leading=leading, color=color)


def draw_job(c, title, date, role, bullets, x, y, width):
    set_fill(c, TEXT)
    c.setFont("YaHeiBold", 10.5)
    c.drawString(x, y, title)
    set_fill(c, ACCENT)
    c.setFont("YaHeiBold", 8)
    c.drawRightString(x + width, y, date)
    y -= 14
    set_fill(c, MUTED)
    c.setFont("YaHei", 8)
    c.drawString(x, y, role)
    y -= 13
    for bullet in bullets:
        y = draw_bullet(c, bullet, x, y, width, size=8.1, leading=11.6)
        y -= 3
    return y - 6


def draw_project(c, index, title, meta, bullets, x, y, width):
    draw_round_rect(c, x, y - 86, width, 86, radius=11, fill=PANEL, stroke=LINE)
    set_fill(c, ACCENT)
    c.setFont("YaHeiBold", 11)
    c.drawString(x + 12, y - 18, f"{index:02d}")
    set_fill(c, TEXT)
    c.setFont("YaHeiBold", 10.5)
    c.drawString(x + 42, y - 18, title)
    set_fill(c, SOFT)
    c.setFont("YaHei", 7.5)
    c.drawString(x + 42, y - 31, meta)
    ty = y - 47
    for bullet in bullets[:2]:
        ty = draw_bullet(c, bullet, x + 14, ty, width - 28, size=7.6, leading=10.6)
    return y - 96


def page_one(c):
    draw_bg(c, 1)
    x = MARGIN
    y = PAGE_H - MARGIN

    set_fill(c, ACCENT)
    c.setFont("YaHeiBold", 8)
    c.drawString(x, y, "AI DIGITAL VISUAL DESIGNER / 3D CG VISUAL DESIGNER")
    y -= 46
    set_fill(c, TEXT)
    c.setFont("YaHeiBold", 42)
    c.drawString(x, y, "游凯")
    set_fill(c, ACCENT)
    c.setFont("YaHeiBold", 16)
    c.drawString(x + 108, y + 7, "YOU KAI")
    y -= 26
    set_fill(c, MUTED)
    c.setFont("YaHei", 9.5)
    c.drawString(x, y, "意向岗位：AIGC影视 / AI数字视觉设计师 / 三维CG视觉设计师")
    c.drawRightString(PAGE_W - MARGIN, y, "重庆 | 5年视觉项目经验")

    y -= 34
    left_w = 150
    mid_w = PAGE_W - MARGIN * 2 - left_w - 14
    draw_round_rect(c, x, y - 88, left_w, 88, radius=14, fill=PANEL, stroke=LINE)
    draw_label(c, "CONTACT", x + 14, y - 18)
    draw_text(c, "187 1702 7073\n782550606@qq.com\n男 / 考虑机会", x + 14, y - 36, left_w - 28, size=8.6, leading=14, color=TEXT)

    draw_round_rect(c, x + left_w + 14, y - 88, mid_w, 88, radius=14, fill=PANEL, stroke=LINE)
    draw_label(c, "PROFILE", x + left_w + 28, y - 18)
    summary = "拥有完整三维视觉全流程制作经验，深耕沉浸式空间美陈、游戏场景、品牌CG宣传、线下舞美视觉与AI漫画短剧项目。擅长把控光影、构图、材质和成片质感，能够从概念方向推进到建模、动画、渲染、合成与交付。"
    draw_text(c, summary, x + left_w + 28, y - 36, mid_w - 28, size=8.4, leading=13.2, color=MUTED, max_lines=4)

    y -= 114
    stat_w = (PAGE_W - MARGIN * 2 - 18) / 4
    stats = [("5+", "年视觉项目经验"), ("30+", "商业/影像/空间项目"), ("1.9w", "AI短剧账号获赞"), ("2800+", "账号粉丝积累")]
    sx = x
    for value, label in stats:
        draw_stat(c, value, label, sx, y, stat_w)
        sx += stat_w + 6

    y -= 74
    y = draw_section_title(c, ("核心能力", "CAPABILITY"), x, y, PAGE_W - MARGIN * 2)
    chip_x = x
    chip_y = y
    for chip in ["C4D", "Blender", "After Effects", "Premiere", "Substance Painter", "AI绘图/生视频", "CG渲染", "空间美陈", "舞美大屏"]:
        if chip_x + text_width(chip, "YaHeiBold", 7.5) + 22 > PAGE_W - MARGIN:
            chip_x = x
            chip_y -= 24
        chip_x = draw_chip(c, chip, chip_x, chip_y)

    y = chip_y - 38
    y = draw_section_title(c, ("工作经历", "EXPERIENCE"), x, y, PAGE_W - MARGIN * 2)
    y = draw_job(
        c,
        "独立自由创作者 | AI漫短剧自媒体",
        "持续运营",
        "KK漫画阁（抖音ID：K_movie）",
        [
            "独立完成选题策划、小说剧本改编、角色人设、AI批量生图生视频、动态漫剪辑合成、字幕配音和发布流程。",
            "累计产出系列原创AI漫画短剧，账号积累2800+粉丝、1.9万总获赞，形成可复用的AIGC短剧工作流。",
        ],
        x,
        y,
        PAGE_W - MARGIN * 2,
    )
    y = draw_job(
        c,
        "北门影视传媒",
        "2025.01 - 2026.03",
        "三维CG动画设计师",
        [
            "参与产品官宣CG、影视片头、线下舞台舞美视觉动画等项目，覆盖概念、三维、动画、光影渲染、后期合成与成片输出。",
            "统筹画面审美，基于美术绘画功底把控光影氛围、色彩调性和镜头构图，提升品牌宣传片质感。",
        ],
        x,
        y,
        PAGE_W - MARGIN * 2,
    )
    y = draw_job(
        c,
        "感映维度艺术发展（重庆）中心",
        "2023.01 - 2024.12",
        "3D设计师",
        [
            "负责商业IP、潮玩产品三维场景设计与视觉物料开发，输出3D设计方案、效果图和落地制作文件。",
            "对接策划、客户与执行团队，核对尺寸、材质、结构细节，交付标准化生产文件。",
        ],
        x,
        y,
        PAGE_W - MARGIN * 2,
    )
    draw_job(
        c,
        "空间跳动（重庆）文化传媒有限公司",
        "2021.06 - 2022.06",
        "视觉 / 空间设计师",
        [
            "参与江北机场T3航站楼公共空间视觉、主题登机口和装置空间视觉设计，负责概念设计与效果图渲染。",
        ],
        x,
        y,
        PAGE_W - MARGIN * 2,
    )


def page_two(c):
    draw_bg(c, 2)
    x = MARGIN
    y = PAGE_H - MARGIN

    y = draw_section_title(c, ("精选项目经验", "SELECTED WORKS"), x, y, PAGE_W - MARGIN * 2)
    col_gap = 14
    col_w = (PAGE_W - MARGIN * 2 - col_gap) / 2
    left_y = y
    right_y = y
    projects = [
        ("全流程AI动态漫制作", "代表作《全球高武：平A加血条，万拳之后我无敌》", ["完成选题策划、小说改编、角色人设、AI生图生视频、动态漫剪辑、字幕配音与发布。", "账号积累2800+粉丝、1.9万总获赞，形成可复用AIGC短剧生产流程。"]),
        ("产品CGI宣传短片 / 影视片头CG包装", "五菱、宝骏、MINIEV等商业CGI / 《最美的你》片头", ["完成高精度三维资产、机械结构动画、写实工业光影与AE后期合成。", "输出新品发布、车型上市与影视片头相关CG镜头。"]),
        ("线下舞台舞美大屏CG", "《白鹭》《傩面》《千江月》", ["适配舞台大屏分辨率与循环播放需求。", "制作国风三维场景、粒子流体动态和长镜头舞美素材。"]),
        ("沉浸式剧场 / 游戏场景", "2019 - 2020 多个沉浸式空间项目", ["将剧本场景转化为三维空间视觉，完成模型、贴图、渲染与概念短片。", "覆盖废土、恐怖、实景体验馆等多种风格场景。"]),
        ("江北机场公共空间视觉", "T3国际到达通道、F22主题登机口", ["参与创意策划、整体空间视觉方案与装置落地设计。", "负责概念设计、空间效果图渲染和公共空间氛围塑造。"]),
        ("商业美陈落地项目", "源著天街、上海奇迹花园、招商花海博物志等", ["独立或主导全案3D场景设计，多项目完成落地。", "输出商业展陈、美陈空间、花卉展与开业场景方案。"]),
    ]
    for idx, (title, meta, bullets) in enumerate(projects, start=1):
        if idx % 2:
            left_y = draw_project(c, idx, title, meta, bullets, x, left_y, col_w)
        else:
            right_y = draw_project(c, idx, title, meta, bullets, x + col_w + col_gap, right_y, col_w)

    y = min(left_y, right_y) - 12
    y = draw_section_title(c, ("教育与荣誉", "EDUCATION"), x, y, PAGE_W - MARGIN * 2)
    draw_round_rect(c, x, y - 62, PAGE_W - MARGIN * 2, 62, radius=12, fill=PANEL, stroke=LINE)
    draw_text(c, "四川美术学院 | 本科 | 艺术与科技专业（特殊原因结业）\n就读时间：2017.09 - 2021.06\n作品《草履虫梦境》入选四川美术学院年展", x + 14, y - 18, PAGE_W - MARGIN * 2 - 28, size=8.7, leading=14, color=TEXT)

    y -= 88
    y = draw_section_title(c, ("求职意向", "INTENTION"), x, y, PAGE_W - MARGIN * 2)
    draw_round_rect(c, x, y - 74, PAGE_W - MARGIN * 2, 74, radius=12, fill=PANEL, stroke=LINE)
    intent_left = "意向岗位：AIGC影视\n意向城市：重庆\n期望薪资：8-10K / 面议"
    intent_right = "期望行业：AI影视业\n当前状态：考虑机会\n个人网站：网页版作品集"
    draw_text(c, intent_left, x + 14, y - 18, 220, size=8.7, leading=15, color=TEXT)
    draw_text(c, intent_right, x + 292, y - 18, 230, size=8.7, leading=15, color=TEXT)

    final_y = 58 * mm
    draw_round_rect(c, x, final_y - 44, PAGE_W - MARGIN * 2, 44, radius=14, fill=(0.095, 0.058, 0.062), stroke=(0.42, 0.12, 0.13), line_width=0.65)
    set_fill(c, ACCENT)
    c.setFont("YaHeiBold", 13)
    c.drawString(x + 14, final_y - 18, "GET RESUME / VIEW PORTFOLIO")
    set_fill(c, TEXT)
    c.setFont("YaHei", 8.4)
    c.drawString(x + 14, final_y - 34, "邮箱：782550606@qq.com    电话：187 1702 7073")
    set_fill(c, MUTED)
    c.setFont("YaHei", 8)
    c.drawRightString(PAGE_W - MARGIN - 14, final_y - 27, "AI数字视觉设计师 / 三维CG视觉设计师")


def main():
    register_fonts()
    OUT_PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    OUT_COPY.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT_PUBLIC), pagesize=A4)
    c.setTitle("游凯 - AI数字视觉设计师个人介绍")
    page_one(c)
    c.showPage()
    page_two(c)
    c.save()
    OUT_COPY.write_bytes(OUT_PUBLIC.read_bytes())
    print(OUT_PUBLIC)


if __name__ == "__main__":
    main()
