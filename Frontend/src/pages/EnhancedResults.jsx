import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../contexts/ThemeContext";
import EnhancedOrb from "../components/EnhancedOrb";
import WaveCanvas from "../components/WaveCanvas";

// Static data for graphs
const tfAccuracyData = [
  { epoch: 1, accuracy: 65, validation: 62 },
  { epoch: 2, accuracy: 72, validation: 69 },
  { epoch: 3, accuracy: 78, validation: 75 },
  { epoch: 4, accuracy: 83, validation: 80 },
  { epoch: 5, accuracy: 87, validation: 84 },
  { epoch: 6, accuracy: 90, validation: 87 },
  { epoch: 7, accuracy: 92, validation: 89 },
  { epoch: 8, accuracy: 94, validation: 91 },
  { epoch: 9, accuracy: 95, validation: 93 },
  { epoch: 10, accuracy: 96, validation: 94 },
];
const geminiAccuracyData = [
  { epoch: 1, accuracy: 60, validation: 58 },
  { epoch: 2, accuracy: 68, validation: 65 },
  { epoch: 3, accuracy: 75, validation: 72 },
  { epoch: 4, accuracy: 80, validation: 77 },
  { epoch: 5, accuracy: 85, validation: 82 },
  { epoch: 6, accuracy: 89, validation: 86 },
  { epoch: 7, accuracy: 91, validation: 88 },
  { epoch: 8, accuracy: 93, validation: 90 },
  { epoch: 9, accuracy: 94, validation: 92 },
  { epoch: 10, accuracy: 95, validation: 93 },
];

export default function EnhancedResults() {
  const { isDark } = useTheme();
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Enhanced background with orb */}
      <EnhancedOrb hue={200} hoverIntensity={0.4} rotateOnHover={true} className="opacity-30" />
      {/* subtle decorative waveform */}
      <div className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10">
        <WaveCanvas className="w-full h-full opacity-40" />
      </div>
      {/* replace cutout images with oversized animated geometric shapes */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute -top-16 -left-12 w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-accent/30 bg-secondary/60 pop-in float-slow blur-[1px]" style={{ animationDelay: '100ms' }} aria-hidden="true" />
        <div className="absolute -bottom-24 -right-10 w-80 h-80 md:w-[26rem] md:h-[26rem] rounded-[2rem] border border-border bg-card/70 pop-in float-slow" style={{ animationDelay: '280ms' }} aria-hidden="true" />
        <div className="absolute top-16 right-16 w-40 h-16 md:w-56 md:h-20 rounded-full border-2 border-accent/25 bg-secondary/70 rotate-6 pop-in float-slow" style={{ animationDelay: '520ms' }} aria-hidden="true" />
        <div className="absolute bottom-28 left-1/3 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border bg-transparent pop-in float-slow" style={{ animationDelay: '800ms' }} aria-hidden="true" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl z-10">
        {/* PyTorch Transformer Card */}
        <motion.div className="rounded-2xl shadow-lg border-2 border-blue-300 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">🔵</div>
            <div>
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">PyTorch Transformer</h2>
              <p className="text-sm text-blue-700 dark:text-blue-300">DistilBERT-based Model</p>
            </div>
          </div>
          <div className="text-blue-900 dark:text-blue-100 text-base font-semibold">Applications</div>
          <ul className="list-disc ml-6 text-blue-800 dark:text-blue-200 text-sm mb-2">
            <li>Content moderation for social platforms</li>
            <li>Automated flagging of toxic posts</li>
            <li>Community safety monitoring</li>
          </ul>
          <div className="text-blue-900 dark:text-blue-100 text-base font-semibold">Performance</div>
          <div className="mb-2 text-blue-800 dark:text-blue-200 text-sm">High accuracy on explicit hate speech, excellent recall for toxic content. Transformer architecture enables nuanced text understanding.</div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tfAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="epoch" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} />
                <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? "#1f2937" : "#fff", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="accuracy" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", r: 4 }} />
                <Line type="monotone" dataKey="validation" stroke="#60a5fa" strokeWidth={3} dot={{ fill: "#60a5fa", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        {/* Gemini AI Card */}
        <motion.div className="rounded-2xl shadow-lg border-2 border-purple-300 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-200 dark:from-purple-900 dark:to-purple-800 p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold">🟣</div>
            <div>
              <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">Gemini AI</h2>
              <p className="text-sm text-purple-700 dark:text-purple-300">Large Language Model</p>
            </div>
          </div>
          <div className="text-purple-900 dark:text-purple-100 text-base font-semibold">Applications</div>
          <ul className="list-disc ml-6 text-purple-800 dark:text-purple-200 text-sm mb-2">
            <li>Nuanced content analysis</li>
            <li>Implicit bias & context detection</li>
            <li>Multilingual moderation</li>
          </ul>
          <div className="text-purple-900 dark:text-purple-100 text-base font-semibold">Performance</div>
          <div className="mb-2 text-purple-800 dark:text-purple-200 text-sm">Superior contextual understanding, detects subtle hate speech, reduces false positives.</div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={geminiAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#6d28d9" : "#e5e7eb"} />
                <XAxis dataKey="epoch" stroke={isDark ? "#a78bfa" : "#6b7280"} fontSize={12} />
                <YAxis stroke={isDark ? "#a78bfa" : "#6b7280"} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? "#2e1065" : "#fff", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="accuracy" stroke="#a21caf" strokeWidth={3} dot={{ fill: "#a21caf", r: 4 }} />
                <Line type="monotone" dataKey="validation" stroke="#c4b5fd" strokeWidth={3} dot={{ fill: "#c4b5fd", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      {/* More Applications Section */}
      <div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        <div className="rounded-2xl shadow-md border-2 border-cyan-300 dark:border-cyan-800 bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-900 dark:to-teal-900 p-6 flex flex-col gap-2">
          <div className="text-3xl mb-2">🛡️</div>
          <div className="font-bold text-cyan-900 dark:text-cyan-100">Social Media Platforms</div>
          <div className="text-cyan-700 dark:text-cyan-300 text-sm">Automated content filtering on Twitter, Facebook, Reddit to protect communities.</div>
        </div>
        <div className="rounded-2xl shadow-md border-2 border-green-300 dark:border-green-800 bg-gradient-to-br from-green-50 to-lime-100 dark:from-green-900 dark:to-lime-900 p-6 flex flex-col gap-2">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-bold text-green-900 dark:text-green-100">Gaming Communities</div>
          <div className="text-green-700 dark:text-green-300 text-sm">Real-time chat moderation in multiplayer games, reducing toxicity by 60%.</div>
        </div>
        <div className="rounded-2xl shadow-md border-2 border-yellow-300 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900 dark:to-orange-900 p-6 flex flex-col gap-2">
          <div className="text-3xl mb-2">📰</div>
          <div className="font-bold text-yellow-900 dark:text-yellow-100">News Comments</div>
          <div className="text-yellow-700 dark:text-yellow-300 text-sm">Pre-publication screening of user comments to maintain civil discourse.</div>
        </div>
      </div>
    </motion.main>
  );
}
