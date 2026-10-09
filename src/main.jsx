import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import LiquidEther from './components/LiquidEther';
import TechText from './components/TechText';
import BorderGlow from './components/BorderGlow';

const frameGlow = { colors: ['#193ccc', '#ffe846', '#f5f3e9'],
  glowColor: '52 100 64', borderRadius: 2, glowRadius: 28,
  glowIntensity: 0.9, fillOpacity: 0.08, edgeSensitivity: 25 };
const portraitGlow = { ...frameGlow, glowColor: '226 85 65', glowIntensity: 0.65 };

const heroPalette = ['#2450e5', '#4273ff', '#f5f3e9', '#ffe846'];

const entranceTargets = [
  '.navigation > *', '.hero-top > *', '.hero-content > .eyebrow', '.hero-tech-title',
  '.hero-name', '.hero-roles > *', '.hero-description > *', '.title-doodle',
  '.hero-bottom > *', '.ticker', '.section-label > *', '.portrait-wrap',
  '.about-content > .eyebrow', '.about-content > h2', '.about-content > .bio',
  '.timeline > *', '.about-links > *', '.stats > *', '.section-heading > *',
  '.filters > *', '.project-card', '.advantage', '.tool-line > *',
  '.contact-main > :not(.contact-actions):not(.sr-only)', '.contact-actions > *',
  'footer > *', '.project-dialog', '.project-dialog .dialog-body > *',
].join(',');

function useEntranceAnimations(enabled) {
  useLayoutEffect(() => {
    const root = document.getElementById('root');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!enabled || preference.matches) return;
    const tracked = new Set();
    const reveal = element => { element.dataset.reveal = 'shown'; observer.unobserve(element); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    }, { threshold: 0.08 });
    const register = () => {
      for (const element of root.querySelectorAll(entranceTargets)) {
        if (tracked.has(element)) continue;
        tracked.add(element);
        const siblings = [...element.parentElement.children].filter(child => child.matches(entranceTargets));
        const delay = Math.min(siblings.indexOf(element), 5) * 65;
        element.style.setProperty('--entrance-delay', `${delay}ms`);
        element.classList.add('entrance-item');
        element.dataset.reveal = 'pending';
        observer.observe(element);
      }
    };
    const revealFocused = event => {
      for (const element of tracked) if (element.contains(event.target)) reveal(element);
    };
    const showAll = () => {
      if (preference.matches) for (const element of tracked) reveal(element);
    };
    register();
    const changes = new MutationObserver(register);
    changes.observe(root, { childList: true, subtree: true });
    root.addEventListener('focusin', revealFocused);
    preference.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      changes.disconnect();
      root.removeEventListener('focusin', revealFocused);
      preference.removeEventListener('change', showAll);
      for (const element of tracked) {
        delete element.dataset.reveal;
        element.classList.remove('entrance-item');
        element.style.removeProperty('--entrance-delay');
      }
    };
  }, [enabled]);
}

function HeroTitle({ motion }) {
  const heading = useRef(null);
  const [size, setSize] = useState(150);
  useEffect(() => {
    const observer = new ResizeObserver(() => setSize(parseFloat(getComputedStyle(heading.current).fontSize)));
    observer.observe(heading.current);
    return () => observer.disconnect();
  }, []);
  const props = { fontSize: size, fontWeight: 900, letterSpacing: -0.045,
    color: '#fffdf7', accentColor: '#ffe846', reveal: 'letter', dashLength: 4,
    dashGap: 2, specks: 12, speed: 1, paused: !motion, labels: true, draggable: true };
  return <h1 ref={heading} className="hero-tech-title" aria-label="CHANSON SHIM">
    <span className="hero-tech-line" aria-hidden="true"><TechText text="CHANSON" {...props} /></span>
    <span className="hero-tech-line" aria-hidden="true"><TechText text="SHIM." {...props} sweep={false} /></span>
  </h1>;
}
const sectionThemes = {
  about: { background: '#f5f3e9', colors: ['#dfdece', '#ccd5ec', '#b1c2ea', '#efe0a7'] },
  work: { background: '#193ccc', colors: heroPalette },
  expertise: { background: '#070a17', colors: ['#111a30', '#24324d', '#465576', '#7a8398'] },
  contact: { background: '#193ccc', colors: heroPalette },
};

function SectionLiquid({ theme, motion }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const { background, colors } = sectionThemes[theme];
  return <div ref={host} className={`section-liquid section-liquid-${theme}`} aria-hidden="true">
    {visible && <LiquidEther colors={colors} backgroundColor={background} lightMode
      mouseForce={18} cursorSize={110} resolution={0.25} iterationsPoisson={16}
      autoSpeed={0.3} autoIntensity={2} autoResumeDelay={1200} paused={!motion} />}
  </div>;
}

