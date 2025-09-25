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

  const changeTestimonial = (newIndex: number) => {
    if (newIndex === currentTestimonial || isAnimating) return;

    setIsAnimating(true);

    // Start fade out animation
    setTimeout(() => {
      setCurrentTestimonial(newIndex);
      // Complete fade in after content change
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

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || isAnimating) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 3000); // Increased to 4 seconds to account for animation time

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentTestimonial, isAnimating]);

  // Pause auto-play when user interacts
  const handleManualNavigation = (action: () => void) => {
    setIsAutoPlaying(false);
    action();
    // Resume auto-play after 6 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  return (
    <div className="pt-8 sm:pt-16 md:pt-20 px-4 sm:px-8 md:px-12 flex flex-col gap-8 sm:gap-16 md:gap-20 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="flex flex-col gap-6 sm:gap-10 md:gap-12">
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
      </div>

      <div className="w-full mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-6">
        <div className="flex flex-col gap-2 sm:gap-3 justify-center shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border-gray-200/80 dark:border-gray-700 border p-4 sm:p-5 md:p-7 rounded-xl bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] transition-colors duration-300">
          <h2 className="font-extrabold text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Innovative Challenges 🧿
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
            <span className="text-red-500 dark:text-red-500 font-bold">
              FlagForge
            </span>{" "}
            offers a variety of innovative challenges that test participants'
            creativity and problem-solving abilities, ensuring an engaging and
            rewarding experience for all.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 justify-center p-4 sm:p-5 md:p-5 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] border-gray-200/80 dark:border-gray-700 border transition-colors duration-300">
          <h2 className="font-extrabold text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Beginner-Friendly 🌐
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
            <span className="text-red-500 dark:text-red-500 font-extrabold">
              FlagForge{" "}
            </span>
            welcomes participants of all skill levels, including beginners. The
            platform offers challenges that cater to newcomers, providing a
            supportive environment for learning and growth.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 justify-center p-4 sm:p-5 md:p-5 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] border-gray-200/80 dark:border-gray-700 border transition-colors duration-300">
          <h2 className="font-extrabold text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Improvement 🎁
          </h2>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">
            <span className="text-red-500 dark:text-red-500 font-extrabold">
              FlagForge
            </span>{" "}
            regularly updates its challenges and platform based on feedback from
            participants, ensuring that the experience remains relevant and
            engaging.
          </p>
        </div>
      </div>

      {/* Testimonial Carousel */}
      <div className="w-full mx-auto">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
              Trusted by tech experts and users
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
                {/* Testimonial Image */}
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

                {/* Testimonial Content */}
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

            {/* Navigation Arrows - Hidden on mobile, visible on desktop */}
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

            {/* Dots indicator */}
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
      </div>
    </div>
  );
};

export default Hero;
