// DeployCard.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle, AlertCircle, RefreshCcw, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DeployCardProps {
  onDeployComplete: () => void;
  onDeployStart: () => Promise<void>;
}

type DeploymentState = 'idle' | 'deploying' | 'success' | 'error';

export const DeployCard = ({ onDeployComplete, onDeployStart }: DeployCardProps) => {
  const [state, setState] = useState<DeploymentState>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | undefined;
    let deploymentTimeout: NodeJS.Timeout | undefined;

    if (state === 'deploying') {
      // Reset progress when starting
      setProgress(0);
      
      const incrementInterval = 100;
      const totalIncrements = 60 * (1000 / incrementInterval);
      const incrementAmount = 100 / totalIncrements;

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return Math.min(prev + incrementAmount, 100);
        });
      }, incrementInterval);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (deploymentTimeout) clearTimeout(deploymentTimeout);
    };
  }, [state]);

  const handleDeploy = async () => {
    try {
      console.log('Starting deployment...'); // Debug log
      setState('deploying');
      setError(null);
      
      await onDeployStart();
      console.log('Deployment successful'); // Debug log
      
      setState('success');
      setProgress(100);
      
      // Show success state for 2 seconds before completing
      setTimeout(() => {
        handleDeploymentComplete();
      }, 5000);
    } catch (err) {
      console.error('Deployment error:', err);
      
      let errorMessage = 'An unexpected error occurred during deployment';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err && 'detail' in err) {
        errorMessage = String(err.detail);
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      setState('error');
      setProgress(0);
    }
  };

  const handleRetry = () => {
    handleDeploy();
  };

  const handleDeploymentComplete = () => {
    setState('idle');
    setProgress(0);
    onDeployComplete();
  };

  const getDeploymentStage = () => {
    if (progress < 33) return "Initializing resources...";
    if (progress < 66) return "Configuring node...";
    return "Finalizing deployment...";
  };

  return (
    <Card className="w-full max-w-md bg-card/95 backdrop-blur border-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {state === 'deploying' ? "Deploying Your Node" : 
           state === 'success' ? "Deployment Successful" :
           state === 'error' ? "Deployment Failed" :
           "Deploy New Node"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {state === 'error' && (
          <div className="space-y-4">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Deployment Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setState('idle');
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry Deployment
              </Button>
            </div>
          </div>
        )}
        
        {state === 'success' && (
          <Alert variant='success' className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your node has been successfully deployed!
            </AlertDescription>
          </Alert>
        )}
        
        {state === 'deploying' && (
          <div className="space-y-6">
            <div className="w-full bg-primary/10 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span className="text-sm">{getDeploymentStage()}</span>
            </div>
          </div>
        )}
        
        {state === 'idle' && (
          <div className="flex flex-col items-center space-y-4">
            <Button
              size="lg"
              onClick={() => void handleDeploy()}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground
                px-8 py-6 rounded-full shadow-lg text-lg font-medium 
                transition-all duration-200 hover:shadow-xl hover:scale-105"
            >
              Deploy New Node
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
