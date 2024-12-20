// app/actions/deployment-actions.ts
"use server";

import { deployDB } from "@/repositories/deploy-db";
import { dockerFactory } from "@/repositories/docker-factory";
import { currentUser } from "@clerk/nextjs/server";

function normalizeEmail(email: string): string {
  return email
    // Convert to lowercase first
    .toLowerCase()
    // Replace special characters with hyphens
    .replace(/[^a-z0-9.]+/g, '-')
    // Replace consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Replace periods and underscores with hyphens for consistency
    .replace(/[._]/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Ensure the string isn't empty
    || 'empty';
}

export async function createDeployment() {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      throw new Error("Email do usuário não encontrado.");
    }

    const normalizedEmail = normalizeEmail(email);
    
    // Check existing deployments count
    const deployments = await deployDB.findByClientId(normalizedEmail, {
      page: 1,
      perPage: 100
    });
    
    if (deployments.data.length >= 3) {
      throw new Error("Maximum limit of 3 nodes reached.");
    }
    
    // Cria deployment via Docker Factory
    const deploymentId = await dockerFactory.createDeployment({
      client_id: normalizedEmail
    });

    return deploymentId;

  } catch (error) {
    console.error("Erro ao criar deployment:", error);
    throw error;
  }
}

export async function getClientDeployments() {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      throw new Error("Usuário não autenticado ou sem email válido.");
    }

    const normalizedEmail = normalizeEmail(email);
    
    // Usa o DeployDB mas retorna apenas os itens para manter compatibilidade
    const result = await deployDB.findByClientId(normalizedEmail, { 
      page: 1, 
      perPage: 100 // Mantém comportamento atual sem paginação
    });

    return result.data;

  } catch (error) {
    console.error("Erro ao buscar deployments:", error);
    throw new Error("Erro ao buscar deployments do banco de dados.");
  }
}