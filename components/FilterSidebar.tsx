import React from "react";
import { IoFilter } from "react-icons/io5";

export default function FilterSidebar() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <div className="text-2xl font-bold flex gap-2 items-center text-center mb-4">
        <IoFilter className="text-gray-900 dark:text-gray-100 transition-colors duration-300" />
        <span className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
          Filters
        </span>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
            Topics
          </h1>
          <ul className="flex flex-col gap-2 font-base">
            {[
              "All",
              "Web Exploitation",
              "Cryptography",
              "Reverse Engineering",
              "Forensics",
              "General Skills",
              "Binary Exploitation",
            ].map((topic) => (
              <li
                key={topic}
                className="shadow p-3 rounded-md hover:text-red-500 hover:font-bold hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-300 text-gray-900 dark:text-gray-100"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
