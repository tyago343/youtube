// Mock uuid module globally for Jest
jest.mock('uuid', () => ({
  validate: (id: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  },
  v4: jest.requireActual('crypto').randomUUID as unknown as () => string, // eslint-disable-line @typescript-eslint/no-unsafe-member-access
}));
