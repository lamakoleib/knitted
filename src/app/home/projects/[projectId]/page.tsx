import React from "react";
import Image from "next/image";

const projectData = {
  title: "Goose by Knittinglama",
  pattern: "Goose Crochet Pattern",
  category: "",
  size: "",
  needles: "",
  yarn: "",
  yardage: "",
  colourway: "",
  status: "Finished",
  started: "July 8th 2024",
  finished: "July 10th 2024",
  image:
    "https://media.discordapp.net/attachments/1337147309414416434/1337147436183064686/Screenshot_2025-02-06_140546.png?ex=67aa5797&is=67a90617&hm=e390d14cca1f483dcacf37004bdcf92de0a7b4d59004d06a125d470318b9463c&=&format=webp&quality=lossless&width=463&height=565",
};

const ProjectDetailsPage = () => {
  return (
    <div className="bg-gray-50 p-4 md:p-12 min-h-screen w-full">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_3fr] gap-6 md:gap-8">
        {/* Responsive Image Section */}
        <div className="p-4 md:p-10 flex justify-center md:justify-start">
          <div className="relative w-[15rem] md:w-[20rem] aspect-[3/4]">
            <Image
              src={projectData.image}
              alt={projectData.title}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Project Details Section */}
        <div className="p-4 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
            {projectData.title}
          </h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_auto_1fr] md:gap-6">
            {/* Project Information Section */}
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2 md:mb-4">
                Project Information
              </h2>
              <div className="space-y-2">
                {[
                  ["Pattern", projectData.pattern],
                  ["Category", projectData.category || "N/A"],
                  ["Size", projectData.size || "N/A"],
                  ["Needles / Hooks", projectData.needles || "N/A"],
                  ["Yarn", projectData.yarn || "N/A"],
                  ["Yardage", projectData.yardage || "N/A"],
                  ["Colourway", projectData.colourway || "N/A"],
                ].map(([label, value], index) => (
                  <div
                    key={`info-${label}-${index}`}
                    className="flex justify-between text-sm border-b pb-2 flex-wrap"
                  >
                    <strong className="text-gray-600">{label}:</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Separator for larger screens */}
            <div className="hidden md:block w-[1.5px] bg-gray-300"></div>

            {/* Project Status Section */}
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2 md:mb-4">
                Project Status
              </h2>
              <div className="space-y-2">
                {[
                  [
                    "Status",
                    <span key="status" className="text-red-300">
                      {projectData.status}
                    </span>,
                  ],
                  ["Started", projectData.started],
                  ["Finished", projectData.finished],
                ].map(([label, value], index) => (
                  <div
                    key={`status-${label}-${index}`}
                    className="flex justify-between text-sm border-b pb-2 flex-wrap"
                  >
                    <strong className="text-gray-600">{label}:</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
