import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './styles.css'

gsap.registerPlugin(ScrollTrigger)

const commercialSpaceWorks = [
  'page_002_image_01.jpg',
  'page_003_image_01.jpg',
  'page_004_image_01.jpg',
  'page_005_image_01.jpg',
  'page_006_image_01.jpg',
  'page_007_image_01.jpg',
  'page_008_image_01.jpg',
  'page_009_image_01.jpg',
  'page_010_image_01.jpg',
  'page_011_image_01.jpg',
  'page_012_image_01.jpg',
  'page_013_image_01.jpg',
  'page_014_image_01.jpg',
  'page_015_image_01.jpg',
  'page_016_image_01.jpg',
  'page_017_image_01.jpg',
  'page_018_image_01.jpg',
  'page_019_image_01.jpg',
  'page_021_image_01.jpg',
  'page_022_image_01.jpg',
  'page_023_image_01.jpg',
  'page_024_image_01.jpg',
  'page_025_image_01.jpg',
  'page_026_image_01.jpg',
  'page_027_image_01.jpg',
  'page_028_image_01.jpg',
  'page_029_image_01.jpg',
  'page_030_image_01.jpg',
  'page_031_image_01.jpg',
  'page_032_image_01.jpg',
  'page_033_image_01.jpg',
  'page_034_image_01.jpg',
  'page_035_image_01.jpg',
  'page_037_image_01.jpg',
  'page_038_image_01.jpg',
  'page_038_image_02.jpg',
  'page_039_image_01.jpg',
  'page_055_image_01.jpg',
  'page_056_image_01.jpg',
  'page_057_image_01.jpg',
  'page_058_image_01.jpg',
].map((file, index) => ({
  id: `commercial-space-${index + 1}`,
  src: `/works/commercial-space/${file}`,
}))

const productCgiWorks = [
  '1.mp4',
  '2.mp4',
  '3.mp4',
  '4.mp4',
  '5.mp4',
  '6.mp4',
  '7.mp4',
  '8-source.mp4',
  '8.mp4',
].map((file, index) => ({
  id: `product-cgi-${index + 1}`,
  src: `/works/product-cgi/${encodeURIComponent(file)}`,
  type: 'video',
}))

const stageVisualWorks = [
  '9.mp4',
  '11.mp4',
  '12.mp4',
  '15.mp4',
  '17.mp4',
  '21.mp4',
].map((file, index) => ({
  id: `stage-visual-${index + 1}`,
  src: `/works/stage-visual/${file}`,
  type: 'video',
}))

const aiShortsWorks = [
  '111.mp4',
  '222.mp4',
  '333.mp4',
  '444.mp4',
  '555.mp4',
  '666.mp4',
].map((file, index) => ({
  id: `ai-shorts-${index + 1}`,
  src: `/works/ai-shorts/${file}`,
  type: 'video',
}))

const projects = [
  {
    title: 'AI 漫画短剧自媒体',
    tag: 'AIGC / Short Drama Workflow',
    image: '/images/project-ai.jpg',
    works: aiShortsWorks,
    meta: 'KK 漫画阁，2800+ 粉丝，1.9 万获赞',
    desc: '独立完成选题策划、小说改编、角色设定、AI 批量生图生视频、动态漫剪辑、字幕配音与发布运营。',
  },
  {
    title: '产品 CGI 宣传短片',
    tag: 'Automotive / Industrial CGI',
    image: '/images/project-cgi.jpg',
    works: productCgiWorks,
    meta: '五菱动力电池、宝骏云海、MINIEV 等车型商业宣传',
    desc: '负责高精度三维资产、机械结构动画、写实工业光影渲染与成片输出，让产品信息以更具发布会质感的影像方式抵达用户。',
  },
  {
    title: '商业美陈与沉浸空间',
    tag: 'Spatial Design / Retail Installation',
    image: '/images/project-space.jpg',
    works: commercialSpaceWorks,
    galleryMode: 'horizontal',
    meta: '源著天街、上海奇迹花园、招商花海博物志等',
    desc: '从概念方案、三维场景、效果图到落地文件，完成商业空间与装置类项目的视觉设计和执行衔接。',
  },
  {
    title: '舞美大屏 CG 视觉',
    tag: 'Stage Visual / Motion Design',
    image: '/images/project-stage.jpg',
    works: stageVisualWorks,
    meta: '《白鹭》《傩面》《千江月》舞台视觉',
    desc: '围绕舞台分辨率、循环播放和现场氛围制作国风三维场景、粒子流体动态与长镜头视觉素材。',
  },
]

