"use client";

import {useState, useMemo, useEffect} from "react";
import {useRouter} from "next/navigation";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/lib/firebase";
import PageLayout from "@/components/PageLayout";
import {manualSections} from "@/data/manualSections";
import {Box, CircularProgress} from "@mui/material";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

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

  if (loading || !isAuthenticated) {
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
