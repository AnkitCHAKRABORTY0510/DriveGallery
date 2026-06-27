export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  gallery: unknown[]; // To be updated when Gallery module is built
  collections: unknown[]; // To be updated when Collections module is built
  featured: unknown[]; // To be updated when Photos module is built
}

export interface UserSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
}
