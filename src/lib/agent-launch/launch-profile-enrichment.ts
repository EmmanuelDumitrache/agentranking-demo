export type LaunchProfileServiceInput = {
  name: string;
  endpoint: string;
  version?: string;
};

export type LaunchProfileEnrichmentFields = {
  website: string;
  github: string;
  archetype: string;
  capabilityTags: string[];
  services: LaunchProfileServiceInput[];
};
