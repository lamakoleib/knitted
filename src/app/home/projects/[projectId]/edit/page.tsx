"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
    status: "Started",
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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      status: "Started",
      started: "",
      finished: "",
    });
    setProjectImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-10">
        {/* Project Image */}
        <div className="relative border-dashed border-2 border-gray-300 rounded-lg h-[300px] md:h-[480px] flex items-center justify-center">
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
              className="text-gray-500 cursor-pointer text-center"
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
        <div className="max-w-full">
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter project title"
            className="w-full text-black text-2xl md:text-3xl font-bold mb-4 placeholder:text-red-300"
          />

          <p className="text-lg text-gray-500 mb-4">Project Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["pattern", "Pattern"],
              ["category", "Category"],
              ["size", "Size"],
              ["needles", "Needles / Hooks"],
              ["yarn", "Yarn"],
              ["yardage", "Yardage"],
              ["colourway", "Colourway"],
            ].map(([name, placeholder], idx) => (
              <Input
                key={idx}
                type="text"
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full"
              />
            ))}
          </div>

          {/* Project Status */}
          <p className="text-lg text-gray-500 mt-6 mb-3">Project Status</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Dropdown */}
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Started">Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="w-full">
              <label className="block text-sm text-gray-600 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                name="started"
                value={formData.started}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Conditionally Render Completion Date */}
          {formData.status === "Completed" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="w-full">
                <label className="block text-sm text-gray-600 mb-1">
                  Completion Date
                </label>
                <Input
                  type="date"
                  name="finished"
                  value={formData.finished}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-red-200 hover:bg-red-300 text-white"
              onClick={() => console.log("Submitted Data:", formData)}
            >
              Save Project
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
