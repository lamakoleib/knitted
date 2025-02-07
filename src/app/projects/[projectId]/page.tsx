import React from "react";
import Image from "next/image";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/home/components/app-sidebar";

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
    "https://media.discordapp.net/attachments/1337147309414416434/1337147436183064686/Screenshot_2025-02-06_140546.png?ex=67a66317&is=67a51197&hm=9ede515442a88321ca281eec04c7b896c7722b386d2a46b79f289c4af9848a35&=&format=webp&quality=lossless&width=463&height=565",
};

const ProjectDetailsPage = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset>
          <div className="bg-gray-50 p-12 w-full">
            <div className="max-w-7xl mx-auto overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Image Section */}
                <div className="p-10">
                  <Image
                    src={projectData.image}
                    alt={projectData.title}
                    width={463}
                    height={565}
                    className="rounded-lg w-full h-[480px] object-cover"
                  />
                </div>

                {/* Project Details Section */}
                <div className="p-10">
                  <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    {projectData.title}
                  </h1>

                  <div className="grid grid-cols-[2fr_auto_1fr] gap-8">
                    {/* Project Information Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
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
                            className="flex justify-between text-sm border-b pb-2"
                          >
                            <strong className="text-gray-600">{label}:</strong>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-[1.5px] bg-gray-300 h-full self-stretch"></div>

                    {/* Project Status Section */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Project Status
                      </h2>
                      <div className="space-y-2">
                        {[
                          [
                            "Status",
                            <span key="status" className="text-pink-500">
                              {projectData.status}
                            </span>,
                          ],
                          ["Started", projectData.started],
                          ["Finished", projectData.finished],
                        ].map(([label, value], index) => (
                          <div
                            key={`status-${label}-${index}`}
                            className="flex justify-between text-sm border-b pb-2"
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ProjectDetailsPage;
