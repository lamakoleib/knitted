"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

  return (
    <Card className="max-w-6xl mx-auto mt-10 shadow-lg p-8">
      <div className="grid grid-cols-2 gap-6">
        {/* Project Image */}
        <CardHeader>
          <div className="relative border-dashed border-2 border-gray-300 rounded-lg h-[300px]">
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
                className="flex items-center justify-center h-full text-gray-500 cursor-pointer"
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
        </CardHeader>

        {/* Project Details */}
        <CardContent>
          {/* Project Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            className="w-full text-3xl font-bold mb-4 border-b-2 focus:outline-none p-1"
          />

          <p className="text-lg text-gray-500 mb-4">Project Information</p>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="pattern"
              value={formData.pattern}
              onChange={handleInputChange}
              placeholder="Pattern"
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="Size"
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="needles"
              value={formData.needles}
              onChange={handleInputChange}
              placeholder="Needles / Hooks"
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="yarn"
              value={formData.yarn}
              onChange={handleInputChange}
              placeholder="Yarn"
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="yardage"
              value={formData.yardage}
              onChange={handleInputChange}
              placeholder="Yardage"
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              name="colourway"
              value={formData.colourway}
              onChange={handleInputChange}
              placeholder="Colourway"
              className="border rounded-lg p-2"
            />
          </div>

          {/* Project Status */}
          <p className="text-lg text-gray-500 mt-6">Project Status</p>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              placeholder="Status (e.g., Finished)"
              className="border rounded-lg p-2"
            />

            {/* Date inputs */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                name="started"
                value={formData.started}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Completion Date</label>
              <input
                type="date"
                name="finished"
                value={formData.finished}
                onChange={handleInputChange}
                className="border rounded-lg p-2 w-full"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            className="mt-6 bg-pink-300 hover:bg-pink-400 text-white px-6 py-2 rounded-lg"
            onClick={() => console.log("Submitted Data:", formData)}
          >
            Save Project
          </button>
        </CardContent>
      </div>
    </Card>
  );
}
