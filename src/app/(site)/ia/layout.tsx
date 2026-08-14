import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence artificielle — BuildNivo",
  description: "Dictée terrain transformée en actions, rapports générés, lecture documentaire sourcée, relances préparées — toujours validées par un humain.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
