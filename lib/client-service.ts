import { prisma } from './prisma';

interface ContactFormData {
  fullname: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
  requirements?: string;
}

/**
 * Create or update a client when contact form is submitted
 * - If client exists (by email): Create new project
 * - If new client: Create client, category, and first project
 */
export async function createOrUpdateClient(contactData: ContactFormData, contactId: string) {
  try {
    // Check if client already exists
    const client = await prisma.client.findUnique({
      where: { email: contactData.email },
      include: { projects: true },
    });

    if (client) {
      // Existing client - create new project
      const project = await prisma.project.create({
        data: {
          clientId: client.id,
          contactId: contactId,
          projectType: contactData.projectType,
          timeline: contactData.timeline,
          budget: contactData.budget,
          message: contactData.message,
          requirements: contactData.requirements || null,
          status: 'inquiry',
        },
      });

      // Update contact with clientId
      await prisma.contact.update({
        where: { id: contactId },
        data: { clientId: client.id },
      });

      console.log(`✅ Added new project for existing client: ${client.email}`);
      return { client, project, isNewClient: false };
    } else {
      // New client - create client, category, and project in transaction
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create client
        const newClient = await tx.client.create({
          data: {
            email: contactData.email,
            fullname: contactData.fullname,
            status: 'lead',
          },
        });

        // 2. Create client category with inferred budget tier
        const budgetTier = contactData.budget; // xs, sm, md, lg
        await tx.clientCategory.create({
          data: {
            clientId: newClient.id,
            budgetTier: budgetTier,
            projectStage: 'inquiry',
            priority: budgetTier === 'lg' || budgetTier === 'md' ? 'high' : 'medium',
          },
        });

        // 3. Create first project
        const newProject = await tx.project.create({
          data: {
            clientId: newClient.id,
            contactId: contactId,
            projectType: contactData.projectType,
            timeline: contactData.timeline,
            budget: contactData.budget,
            message: contactData.message,
            requirements: contactData.requirements || null,
            status: 'inquiry',
          },
        });

        // 4. Update contact with clientId
        await tx.contact.update({
          where: { id: contactId },
          data: { clientId: newClient.id },
        });

        // 5. Add auto-tags based on project type
        const autoTags = getAutoTags(contactData);
        if (autoTags.length > 0) {
          await tx.clientTag.createMany({
            data: autoTags.map(tag => ({
              clientId: newClient.id,
              tag,
            })),
          });
        }

        return { client: newClient, project: newProject };
      });

      console.log(`✅ Created new client: ${contactData.email}`);
      return { ...result, isNewClient: true };
    }
  } catch (error) {
    console.error('❌ Error in createOrUpdateClient:', error);
    throw error;
  }
}

/**
 * Generate auto-tags based on contact form data
 */
export function getAutoTags(data: ContactFormData): string[] {
  const tags: string[] = [];

  // Budget-based tags
  if (data.budget === 'lg') tags.push('high-budget', 'enterprise');
  if (data.budget === 'xs') tags.push('budget-conscious');

  // Timeline-based tags
  if (data.timeline === '1m') tags.push('urgent');
  if (data.timeline === '6+') tags.push('long-term');

  // Project type-based tags
  const projectTags: { [key: string]: string[] } = {
    'ai': ['ai-ml', 'technical', 'cutting-edge'],
    'aweb': ['web-development', 'technical'],
    'app': ['mobile', 'technical'],
    'desktop': ['desktop-app', 'technical'],
    'ui': ['design', 'creative'],
    'logo': ['design', 'branding', 'creative'],
    'branding': ['branding', 'creative'],
  };

  const typeTagsArray = projectTags[data.projectType] || [];
  tags.push(...typeTagsArray);

  // Requirements-based tags
  if (data.requirements && data.requirements.length > 200) {
    tags.push('detailed-requirements');
  }

  return Array.from(new Set(tags)); // Remove duplicates
}

/**
 * Get client by ID with all relations
 */
export async function getClientById(clientId: string) {
  return await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      projects: {
        include: { contact: true },
        orderBy: { createdAt: 'desc' },
      },
      tags: true,
      categories: true,
      contacts: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

/**
 * Get all clients with filters
 */
export async function getClients(filters?: {
  status?: string;
  budgetTier?: string;
  tags?: string[];
  search?: string;
}) {
  try {
    const where: Record<string, unknown> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { fullname: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.budgetTier) {
      where.categories = {
        is: {
          budgetTier: filters.budgetTier,
        }
      };
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        some: {
          tag: { in: filters.tags },
        },
      };
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        projects: true,
        tags: true,
        categories: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📊 Fetched ${clients.length} clients from database`);
    return clients;
  } catch (error) {
    console.error('❌ Error in getClients:', error);
    throw error;
  }
}

/**
 * Update client information
 */
export async function updateClient(clientId: string, data: Record<string, unknown>) {
  return await prisma.client.update({
    where: { id: clientId },
    data,
  });
}

/**
 * Add tag to client
 */
export async function addClientTag(clientId: string, tag: string) {
  try {
    return await prisma.clientTag.create({
      data: {
        clientId,
        tag: tag.toLowerCase().trim(),
      },
    });
  } catch (error) {
    // Tag might already exist (unique constraint)
    console.log('Tag already exists or error:', error);
    return null;
  }
}

/**
 * Remove tag from client
 */
export async function removeClientTag(clientId: string, tag: string) {
  return await prisma.clientTag.deleteMany({
    where: {
      clientId,
      tag,
    },
  });
}

/**
 * Update client category
 */
export async function updateClientCategory(clientId: string, data: Record<string, unknown>) {
  return await prisma.clientCategory.upsert({
    where: { clientId },
    update: data,
    create: {
      clientId,
      ...data,
    },
  });
}
