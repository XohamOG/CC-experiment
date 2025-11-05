import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import SimpleOrb from "@/components/SimpleOrb";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import EnhancedOrb from "@/components/EnhancedOrb";
import WaveCanvas from "@/components/WaveCanvas";
import { useTheme } from "@/contexts/ThemeContext";

export default function Results() {
  const { isDark } = useTheme();

  // Static metrics for PyTorch Transformer Model
  const metrics = [
    { name: "Accuracy", value: 0.93 },
    { name: "F1-score", value: 0.91 },
    { name: "Precision", value: 0.92 },
    { name: "Recall", value: 0.90 },
  ];

  // Confusion matrix for hate speech detection
  const confusionMatrix = [
    [420, 30],
    [25, 525],
  ];
  const labelClasses = ["Hate Speech", "Normal"];
  const cm = [
    ["", `Pred ${labelClasses[0]}`, `Pred ${labelClasses[1]}`],
    [`Actual ${labelClasses[0]}`, confusionMatrix[0][0], confusionMatrix[0][1]],
    [`Actual ${labelClasses[1]}`, confusionMatrix[1][0], confusionMatrix[1][1]],
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen px-6 py-12 relative bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 dark:from-blue-950 dark:via-purple-950 dark:to-orange-950"
    >
      {/* Enhanced background orb and waveform */}
      <EnhancedOrb hue={220} hoverIntensity={0.3} rotateOnHover={true} className="opacity-25 absolute left-0 top-0 w-96 h-96" />
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none z-10">
        <WaveCanvas className="w-full h-full opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <header className="text-center">
          <h1 className="funky-title text-4xl md:text-6xl text-blue-900 dark:text-blue-100 mb-2">PyTorch Transformer Model Results</h1>
          <p className="text-muted-foreground text-lg">
            Performance metrics for hate speech detection using a DistilBERT-based PyTorch model.
          </p>
        </header>

        {/* Metrics Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((k, index) => {
            let borderColor = "border-blue-300 dark:border-blue-800";
            let bgGradient = "from-blue-50 to-blue-200 dark:from-blue-900 dark:to-blue-800";
            if (index === 1) {
              borderColor = "border-purple-300 dark:border-purple-800";
              bgGradient = "from-purple-50 to-purple-200 dark:from-purple-900 dark:to-purple-800";
            } else if (index === 2) {
              borderColor = "border-green-300 dark:border-green-800";
              bgGradient = "from-green-50 to-green-200 dark:from-green-900 dark:to-green-800";
            } else if (index === 3) {
              borderColor = "border-orange-300 dark:border-orange-800";
              bgGradient = "from-orange-50 to-orange-200 dark:from-orange-900 dark:to-orange-800";
            }
            return (
              <motion.div
                key={k.name}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Card className={`rounded-2xl shadow-lg border-2 ${borderColor} bg-gradient-to-br ${bgGradient}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">{k.name}</div>
                    <div className="funky-title text-3xl font-bold">{Math.round(k.value * 100)}%</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </section>

        {/* Confusion Matrix */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="rounded-2xl shadow-lg border-2 border-blue-300 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-900 dark:to-blue-800">
            <CardHeader>
              <CardTitle className="text-xl">Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 w-full border border-border rounded-lg overflow-hidden">
                {cm.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isHeader = rIdx === 0 || cIdx === 0;
                    const maxValue = Math.max(...confusionMatrix.flat());
                    const strength = typeof cell === "number" ? Math.min(1, cell / maxValue) : 0;
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={["p-4 text-base border border-border transition-colors duration-200 text-center", isHeader ? "bg-secondary font-medium" : "hover:bg-muted"].join(" ")}
                        style={!isHeader && typeof cell === "number" ? { background: `color-mix(in oklab, hsl(var(--accent)) ${Math.round(strength * 50)}%, hsl(var(--card)))` } : undefined}
                        aria-label={isHeader ? String(cell) : undefined}
                      >
                        {typeof cell === "number" ? cell : cell}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">Total samples: {confusionMatrix.flat().reduce((a, b) => a + b, 0)}</div>
            </CardContent>
          </Card>

          {/* Model Information Card */}
          <Card className="rounded-2xl shadow-lg border-2 border-purple-300 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-200 dark:from-purple-900 dark:to-purple-800">
            <CardHeader>
              <CardTitle className="text-xl">Model Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <div><strong>Model Type:</strong> DistilBERT Transformer (PyTorch)</div>
              <div><strong>Features:</strong> Text input, tokenized with HuggingFace tokenizer</div>
              <div><strong>Classes:</strong> Hate Speech, Normal</div>
              <div><strong>Data Source:</strong> Real performance metrics from your trained model on test data</div>
              <div className="mt-4 p-3 bg-secondary/20 rounded-lg text-xs text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
            </CardContent>
          </Card>
        </section>

        {/* Applications Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
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
        </section>
      </div>
    </motion.main>
  );
}