const strengths = [
  ['CG 全流程', '覆盖建模、动画、灯光、渲染、合成与成片输出，能独立推进商业 CG 影像落地。'],
  ['AIGC 工作流', '熟悉 AI 绘图、生视频与 Codex 等工具，能把 AIGC 纳入稳定生产链路。'],
  ['空间视觉落地', '理解商业美陈、展陈装置与沉浸式场景，从视觉方案延展到执行文件。'],
  ['审美统筹', '具备绘画与艺术科技背景，擅长控制构图、光影、材质和整体影像调性。'],
  ['项目协同', '可对接客户、策划、制片与执行团队，拆解需求并管理多项目并行交付。'],
  ['内容运营', '独立运营原创 AI 漫短剧账号，兼具视觉制作、内容节奏和用户反馈意识。'],
]

const timeline = [
  ['2025 - 2026', '北门影视传媒', '三维 CG 动画设计师，参与产品官宣 CG、影视片头、线下舞美视觉动画等项目。'],
  ['2023 - 2024', '感映维度艺术发展中心', '负责商业 IP、潮玩产品、商业美陈项目的三维设计方案与落地文件。'],
  ['2021 - 2022', '空间跳动文化传媒', '参与江北机场 T3 航站楼公共空间视觉、装置与主题登机口设计。'],
  ['自由创作', 'AI 漫短剧 / 三维视觉外包', '自主运营 KK 漫画阁，并承接沉浸式剧场、商业空间视觉项目。'],
]

const uiCopy = {
  zh: {
    nav: ['经历', '项目', '优势', '联系'],
    contact: '联系我',
    backHome: '返回首页',
    topLeft: 'VISUAL PROTOCOL / 2026',
    topRight: 'CGI · AIGC · SPATIAL',
    role: 'AI DIGITAL VISUAL DESIGNER / 3D CG VISUAL DESIGNER',
    heroLead: '用三维 CG、AIGC 与空间视觉，把产品、舞台和沉浸场景转译成克制而有力量的数字影像。',
    viewProjects: '查看精选项目',
    sendMail: '发送邮件',
    heroMeta: ['5 年视觉经验', 'C4D / Blender / AE / AIGC', '地点·重庆'],
    profileTitle: '从空间、产品到动态影像的复合型视觉设计师。',
    bio: '拥有完整三维视觉全流程制作经验，深耕沉浸式空间美陈、游戏场景、品牌 CG 宣传、线下舞美视觉与 AI 漫画短剧项目。熟悉 C4D、Blender、After Effects、Premiere、Substance Painter 及 AI 创作工具，能在项目早期建立概念方向，也能推进建模、动画、渲染、合成与交付。',
    stats: ['年视觉项目经验', '商业 / 影像 / 空间项目', 'AI 短剧账号获赞', '账号粉丝积累'],
    projectsTitle: '精选项目',
    strengthsTitle: '个人优势',
    contactEyebrow: "LET'S BUILD THE NEXT VISUAL SYSTEM",
    contactTitle: '期待与你合作，把想象推进到可观看、可传播、可落地。',
    roleLine: 'AI 数字视觉设计师 / 三维 CG 视觉设计师',
  },
  en: {
    nav: ['Profile', 'Works', 'Strengths', 'Contact'],
    contact: 'Contact',
    backHome: 'Back to home',
    topLeft: 'VISUAL PROTOCOL / 2026',
    topRight: 'CGI · AIGC · SPATIAL',
    role: 'AI DIGITAL VISUAL DESIGNER / 3D CG VISUAL DESIGNER',
    heroLead: 'I translate products, stages and immersive environments into restrained, high-impact digital imagery through 3D CG, AIGC and spatial visual design.',
    viewProjects: 'View selected works',
    sendMail: 'Send email',
    heroMeta: ['5 years visual practice', 'C4D / Blender / AE / AIGC', 'Based in Chongqing'],
    profileTitle: 'A hybrid visual designer working across space, product and moving image.',
    bio: 'I work across the full 3D visual production pipeline, with experience in immersive commercial installations, game-like environments, brand CGI films, stage screen visuals and AI short-form comic dramas. I use C4D, Blender, After Effects, Premiere, Substance Painter and AI creation tools to shape early concepts and carry projects through modeling, animation, rendering, compositing and final delivery.',
    stats: ['Years of visual work', 'Commercial / film / spatial projects', 'AI short-drama likes', 'Account followers'],
    projectsTitle: 'Selected Works',
    strengthsTitle: 'Core Strengths',
    contactEyebrow: "LET'S BUILD THE NEXT VISUAL SYSTEM",
    contactTitle: 'Let us turn imagination into something visible, shareable and ready to land.',
    roleLine: 'AI Digital Visual Designer / 3D CG Visual Designer',
  },
}

