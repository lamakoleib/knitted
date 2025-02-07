"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ProjectDetailsPage() {
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    pattern: "",
    category: "",
    size: "",
    needles: "",
    yarn: "",
    yardage: "",
    colourway: "",
    status: "",
    started: "",
    finished: "",
  });

  // Handles image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProjectImage(imageUrl);
    }
  };

  // Handles input form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form reset on cancel
  const handleCancel = () => {
    setFormData({
      title: "",
      pattern: "",
      category: "",
      size: "",
      needles: "",
      yarn: "",
      yardage: "",
      colourway: "",
      status: "",
      started: "",
      finished: "",
    });
    setProjectImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
        {/* Project Image */}
        <div className="relative border-dashed border-2 border-gray-300 rounded-lg h-[480px] flex items-center justify-center">
          {projectImage ? (
            <Image
              src={projectImage}
              alt="Project"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          ) : (
            <label
              htmlFor="image-upload"
              className="text-gray-500 cursor-pointer"
            >
              Click to upload project image
              <input
                type="file"
                id="image-upload"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Project Details */}
        <div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            className="w-full text-3xl font-bold mb-4 border-b-2 focus:outline-none p-2"
          />

          <p className="text-lg text-gray-500 mb-4">Project Information</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["pattern", "Pattern"],
              ["category", "Category"],
              ["size", "Size"],
              ["needles", "Needles / Hooks"],
              ["yarn", "Yarn"],
              ["yardage", "Yardage"],
              ["colourway", "Colourway"],
            ].map(([name, placeholder], idx) => (
              <input
                key={idx}
                type="text"
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="border rounded-lg p-2 w-full h-12"
              />
            ))}
          </div>

          {/* Project Status */}
          <p className="text-lg text-gray-500 mt-6 mb-3">Project Status</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                placeholder="Status (e.g., Finished)"
                className="border rounded-lg p-2 w-full h-12"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                name="started"
                value={formData.started}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">Completion Date</label>
              <input
                type="date"
                name="finished"
                value={formData.finished}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full h-12"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-2 rounded-lg"
              onClick={() => console.log("Submitted Data:", formData)}
            >
              Save Project
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
