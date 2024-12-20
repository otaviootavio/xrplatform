import { Prisma, deployments } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema Zod para validação de inputs
const PaginationSchema = z.object({
  page: z.number().int().positive(),
  perPage: z.number().int().positive().max(100),
});

const DeploymentFilterSchema = z.object({
  serviceName: z.string().optional(),
  clientId: z.string().optional(),
  status: z.string().optional(),
  createdAfter: z.date().optional(),
  createdBefore: z.date().optional(),
});

const DeploymentSortSchema = z.object({
  field: z.enum(['created_at', 'service_name', 'client_id', 'status']),
  direction: z.enum(['asc', 'desc']),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;
export type DeploymentFilter = z.infer<typeof DeploymentFilterSchema>;
export type DeploymentSort = z.infer<typeof DeploymentSortSchema>;

export interface PaginatedResult<T> {
  data: T[];
  metadata: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class DeployDB {
  private buildWhereClause(filters?: DeploymentFilter): Prisma.deploymentsWhereInput {
    if (!filters) return {};

    return {
      AND: [
        filters.serviceName ? { service_name: { contains: filters.serviceName } } : {},
        filters.clientId ? { client_id: { contains: filters.clientId } } : {},
        filters.status ? { status: { equals: filters.status } } : {},
        filters.createdAfter ? { created_at: { gte: filters.createdAfter } } : {},
        filters.createdBefore ? { created_at: { lte: filters.createdBefore } } : {},
      ],
    };
  }

  private buildOrderByClause(sort?: DeploymentSort): Prisma.deploymentsOrderByWithRelationInput {
    if (!sort) return { created_at: 'desc' };

    const field = sort.field === 'created_at' ? 'created_at' :
                 sort.field === 'service_name' ? 'service_name' :
                 sort.field === 'client_id' ? 'client_id' : 'status';

    return { [field]: sort.direction };
  }

  async findById(id: number): Promise<deployments | null> {
    const idSchema = z.number().int().positive();
    const validatedId = idSchema.parse(id);

    return prisma.deployments.findUnique({
      where: { id: validatedId },
    });
  }

  async findByServiceName(serviceName: string): Promise<deployments | null> {
    const serviceNameSchema = z.string().min(1);
    const validatedServiceName = serviceNameSchema.parse(serviceName);

    return prisma.deployments.findUnique({
      where: { service_name: validatedServiceName },
    });
  }

  async findAll(
    pagination: PaginationParams,
    filters?: DeploymentFilter,
    sort?: DeploymentSort
  ): Promise<PaginatedResult<deployments>> {
    const validatedPagination = PaginationSchema.parse(pagination);
    const validatedFilters = filters ? DeploymentFilterSchema.parse(filters) : undefined;
    const validatedSort = sort ? DeploymentSortSchema.parse(sort) : undefined;

    const skip = (validatedPagination.page - 1) * validatedPagination.perPage;
    const where = this.buildWhereClause(validatedFilters);
    const orderBy = this.buildOrderByClause(validatedSort);

    const [total, items] = await Promise.all([
      prisma.deployments.count({ where }),
      prisma.deployments.findMany({
        where,
        orderBy,
        skip,
        take: validatedPagination.perPage,
      }),
    ]);

    const totalPages = Math.ceil(total / validatedPagination.perPage);

    return {
      data: items,
      metadata: {
        currentPage: validatedPagination.page,
        perPage: validatedPagination.perPage,
        totalItems: total,
        totalPages,
        hasNextPage: validatedPagination.page < totalPages,
        hasPreviousPage: validatedPagination.page > 1,
      },
    };
  }

  async findByClientId(
    clientId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<deployments>> {
    return this.findAll(
      pagination,
      { clientId },
      { field: 'created_at', direction: 'desc' }
    );
  }
}

export const deployDB = new DeployDB();
