import React from "react";
import { Questions } from "@/interfaces";
import Link from "next/link";
import { Check } from "lucide-react";

const QuestionCards = ({
  title,
  description,
  category,
  points,
  done,
  _id,
}: Questions) => {
  const isDone = done.some(
    (item: { questionId: string | undefined }) => item.questionId === _id
  );

  return (
    <Link
      href={`/problems/${_id}`}
      className={`relative w-full h-full bg-white/40 dark:bg-gray-800 backdrop-blur-[150px] mx-auto my-0 flex flex-col gap-4 shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 px-6 py-5 rounded-2xl z-2 hover:bg-gray-100/70 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors duration-300 ${
        isDone ? "border-green-400 dark:border-green-500/80" : ""
      }`}
    >
      {isDone && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-100/80 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200/80 dark:border-green-500/30">
          <Check size={14} />
          <span>Completed</span>
        </div>
      )}
      <div className="flex flex-col">
        <h1 className="text-[1.5rem] text-start font-bold tracking-tight line-clamp-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {title}
        </h1>
        <div className="flex flex-col gap-2 justify-between">
          <h1 className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Points : <span className="text-red-500 font-bold">{points}</span>
          </h1>
          <div className="text-sm sm:text-base font-bold">
            <span className="text-white dark:text-gray-100 text-xs tracking-tight font-bold px-3 py-1 bg-red-500 dark:bg-red-600 rounded-full transition-colors duration-300">
              {category}
            </span>
          </div>
        </div>
      </div>
      <h3 className="font-base font-[0.5rem] text-black dark:text-gray-200 line-clamp-2 transition-colors duration-300">
        {description}...{" "}
        <span className="text-red-500 dark:text-red-400 font-bold">more</span>
      </h3>
    </Link>
  );
};

export default QuestionCards;
