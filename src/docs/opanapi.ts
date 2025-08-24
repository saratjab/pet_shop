import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { registerUserDocs } from './userDoc';
import { registerPetDocs } from './petDoc';
import { registerAdoptDocs } from './adoptDoc';

export const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

registerUserDocs(registry);
registerPetDocs(registry);
registerAdoptDocs(registry);