const projectEnglish = [
  {
    title: 'AI Comic Short-Drama Channel',
    meta: 'KK Comic Studio, 2,800+ followers and 19k likes',
    desc: 'Independently developed topics, adapted stories, defined characters, generated AI image/video assets, edited motion comic episodes, added subtitles and voice, and managed publishing operations.',
  },
  {
    title: 'Product CGI Campaign Films',
    meta: 'Wuling battery, Baojun Yunhai, MINIEV and other commercial CGI projects',
    desc: 'Created high-fidelity 3D assets, mechanical motion, realistic industrial lighting and final CGI films, helping product messages arrive with a launch-event level of visual polish.',
  },
  {
    title: 'Commercial Display & Immersive Space',
    meta: 'Retail streets, themed gardens, brand installations and exhibition scenes',
    desc: 'Built spatial concepts, 3D scenes, renderings and implementation documents for commercial display and installation projects, connecting visual design with real-world execution.',
  },
  {
    title: 'Stage Screen CG Visuals',
    meta: 'Stage visuals for Bailu, Nuo Mask, Qianjiang Moon and related performances',
    desc: 'Designed stage visuals around screen resolution, playback loops and live atmosphere, including Chinese-style 3D scenes, particle motion and long-shot visual materials.',
  },
]

const strengthsEn = [
  ['Full CG Pipeline', 'Covers modeling, animation, lighting, rendering, compositing and delivery, with the ability to push commercial CGI imagery independently.'],
  ['AIGC Workflow', 'Experienced with AI image/video generation and production tools, integrating AIGC into a stable creative pipeline.'],
  ['Spatial Visual Execution', 'Understands commercial displays, exhibition installations and immersive scenes from visual proposal to implementation files.'],
  ['Art Direction Control', 'Combines an art and technology background with strong control of composition, light, material and overall image tone.'],
  ['Project Collaboration', 'Can work with clients, planners, producers and execution teams, translating needs into clear visual deliverables.'],
  ['Content Operation', 'Runs an original AI comic short-drama account, combining visual production with content pacing and audience feedback.'],
]

const timelineEn = [
  ['2025 - 2026', 'Beimen Film & Media', '3D CG motion designer involved in product CGI launches, film titles and offline stage visual animation.'],
  ['2023 - 2024', 'Ganying Dimension Art Center', 'Responsible for 3D design proposals and delivery documents for commercial IP, art toys and display projects.'],
  ['2021 - 2022', 'Space Jump Culture Media', 'Worked on public-space visuals, installations and themed boarding gate design for Jiangbei Airport T3.'],
  ['Independent Practice', 'AI Comic Shorts / 3D Visual Freelance', 'Runs KK Comic Studio and takes on immersive theater and commercial spatial visual projects.'],
]

function getWorks(project) {
  if (project?.works?.length) return project.works

  return Array.from({ length: 12 }, (_, index) => ({
    id: `${project.title}-${index + 1}`,
  }))
}

function ContactIcon({ type }) {
  const paths = {
    phone: (
      <path d="M6.7 4.2 4.9 5.5c-.7.5-.8 1.4-.4 2.2 1.7 3.7 4.5 6.4 8.1 8.1.8.4 1.7.3 2.2-.4l1.3-1.8-3.1-2-1.1 1.1c-1.7-.8-3.1-2.2-3.9-3.9l1.1-1.1-2.4-3.5Z" />
    ),
    mail: (
      <>
        <path d="M3.8 6.3h12.4v8.9H3.8z" />
        <path d="m4.4 7 5.6 4.4L15.6 7" />
      </>
    ),
    school: (
      <>
        <path d="m3.2 7.8 6.8-3 6.8 3-6.8 3-6.8-3Z" />
        <path d="M6.2 9.4v3.5c1.9 1.2 5.7 1.2 7.6 0V9.4" />
      </>
    ),
  }

  return (
    <svg className="contactIcon" viewBox="0 0 20 20" aria-hidden="true">
      {paths[type]}
    </svg>
  )
}

function WorkMedia({ work, alt, preview = false }) {
  const videoRef = useRef(null)

  function playPreview() {
    if (!preview || !videoRef.current) return
    videoRef.current.play().catch(() => {})
  }

  function pausePreview() {
    if (!preview || !videoRef.current) return
    videoRef.current.pause()
    videoRef.current.currentTime = 0
  }

  if (work.type === 'video') {
    return (
      <video
        ref={videoRef}
        src={work.src}
        muted
        autoPlay={!preview}
        loop={preview}
        playsInline
        controls={false}
        preload={preview ? 'none' : 'metadata'}
        aria-label={alt}
        onPointerEnter={playPreview}
        onPointerLeave={pausePreview}
      />
    )
  }

  if (work.src) {
    return <img src={work.src} alt={alt} loading="lazy" decoding="async" />
  }

  return <i />
}

