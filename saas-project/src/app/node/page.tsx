"use client";

import { useState, useEffect } from "react";
import { getClientDeployments, createDeployment } from "@/proxy";
import type { deployments } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, CheckCircle2 } from "lucide-react";
import { DeployCard } from "../_components/DeployCard";
import { formatDistanceToNow } from "date-fns";
import { Suspense } from "react";

export const maxDuration = 60;

interface DeploymentCardProps {
  deployment: deployments;
  isSelected: boolean;
  onSelect: (deployment: deployments) => void;
}

interface DeploymentDetailsProps {
  deployment: deployments;
}

interface CopyTextDisplayProps {
  label: string;
  value: string;
  className?: string;
}

interface SecureDisplayProps extends CopyTextDisplayProps {
  initiallyVisible?: boolean;
}

function fixUrl(url: string): string {
  if (url.startsWith("https:") && !url.startsWith("https://")) {
    return url.replace("https:", "https://");
  }
  return url;
}

const CopyTextDisplay = ({ label, value, className }: CopyTextDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <Card className="relative border-border">
        <CardContent className="p-3 pr-24 flex items-center">
          <span className="text-sm text-muted-foreground truncate">
            {value}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 hover:bg-primary/5"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy {label}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const SecureDisplay = ({
  label,
  value,
  className,
  initiallyVisible = false,
}: SecureDisplayProps) => {
  const [isVisible, setIsVisible] = useState(initiallyVisible);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className={className}>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <Card className="relative border-border">
        <CardContent className="p-3 pr-24 flex items-center">
          <span className="text-sm text-muted-foreground truncate">
            {isVisible ? value : "•".repeat(Math.min(value.length, 40))}
          </span>
          <div className="absolute right-2 flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-primary/5"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isVisible ? "Hide" : "Show"} {label}
              </span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-primary/5"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy {label}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DeploymentCard = ({
  deployment,
  isSelected,
  onSelect,
}: DeploymentCardProps) => (
  <Card
    className={`p-4 cursor-pointer transition-all duration-200 border-border
      ${
        isSelected
          ? "bg-primary/5 border-primary/30"
          : "hover:border-primary/30"
      }`}
    onClick={() => onSelect(deployment)}
  >
    <CardHeader className="p-0">
      <CardTitle className="text-lg">
        {deployment.service_name ?? `Deployment ${deployment.id}`}
      </CardTitle>
      {deployment.created_at && (
        <p className="text-sm text-muted-foreground">
          Created {formatDistanceToNow(new Date(deployment.created_at))} ago
        </p>
      )}
    </CardHeader>
    <CardContent className="p-0 mt-2">
      <Badge
        variant={deployment.status === "RUNNING" ? "default" : "destructive"}
      >
        {deployment.status ?? "Unknown"}
      </Badge>
    </CardContent>
  </Card>
);

const DeploymentDetails = ({ deployment }: DeploymentDetailsProps) => {
  console.log(deployment);
  const baseUrl = deployment.rpc_endpoint?.replace("//", "").split("/")[0];
  const swaggerUrl = `${baseUrl}/apidocs`;

  return (
    <Card className="w-full mt-8 border-border">
      <CardHeader>
        <CardTitle>
          Manage Deployment:{" "}
          {deployment.service_name ?? `Deployment ${deployment.id}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CopyTextDisplay label="URL" value={deployment.rpc_endpoint ?? "N/A"} />

        <SecureDisplay
          label="Access Token (JWT)"
          value={deployment.access_token ?? "N/A"}
        />

        <div>
          <Label className="text-sm font-medium mb-2 block">Created At</Label>
          <Card className="relative border-border">
            <CardContent className="p-3">
              <span className="text-sm text-muted-foreground">
                {deployment.created_at
                  ? new Date(deployment.created_at).toTimeString()
                  : "N/A"}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full md:w-auto flex items-center gap-2"
            asChild
          >
            <a href={fixUrl(swaggerUrl)} target={"_blank"} rel={"noreferrer"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              View API Documentation
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function DeploymentsLoading() {
  return <div className="animate-pulse space-y-4">
    <div className="h-24 bg-primary/5 rounded-lg"></div>
    <div className="h-24 bg-primary/5 rounded-lg"></div>
  </div>;
}

function DeploymentsList({ 
  deployments,
}: { 
  deployments: deployments[] 
}) {
  const [selectedDeployment, setSelectedDeployment] = useState<deployments | null>(null);

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Your Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          {deployments.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No deployments available. Deploy your first node now!
            </p>
          ) : (
            <div className="space-y-4">
              {deployments.map((deployment) => (
                <DeploymentCard
                  key={deployment.id}
                  deployment={deployment}
                  isSelected={selectedDeployment?.id === deployment.id}
                  onSelect={setSelectedDeployment}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDeployment && (
        <DeploymentDetails deployment={selectedDeployment} />
      )}
    </>
  );
}

export default function NodePage() {
  const [deploying, setDeploying] = useState(false);
  const [deployments, setDeployments] = useState<deployments[]>([]);

  const fetchDeployments = async () => {
    try {
      const fetchedDeployments = await getClientDeployments();
      const formattedDeployments = fetchedDeployments.map((deployment) => ({
        ...deployment,
        created_at: deployment.created_at ? new Date(deployment.created_at) : null,
      }));
      setDeployments(formattedDeployments);
    } catch (err) {
      console.error("Error fetching deployments:", err);
      throw new Error("Failed to load deployments.");
    }
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  async function handleDeployNewNode() {
    if (deploying) return;
    
    try {
      setDeploying(true);
      console.log('Starting deployment in NodePage...');
      await createDeployment();
      console.log('Deployment created successfully');
      await fetchDeployments(); // Refresh the list after successful deployment
      return Promise.resolve();
    } catch (err) {
      console.error("Error creating deployment:", err);
      return Promise.reject(err);
    } finally {
      setDeploying(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="w-full max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-center my-10">
          <DeployCard
            onDeployComplete={fetchDeployments}
            onDeployStart={handleDeployNewNode}
          />
        </div>

        <Suspense fallback={<DeploymentsLoading />}>
          <DeploymentsList deployments={deployments} />
        </Suspense>
      </main>
    </div>
  );
}