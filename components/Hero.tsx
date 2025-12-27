"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";

// Import images statically
import nirmalImage from "@/public/NirmalDahal.jpeg";
import sobitImage from "@/public/SobitThakuri.jpeg";

const Hero: React.FC = () => {
  const { status } = useSession();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const testimonials = [
    {
      id: 1,
      name: "Nirmal Dahal",
      position: "Cofounder of Cryptogen Nepal",
      image: nirmalImage,
      testimonial:
        "FlagForge provides an exceptional platform for cybersecurity professionals to validate their skills. The challenges mirror real-world attack vectors and help teams stay sharp in an ever-evolving threat landscape.",
    },
    {
      id: 2,
      name: "Sobit Thakuri",
      position: "Information Security Officer and ISO 27001:2022 Lead Auditor",
      image: sobitImage,
      testimonial:
        "I appreciate FlagForge's comprehensive approach to security training. The platform effectively bridges the gap between theoretical knowledge and practical application in cybersecurity.",
    },
  ];

  const categories = [
    {
      icon: "🌐",
      title: "Web Exploitation",
      description: "Master web vulnerabilities like SQL injection, XSS, CSRF, and more. Learn to identify and exploit common web application security flaws.",
    },
    {
      icon: "🔐",
      title: "Cryptography",
      description: "Decode encrypted messages, break ciphers, and understand cryptographic algorithms. From classical to modern encryption techniques.",
    },
    {
      icon: "🔍",
      title: "Reverse Engineering",
      description: "Analyze binaries, understand assembly code, and reverse engineer software to uncover hidden flags and vulnerabilities.",
    },
    {
      icon: "🕵️",
      title: "Forensics",
      description: "Investigate digital artifacts, analyze memory dumps, recover hidden data, and solve mysteries through digital forensics.",
    },
    {
      icon: "🎯",
      title: "Binary Exploitation",
      description: "Exploit buffer overflows, format string vulnerabilities, and other binary-level security issues in compiled programs.",
    },
    {
      icon: "🧩",
      title: "Miscellaneous",
      description: "Tackle unique challenges that don't fit traditional categories. Logic puzzles, OSINT, steganography, and creative problem-solving.",
    },
  ];

  const features = [
    {
      icon: "🎓",
      title: "Learn by Doing",
      description: "Hands-on challenges that teach real-world cybersecurity skills through practical application.",
    },
    {
      icon: "📊",
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed statistics, solve rates, and performance analytics.",
    },
    {
      icon: "🏆",
      title: "Compete & Rank",
      description: "Climb the leaderboard, earn points, and compete with cybersecurity enthusiasts worldwide.",
    },
    {
      icon: "💡",
      title: "Smart Hint System",
      description: "Get unstuck with our intelligent hint system. Choose between watching ads or using points for hints.",
    },
    {
      icon: "🌙",
      title: "Dark Mode Support",
      description: "Comfortable coding experience with full dark mode support for extended practice sessions.",
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      description: "Practice anywhere, anytime. Our platform works seamlessly on desktop, tablet, and mobile devices.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Account",
      description: "Sign up for free and join our community of cybersecurity enthusiasts.",
    },
    {
      step: "2",
      title: "Choose Your Challenge",
      description: "Browse challenges across multiple categories and difficulty levels.",
    },
    {
      step: "3",
      title: "Solve & Submit",
      description: "Work through the challenge, find the flag, and submit your solution.",
    },
    {
      step: "4",
      title: "Earn Points & Rank Up",
      description: "Gain points for correct solutions and climb the global leaderboard.",
    },
  ];

  const stats = [
    { number: "100+", label: "Challenges" },
    { number: "1000+", label: "Active Users" },
    { number: "6", label: "Categories" },
    { number: "24/7", label: "Availability" },
  ];

  const faqs = [
    {
      question: "Is FlagForge completely free?",
      answer: "Yes! FlagForge is completely free to use. All challenges, features, and competitions are available at no cost. We believe in making cybersecurity education accessible to everyone.",
    },
    {
      question: "Do I need prior experience in cybersecurity?",
      answer: "No! We welcome participants of all skill levels. We have challenges ranging from beginner-friendly to advanced. Start with easier challenges and progressively work your way up as you learn.",
    },
    {
      question: "How does the hint system work?",
      answer: "When you're stuck on a challenge, you can request hints. You have two options: watch a short advertisement to get a hint for free, or use your earned points to unlock hints instantly. This system keeps the platform free while helping you learn.",
    },
    {
      question: "What are CTF challenges?",
      answer: "CTF (Capture The Flag) challenges are cybersecurity exercises where you solve problems to find hidden 'flags' - special strings that prove you've solved the challenge. They're designed to teach real-world security skills in a safe, legal environment.",
    },
    {
      question: "Can I compete with others?",
      answer: "Absolutely! FlagForge features a global leaderboard where you can see how you rank against other users. Earn points by solving challenges and climb the ranks to showcase your skills.",
    },
    {
      question: "How often are new challenges added?",
      answer: "We regularly update our platform with new challenges based on user feedback and emerging cybersecurity trends. Follow our updates to stay informed about new content.",
    },
    {
      question: "What if I get stuck on a challenge?",
      answer: "Don't worry! You can use our hint system to get guidance. Additionally, our community is active and supportive - you can discuss challenges (without spoilers) and learn from others.",
    },
    {
      question: "Are the challenges based on real-world scenarios?",
      answer: "Yes! Our challenges are designed to mirror real-world security vulnerabilities and attack vectors. This ensures that the skills you learn are directly applicable to actual cybersecurity work.",
    },
  ];

  const changeTestimonial = (newIndex: number) => {
    if (newIndex === currentTestimonial || isAnimating) return;

    setIsAnimating(true);

    setTimeout(() => {
      setCurrentTestimonial(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  const nextTestimonial = () => {
    const newIndex = (currentTestimonial + 1) % testimonials.length;
    changeTestimonial(newIndex);
  };

  const prevTestimonial = () => {
    const newIndex =
      (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    changeTestimonial(newIndex);
  };

  useEffect(() => {
    if (!isAutoPlaying || isAnimating) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentTestimonial, isAnimating]);

  const handleManualNavigation = (action: () => void) => {
    setIsAutoPlaying(false);
    action();
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="pt-8 sm:pt-16 md:pt-20 px-4 sm:px-8 md:px-12 flex flex-col gap-12 sm:gap-20 md:gap-24 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 pb-16">
      {/* Hero Section */}
      <header className="flex flex-col gap-6 sm:gap-10 md:gap-12">
        <h1 className="w-full sm:w-[90%] md:w-[80%] mx-auto text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-center text-gray-600 dark:text-gray-100 leading-tight sm:leading-tight md:leading-tight tracking-tight transition-colors duration-300">
          Welcome to
          <span className="text-red-500 dark:text-red-500 font-extrabold">
            {" "}
            FlagForge{" "}
          </span>
          <span className="font-bold">Capture The Flag (CTF) </span>
          playground!🏆
        </h1>
        <p className="w-full sm:w-[85%] md:w-[75%] mx-auto text-center text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
          <span className="text-red-500 dark:text-red-500 font-extrabold">
            FlagForge
          </span>{" "}
          is a dynamic and engaging CTF platform dedicated to promoting
          <span className="text-red-500 dark:text-red-500 font-extrabold">
            {" "}
            Cybersecurity{" "}
          </span>
          awareness and fostering a passion for coding among participants. Our
          CTF competition offers a challenging environment for individuals to
          sharpen their skills in cybersecurity, cryptography 🗝️, web
          exploitation 💻, reverse engineering 🔍, & more.
        </p>
        <div className="flex justify-center">
          <Link
            href={status === "authenticated" ? "/problems" : "/authentication"}
            className="w-full max-w-xs sm:max-w-sm"
          >
            <button className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg px-6 py-3 sm:px-8 sm:py-4 text-white text-center font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl touch-manipulation">
              Start Solving 🚀
            </button>
          </Link>
        </div>
      </header>

      {/* Stats Section */}
      <div className="w-full mx-auto" aria-label="Key Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] rounded-xl p-6 sm:p-8 shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 text-center transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-500 dark:text-red-500 mb-2">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What We Provide Section */}
      <section className="w-full mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            What We Provide
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to master cybersecurity through hands-on practice
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              className="bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] rounded-xl p-6 sm:p-8 shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="text-4xl sm:text-5xl mb-4" aria-hidden="true">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Challenge Categories Section */}
      <section className="w-full mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            Challenge Categories
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Explore diverse cybersecurity domains and build comprehensive skills
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category, index) => (
            <article
              key={index}
              className="bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] rounded-xl p-6 sm:p-8 shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                {category.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                {category.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {category.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Get started in just four simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {howItWorks.map((item, index) => (
            <div
              key={index}
              className="relative bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] rounded-xl p-6 sm:p-8 shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                {item.step}
              </div>
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose FlagForge */}
      <section className="w-full mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-6">
        <div className="flex flex-col gap-2 sm:gap-3 justify-center shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border-gray-200/80 dark:border-gray-700 border p-4 sm:p-5 md:p-7 rounded-xl bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] transition-all duration-300 hover:scale-105">
          <h3 className="font-extrabold text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Innovative Challenges 🧿
          </h3>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
            <span className="text-red-500 dark:text-red-500 font-bold">
              FlagForge
            </span>{" "}
            offers a variety of innovative challenges that test participants'
            creativity and problem-solving abilities, ensuring an engaging and
            rewarding experience for all.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 justify-center p-4 sm:p-5 md:p-5 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] border-gray-200/80 dark:border-gray-700 border transition-all duration-300 hover:scale-105">
          <h3 className="font-extrabold text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Beginner-Friendly 🌐
          </h3>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
            <span className="text-red-500 dark:text-red-500 font-extrabold">
              FlagForge{" "}
            </span>
            welcomes participants of all skill levels, including beginners. The
            platform offers challenges that cater to newcomers, providing a
            supportive environment for learning and growth.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 justify-center p-4 sm:p-5 md:p-5 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] border-gray-200/80 dark:border-gray-700 border transition-all duration-300 hover:scale-105">
          <h3 className="font-extrabold text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Continuous Improvement 🎁
          </h3>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
            <span className="text-red-500 dark:text-red-500 font-extrabold">
              FlagForge
            </span>{" "}
            regularly updates its challenges and platform based on feedback from
            participants, ensuring that the experience remains relevant and
            engaging.
          </p>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="w-full mx-auto" aria-labelledby="testimonials-title">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 id="testimonials-title" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
              Trusted by Cybersecurity Experts
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div
              className={`bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] rounded-xl p-4 sm:p-6 md:p-8 shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 transition-all duration-300 ease-in-out ${isAnimating
                ? "opacity-40 scale-[0.98]"
                : "opacity-100 scale-100"
                }`}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
                <div
                  className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isAnimating
                    ? "opacity-0 translate-x-4"
                    : "opacity-100 translate-x-0"
                    }`}
                >
                  <Image
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    width={96}
                    height={96}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full object-cover transition-all duration-300 ease-in-out hover:scale-105 mx-auto"
                  />
                </div>

                <div
                  className={`flex-1 text-center md:text-left transition-all duration-300 ease-in-out ${isAnimating
                    ? "opacity-0 translate-x-8"
                    : "opacity-100 translate-x-0"
                    }`}
                >
                  <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6 leading-relaxed transition-all duration-300 ease-in-out">
                    "{testimonials[currentTestimonial].testimonial}"
                  </blockquote>

                  <div className="transition-all duration-300 ease-in-out">
                    <div className="font-bold text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-100">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                      {testimonials[currentTestimonial].position}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleManualNavigation(prevTestimonial)}
              disabled={isAnimating}
              className={`hidden md:block absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:scale-110 active:scale-95 ${isAnimating ? "opacity-50 cursor-not-allowed" : "opacity-100"
                }`}
              aria-label="Previous testimonial"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-600 dark:text-gray-300"
              >
                <path
                  d="M6.35058 1.5043L2.21073 5.64415C1.46183 6.39306 1.46183 7.60734 2.21073 8.35624L6.35059 12.4961"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={() => handleManualNavigation(nextTestimonial)}
              disabled={isAnimating}
              className={`hidden md:block absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:scale-110 active:scale-95 ${isAnimating ? "opacity-50 cursor-not-allowed" : "opacity-100"
                }`}
              aria-label="Next testimonial"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-600 dark:text-gray-300"
              >
                <path
                  d="M1.64941 12.4957L5.78927 8.35585C6.53817 7.60694 6.53817 6.39266 5.78927 5.64376L1.64941 1.50391"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex justify-center mt-4 sm:mt-6 gap-2 sm:gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleManualNavigation(() => changeTestimonial(index))
                  }
                  disabled={isAnimating}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500 ease-out touch-manipulation ${index === currentTestimonial
                    ? "bg-red-500 scale-125 shadow-lg shadow-red-500/30"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110 active:scale-95"
                    } ${isAnimating
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full mx-auto max-w-4xl" aria-labelledby="faq-title">
        <div className="text-center mb-8 sm:mb-12">
          <h2 id="faq-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            Everything you need to know about FlagForge
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                aria-expanded={openFaqIndex === index}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <span className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-red-500 flex-shrink-0 transition-transform duration-300 ${openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? "max-h-96" : "max-h-0"
                  }`}
              >
                <div className="px-6 pb-5 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full mx-auto max-w-4xl">
        <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-2xl p-8 sm:p-12 md:p-16 shadow-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of cybersecurity enthusiasts and start solving challenges today. It's completely free!
          </p>
          <Link
            href={status === "authenticated" ? "/problems" : "/authentication"}
            className="inline-block"
          >
            <button className="bg-white text-red-600 hover:bg-gray-100 active:bg-gray-200 rounded-lg px-8 py-4 sm:px-10 sm:py-5 font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
              Get Started Now 🚀
            </button>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default Hero;
