"use client";

import {useState, useMemo} from "react";
import PageLayout from "@/components/PageLayout";
import {manualSections} from "@/data/manualSections";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchTerm) return manualSections;

    const lowerTerm = searchTerm.toLowerCase();
    return manualSections.filter((section) => {
      const titleMatch = section.title.toLowerCase().includes(lowerTerm);
      const contentText = section.content.replace(/<[^>]+>/g, "").toLowerCase();
      const contentMatch = contentText.includes(lowerTerm);

      return titleMatch || contentMatch;
    });
  }, [searchTerm]);

  return (
    <PageLayout
      sections={filteredSections}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
    />
  );
}