const projects = [
 {id:'01',title:'作品集全览',category:'影视 / 三维 / 动态视觉',filter:'视觉设计',video:'showreel.mp4',subtitle:'从创意构思，到完整的视觉表达。',role:'视觉设计 / 三维 / 动画 / 后期合成',description:'集中展示影视后期、三维视觉与动态设计实践，通过完整作品呈现画面表达与制作能力。',details:['整合影视包装、三维与动态视觉作品。','呈现视觉设计、动画节奏与后期合成效果。'],status:'作品集全览',coverNote:'作品集 · 点击播放'},
 {id:'02',title:'西门子',category:'全 AI',filter:'AI设计',video:'siemens.mp4',subtitle:'以 AI 创作，探索品牌影像的表达。',role:'AI 视觉创作',description:'以全 AI 方式完成的西门子影像作品，展示生成式创作在品牌视觉中的应用。',details:['以 AI 影像构建视觉内容。','围绕品牌表达组织画面风格与影像节奏。'],status:'全 AI 创作',coverNote:'全 AI · 点击播放'},
 {id:'03',title:'一枝花',category:'AI 结合实拍',filter:'AI设计',video:'flower.mp4',subtitle:'让生成式影像，与真实画面自然连接。',role:'AI 创意 / 素材生成 / 转场 / 修复',description:'围绕鲜花主题，将 AI 创意与素材生成结合实拍影像，通过转场、修复与后期整合形成完整片头。',details:['参与 AI 创意设计与素材生成，围绕主题拓展视觉表现。','结合实拍画面设计转场，处理生成素材与实拍影像的衔接。','通过修复与局部调整，提升影像完整性与视觉一致性。'],status:'AI 与实拍结合',coverNote:'AI × 实拍 · 点击播放'},
 {id:'04',title:'敦煌女儿',category:'电影片头',filter:'视觉设计',video:'dunhuang.mp4',subtitle:'让视觉，成为故事的开场。',role:'片头设计 / 动画 / 三维 / 合成',description:'参与电影片头的视觉构思与制作，将设计方向落实为动画、三维画面与后期合成。关注运动节奏、画面层次及不同制作环节的衔接。',details:['参与片头视觉构思与效果设计，组织开篇影像的视觉语言。','参与动画及三维制作，在后期合成中整合不同视觉元素。','通过运动衔接、层次组织与风格统一，支持片头的完整表达。'],status:'电影片头制作',coverNote:'电影片头 · 点击播放'},
];
const advantages = [
  ['01', '创意与执行，连成一线。', '视觉设计', '从视觉构思、分镜预演到动态画面制作，兼顾表达、节奏与实际制作条件。', 'VISUAL THINKING'],
  ['02', '让 AI 进入实际工作流。', 'AI 设计', '通过LibTV管理参考资产与制作方案，结合Seedance、Midjourney等工具开展视觉开发、素材生成与修复。', 'AI WORKFLOW'],
  ['03', '建立可信的品牌影像。', '品牌设计', '将品牌需求转化为视觉语言，在产品影像中关注结构、材质、标识与画面的一致性。', 'BRAND EXPRESSION'],
  ['04', '把复杂画面，整合完成。', '三维与后期', '以Cinema 4D、After Effects和Octane Render衔接三维、MG动画与合成，组织画面层次和运动关系。', 'CRAFT & MOTION'],
];
function Arrow() { return <span aria-hidden="true">↗</span>; }
function Scribble({ className = '' }) { return <svg className={`scribble ${className}`} viewBox="0 0 600 180" fill="none" aria-hidden="true"><path d="M5 110C45 120 40 72 65 83L90 136 115 43 147 137 180 79C195 63 205 104 228 85S271 18 297 59 322 144 344 82 397 92 406 120 441 161 465 89 514 12 540 53 564 172 595 79" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" /></svg>; }

function App() {
  const [filter, setFilter] = useState('全部');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEntranceAnimations(motion);
  const dialog = useRef(null);
  const previousFocus = useRef(null);
  useEffect(() => {
    if (!selected) return;
    previousFocus.current = document.activeElement;
    dialog.current.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; previousFocus.current?.focus(); };
  }, [selected]);
  const close = () => { dialog.current?.close(); setSelected(null); };
  const copy = async () => {
    try { await navigator.clipboard.writeText('714791780@qq.com'); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch { window.location.href = 'mailto:714791780@qq.com'; }
  };
  return <>
    <a className="skip" href="#about">跳到个人介绍</a>
    <header className="navigation"><a href="#home" className="wordmark" aria-label="沈鑫骋首页">CS<span>✳</span><i>CHANSON SHIM</i></a><nav aria-label="主导航"><a href="#about">关于</a><a href="#work">作品</a><a href="#expertise">能力</a></nav><a className="nav-contact" href="#contact">聊聊你的项目 <Arrow /></a></header>
    <main className={motion ? '' : 'motion-paused'}>
      <section id="home" className="hero">
        <div className="hero-liquid" aria-hidden="true">
          <LiquidEther colors={heroPalette} backgroundColor="#193ccc" lightMode
            mouseForce={22} cursorSize={120} resolution={0.35}
            iterationsPoisson={20} autoSpeed={0.35} autoIntensity={2.2}
            autoResumeDelay={1200} paused={!motion} />
        </div>
        <div className="hero-top mono"><span>INDEPENDENT VISION. PLAYFUL EXPRESSION.</span><span>SHANGHAI, CN <span className="dot" /></span></div>
        <div className="hero-layout container">
          <div className="hero-content"><p className="eyebrow">SELECTED PORTFOLIO / 2026</p><HeroTitle motion={motion} /><p className="hero-name">沈鑫骋 作品集</p><div className="hero-roles"><span>视觉设计师</span><span>AI 设计师</span><span>品牌设计师</span></div><div className="hero-description"><p>以设计建立表达，以技术拓展边界。<br />从品牌视觉到电影影像，探索每一种可能。</p><a href="#work" className="round-link" aria-label="浏览精选作品"><Arrow /></a></div><Scribble className="title-doodle" /></div>
        </div>
        <div className="hero-bottom mono"><span>VISUAL DESIGN · AI · BRAND · MOTION</span><a href="#about">往下看看 ↓</a><button onClick={() => setMotion(!motion)} aria-pressed={motion}>{motion ? 'Ⅱ 暂停动态' : '▷ 开启动态'}</button></div>
      </section>
      <div className="ticker" aria-hidden="true"><div>{Array.from({length:4},(_,i)=><span key={i}>VISUAL DESIGN <b>✳</b> AI CREATION <b>✳</b> BRAND & MOTION <b>✳</b> </span>)}</div></div>

      <section id="about" className="section about paper"><SectionLiquid theme="about" motion={motion} /><div className="container">
        <div className="section-label"><span className="mono">01 / NICE TO MEET YOU</span><span>设计背后的人</span></div>
        <div className="about-grid"><BorderGlow className="portrait-wrap" {...portraitGlow} backgroundColor="#fffef9"><span className="paper-tape" aria-hidden="true" /><img className="portrait" src="/media/portrait-cg-v6.png" alt="CHANSON SHIM 彩色CG半身形象" loading="lazy" /><div className="portrait-caption mono"><span>CHANSON SHIM</span><span>上海 / CHINA</span></div><div className="portrait-cross" aria-hidden="true">✳</div><span className="photo-handwriting">Hi, I’m Chanson.</span></BorderGlow><div className="about-content"><p className="eyebrow">你好，我是沈鑫骋。</p><h2>用视觉讲故事，<br />用技术打开想象。</h2><p className="bio">数码艺术设计背景，长期从事影视后期、三维视觉与MG动画制作。从电影片头、纪录片包装到品牌影像，我持续将创意转化为完整的视觉表达。</p><p className="bio">现在，我把AI创作纳入设计工作流，结合LibTV与Seedance开展视觉开发和数字制作，让传统制作经验与新的创作方式彼此连接。</p><div className="timeline"><div><span className="mono">2012.09 — 至今</span><strong>上海东影传媒有限公司</strong><small>影视后期制作包装特效师</small></div><div><span className="mono">2008.09 — 2012.06</span><strong>上海师范大学</strong><small>数码艺术设计 · 本科</small></div></div><div className="about-links"><a href="mailto:714791780@qq.com">714791780@qq.com <Arrow /></a></div></div></div>
        <div className="stats"><div><strong>2012<span>起</span></strong><p>持续从事影视后期制作</p></div><div><strong>5<span>年</span></strong><p>连续参与电影节开幕及大屏制作</p></div><div><strong>4<span>个</span></strong><p>精选影像作品</p></div><div><strong>AI<span>× CG</span></strong><p>结合生成式创作与传统制作</p></div></div>
      </div></section>

      <section id="work" className="section work"><SectionLiquid theme="work" motion={motion} /><div className="container"><div className="section-label"><span className="mono">02 / MY CREATIVE WORLD</span><span>作品与实践</span></div><div className="section-heading"><div><p className="large-en">SELECTED <span>WORK.</span></p><h2>每一次创作，都是一次探索。</h2></div><p>电影、AI与品牌影像。<br />从创意起点，到画面实现。</p></div><div className="filters" role="group" aria-label="筛选项目">{['全部', '视觉设计', 'AI设计', '品牌设计'].map(item => <button key={item} className={filter === item ? 'active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}<span>{item === '全部' ? '04' : String(projects.filter(p => p.filter === item || (item === '品牌设计' && p.id === '02')).length).padStart(2, '0')}</span></button>)}</div><div className="project-grid">{projects.filter(p => filter === '全部' || p.filter === filter || (filter === '品牌设计' && p.id === '02')).map(p => <BorderGlow as="button" className="project-card" {...frameGlow} backgroundColor="#f5f3e9" key={p.id} onClick={() => setSelected(p)} aria-label={`播放${p.title}`}><div className="project-image"><span className="card-tape" aria-hidden="true" /><video src={`/media/videos/${p.video}#t=1`} muted playsInline preload="metadata" aria-label={`${p.title}视频预览`} /><span className="project-number mono">PROJECT / {p.id}</span><span className="cover-note">{p.coverNote}</span><span className="project-arrow"><Arrow /></span></div><div className="project-meta"><div><p>{p.category}</p><h3>{p.title}</h3></div><span>{p.role}</span></div></BorderGlow>)}</div></div></section>

      <section id="expertise" className="section expertise"><SectionLiquid theme="expertise" motion={motion} /><div className="container"><div className="section-label"><span className="mono">03 / MY SUPERPOWERS</span><span>个人优势</span></div><div className="section-heading"><div><p className="large-en">IDEAS <span>× CRAFT.</span></p><h2>表达有方向，制作有方法。</h2></div><p>连接创意、技术与执行，<br />让设计走到实际画面里。</p></div><div className="advantage-grid">{advantages.map(([num, title, name, text, en]) => <BorderGlow as="article" className="advantage" {...frameGlow} backgroundColor={num === '03' ? '#ffe846' : Number(num) % 2 === 0 ? '#e9eeff' : '#f5f3e9'} key={num}><div className="advantage-top mono"><span>{num}</span><span className="capability-icon" aria-hidden="true">{num === '01' ? '◇' : num === '02' ? '✳' : num === '03' ? '⊞' : '◎'}</span></div><p className="eyebrow">{name}</p><h3>{title}</h3><p className="advantage-description">{text}</p><span className="mono advantage-en">{en}</span></BorderGlow>)}</div><div className="tool-line"><span className="mono">MY TOOLKIT</span><p>After Effects <i>/</i> Cinema 4D <i>/</i> Octane Render <i>/</i> LibTV <i>/</i> Seedance <i>/</i> Midjourney <i>/</i> Photoshop <i>/</i> Illustrator</p></div></div></section>

      <section id="contact" className="contact"><SectionLiquid theme="contact" motion={motion} /><div className="container contact-inner"><div className="section-label"><span className="mono">04 / LET’S CONNECT</span><span><span className="dot" /> 欢迎项目交流</span></div><div className="contact-main"><p className="eyebrow">有一个值得实现的想法？</p><p className="contact-kicker">LET’S MAKE</p><h2>SOMETHING<br /><span className="contact-imaginary">GREAT<span className="contact-star" aria-hidden="true">✳</span>.</span></h2><p className="contact-chinese">下一次创作，一起开始。</p><a href="mailto:714791780@qq.com" className="email-link">714791780@qq.com <Arrow /></a><div className="contact-actions"><button onClick={copy}>{copied ? '邮箱已复制 ✓' : '复制邮箱 ↗'}</button><a href="tel:+8618962816000">189-6281-6000 ↗</a><span>中国 · 上海</span></div><p role="status" className="sr-only">{copied ? '邮箱地址已复制' : ''}</p></div><footer><a className="wordmark" href="#home">CS<span>✳</span></a><span className="mono">© {new Date().getFullYear()} CHANSON SHIM</span><a href="#home">回到顶部 ↑</a></footer></div></section>
    </main>
    {selected && <BorderGlow as="dialog" {...frameGlow} backgroundColor="#f5f3e9" ref={dialog} className="project-dialog" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === dialog.current) close(); }}><button className="dialog-close" onClick={close} aria-label="关闭项目详情">×</button><video key={selected.id} src={`/media/videos/${selected.video}`} controls autoPlay playsInline preload="metadata" aria-label={`${selected.title}完整视频`} /><div className="dialog-body"><p className="eyebrow">{selected.status}</p><h2>{selected.title}</h2><p className="dialog-subtitle">{selected.subtitle}</p><p className="dialog-role">参与内容 · {selected.role}</p><p>{selected.description}</p><ul>{selected.details.map(d => <li key={d}>{d}</li>)}</ul><small>{selected.coverNote}</small><a className="detail-contact" href="#contact" onClick={close}>交流相关项目 <Arrow /></a></div></BorderGlow>}
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
