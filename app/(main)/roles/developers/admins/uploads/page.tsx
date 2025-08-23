"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [formData, setFormData] = useState({
    title: "",
    flag: "",
    description: "",
    points: "",
    category: "All",
    link: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("CTF question uploaded successfully!");
        setFormData({
          title: "",
          flag: "",
          description: "",
          points: "",
          category: "All",
          link: "",
        });
        router.push("/problems"); // Redirect to problems page
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1 className="pt-12 text-4xl sm:text-5xl text-center text-rose-500 font-bold">
        Upload CTF Questions
      </h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2"
        onSubmit={handleSubmit}
      >
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Heading
            </label>
            <input
              id="title"
              type="text"
              placeholder="CTF"
              value={formData.title}
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
              required
            />
          </div>
          <div className="md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Flag
            </label>
            <input
              id="flag"
              type="text"
              placeholder="bingo{.....}"
              value={formData.flag}
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
              required
            />
          </div>
        </div>
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-full px-3">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Description
            </label>
            <input
              id="description"
              type="text"
              placeholder="Description of the question"
              value={formData.description}
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
              required
            />
          </div>
        </div>
        <div className="-mx-3 md:flex mb-2">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Points
            </label>
            <input
              id="points"
              type="number"
              placeholder="100"
              value={formData.points}
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
              required
            />
          </div>
          <div className="md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
            >
              <option>All</option>
              <option>Web Exploitation</option>
              <option>Cryptography</option>
              <option>Reverse Engineering</option>
              <option>Forensics</option>
              <option>General Skills</option>
              <option>Binary Exploitation</option>
            </select>
          </div>
          <div className="md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
              Resource Link
            </label>
            <input
              id="link"
              type="text"
              placeholder="link here"
              value={formData.link}
              onChange={handleChange}
              className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <div className="flex justify-center items-center mt-10">
          <button
            type="submit"
            className="bg-rose-500 hover:bg-rose-800 rounded-xl w-[18rem] px-4 py-2 text-white text-center mx-[auto] my-0 font-bold"
          >
            Upload 🚀
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