function ProjectCard({ project, index, onOpen }) {
  function handleMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--glow-x', `${((x + 0.5) * 100).toFixed(1)}%`)
    event.currentTarget.style.setProperty('--glow-y', `${((y + 0.5) * 100).toFixed(1)}%`)
  }

  function handleLeave(event) {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
    event.currentTarget.style.setProperty('--glow-x', '50%')
    event.currentTarget.style.setProperty('--glow-y', '50%')
  }

  return (
    <article
      className="projectCard"
      onClick={() => onOpen(project, index)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ '--tilt-x': '0deg', '--tilt-y': '0deg', '--glow-x': '50%', '--glow-y': '50%' }}
    >
      <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
      <div className="projectContent">
        <b>{String(index + 1).padStart(2, '0')}</b>
        <span>{project.tag}</span>
        <h3>{project.title}</h3>
        <p className="projectMeta">{project.meta}</p>
        <p>{project.desc}</p>
      </div>
    </article>
  )
}

function HeroBackgroundVideo() {
  const videoRef = useRef(null)
  const [canLoadVideo, setCanLoadVideo] = useState(false)

  useEffect(() => {
    const load = () => setCanLoadVideo(true)
    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(load, { timeout: 1800 })
      return () => window.cancelIdleCallback?.(idleId)
    }

    const timer = window.setTimeout(load, 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!canLoadVideo || !videoRef.current) return
    videoRef.current.load()
    videoRef.current.play().catch(() => {})
  }, [canLoadVideo])

  return (
    <video ref={videoRef} className="heroVideo" autoPlay muted loop playsInline preload="none" aria-hidden="true">
      {canLoadVideo && <source src="/videos/hero-bg.webm" type="video/webm" />}
    </video>
  )
}

