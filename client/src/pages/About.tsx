import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, Target, Users, Zap, Award, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs/lib/anime.es.js';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const features = [
    { icon: Code, title: 'Interactive Coding', description: 'Practice with real coding challenges and get instant feedback.' },
    { icon: Target, title: 'Goal-Oriented Learning', description: 'Set goals, track progress, and unlock new challenges as you grow.' },
    { icon: Users, title: 'Community Driven', description: 'Learn alongside peers, compete on leaderboards, and share achievements.' },
    { icon: Zap, title: 'AI-Powered', description: 'Get personalized explanations, hints, and mentorship from AI.' },
    { icon: Award, title: 'Gamification', description: 'Earn points, badges, and level up as you master new concepts.' },
    { icon: BookOpen, title: 'Structured Paths', description: 'Follow curated learning paths from beginner to advanced levels.' },
  ];

  const stats = [
    { label: 'Active Users', value: 10000, suffix: '+' },
    { label: 'Coding Tests', value: 500, suffix: '+' },
    { label: 'Topics Covered', value: 50, suffix: '+' },
    { label: 'Success Rate', value: 95, suffix: '%' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Hero Parallax
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        yPercent: 50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // 2. Mission Section Pinning & Text Reveal
    const missionSection = containerRef.current.querySelector('.mission-section');
    if (missionSection) {
      gsap.fromTo(missionSection.querySelectorAll('.text-reveal span'),
        { opacity: 0.2, filter: 'blur(4px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: missionSection,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1
          }
        }
      );
    }

    // 3. Features Stagger
    const cards = containerRef.current.querySelectorAll('.feature-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 100, rotateX: -15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '.features-grid',
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 4. Stats Counter Animation using Anime.js triggered by ScrollTrigger
    let statsAnimated = false;
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 80%",
      onEnter: () => {
        if (statsAnimated) return;
        statsAnimated = true;
        const elements = document.querySelectorAll('.stat-number');
        elements.forEach((el, i) => {
          const targetValue = stats[i].value;
          anime({
            targets: el,
            innerHTML: [0, targetValue],
            easing: 'easeOutExpo',
            round: 1,
            duration: 2500,
            update: function (a) {
              const val = Math.round(parseFloat(a.animations[0].currentValue));
              el.innerHTML = `${val}${stats[i].suffix}`;
            }
          });
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="space-y-24 pb-24 overflow-hidden" ref={containerRef}>

      {/* Cinematic Hero */}
      <div className="relative min-h-[60vh] flex items-center justify-center -mx-8 -mt-8 pt-8 overflow-hidden bg-cyber-darker" ref={heroRef}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1),transparent_50%)]" />
          {/* Abstract grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" style={{ transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary uppercase tracking-[0.2em] text-xs font-bold shadow-cyber">
              The Platform Story
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
              Redefining <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-neon to-primary">Developer Growth</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
              Empowering the next generation of engineers to master coding through immersive AI-powered learning and practice.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Scrollytelling Mission */}
      <div className="mission-section max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-sm uppercase tracking-[0.3em] text-accent-neon mb-8 font-bold flex items-center gap-4">
          <span className="w-12 h-px bg-accent-neon" />
          Our Mission
        </h2>
        <h3 className="text-3xl md:text-5xl font-semibold text-white leading-tight text-reveal">
          {("CodeMate is dedicated to making coding education accessible, engaging, and highly effective. We believe that everyone can learn to code with the right tools, contextual guidance, and deliberate practice. Our platform merges AI mentor architecture with gamified loops to create an experience that adapts to your pace.").split(' ').map((word, i) => (
            <span key={i} className="inline-block mr-2">{word}</span>
          ))}
        </h3>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            The <span className="text-primary">Ecosystem</span>
          </h2>
        </div>
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="feature-card transform-style-3d">
                <Card className="p-8 h-full bg-card/20 backdrop-blur-xl border border-white/5 hover:border-primary/50 transition-colors group overflow-hidden relative">
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />

                  <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Icon className="w-7 h-7 text-white group-hover:text-accent-neon transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Stats */}
      <div className="max-w-5xl mx-auto px-4" ref={statsRef}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/10 relative">
          {/* Background glow for stats */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          {stats.map((stat) => (
            <div key={stat.label} className="text-center relative z-10">
              <p className="stat-number text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2 drop-shadow-lg">
                0{stat.suffix}
              </p>
              <p className="text-sm font-bold tracking-widest uppercase text-accent-neon">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-sm uppercase tracking-[0.3em] text-primary mb-12 font-bold text-center">Core Directives</h2>
        <div className="space-y-6">
          {[
            { title: 'Excellence', desc: 'We strive for the highest quality in our content, platform infrastructure, and user experience paradigms.' },
            { title: 'Innovation', desc: 'We leverage cutting-edge AI technology to provide personalized and adaptive learning experiences.' },
            { title: 'Community', desc: 'We believe in the power of open source learning, peer programming, and supporting collective ecosystem growth.' }
          ].map((value, i) => (
            <div key={i} className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-4">
                <span className="text-primary font-mono text-lg">0{i + 1}.</span> {value.title}
              </h3>
              <p className="text-white/60 leading-relaxed text-lg ml-10">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;


