import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import CountUpModule from 'react-countup';
const CountUp = CountUpModule.default || CountUpModule;
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import API from '../services/api';
import { Button, Card, Badge } from '../components/UI';
import {
  Code2,
  Cpu,
  Bot,
  Globe,
  Terminal,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Award,
  Zap,
  PlayCircle,
  GraduationCap,
  Brain,
  Rocket,
  Binary,
  Target,
  FileCode,
  Laptop,
  Check,
} from 'lucide-react';

// Sub-Component: Multi-Stage Hero Transformation Animation (Code -> Compiler -> Robot AI -> Web App)
const HeroTransformationAnimation = () => {
  const [stage, setStage] = useState(1); // 1: Code, 2: Compile, 3: Robot, 4: Web App
  const containerRef = useRef(null);

  // Auto-progress stages in a smooth loop
  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      {/* Outer Glow Background */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-[#2563EB] opacity-30 blur-2xl animate-pulse"></div>

      {/* Main Window Container */}
      <div className="relative bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 shadow-2xl space-y-5 text-[#F8FAFC] overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-[#94A3B8] ml-2">baccalaureate_journey.ts</span>
          </div>

          {/* Manual Stage Pills */}
          <div className="flex space-x-1.5">
            {[
              { id: 1, label: 'Code' },
              { id: 2, label: 'Compile' },
              { id: 3, label: 'AI Core' },
              { id: 4, label: 'App' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStage(s.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  stage === s.id
                    ? 'bg-[#2563EB] text-white shadow'
                    : 'bg-[#111827] text-[#94A3B8] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Stage Render Area */}
        <div className="min-h-[260px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {/* STAGE 1: Code Typing Animation */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-3 font-mono text-xs text-left"
              >
                <div className="flex items-center space-x-2 text-[#06B6D4]">
                  <Code2 className="w-4 h-4" />
                  <span>// Step 1: Write Clean Algorithmic Logic</span>
                </div>
                <div className="bg-[#020617] p-4 rounded-xl border border-[#1E293B] space-y-2 text-slate-300">
                  <p className="text-blue-400">
                    <span className="text-purple-400">const</span> student ={' '}
                    <span className="text-amber-300">new BaccalaureateDeveloper</span>();
                  </p>
                  <p className="text-[#94A3B8]">
                    student.<span className="text-[#06B6D4]">masterProblemSolving</span>(['C++', 'JS', 'Algorithms']);
                  </p>
                  <p className="text-emerald-400 font-bold animate-pulse">
                    &gt; await student.buildUniversityProjects();
                  </p>
                </div>
                <div className="text-[11px] text-[#94A3B8] flex items-center justify-between">
                  <span>Status: Writing Code...</span>
                  <span className="text-[#06B6D4]">Stage 1 / 4</span>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: Compiler Pipeline */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-3 font-mono text-xs text-left"
              >
                <div className="flex items-center space-x-2 text-[#2563EB]">
                  <Cpu className="w-4 h-4" />
                  <span>// Step 2: Compiling AST & Algorithm Nodes</span>
                </div>
                <div className="bg-[#020617] p-4 rounded-xl border border-[#1E293B] space-y-2">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>[OK] Parsing Syntax Trees</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-4/5 animate-pulse"></div>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    [SUCCESS] 0 Errors · Optimizing Memory Space &amp; Time Complexity (O(N log N))
                  </p>
                </div>
                <div className="text-[11px] text-[#94A3B8] flex items-center justify-between">
                  <span>Status: Compiling Binary...</span>
                  <span className="text-[#2563EB]">Stage 2 / 4</span>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: Robot AI Core */}
            {stage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0, rotate: -5 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 5 }}
                transition={{ duration: 0.4 }}
                className="w-full text-center space-y-4 py-2"
              >
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping"></div>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                    <Bot className="w-10 h-10 animate-bounce" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#F8FAFC]">AI &amp; Algorithmic Intelligence</h4>
                  <p className="text-xs text-[#94A3B8]">
                    Transforming logic into automated AI agents &amp; software systems.
                  </p>
                </div>

                <div className="flex justify-center space-x-2 text-[10px] font-mono text-[#06B6D4]">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                    [C++]
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30">
                    [Python]
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                    [React]
                  </span>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: Web Application Showcase */}
            {stage === 4 && (
              <motion.div
                key="stage4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-3 text-left"
              >
                <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs">
                  <Globe className="w-4 h-4" />
                  <span>// Step 4: Deployed Production Web App</span>
                </div>

                <div className="bg-[#020617] p-3 rounded-xl border border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-[#1E293B] pb-2">
                    <span className="font-bold text-white flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                      <span>Baccalaureate Portfolio Project</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      LIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-[#111827] border border-[#1E293B] space-y-1">
                      <span className="text-[#94A3B8] block">CS Exam Score</span>
                      <span className="text-emerald-400 font-bold text-sm">20 / 20</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#111827] border border-[#1E293B] space-y-1">
                      <span className="text-[#94A3B8] block">Projects Built</span>
                      <span className="text-[#06B6D4] font-bold text-sm">12 Apps</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#94A3B8] flex items-center justify-between font-mono">
                  <span>Status: University Ready</span>
                  <span className="text-emerald-400">Stage 4 / 4</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export const Home = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Fetch visitor count and categories
  useEffect(() => {
    const initPage = async () => {
      try {
        const res = await API.post('/visitors/track');
        setVisitorCount(res.data.totalVisitors);
      } catch (err) {
        try {
          const countRes = await API.get('/visitors/count');
          setVisitorCount(countRes.data.totalVisitors);
        } catch (e) {}
      }

      try {
        const catRes = await API.get('/categories');
        setCategories(catRes.data);
      } catch (e) {}
    };
    initPage();
  }, []);

  const baccalaureateRoadmap = [
    {
      step: '01',
      title: 'Logic & Problem Solving',
      desc: 'Master computational thinking, flowcharts, variables, conditionals, and algorithm design.',
      tag: 'Zero to One',
    },
    {
      step: '02',
      title: 'Core Data Structures',
      desc: 'Arrays, matrices, recursion, search & sorting algorithms essential for CS exams.',
      tag: 'Baccalaureate CS',
    },
    {
      step: '03',
      title: 'Modern Web Development',
      desc: 'Build real-world full-stack web applications with HTML, CSS, JavaScript, React, and Node.js.',
      tag: 'Full-Stack Portfolio',
    },
    {
      step: '04',
      title: 'University & AI Preparation',
      desc: 'Prepare for university computer science degrees, competitive programming, and AI foundations.',
      tag: 'Software Engineer',
    },
  ];

  const technologies = [
    { name: 'JavaScript / ES6+', icon: Code2, desc: 'The language of the modern web' },
    { name: 'TypeScript', icon: FileCode, desc: 'Type-safe enterprise programming' },
    { name: 'React.js', icon: Laptop, desc: 'Interactive frontend user interfaces' },
    { name: 'Node.js & Express', icon: Terminal, desc: 'Backend REST API architecture' },
    { name: 'MongoDB Database', icon: Cpu, desc: 'NoSQL database design' },
    { name: 'AI & Problem Solving', icon: Brain, desc: 'Algorithmic thinking & AI basics' },
  ];

  const faqs = [
    {
      q: 'Is this platform designed specifically for High School / Baccalaureate students?',
      a: 'Yes! Our entire curriculum is tailored for Baccalaureate students and high schoolers starting from absolute zero. We cover foundational programming logic, computer science exam preparation, and modern full-stack web development.',
    },
    {
      q: 'Do I need any previous programming experience?',
      a: 'None at all. We start from basic logical thinking and build up step-by-step to professional software engineering and project creation.',
    },
    {
      q: 'How does course access work?',
      a: 'Course access is strictly controlled by administrators or open to all students if marked as Public. There are no monthly recurring subscriptions.',
    },
    {
      q: 'Will this prepare me for University Computer Science degrees?',
      a: 'Absolutely. You will master problem-solving skills, algorithmic efficiency, and building real-world projects that give you a huge head start in university computer science programs.',
    },
  ];

  return (
    <div className="bg-[#020617] text-[#F8FAFC] overflow-hidden bg-grid-pattern selection:bg-[#2563EB] selection:text-white">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-[#06B6D4] text-xs font-mono font-bold tracking-wider">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>For Baccalaureate &amp; High School Students</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#F8FAFC] tracking-tight leading-tight">
              Learn Programming <br />
              <span className="gradient-text-blue">From Zero to Professional.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Master problem solving, algorithms, and modern web development. Prepare for university computer science degrees and build real-world software projects.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/courses" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto space-x-2">
                  <span>Explore Courses</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Right Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <HeroTransformationAnimation />
          </motion.div>
        </div>
      </section>

      {/* WHY PROGRAMMING FOR BACCALAUREATE STUDENTS */}
      <section className="py-20 bg-[#0F172A] border-y border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="accent">Why BacDev PRO?</Badge>
            <h2 className="text-3xl font-extrabold text-[#F8FAFC]">Built For High School Developers</h2>
            <p className="text-[#94A3B8] text-sm">
              We bridge the gap between high school computer science theory and professional software engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 text-[#2563EB] flex items-center justify-center font-bold border border-blue-500/30">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC]">Computational Thinking</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Develop strong logical reasoning, algorithmic problem solving, and analytical skills necessary for CS exams.
              </p>
            </Card>

            <Card hover className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 text-[#06B6D4] flex items-center justify-center font-bold border border-cyan-500/30">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC]">University CS Preparation</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Get a major head start in university software engineering, computer science degrees, and competitions.
              </p>
            </Card>

            <Card hover className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-[#22C55E] flex items-center justify-center font-bold border border-emerald-500/30">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC]">Real Portfolio Projects</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Build real-world full-stack web applications and AI projects instead of just memorizing syntax.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* BACCALAUREATE LEARNING ROADMAP */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="primary">Structured Curriculum</Badge>
          <h2 className="text-3xl font-extrabold text-[#F8FAFC]">The Baccalaureate Roadmap</h2>
          <p className="text-[#94A3B8] text-sm">
            Four-stage journey designed to take high school students from absolute zero to university-ready software engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {baccalaureateRoadmap.map((item, idx) => (
            <Card key={idx} hover className="relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-blue-500/40 font-mono">{item.step}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F172A] border border-[#1E293B] text-[#06B6D4]">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">{item.title}</h3>
              <p className="text-[#94A3B8] text-xs leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* TECHNOLOGIES YOU'LL LEARN */}
      <section className="py-20 bg-[#0F172A] border-y border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="accent">Modern Tech Stack</Badge>
            <h2 className="text-3xl font-extrabold text-[#F8FAFC]">Technologies You'll Master</h2>
            <p className="text-[#94A3B8] text-sm">
              Learn industry-standard tools and programming languages used by software engineers globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <Card key={idx} hover className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-[#020617] text-[#06B6D4] border border-[#1E293B] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-[#F8FAFC]">{tech.name}</h4>
                    <p className="text-xs text-[#94A3B8]">{tech.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* STUDENT SUCCESS METRICS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-3xl p-10 md:p-16 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-black text-[#06B6D4] font-mono">
              <CountUp end={100} duration={3} suffix="%" />
            </div>
            <p className="text-sm text-[#94A3B8] font-medium">Baccalaureate CS Focus</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-black text-[#2563EB] font-mono">
              <CountUp end={12} duration={3} suffix="+" />
            </div>
            <p className="text-sm text-[#94A3B8] font-medium">Portfolio Projects Built</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-black text-[#22C55E] font-mono">
              <CountUp end={24} duration={3} suffix="/7" />
            </div>
            <p className="text-sm text-[#94A3B8] font-medium">Instructor Access &amp; Support</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#0F172A] border-t border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <Badge variant="primary">FAQ</Badge>
            <h2 className="text-3xl font-extrabold text-[#F8FAFC]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#1E293B] rounded-2xl p-5 bg-[#020617] cursor-pointer transition-all hover:border-[#2563EB]"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#F8FAFC] text-base">{faq.q}</h4>
                  <ChevronDown
                    className={`w-5 h-5 text-[#94A3B8] transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-[#2563EB]' : ''
                    }`}
                  />
                </div>
                {activeFaq === idx && (
                  <p className="mt-3 text-sm text-[#94A3B8] leading-relaxed border-t border-[#1E293B] pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#020617] text-[#94A3B8] py-12 border-t border-[#1E293B] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <Code2 className="w-5 h-5 text-[#2563EB]" />
            <span>BacDev PRO</span>
          </div>

          <p>© {new Date().getFullYear()} BacDev PRO. Baccalaureate Computer Science Platform. Built with MERN Stack.</p>
        </div>
      </footer>
    </div>
  );
};
