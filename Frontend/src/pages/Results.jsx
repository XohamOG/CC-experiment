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
import { useState, useEffect } from "react";

export default function Results() {
  const { isDark } = useTheme();
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch model metrics on component mount
  useEffect(() => {
    const fetchModelMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/model-metrics");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setModelData(data);
        } else {
          throw new Error(data.error || "Failed to fetch model metrics");
        }
      } catch (err) {
        console.error("Error fetching model metrics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModelMetrics();
  }, []);

  // Default values while loading or if error
  const defaultMetrics = [
    { name: "Accuracy", value: 0 },
    { name: "F1-score", value: 0 },
    { name: "Precision", value: 0 },
    { name: "Recall", value: 0 },
  ];

  // Use actual metrics if available, otherwise defaults
  const metrics = modelData
    ? [
        { name: "Accuracy", value: modelData.accuracy },
        { name: "F1-score", value: modelData.f1_score },
        { name: "Precision", value: modelData.precision },
        { name: "Recall", value: modelData.recall },
      ]
    : defaultMetrics;

  // Confusion matrix data
  const confusionMatrix = modelData?.confusion_matrix || [
    [0, 0],
    [0, 0],
  ];
  const labelClasses = modelData?.label_classes || ["female", "male"];

  // Format confusion matrix for display
  const cm = [
    ["", `Pred ${labelClasses[0]}`, `Pred ${labelClasses[1]}`],
    [`Actual ${labelClasses[0]}`, confusionMatrix[0][0], confusionMatrix[0][1]],
    [`Actual ${labelClasses[1]}`, confusionMatrix[1][0], confusionMatrix[1][1]],
  ];

  const acc = useCountUp(metrics[0].value, 1200);
  const f1 = useCountUp(metrics[1].value, 1000);
  const prec = useCountUp(metrics[2].value, 950);
  const rec = useCountUp(metrics[3].value, 980);

  if (loading) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen px-6 py-12 relative flex items-center justify-center"
      >
        <SimpleOrb className="opacity-20" />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading model metrics...</p>
        </div>
      </motion.main>
    );
  }

  if (error) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen px-6 py-12 relative flex items-center justify-center"
      >
        <SimpleOrb className="opacity-20" />
        <div className="text-center relative z-10">
          <div className="text-red-500 mb-4">
            ❌ Error loading model metrics
          </div>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen px-6 py-12 relative"
    >
      {/* Background orb */}
      <SimpleOrb className="opacity-20" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <header>
          <h1 className="funky-title text-3xl md:text-5xl">Model Results</h1>
          <p className="text-muted-foreground mt-2">
            Performance metrics from your trained voice gender recognition
            model.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Accuracy", v: acc },
            { label: "F1-score", v: f1 },
            { label: "Precision", v: prec },
            { label: "Recall", v: rec },
          ].map((k, index) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Card className="card-pop hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className="funky-title text-2xl mt-1">
                    {Math.round(k.v * 100)}%
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-pop">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDark ? '#333333' : '#e5e7eb'} 
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke={isDark ? '#ffffff' : '#6b7280'}
                    fontSize={12}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tickFormatter={(v) => `${Math.round(v * 100)}%`}
                    stroke={isDark ? '#ffffff' : '#6b7280'}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(v) => `${Math.round(v * 100)}%`}
                    contentStyle={{
                      backgroundColor: isDark ? '#000000' : '#ffffff',
                      border: `1px solid ${isDark ? '#333333' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: isDark ? '#ffffff' : '#111827'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={isDark ? '#ffffff' : '#8b5a2b'}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-pop">
            <CardHeader>
              <CardTitle>Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 w-full border border-border rounded-lg overflow-hidden">
                {cm.map((row, rIdx) =>
                  row.map((cell, cIdx) => {
                    const isHeader = rIdx === 0 || cIdx === 0;
                    const maxValue = Math.max(...confusionMatrix.flat());
                    const strength =
                      typeof cell === "number"
                        ? Math.min(1, cell / maxValue)
                        : 0;
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={[
                          "p-3 text-sm md:text-base border border-border transition-colors duration-200 text-center",
                          isHeader
                            ? "bg-secondary font-medium"
                            : "hover:bg-muted",
                        ].join(" ")}
                        style={
                          !isHeader && typeof cell === "number"
                            ? {
                                background: `color-mix(in oklab, hsl(var(--accent)) ${Math.round(
                                  strength * 50
                                )}%, hsl(var(--card)))`,
                              }
                            : undefined
                        }
                        aria-label={isHeader ? String(cell) : undefined}
                      >
                        {typeof cell === "number" ? cell : cell}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Total samples:{" "}
                {confusionMatrix.flat().reduce((a, b) => a + b, 0)}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6">
          {/* Dataset Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card className="card-pop bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    3,168
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Total Samples
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card className="card-pop bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    20
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Audio Features
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card className="card-pop bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    50/50
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Gender Balance
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card className="card-pop bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🗣️</div>
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    1584
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Each Gender
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Dataset Details Card */}
          <Card className="card-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📁</span>
                Dataset Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Source
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Platform:</span>
                      <a
                        href="https://www.kaggle.com/datasets/primaryobjects/voicegender/data"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Kaggle Dataset
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Creator:</span>
                      <span className="text-sm text-muted-foreground">
                        primaryobjects
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Type:</span>
                      <span className="text-sm text-muted-foreground">
                        Voice Gender Recognition
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Composition
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Male Samples:</span>
                      <span className="text-sm text-muted-foreground">
                        1,584 (50%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Female Samples:
                      </span>
                      <span className="text-sm text-muted-foreground">
                        1,584 (50%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Total Features:
                      </span>
                      <span className="text-sm text-muted-foreground">
                        20 audio properties
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Audio Features
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {[
                    "meanfreq",
                    "sd",
                    "median",
                    "Q25",
                    "Q75",
                    "IQR",
                    "skew",
                    "kurt",
                    "sp.ent",
                    "sfm",
                    "mode",
                    "centroid",
                    "meanfun",
                    "minfun",
                    "maxfun",
                    "meandom",
                    "mindom",
                    "maxdom",
                    "dfrange",
                    "modindx",
                  ].map((feature, index) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-center"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  This dataset contains preprocessed acoustic properties
                  extracted from voice recordings for gender classification.
                  Features include frequency characteristics, spectral
                  properties, and harmonic measures that help distinguish
                  between male and female voices.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-pop">
            <CardHeader>
              <CardTitle>Model Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>
                <strong>Model Type:</strong> Trained ML Pipeline with Feature
                Scaling and PCA
              </div>
              <div>
                <strong>Features:</strong> 20 audio features extracted from
                voice recordings
              </div>
              <div>
                <strong>Classes:</strong> {labelClasses.join(", ")}
              </div>
              <div>
                <strong>Data Source:</strong> Real performance metrics from your
                trained model on test data
              </div>
              {modelData && (
                <div className="mt-4 p-3 bg-secondary/20 rounded-lg">
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date().toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </motion.main>
  );
}
