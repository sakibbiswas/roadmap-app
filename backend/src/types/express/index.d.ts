// // src/types/express/index.d.ts
// import 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: { id: string };
//     }
//   }
// }

// types/express/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

