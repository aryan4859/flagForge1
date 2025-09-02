import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Licensing() {
  return (
    <div className="pt-[5rem] px-[3rem] flex flex-col gap-[5rem] max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-100 transition-colors duration-300">
          Licensing{" "}
          <span className="text-red-400 dark:text-red-500 transition-colors duration-300">
            Information
          </span>
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-3xl transition-colors duration-300">
          FlagForge is open source software released under the GNU General
          Public License
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-200/80 dark:border-gray-700 p-8 backdrop-blur-[150px] transition-colors duration-300 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4 transition-colors duration-300">
            GPL-3.0 License
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
            FlagForge is licensed under the GNU General Public License v3.0.
            This means you are free to use, modify, and distribute the software,
            but you must:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 transition-colors duration-300">
                •
              </span>
              <span>
                Disclose your source code when distributing modified versions
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 transition-colors duration-300">
                •
              </span>
              <span>
                License your modifications under the same GPL-3.0 license
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 transition-colors duration-300">
                •
              </span>
              <span>Include copyright notices and license text</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 transition-colors duration-300">
                •
              </span>
              <span>State significant changes made to the original code</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4 transition-colors duration-300">
            Your Rights
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
            Under the GPL-3.0 license, you have the freedom to:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 transition-colors duration-300">
                •
              </span>
              <span>
                Use the software for any purpose, including commercially
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 transition-colors duration-300">
                •
              </span>
              <span>Study how the program works and modify it</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 transition-colors duration-300">
                •
              </span>
              <span>Distribute original or modified versions</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 dark:text-red-500 mr-2 transition-colors duration-300">
                •
              </span>
              <span>Contribute back to the original project</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4 transition-colors duration-300">
            Third-Party Components
          </h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            FlagForge may include third-party open source components that are
            subject to their own licenses. All compatible licenses are respected
            and attribution is provided where required.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4 transition-colors duration-300">
            Getting the Source Code
          </h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            The complete source code for FlagForge is available on GitHub. You
            can access, fork, and contribute to the project through our
            repository. We welcome contributions from the community!
          </p>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="https://github.com/FlagForgeCTF/flagForge"
          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg px-6 py-3 text-gray-700 dark:text-gray-100 text-center font-bold border border-gray-300 dark:border-gray-700 transition-colors duration-300"
        >
          <FaGithub size={20} /> GitHub Repo
        </Link>
        <Link
          href="/"
          className="inline-block bg-red-500 hover:bg-rose-700 dark:bg-red-500 dark:hover:bg-rose-700 rounded-lg px-6 py-3 text-white text-center font-bold transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
