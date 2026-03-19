"use client";

import {useState, useMemo, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks";
import PageLayout from "@/components/PageLayout";
import {manualSections} from "@/data/manualSections";
import {Box, CircularProgress} from "@mui/material";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const {user, loading} = useAuth();

  useEffect(() => {
    // Se já terminou de carregar e não há usuário, redireciona para login
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  if (loading || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#050505",
        }}
      >
        <CircularProgress sx={{color: "#00e5ff"}} />
      </Box>
    );
  }

  return (
    <PageLayout
      sections={filteredSections}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
    />
  );
}
