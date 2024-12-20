import { env } from '@/utils/env';
import { z } from 'zod';

const DeploymentRequestSchema = z.object({
  client_id: z.string().min(1, "Client ID é obrigatório")
});

export type DockerDeployRequest = z.infer<typeof DeploymentRequestSchema>;

export class DockerFactory {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string
  ) {}

  async createDeployment(data: DockerDeployRequest): Promise<string> {
    const validatedData = DeploymentRequestSchema.parse(data);
    const apiUrl = `${this.baseUrl.replace(/\/+$/, "")}/deployments/`;
    console.log(apiUrl);

    console.log('Request payload:', validatedData);
    console.log('API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
        Accept: "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na Docker Factory:", errorData);
      throw new Error("Erro ao criar deployment no Docker Factory.");
    }

    return response.text();
  }
}

export const dockerFactory = new DockerFactory(
  env.api.url,
  env.api.key
);