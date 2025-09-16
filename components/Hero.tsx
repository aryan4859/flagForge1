"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

// Import images statically
import nirmalImage from '@/public/NirmalDahal.jpeg';
import sobitImage from '@/public/SobitThakuri.jpeg';

const Hero: React.FC = () => {
  const { status } = useSession();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Nirmal Dahal",
      position: "Cofounder of Cryptogen Nepal",
      image: nirmalImage, // Use imported image
    testimonial: "FlagForge provides an exceptional platform for cybersecurity professionals to validate their skills. The challenges mirror real-world attack vectors and help teams stay sharp in an ever-evolving threat landscape."    },
    {
      id: 2,
      name: "Sobit Thakuri",
      position: "Information Security Officer and ISO 27001:2022 Lead Auditor",
      image: sobitImage, // Use imported image
    testimonial: "I appreciate FlagForge's comprehensive approach to security training. The platform effectively bridges the gap between theoretical knowledge and practical application in cybersecurity."    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem]  dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="flex flex-col gap-[50px] ">
        <h2 className="sm:w-[80%] mx-auto text-[2.6rem] sm:text-6xl text-center text-gray-600 dark:text-gray-100 leading-[180%] sm:leading-2 tracking-tight transition-colors duration-300">
          Welcome to
          <span className="text-red-500 dark:text-red-500 font-extrabold">
            {" "}
            FlagForge{" "}
          </span>
          <span className="font-bold">Capture The Flag (CTF) </span>
          playground!🏆
        </h2>
        <h2 className="w-[98%] sm:w-[75%] mx-auto my-0 text-center text-base sm:text-lg text-gray-700 dark:text-gray-300 transition-colors duration-300">
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
        </h2>
        <Link
          href={status === "authenticated" ? "/problems" : "/authentication"}
          className="mx-auto"
        >
          <button className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg w-[18rem] px-4 py-4 text-white text-center mx-[auto] my-0 font-bold transition-colors duration-300">
            Start Solving 🚀
          </button>
        </Link>
      </div>

      <div className="w-auto mx-auto my-0 flex flex-col md:flex-row p-6 gap-8">
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border-gray-200/80 dark:border-gray-700 border p-7 rounded-xl bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] transition-colors duration-300">
          <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Innovative Challenges 🧿
          </h1>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <span className="text-red-500 dark:text-red-500 font-bold">
              FlagForge
            </span>{" "}
            offers a variety of innovative challenges that test participants'
            creativity and problem-solving abilities, ensuring an engaging and
            rewarding experience for all.
          </p>
        </div>
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center p-5 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] border-gray-200/80 dark:border-gray-700 border transition-colors duration-300">
          <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Beginner-Friendly 🌐
          </h1>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <span className="text-red-500 dark:text-red-500 font-extrabold">
              FlagForge{" "}
            </span>
            welcomes participants of all skill levels, including beginners. The
            platform offers challenges that cater to newcomers, providing a
            supportive environment for learning and growth.
          </p>
        </div>
        <div className="mx-auto my-0 flex flex-col gap-3 justify-center p-5 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] border-gray-200/80 dark:border-gray-700 border transition-colors duration-300">
          <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
            Improvement 🎁
          </h1>
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
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
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
              Trusted by tech experts and users
            </h2>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/40 dark:bg-gray-800/90 backdrop-blur-[150px] rounded-xl p-8 shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 transition-colors duration-300">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Testimonial Image - Now using Next.js Image component */}
                <div className="flex-shrink-0">
                  <Image
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    width={128}
                    height={128}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                  />
                </div>
                
                {/* Testimonial Content */}
                <div className="flex-1 text-center md:text-left">
                  <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">
                    "{testimonials[currentTestimonial].testimonial}"
                  </blockquote>
                  
                  <div>
                    <div className="font-bold text-xl text-gray-800 dark:text-gray-100 transition-colors duration-300">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      {testimonials[currentTestimonial].position}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300"
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
              onClick={nextTestimonial}
              className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300"
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
            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentTestimonial
                      ? 'bg-red-500'
                      : 'bg-gray-300 dark:bg-gray-600'
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