import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --cream: #FDF6EE;
    --peach: #F5C5A3;
    --coral: #E8907A;
    --pink-soft: #F2D4CC;
    --sand: #EDE0D0;
    --text-dark: #2C2318;
    --text-mid: #6B5744;
    --text-light: #A08870;
    --accent-red: #D9534F;
    --green-tag: #4CAF50;
    --section-bg: #FAF0E6;
  }

  .portfolio {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text-dark);
    overflow-x: hidden;
    width: 100%;
  }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: flex-end; align-items: center;
    padding: 1rem 4rem; gap: 1.5rem;
    background: rgba(253,246,238,0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(232,144,122,0.15);
    transition: all 0.3s;
  }
  .nav a {
    text-decoration: none; color: var(--text-mid);
    font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em;
    transition: color 0.2s;
    cursor: pointer;
  }
  .nav a:hover { color: var(--coral); }

  /* HERO */
  .hero {
    min-height: 100vh; width: 100%; display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center;
    padding: 6rem 2rem 3rem;
    position: relative; overflow: hidden;
    transition: background 0.6s ease;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba(245,197,163,0.5) 0%, transparent 55%),
                radial-gradient(ellipse at 75% 80%, rgba(232,144,122,0.25) 0%, transparent 50%),
                radial-gradient(ellipse at 60% 40%, rgba(242,212,204,0.4) 0%, transparent 45%);
    pointer-events: none;
    transition: opacity 0.6s ease;
  }
  .hero.scrolled::before {
    opacity: 0;
  }
  /* 컬러 오버레이 레이어 */
  .hero::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at 20% 60%, rgba(232,144,122,0.18) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(245,197,163,0.22) 0%, transparent 45%);
    opacity: 0; transition: opacity 0.6s ease;
  }
  .hero.scrolled::after { opacity: 1; }

  /* 떠다니는 컬러 블롭 */
  .blob {
    position: absolute; border-radius: 50%; pointer-events: none;
    filter: blur(60px); opacity: 0.45;
    animation: floatBlob 8s ease-in-out infinite;
  }
  .blob-1 {
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(245,197,163,0.8), rgba(232,144,122,0.3));
    top: -80px; left: -60px; animation-delay: 0s;
  }
  .blob-2 {
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(242,212,204,0.9), rgba(245,197,163,0.2));
    bottom: -60px; right: -40px; animation-delay: -3s;
  }
  .blob-3 {
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(232,144,122,0.6), transparent);
    top: 40%; left: 10%; animation-delay: -5s;
    opacity: 0; transition: opacity 0.8s ease;
  }
  .hero.scrolled .blob-3 { opacity: 0.35; }
  @keyframes floatBlob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(18px, -22px) scale(1.04); }
    66% { transform: translate(-12px, 14px) scale(0.97); }
  }

  /* 타이핑 커서 효과 */
  .hero-subtitle::after {
    content: '|'; color: var(--coral);
    animation: blink 1.1s step-end infinite;
    margin-left: 2px;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0; }
  }

  /* 스크롤 힌트 펄스 */
  .scroll-hint {
    margin-top: 3rem; color: var(--text-light); font-size: 0.8rem;
    opacity: 0; animation: fadeUp 0.8s 1s forwards;
    display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
  }
  .scroll-arrow {
    width: 20px; height: 20px; border-right: 2px solid var(--coral);
    border-bottom: 2px solid var(--coral);
    transform: rotate(45deg);
    animation: scrollPulse 1.5s ease-in-out infinite;
  }
  @keyframes scrollPulse {
    0%, 100% { transform: rotate(45deg) translate(0,0); opacity: 1; }
    50% { transform: rotate(45deg) translate(4px, 4px); opacity: 0.4; }
  }
  .avatar-row {
    display: flex; gap: 0.6rem; margin-bottom: 1.5rem;
  }
  .avatar-dot {
    width: 52px; height: 52px; border-radius: 50%;
    background: var(--sand); border: 2px solid var(--peach);
    overflow: hidden; display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; cursor: pointer; text-decoration: none;
    transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
  }
  .avatar-dot:hover { transform: translateY(-4px) scale(1.1); box-shadow: 0 8px 20px rgba(232,144,122,0.3); background: var(--peach); }
  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 7vw, 7rem);
    font-weight: 900; line-height: 1.1;
    color: var(--text-dark); margin-bottom: 0.3rem;
    opacity: 0; transform: translateY(20px);
    animation: fadeUp 0.8s 0.2s forwards;
  }
  .hero-subtitle {
    font-size: clamp(1rem, 2.5vw, 1.4rem);
    color: var(--coral); font-weight: 500; letter-spacing: 0.08em;
    margin-bottom: 1.5rem;
    opacity: 0; animation: fadeUp 0.8s 0.4s forwards;
  }
  .hero-desc {
    max-width: 500px; color: var(--text-mid);
    font-size: 0.95rem; line-height: 1.7;
    opacity: 0; animation: fadeUp 0.8s 0.6s forwards;
  }
  .hero-desc em {
    font-style: italic; color: var(--coral);
  }
  .scroll-hint {
    margin-top: 3rem; color: var(--text-light); font-size: 0.8rem;
    animation: bounce 2s infinite;
    opacity: 0; animation: fadeUp 0.8s 1s forwards, bounce 2s 1.5s infinite;
  }

  /* SECTION COMMON */
  .section { padding: 5rem 4rem; }
  @media (max-width: 768px) { .section { padding: 3.5rem 1.5rem; } }
  .section-inner { max-width: 1200px; margin: 0 auto; }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700; color: var(--text-dark);
    margin-bottom: 2.5rem; line-height: 1.2;
  }
  .tag-label {
    display: inline-block; background: var(--coral);
    color: white; font-size: 0.75rem; font-weight: 600;
    padding: 0.25rem 0.8rem; border-radius: 20px;
    letter-spacing: 0.05em; margin-bottom: 1rem;
  }
  .tag-label-lg {
    font-size: 1.05rem; font-weight: 700;
    padding: 0.5rem 1.4rem; border-radius: 24px;
    letter-spacing: 0.07em;
    box-shadow: 0 4px 14px rgba(232,144,122,0.35);
  }

  /* THINK MAKE SOLVE */
  .tms-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
    margin-top: 2rem;
  }
  .tms-card {
    background: white; border-radius: 16px; padding: 1.5rem;
    border: 1.5px solid var(--sand); cursor: pointer;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }
  .tms-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--pink-soft), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .tms-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(232,144,122,0.2); }
  .tms-card:hover::before { opacity: 1; }
  .tms-icon {
    width: 60px; height: 60px; border-radius: 50%;
    background: var(--sand); margin-bottom: 1rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; transition: transform 0.3s;
  }
  .tms-card:hover .tms-icon { transform: rotate(10deg) scale(1.1); }
  .tms-card h3 { font-weight: 700; margin-bottom: 0.4rem; font-size: 1rem; }
  .tms-card p { font-size: 0.82rem; color: var(--text-mid); line-height: 1.6; }

  /* SKILLS */
  .skills-section { background: var(--section-bg); }
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  .skill-group h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;
  }
  .skill-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .chip {
    background: white; border: 1.5px solid var(--peach);
    border-radius: 20px; padding: 0.3rem 0.9rem;
    font-size: 0.82rem; color: var(--text-mid); font-weight: 500;
    cursor: pointer; transition: all 0.25s;
  }
  .chip:hover { background: var(--coral); color: white; border-color: var(--coral); transform: scale(1.05); }

  /* EXPERIENCE */
  .exp-card {
    background: white; border-radius: 20px; padding: 2rem;
    border: 1.5px solid var(--sand); margin-bottom: 1.5rem;
    transition: all 0.3s; cursor: pointer;
  }
  .exp-card:hover { box-shadow: 0 12px 35px rgba(232,144,122,0.15); transform: translateX(6px); }
  .exp-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem; }
  .exp-logo {
    width: 50px; height: 50px; border-radius: 12px;
    background: var(--sand); display: flex; align-items: center;
    justify-content: center; font-size: 1.3rem; flex-shrink: 0;
  }
  .exp-title { font-weight: 700; font-size: 1.05rem; }
  .exp-role {
    display: inline-block; background: var(--green-tag);
    color: white; font-size: 0.7rem; padding: 0.15rem 0.6rem;
    border-radius: 10px; margin-left: 0.4rem; vertical-align: middle;
  }
  .exp-desc { font-size: 0.85rem; color: var(--text-mid); line-height: 1.6; }
  .tech-stack { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.8rem; }
  .tech-tag {
    background: var(--cream); border: 1px solid var(--sand);
    border-radius: 8px; padding: 0.2rem 0.6rem;
    font-size: 0.75rem; color: var(--text-mid);
  }
  .awards { margin-top: 0.8rem; }
  .award-item {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.82rem; color: var(--coral); padding: 0.2rem 0;
  }
  .award-item::before { content: '🏆'; font-size: 0.9rem; }

  /* Screenshots carousel */
  .screenshots {
    display: flex; gap: 1.5rem; padding: 1.5rem 0;
    margin-top: 1rem; justify-content: center;
  }
  .phone-frame {
    flex-shrink: 0; width: 160px; height: 347px;
    border-radius: 22px; overflow: hidden;
    border: 2.5px solid var(--peach);
    background: var(--sand);
    box-shadow: 0 8px 24px rgba(44,35,24,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer; position: relative;
  }
  .phone-frame:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 16px 36px rgba(232,144,122,0.25); }
  .phone-frame img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .phone-frame-empty {
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.5rem; color: var(--text-light); font-size: 0.72rem;
  }
  .phone-frame-empty span { font-size: 1.8rem; }

  /* COMMUNITY */
  .community-block { margin-bottom: 3rem; }

  /* CEOS — 큰 featured 카드 */
  .ceos-card {
    background: white; border-radius: 24px;
    border: 1.5px solid var(--sand);
    overflow: hidden; margin-bottom: 1.2rem;
  }
  .ceos-photos {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0; height: 200px;
  }
  .ceos-photos .photo-slot { overflow: hidden; position: relative; }
  .ceos-photos .photo-slot:first-child { border-radius: 0; }
  .ceos-photos .photo-slot img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s ease;
  }
  .ceos-photos .photo-slot:hover img { transform: scale(1.07); }
  .ceos-body { padding: 1.4rem 1.6rem; }
  .ceos-body h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700; margin-bottom: 0.2rem;
  }
  .ceos-body .meta { font-size: 0.75rem; color: var(--text-light); margin-bottom: 0.6rem; }
  .ceos-body ul { padding-left: 1.1rem; }
  .ceos-body li { font-size: 0.82rem; color: var(--text-mid); line-height: 1.7; }

  /* 중간 3개 카드 */
  .mid-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1rem; margin-bottom: 1.2rem;
  }
  .mid-card {
    background: white; border-radius: 20px;
    border: 1.5px solid var(--sand); overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .mid-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(232,144,122,0.18); }
  .mid-photo {
    width: 100%; aspect-ratio: 4/3; overflow: hidden;
    background: var(--sand); position: relative;
  }
  .mid-photo img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s ease;
  }
  .mid-card:hover .mid-photo img { transform: scale(1.07); }
  .mid-photo-empty {
    width: 100%; height: 100%; display: flex;
    flex-direction: column; align-items: center; justify-content: center;
    gap: 0.3rem; color: var(--text-light); font-size: 0.7rem;
  }
  .mid-photo-empty span { font-size: 1.4rem; }
  .mid-body { padding: 1rem 1.1rem 1.2rem; }
  .mid-body h4 {
    font-family: 'Playfair Display', serif;
    font-size: 0.95rem; font-weight: 700; margin-bottom: 0.15rem;
    line-height: 1.3;
  }
  .mid-body .meta { font-size: 0.72rem; color: var(--text-light); margin-bottom: 0.5rem; }
  .mid-body ul { padding-left: 1rem; }
  .mid-body li { font-size: 0.78rem; color: var(--text-mid); line-height: 1.65; }

  /* 고스락 — 가로 스크롤 갤러리 */
  .band-card {
    background: white; border-radius: 24px;
    border: 1.5px solid var(--sand); overflow: hidden;
  }
  .band-header { padding: 1.4rem 1.6rem 0.8rem; display: flex; align-items: baseline; gap: 1rem; }
  .band-header h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700;
  }
  .band-header .meta { font-size: 0.75rem; color: var(--text-light); }
  .band-header ul { padding-left: 1.1rem; }
  .band-header li { font-size: 0.82rem; color: var(--text-mid); line-height: 1.7; }
  .band-info { padding: 0 1.6rem 0.8rem; }
  .band-scroll {
    display: flex; gap: 0.6rem; overflow-x: auto;
    scrollbar-width: none; padding: 0 1.6rem 1.4rem;
  }
  .band-scroll::-webkit-scrollbar { display: none; }
  .band-photo {
    flex-shrink: 0; width: 200px; aspect-ratio: 4/3;
    border-radius: 14px; overflow: hidden; background: var(--sand);
    border: 1.5px solid var(--peach);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .band-photo:hover { transform: scale(1.04); box-shadow: 0 10px 24px rgba(232,144,122,0.22); }
  .band-photo img { width: 100%; height: 100%; object-fit: cover; }
  .band-photo-empty {
    width: 100%; height: 100%; display: flex;
    flex-direction: column; align-items: center; justify-content: center;
    gap: 0.3rem; color: var(--text-light); font-size: 0.7rem;
  }
  .band-photo-empty span { font-size: 1.4rem; }

  /* 슬라이드 카드 */
  .slide-row {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1rem; margin-bottom: 1.2rem;
  }
  .slide-card {
    background: white; border-radius: 24px;
    border: 1.5px solid var(--sand); overflow: hidden;
    transition: box-shadow 0.3s;
  }
  .slide-card:hover { box-shadow: 0 16px 36px rgba(232,144,122,0.18); }
  .slide-window {
    width: 100%; aspect-ratio: 4/3; overflow: hidden;
    background: var(--sand); position: relative;
  }
  .slide-window img {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover;
    opacity: 0; transition: opacity 0.6s ease;
  }
  .slide-window img.active { opacity: 1; }
  .slide-dots {
    position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 5px; z-index: 2;
  }
  .slide-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.5); transition: background 0.3s, transform 0.3s;
  }
  .slide-dot.active { background: white; transform: scale(1.3); }
  .slide-body { padding: 1.2rem 1.4rem 1.4rem; }
  .slide-body h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-weight: 700; margin-bottom: 0.15rem;
  }
  .slide-body .meta { font-size: 0.72rem; color: var(--text-light); margin-bottom: 0.5rem; }
  .slide-body ul { padding-left: 1rem; }
  .slide-body li { font-size: 0.8rem; color: var(--text-mid); line-height: 1.7; }

  /* COMMUNITY RESPONSIVE */
  @media (max-width: 768px) {
    .slide-row { grid-template-columns: 1fr; }
    .mid-grid { grid-template-columns: 1fr; }
  }

  /* EDUCATION */
  .edu-card {
    background: white; border-radius: 16px; padding: 1.5rem 2rem;
    border: 1.5px solid var(--sand); display: flex; align-items: center; gap: 1.5rem;
    transition: all 0.3s; cursor: pointer; margin-bottom: 1rem;
  }
  .edu-card:hover { box-shadow: 0 12px 30px rgba(232,144,122,0.15); transform: translateX(4px); }
  .edu-icon {
    width: 48px; height: 48px; border-radius: 12px; background: var(--pink-soft);
    display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;
  }
  .edu-name { font-weight: 700; font-size: 1rem; }
  .edu-period { font-size: 0.8rem; color: var(--text-light); }
  .edu-detail { font-size: 0.83rem; color: var(--text-mid); margin-top: 0.2rem; }

  /* PROJECTS */
  .projects-section { background: var(--section-bg); }
  .project-card {
    background: white; border-radius: 20px; padding: 2rem;
    border: 1.5px solid var(--sand); margin-bottom: 1.5rem;
    transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden;
  }
  .project-card::after {
    content: '→'; position: absolute; right: 1.5rem; top: 50%;
    transform: translateY(-50%) translateX(20px);
    font-size: 1.3rem; color: var(--coral); opacity: 0; transition: all 0.3s;
  }
  .project-card:hover { box-shadow: 0 16px 40px rgba(232,144,122,0.2); transform: translateY(-4px); }
  .project-card:hover::after { opacity: 1; transform: translateY(-50%) translateX(0); }
  .project-title { font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem; }
  .project-desc { font-size: 0.85rem; color: var(--text-mid); line-height: 1.6; }

  /* FOOTER */
  .footer {
    text-align: center; padding: 3rem 2rem;
    background: var(--text-dark); color: white;
  }
  .footer h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem; margin-bottom: 0.5rem;
  }
  .footer p { color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 1.5rem; }
  .footer-links { display: flex; justify-content: center; gap: 1.2rem; flex-wrap: wrap; }
  .footer-link {
    color: var(--peach); text-decoration: none; font-size: 0.85rem;
    font-weight: 500; transition: color 0.2s; cursor: pointer;
  }
  .footer-link:hover { color: white; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .reveal {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .tms-grid { grid-template-columns: 1fr; }
    .skills-grid { grid-template-columns: 1fr; }
    .community-grid { grid-template-columns: 1fr; }
    .nav { justify-content: center; flex-wrap: wrap; gap: 0.8rem; padding: 0.8rem 1rem; }
  }
  @media (max-width: 480px) {
    .section { padding: 3.5rem 1.2rem; }
  }
`;

const data = {
  tms: [
    { icon: "👂", title: "Think.", sub: "Listening to the User's Voice", desc: "사용자의 목소리에 귀 기울이며 진짜 문제를 발견합니다." },
    { icon: "🛠️", title: "Make.", sub: "Building for the Organization's Success", desc: "팀과 함께 조직의 성공을 위한 솔루션을 만들어 갑니다." },
    { icon: "💡", title: "Solve.", sub: "Becoming the Solution the Team Needs", desc: "팀에 필요한 해결책이 되어 문제를 풀어냅니다." },
  ],
  languages: ["Java", "Python", "C/C++"],
  technologies: ["Spring Boot", "Spring JPA", "Spring Security", "MySQL", "Redis", "Docker", "EC2", "RDS", "CloudFront", "Nginx", "Git/GitHub", "Notion", "Slack"],
  experiences: [
    {
      logo: "🌿",
      title: "DearDream | 이어드림",
      role: "Backend Leader",
      screenshot1: "/src/assets/images/deardream/1.png",
      screenshot2: "/src/assets/images/deardream/2.png",
      screenshot3: "/src/assets/images/deardream/3.png",
      gif: " /src/assets/images/deardream/deadreamgif.gif",
      githubUrl: "https://github.com/DearDreamTeam/deardream-backend",
      notionUrl: "https://glib-tellurium-57e.notion.site/2de635ead8e5808aa0caf22d627cc39c?pvs=74",
      desc: "가족들이 한 달 동안 쓴 글과 사진들을 모아 한 권의 책으로 만들어 받는 월간 책자 서비스",
      stack: ["Spring", "Redis", "MySQL", "Nginx", "CloudFront", "Docker", "AWS", "S3"],
      detail: "DDD 기반 설계, 기능 요청 분리 / 전략 패턴 기반 OAuth2를 통한 인증 설계 / 스케줄러 기반 PDF 자동 생성 및 CDN 최적화 / 환경별 로깅 관리",
      awards: ["제 14회 콤플렉스 SW 개발 공모전 [피우다] 장려상 수상", "소셜 벤처 부트캠프 2기 우수상 수상", "와디즈 디자인 & 기획, 195% 펀딩 달성"],
    },
  ],
  communities: [
    {
      name: "신촌IT창업동아리 [CEOS]",
      period: "2025.03 - 2026.02",
      items: ["21기 백엔드 수료", "프로젝트 제작 및 팀장", "22기 백엔드 운영진 및 스터디 진행"],
      // 사진 4장 (첫 번째 줄)
      row1: ["/src/assets/images/ceos/ceos1.jpg", "/src/assets/images/ceos/ceos2.jpg", "/src/assets/images/ceos/win.jpg", "/src/assets/images/ceos/ceosleader.png"],
    },
    {
      name: "UMC",
      period: "2024.03-2024.08",
      items: ["6기 백엔드 수료", "프로젝트 제작 · 백엔드"],
      // 사진 1장 (두 번째 줄)
      row2: "/src/assets/images/etc/umc.jpg",
    },
    {
      name: "한국 프로젝트 협회 사이트 나우",
      period: "2025.10-2025.01",
      items: ["2기 백엔드 수료", "Security & Test 스터디 진행", "프로젝트 제작 · 백엔드"],
      // 사진 1장 (두 번째 줄)
      row2: "/src/assets/images/etc/sidenow.png",
    },
    {
      name: "Data Science 코딩스터디",
      period: "2024.07-2024.08",
      items: ["Python 데이터 스터디 팀 부스트 리더"],
      // 사진 1장 (두 번째 줄)
      row2: "/src/assets/images/etc/DataScience.png",
    },
    {
      name: "고스락",
      period: "2022.03 · NOW",
      items: ["교내 밴드 동아리(기타)", "10회+ 공연, 40곡+ 연주"],
      // 사진 8장 (세 번째 줄, 가로 스크롤)
      row3: ["/src/assets/images/band/band1.jpg", "/src/assets/images/band/band2.jpg", "/src/assets/images/band/band3.jpg", "/src/assets/images/band/band4.jpg", "/src/assets/images/band/band5.jpg", "/src/assets/images/band/band6.jpg", "/src/assets/images/band/band7.jpg", "/src/assets/images/band/band8.jpg"],
    },
  ],
  education: [{ icon: "🎓", name: "고스락", period: "2022.03 · NOW", detail: "2년 밴드 연이어 · 20명 이상 담대" }],
  projects: [
    {
      title: "To-Doing | 투둥이",
      desc: "AI 투두 메이트 · Terraform 기반 IaC 도입 및 Blue-Green 배포 · 가중치 기반 Todo 인증 알고리즘 설계 · AI 활용 FE 컴포넌트 설계",
      stack: ["Spring", "Redis", "MySQL", "Terraform", "Docker", "AWS", "Google Vision API"],
      githubUrl: "https://github.com/2025todoing",
      notionUrl: "https://glib-tellurium-57e.notion.site/2df635ead8e580e7983eec233668586f?pvs=74",
    },
    {
      title: "CAREER_FOR_ME | 커리어포미",
      desc: "대학생 맞춤형 커리어 추천 플랫폼 · 백엔드 리더 · JUnit Test 작성 · Email SMTP 를 사용한 로그인 인증 서비스 개발 · 배포",
      stack: ["Spring", "Docker", "MySQL"],
      githubUrl: "https://github.com/CAREER-For-Me/Career-server",
      notionUrl: "https://glib-tellurium-57e.notion.site/2df635ead8e5809d84ebe618fdb06014?pvs=74",
    },
  ],
};

function useHeroScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function SlideCard({ photos, name, period, items }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(p => (p + 1) % photos.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [photos]);
  return (
    <div className="slide-card">
      <div className="slide-window">
        {photos && photos.map((src, j) => (
          src
            ? <img key={j} src={src} alt={`${name}-${j + 1}`} className={j === current ? "active" : ""} />
            : <div key={j} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.3rem", color: "var(--text-light)", fontSize: "0.7rem", opacity: j === current ? 1 : 0, transition: "opacity 0.6s" }}><span style={{ fontSize: "1.4rem" }}>🖼️</span>사진 {j + 1}</div>
        ))}
        {photos && photos.length > 1 && (
          <div className="slide-dots">
            {photos.map((_, j) => (
              <div key={j} className={`slide-dot ${j === current ? "active" : ""}`} onClick={() => setCurrent(j)} />
            ))}
          </div>
        )}
      </div>
      <div className="slide-body">
        <h3>{name}</h3>
        <div className="meta">{period}</div>
        <ul>{items.map((item, j) => <li key={j}>{item}</li>)}</ul>
      </div>
    </div>
  );
}


const RevealSection = ({ children, style }) => {
  const ref = useReveal();
  return <div ref={ref} className="reveal" style={style}>{children}</div>;
};

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("");
  const heroScrolled = useHeroScroll();

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className="portfolio" style={{ width: "100vw" }}>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="nav">
        {["about", "skills", "experience", "community", "projects"].map(s => (
          <a key={s} onClick={() => scrollTo(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</a>
        ))}
      </nav>

      {/* HERO */}
      <section id="about" className={`hero${heroScrolled ? " scrolled" : ""}`}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="avatar-row">
          <a className="avatar-dot" href="https://github.com/hyesuhan" target="_blank" rel="noopener noreferrer" title="GitHub">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#2C2318" />
            </svg>
          </a>
          <a className="avatar-dot" href="https://heajjang.tistory.com/" target="_blank" rel="noopener noreferrer" title="Blog">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="2" rx="1" fill="#2C2318" />
              <rect x="3" y="9" width="11" height="2" rx="1" fill="#2C2318" />
              <rect x="3" y="14" width="18" height="2" rx="1" fill="#2C2318" />
              <path d="M15 17l2.5-2.5 4 4L20 20l-4-4-1 1v-4h4l-1.5 1.5L15 17z" fill="#E8907A" />
            </svg>
          </a>
        </div>
        <h1>Hyesoo Han</h1>
        <div className="hero-subtitle">Software Developer</div>
        <p className="hero-desc">
          소프트웨어 개발자로 기술의 본질을 통해 사람의 불편함을 해소합니다.<br />
          조직에서 발빠른 개발자로 팀 밸런스를 유지합니다.<br />
          <em>I love my work and am committed to continuous growth through constant learning!</em>
        </p>
        <div className="scroll-hint">
          <span>scroll to explore</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* THINK MAKE SOLVE */}
      <section className="section" id="philosophy">
        <div className="section-inner">
          <RevealSection>
            <h2 className="section-title">Think. Make.<br />Solve</h2>
            <div className="tms-grid">
              {data.tms.map((t, i) => (
                <div key={i} className="tms-card">
                  <div className="tms-icon">{t.icon}</div>
                  <h3>{t.title}</h3>
                  <div style={{ fontSize: "0.75rem", color: "var(--coral)", marginBottom: "0.4rem", fontWeight: 600 }}>{t.sub}</div>
                  <p>{t.desc}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section skills-section">
        <div className="section-inner">
          <RevealSection>
            <div className="skills-grid">
              <div className="skill-group">
                <h3>Language</h3>
                <div className="skill-chips">
                  {data.languages.map(l => <span key={l} className="chip">{l}</span>)}
                </div>
              </div>
              <div className="skill-group">
                <h3>Technologies</h3>
                <div className="skill-chips">
                  {data.technologies.map(t => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <div className="section-inner">
          <RevealSection>
            <span className="tag-label tag-label-lg">Experience</span>
            {data.experiences.map((exp, i) => (
              <div key={i} className="exp-card">
                <div className="exp-header">
                  <div>
                    <div className="exp-title">{exp.title} <span className="exp-role">{exp.role}</span></div>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-mid)", marginTop: "0.3rem" }}>{exp.desc}</p>
                  </div>
                </div>
                {/* 📱 Phone screenshots — 사진 3장을 여기에 넣어주세요 */}
                <div className="screenshots">
                  {[
                    exp.screenshot1 || null,
                    exp.screenshot2 || null,
                    exp.screenshot3 || null,
                  ].map((src, j) => (
                    <div key={j} className="phone-frame">
                      {src
                        ? <img src={src} alt={`screenshot-${j + 1}`} />
                        : <div className="phone-frame-empty"><span>📱</span>사진 {j + 1}</div>
                      }
                    </div>
                  ))}
                  {exp.gif && (
                    <div className="phone-frame">
                      <img src={exp.gif} alt="demo gif" />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem", flexWrap: "wrap" }}>
                  <a href={exp.githubUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      background: "var(--cream)", border: "1.5px solid var(--peach)",
                      borderRadius: "20px", padding: "0.3rem 1rem", fontSize: "0.8rem",
                      cursor: "pointer", color: "var(--text-mid)", textDecoration: "none",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "var(--coral)"}
                    onMouseOut={e => e.currentTarget.style.background = "var(--cream)"}
                  >
                    {/* GitHub 아이콘 */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    GitHub
                  </a>

                  <a href={exp.notionUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      background: "var(--cream)", border: "1.5px solid var(--peach)",
                      borderRadius: "20px", padding: "0.3rem 1rem", fontSize: "0.8rem",
                      cursor: "pointer", color: "var(--text-mid)", textDecoration: "none",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "var(--coral)"}
                    onMouseOut={e => e.currentTarget.style.background = "var(--cream)"}
                  >
                    {/* Notion 아이콘 */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                    </svg>
                    Notion
                  </a>
                </div>
                <div className="tech-stack">{exp.stack.map(t => <span key={t} className="tech-tag">{t}</span>)}</div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-mid)", marginTop: "0.8rem", lineHeight: "1.7" }}>{exp.detail}</p>
                <div className="awards">
                  {exp.awards.map((a, j) => <div key={j} className="award-item">{a}</div>)}
                </div>
              </div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="section skills-section">
        <div className="section-inner">
          <RevealSection>
            <span className="tag-label tag-label-lg">Community</span>

            {/* ── CEOS + 고스락: 슬라이드 2열 ── */}
            <div className="slide-row" style={{ marginTop: "1.5rem" }}>
              <SlideCard
                photos={data.communities[0].row1}
                name={data.communities[0].name}
                period={data.communities[0].period}
                items={data.communities[0].items}
              />
              <SlideCard
                photos={data.communities[4].row3}
                name={data.communities[4].name}
                period={data.communities[4].period}
                items={data.communities[4].items}
              />
            </div>

            {/* ── 중간 3개: 사진 위 + 텍스트 아래 ── */}
            <div className="mid-grid">
              {data.communities.slice(1, 4).map((c, i) => (
                <div key={i} className="mid-card">
                  <div className="mid-photo">
                    {c.row2
                      ? <img src={c.row2} alt={c.name} />
                      : <div className="mid-photo-empty"><span>🖼️</span><span>사진</span></div>
                    }
                  </div>
                  <div className="mid-body">
                    <h4>{c.name}</h4>
                    <div className="meta">{c.period}</div>
                    <ul>{c.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>

            

          </RevealSection>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section projects-section">
        <div className="section-inner">
          <RevealSection>
            <span className="tag-label">Projects</span>
            <div style={{ marginTop: "1.5rem" }}>
              {data.projects.map((p, i) => (
                <div key={i} className="project-card">
                  <div className="project-title">{p.title}</div>
                  <p className="project-desc">{p.desc}</p>
                  <div className="tech-stack" style={{ marginTop: "1rem" }}>
                    {p.stack.map(t => <span key={t} className="tech-tag">{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--cream)", border: "1.5px solid var(--peach)", borderRadius: "20px", padding: "0.3rem 1rem", fontSize: "0.8rem", color: "var(--text-mid)", textDecoration: "none", transition: "all 0.2s" }}
                        onMouseOver={e => { e.currentTarget.style.background = "var(--coral)"; e.currentTarget.style.color = "white"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.color = "var(--text-mid)"; }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {p.notionUrl && (
                      <a href={p.notionUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--cream)", border: "1.5px solid var(--peach)", borderRadius: "20px", padding: "0.3rem 1rem", fontSize: "0.8rem", color: "var(--text-mid)", textDecoration: "none", transition: "all 0.2s" }}
                        onMouseOver={e => { e.currentTarget.style.background = "var(--coral)"; e.currentTarget.style.color = "white"; }}
                        onMouseOut={e => { e.currentTarget.style.background = "var(--cream)"; e.currentTarget.style.color = "var(--text-mid)"; }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                        </svg>
                        Notion
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <h2>Let's Connect 👋</h2>
        <p>만나서 반갑습니다!</p>
        <div className="footer-links">
          <a className="footer-link" href="https://github.com/hyesuhan" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="footer-link" href="mailto:heaoo88@gmail.com">Email</a>
        </div>
        <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>© 2026 Hyesoo Han. All rights reserved.</p>
      </footer>
    </div>
  );
}