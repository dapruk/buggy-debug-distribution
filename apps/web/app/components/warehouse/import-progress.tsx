import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function ImportProgress() {
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (isImporting && progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => Math.min(prev + 10, 100));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isImporting, progress]);

  const startImport = () => {
    setIsImporting(true);
    setProgress(0);
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <CardHeader>
        <CardTitle>Import Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-secondary h-4 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">{progress}% Complete</span>
          <Button onClick={startImport} disabled={isImporting && progress < 100}>
            {progress === 100 ? "Done" : isImporting ? "Importing..." : "Start Import"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