function ProjectOverlay({ project, projectIndex, activeWork, setActiveWork, onClose }) {
  if (!project) return null

  const railRef = useRef(null)
  const progressRef = useRef(null)
  const scrollTimerRef = useRef(null)
  const inertiaFrameRef = useRef(null)
  const progressFrameRef = useRef(null)
  const progressDragRef = useRef(false)
  const progressDragStateRef = useRef({
    thumbOffset: 0,
  })
  const dragStateRef = useRef({
    active: false,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    moved: false,
    totalDistance: 0,
  })
  const [scrollMetrics, setScrollMetrics] = useState({ position: 0, size: 1 })
  const [progressVisible, setProgressVisible] = useState(false)

  useEffect(() => () => {
    stopInertia()
    if (progressFrameRef.current) {
      window.cancelAnimationFrame(progressFrameRef.current)
    }
  }, [])

  useEffect(() => {
    const node = railRef.current
    if (!node) return undefined

    const frame = window.requestAnimationFrame(() => updateRailProgress(node))
    return () => window.cancelAnimationFrame(frame)
  }, [project.id])

  useEffect(() => {
    if (activeWork === null) return undefined

    const lockedScrollY = window.scrollY
    const previousBodyOverflow = document.body.style.overflow
    const previousBodyPosition = document.body.style.position
    const previousBodyTop = document.body.style.top
    const previousBodyWidth = document.body.style.width
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${lockedScrollY}px`
    document.body.style.width = '100%'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.position = previousBodyPosition
      document.body.style.top = previousBodyTop
      document.body.style.width = previousBodyWidth
      document.documentElement.style.overflow = previousHtmlOverflow
      window.scrollTo(0, lockedScrollY)
    }
  }, [activeWork !== null])

  const works = getWorks(project)

  function updateRailProgress(node) {
    const maxScroll = node.scrollWidth - node.clientWidth
    const thumbSize = node.scrollWidth > 0 ? Math.min(node.clientWidth / node.scrollWidth, 1) : 1
    const thumbTravel = Math.max(1 - thumbSize, 0)
    const progress = maxScroll > 0 ? node.scrollLeft / maxScroll : 0
    setScrollMetrics({
      position: thumbTravel * progress,
      size: thumbSize,
    })
    setProgressVisible(true)
    window.clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = window.setTimeout(() => setProgressVisible(false), 760)
  }

  function handleRailWheel(event) {
    event.preventDefault()
    const node = railRef.current
    if (!node) return
    node.scrollLeft += (event.deltaY + event.deltaX) * 3.5
    updateRailProgress(node)
  }

  function handleRailScroll(event) {
    const node = event.currentTarget
    if (progressFrameRef.current) return
    progressFrameRef.current = window.requestAnimationFrame(() => {
      progressFrameRef.current = null
      updateRailProgress(node)
    })
  }

  function seekRailByClientX(clientX, thumbOffset = 0) {
    const node = railRef.current
    const progress = progressRef.current
    if (!node || !progress) return

    const rect = progress.getBoundingClientRect()
    const maxScroll = node.scrollWidth - node.clientWidth
    const thumbWidth = rect.width * scrollMetrics.size
    const maxThumbTravel = rect.width - thumbWidth

    if (maxScroll <= 0 || maxThumbTravel <= 0) return

    const thumbLeft = Math.min(Math.max(clientX - rect.left - thumbOffset, 0), maxThumbTravel)
    node.scrollLeft = maxScroll * (thumbLeft / maxThumbTravel)
    updateRailProgress(node)
  }

  function handleProgressPointerDown(event) {
    event.stopPropagation()
    event.preventDefault()
    stopInertia()
    const rect = event.currentTarget.getBoundingClientRect()
    const thumbWidth = rect.width * scrollMetrics.size
    const thumbLeft = rect.left + rect.width * scrollMetrics.position
    const isInsideThumb = event.clientX >= thumbLeft && event.clientX <= thumbLeft + thumbWidth

    progressDragStateRef.current.thumbOffset = isInsideThumb
      ? event.clientX - thumbLeft
      : thumbWidth / 2
    progressDragRef.current = true
    setProgressVisible(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    seekRailByClientX(event.clientX, progressDragStateRef.current.thumbOffset)
  }

  function handleProgressPointerMove(event) {
    if (!progressDragRef.current) return
    event.stopPropagation()
    event.preventDefault()
    seekRailByClientX(event.clientX, progressDragStateRef.current.thumbOffset)
  }

  function handleProgressPointerUp(event) {
    if (!progressDragRef.current) return
    event.stopPropagation()
    progressDragRef.current = false
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    window.clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = window.setTimeout(() => setProgressVisible(false), 760)
  }

  function stopInertia() {
    if (inertiaFrameRef.current) {
      window.cancelAnimationFrame(inertiaFrameRef.current)
      inertiaFrameRef.current = null
    }
  }

  function startInertia() {
    const node = railRef.current
    if (!node) return
    let velocity = dragStateRef.current.velocity
    const minVelocity = 0.08
    const friction = 0.92

    function step() {
      if (Math.abs(velocity) < minVelocity) {
        inertiaFrameRef.current = null
        return
      }

      node.scrollLeft -= velocity
      updateRailProgress(node)
      velocity *= friction
      inertiaFrameRef.current = window.requestAnimationFrame(step)
    }

    inertiaFrameRef.current = window.requestAnimationFrame(step)
  }

  function handleRailPointerDown(event) {
    if (event.button !== 0) return
    const node = railRef.current
    if (!node) return
    stopInertia()
    dragStateRef.current = {
      active: true,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
      totalDistance: 0,
    }
    node.classList.add('isDragging')
    node.setPointerCapture?.(event.pointerId)
  }

  function handleRailPointerMove(event) {
    const state = dragStateRef.current
    const node = railRef.current
    if (!state.active || !node) return

    const now = performance.now()
    const deltaX = event.clientX - state.lastX
    const deltaTime = Math.max(now - state.lastTime, 16)
    state.totalDistance += Math.abs(deltaX)
    if (state.totalDistance > 14) state.moved = true

    node.scrollLeft -= deltaX
    state.velocity = deltaX / deltaTime * 16.67
    state.lastX = event.clientX
    state.lastTime = now
    updateRailProgress(node)
  }

  function handleRailPointerUp(event) {
    const state = dragStateRef.current
    const node = railRef.current
    if (!state.active || !node) return
    state.active = false
    node.classList.remove('isDragging')
    node.releasePointerCapture?.(event.pointerId)
    if (state.moved) {
      startInertia()
      window.setTimeout(() => {
        dragStateRef.current.moved = false
      }, 120)
      return
    }

    const thumb = document.elementFromPoint(event.clientX, event.clientY)?.closest?.('.workThumb')
    if (thumb?.dataset.workIndex) {
      setActiveWork(Number(thumb.dataset.workIndex))
    }
  }

  function handleWorkClick(index) {
    if (dragStateRef.current.moved) return
    setActiveWork(index)
  }

  function handleWheel(event) {
    if (activeWork === null) return
    event.stopPropagation()
    event.preventDefault()
    setActiveWork((current) => {
      const direction = event.deltaY > 0 ? 1 : -1
      return (current + direction + works.length) % works.length
    })
  }

  return (
    <div className="projectOverlay" onClick={onClose}>
      <div className="projectExpanded" onClick={(event) => event.stopPropagation()}>
        <div className="expandedHeader">
          <div>
            <span>{String(projectIndex + 1).padStart(2, '0')} / SELECTED WORK</span>
            <h2>{project.title}</h2>
          </div>
          <p>{project.desc}</p>
        </div>
        <div className="workRailWrap">
            <div
              className="workRail"
              ref={railRef}
              onWheel={handleRailWheel}
              onScroll={handleRailScroll}
              onPointerDown={handleRailPointerDown}
              onPointerMove={handleRailPointerMove}
              onPointerUp={handleRailPointerUp}
              onPointerCancel={handleRailPointerUp}
              onPointerLeave={handleRailPointerUp}
            >
              {works.map((work, index) => (
              <button
                className={`workThumb ${work.src ? '' : 'isPlaceholder'}`}
                key={work.id}
                data-work-index={index}
                onClick={() => handleWorkClick(index)}
              >
                <WorkMedia work={work} alt={`${project.title} 作品 ${index + 1}`} preview />
              </button>
            ))}
          </div>
          <div
            className={`workProgress ${progressVisible ? 'isVisible' : ''}`}
            ref={progressRef}
            onPointerDown={handleProgressPointerDown}
            onPointerMove={handleProgressPointerMove}
            onPointerUp={handleProgressPointerUp}
            onPointerCancel={handleProgressPointerUp}
          >
            <span
              style={{
                width: `${Math.max(scrollMetrics.size * 100, 8)}%`,
                left: `${scrollMetrics.position * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {activeWork !== null && (
        <div className="workLightbox" onClick={(event) => { event.stopPropagation(); setActiveWork(null) }} onWheel={handleWheel}>
          <button className="lightboxArrow prev" onClick={(event) => { event.stopPropagation(); setActiveWork((activeWork - 1 + works.length) % works.length) }}>
            ‹
          </button>
          <div
            className={`lightboxWork ${works[activeWork].src ? 'hasImage' : ''} ${works[activeWork].type === 'video' ? 'hasVideo' : ''}`}
            onClick={(event) => event.stopPropagation()}
          >
            {works[activeWork].src ? (
              <WorkMedia work={works[activeWork]} alt={`${project.title} 作品 ${activeWork + 1}`} />
            ) : (
              <span />
            )}
          </div>
          <button className="lightboxArrow next" onClick={(event) => { event.stopPropagation(); setActiveWork((activeWork + 1) % works.length) }}>
            ›
          </button>
          <div className="lightboxMeta">
            {String(activeWork + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const pageRef = useRef(null)
  const [lang, setLang] = useState('zh')
  const [openedProject, setOpenedProject] = useState(null)
  const [openedProjectIndex, setOpenedProjectIndex] = useState(0)
  const [activeWork, setActiveWork] = useState(null)
  const copy = uiCopy[lang]
  const localizedProjects = projects.map((project, index) => (
    lang === 'en' ? { ...project, ...projectEnglish[index] } : project
  ))
  const activeStrengths = lang === 'en' ? strengthsEn : strengths
  const activeTimeline = lang === 'en' ? timelineEn : timeline

  useEffect(() => {
    const page = pageRef.current
    if (!page) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      page.classList.add('motionReady')
      return undefined
    }

    const context = gsap.context(() => {
      page.classList.add('motionReady')

      gsap.set('.openingLayer', { autoAlpha: 1 })
      gsap.set('.openingPanel', { scaleX: 1, transformOrigin: 'left center' })
      gsap.set('.nav', { y: -34, autoAlpha: 0, filter: 'blur(10px)' })
      gsap.set('.heroTopline span, .heroMeta span', { y: 28, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' })
      gsap.set('.hero .eyebrow, .heroLead, .heroActions a', { y: 38, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' })
      gsap.set('.heroWordmark span', {
        yPercent: 112,
        scaleX: 0.68,
        autoAlpha: 0,
        transformOrigin: '50% 100%',
        clipPath: 'inset(0 0 100% 0)',
      })
      gsap.set('.heroWordmark i', {
        yPercent: 112,
        scaleX: 0.68,
        autoAlpha: 0,
        transformOrigin: '50% 100%',
        clipPath: 'none',
      })
      gsap.set('.heroVideo', { scale: 1.14, filter: 'blur(12px) grayscale(0.22) saturate(0.78) contrast(1.08) brightness(0.48)' })
      gsap.set('.motionBackdrop', { autoAlpha: 0.38, scale: 1.08 })

      const opening = gsap.timeline({ defaults: { ease: 'expo.out' } })
      opening
        .to('.openingPanel.isTop', { scaleX: 0, duration: 1.35, ease: 'power4.inOut' }, 0.18)
        .to('.openingPanel.isBottom', { scaleX: 0, duration: 1.5, ease: 'power4.inOut' }, 0.32)
        .to('.heroVideo', {
          scale: 1,
          filter: 'blur(4px) grayscale(0.22) saturate(0.82) contrast(1.04) brightness(0.62)',
          duration: 2.4,
        }, 0.24)
        .to('.motionBackdrop', { autoAlpha: 0.72, scale: 1, duration: 1.8 }, 0.3)
        .to('.nav', { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1.05 }, 0.78)
        .to('.heroTopline span', { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.05, stagger: 0.12 }, 0.92)
        .to('.hero .eyebrow', { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.9 }, 1.02)
        .to('.heroWordmark span', {
          yPercent: 0,
          scaleX: 1,
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.35,
          stagger: 0.09,
        }, 1.08)
        .to('.heroWordmark i', {
          yPercent: 0,
          scaleX: 1,
          autoAlpha: 1,
          clipPath: 'none',
          duration: 1.35,
        }, 1.17)
        .to('.heroLead', { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.05 }, 1.44)
        .to('.heroActions a', { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.92, stagger: 0.08 }, 1.58)
        .to('.heroMeta span', { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.95, stagger: 0.1 }, 1.7)
        .to('.openingLayer', { autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, 1.9)

      gsap.utils.toArray('.section:not(.hero)').forEach((section) => {
        const label = section.querySelector('.sectionHeader p')
        const heading = section.querySelector('.sectionHeader h2')
        const cards = section.querySelectorAll('.portraitPanel, .bioPanel, .timeline article, .projectCard, .strengthGrid article, .contactBlock')
        const images = section.querySelectorAll('.portrait img, .projectCard img')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
          defaults: { ease: 'expo.out' },
        })

        if (label) {
          tl.fromTo(label, {
            x: -150,
            y: 34,
            scaleX: 0.62,
            autoAlpha: 0,
            clipPath: 'inset(0 100% 0 0)',
            transformOrigin: 'left center',
          }, {
            x: 0,
            y: 0,
            scaleX: 1,
            autoAlpha: 1,
            clipPath: 'inset(-14% 0% -14% 0)',
            duration: 1.1,
          }, 0)
        }

        if (heading) {
          tl.fromTo(heading, {
            y: 96,
            scaleY: 0.72,
            autoAlpha: 0,
            clipPath: 'inset(0 0 100% 0)',
            transformOrigin: '50% 100%',
          }, {
            y: 0,
            scaleY: 1,
            autoAlpha: 1,
            clipPath: 'inset(-14% 0 -14% 0)',
            duration: 1.25,
          }, 0.16)
        }

        if (cards.length) {
          tl.fromTo(cards, {
            y: 92,
            scale: 0.94,
            autoAlpha: 0,
            clipPath: 'inset(22% 0 0 0 round 24px)',
          }, {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            clipPath: 'inset(0% 0 0 0 round 24px)',
            duration: 1.15,
            stagger: { each: 0.12, from: 'start' },
          }, 0.42)
        }

        images.forEach((image) => {
          gsap.fromTo(image, {
            yPercent: -8,
            scale: 1.18,
          }, {
            yPercent: 6,
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: image,
              start: 'top 90%',
              end: 'bottom top',
              scrub: 1.15,
            },
          })
        })
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: '.contact',
          start: 'top 72%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'expo.out' },
      })
        .fromTo('.contact .eyebrow', {
          x: -130,
          scaleX: 0.64,
          autoAlpha: 0,
          clipPath: 'inset(0 100% 0 0)',
          transformOrigin: 'left center',
        }, {
          x: 0,
          scaleX: 1,
          autoAlpha: 1,
          clipPath: 'inset(-14% 0% -14% 0)',
          duration: 1.05,
        }, 0)
        .fromTo('.contact h2', {
          y: 120,
          scaleY: 0.68,
          autoAlpha: 0,
          clipPath: 'inset(0 0 100% 0)',
          transformOrigin: '50% 100%',
        }, {
          y: 0,
          scaleY: 1,
          autoAlpha: 1,
          clipPath: 'inset(-14% 0 -14% 0)',
          duration: 1.28,
        }, 0.16)

      ScrollTrigger.refresh()
    }, page)

    return () => context.revert()
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => window.cancelAnimationFrame(frame)
  }, [lang])

  function openProject(project, index) {
    setOpenedProject(project)
    setOpenedProjectIndex(index)
    setActiveWork(null)
  }

  function closeProject() {
    setOpenedProject(null)
    setActiveWork(null)
  }

  return (
    <main ref={pageRef}>
      <div className="openingLayer" aria-hidden="true">
        <div className="openingPanel isTop" />
        <div className="openingPanel isBottom" />
      </div>
      <header className="nav">
        <a className="brand" href="#home" aria-label={copy.backHome}>
          <span>YK</span>
          <b>游凯</b>
        </a>
        <nav>
          <a href="#profile">{copy.nav[0]}</a>
          <a href="#projects">{copy.nav[1]}</a>
          <a href="#strengths">{copy.nav[2]}</a>
          <a href="#contact">{copy.nav[3]}</a>
        </nav>
        <div className="navTools">
          <button
            className="langToggle"
            type="button"
            onClick={() => setLang((current) => (current === 'zh' ? 'en' : 'zh'))}
            aria-label="Switch language"
          >
            <span className={lang === 'zh' ? 'isActive' : ''}>ZH</span>
            <i />
            <span className={lang === 'en' ? 'isActive' : ''}>EN</span>
          </button>
          <a className="navContact" href="mailto:782550606@qq.com">{copy.contact}</a>
        </div>
      </header>

      <section className="hero section" id="home">
        <HeroBackgroundVideo />
        <div className="motionBackdrop" aria-hidden="true">
          <div className="scanline" />
          <div className="lightPlane one" />
          <div className="lightPlane two" />
          <div className="gridField" />
        </div>
        <div className="heroTopline">
          <span>{copy.topLeft}</span>
          <span>{copy.topRight}</span>
        </div>
        <div className="heroInner">
          <p className="eyebrow">{copy.role}</p>
          <h1 className="heroWordmark" aria-label="游凯 YOU KAI">
            <span>YOU</span>
            <i>游凯</i>
            <span>KAI</span>
          </h1>
          <p className="heroLead">
            {copy.heroLead}
          </p>
          <div className="heroActions">
            <a href="#projects">{copy.viewProjects}</a>
            <a href="mailto:782550606@qq.com">{copy.sendMail}</a>
          </div>
        </div>
        <div className="heroMeta" aria-label="个人概览">
          <span>{copy.heroMeta[0]}</span>
          <span>{copy.heroMeta[1]}</span>
          <span>{copy.heroMeta[2]}</span>
        </div>
      </section>

      <section className="profile section" id="profile">
        <div className="sectionHeader">
          <p>PROFILE</p>
          <h2>{copy.profileTitle}</h2>
        </div>
        <div className="profileGrid">
          <div className="portraitPanel">
            <div className="portrait">
              <img src="/images/profile-portrait.jpg" alt="游凯个人肖像" />
            </div>
            <div className="contactLines">
              <a href="tel:18717027073"><ContactIcon type="phone" />187 1702 7073</a>
              <a href="mailto:782550606@qq.com"><ContactIcon type="mail" />782550606@qq.com</a>
              <span><ContactIcon type="school" />四川美术学院 · 艺术与科技</span>
            </div>
          </div>
          <div className="bioPanel">
            <p>
              {copy.bio}
            </p>
            <div className="stats">
              <div><strong>5+</strong><span>{copy.stats[0]}</span></div>
              <div><strong>30+</strong><span>{copy.stats[1]}</span></div>
              <div><strong>1.9w</strong><span>{copy.stats[2]}</span></div>
              <div><strong>2800+</strong><span>{copy.stats[3]}</span></div>
            </div>
          </div>
        </div>
        <div className="timeline">
          {activeTimeline.map(([date, company, detail]) => (
            <article key={company}>
              <time>{date}</time>
              <h3>{company}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="projects section" id="projects">
        <div className="sectionHeader">
          <p>SELECTED WORKS</p>
          <h2>{copy.projectsTitle}</h2>
        </div>
        <div className="projectGrid">
          {localizedProjects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.title} onOpen={openProject} />
          ))}
        </div>
      </section>

      <section className="strengths section" id="strengths">
        <div className="sectionHeader">
          <p>CAPABILITY</p>
          <h2>{copy.strengthsTitle}</h2>
        </div>
        <div className="strengthGrid">
          {activeStrengths.map(([title, detail], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact section" id="contact">
        <div>
          <p className="eyebrow">{copy.contactEyebrow}</p>
          <h2>{copy.contactTitle}</h2>
        </div>
        <div className="contactBlock">
          <a href="mailto:782550606@qq.com">782550606@qq.com</a>
          <a href="tel:18717027073">187 1702 7073</a>
          <span>{copy.roleLine}</span>
        </div>
      </section>

      {openedProject && (
        <ProjectOverlay
          project={openedProject}
          projectIndex={openedProjectIndex}
          activeWork={activeWork}
          setActiveWork={setActiveWork}
          onClose={closeProject}
        />
      )}
    </main>
  )
}

export default App

createRoot(document.getElementById('root')).render(<App />)
