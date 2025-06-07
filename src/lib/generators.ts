import { faker } from '@faker-js/faker';
import { InsertClient } from '@shared/schema';

/**
 * Generate a single random client
 * @param userId - The user ID to associate the client with
 * @returns A randomly generated client
 */
export function generateRandomClient(userId: number): InsertClient {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const phone = `+1${faker.string.numeric(10)}`; // Format as E.164
  
  const tagCount = faker.number.int({ min: 0, max: 3 });
  const tags: string[] = [];
  const allTags = ['VIP', 'Lead', 'Customer', 'Prospect', 'Inactive', 'New', 'Returning'];
  
  for (let i = 0; i < tagCount; i++) {
    const randomTag = allTags[faker.number.int({ min: 0, max: allTags.length - 1 })];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }
  
  return {
    userId,
    firstName,
    lastName,
    phone,
    email: faker.helpers.maybe(() => faker.internet.email({ firstName, lastName }), { probability: 0.7 }),
    tags: tags.length > 0 ? tags : null,
    notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.5 }),
  };
}

/**
 * Generate multiple random clients
 * @param userId - The user ID to associate the clients with
 * @param count - The number of clients to generate
 * @returns An array of randomly generated clients
 */
export function generateRandomClients(userId: number, count: number): InsertClient[] {
  const clients: InsertClient[] = [];
  
  for (let i = 0; i < count; i++) {
    clients.push(generateRandomClient(userId));
  }
  
  return clients;
}