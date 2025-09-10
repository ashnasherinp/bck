

// import { Request, Response, NextFunction } from 'express';
// import { IUser, UserRole } from '../interfaces/userInterface';

// export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
//  const user = req.user as IUser; 
//  
//  console.log('[adminMiddleware] Checking user role:', user ? { email: user.email, role: user.role } : 'No user');
//  if (!user || user.role !== UserRole.Admin) {
//     console.log('[adminMiddleware] Access denied, role:', user?.role || 'undefined');
//     res.status(403).json({ message: 'Admin access required' });
//     return;
//   }
//   console.log('[adminMiddleware] Admin access granted for user:', user.email);
//   next();
// };

// import { Request, Response, NextFunction } from 'express';
// import { IUser, UserRole } from '../interfaces/userInterface';

// export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
//   // const user = req.user as IUser;
//   const user = req.user; 

//   console.log('[adminMiddleware] Checking user role:', user ? { email: user.email, role: user.role } : 'No user');
//   if (!user || user.role !== UserRole.Admin) {
//     console.log('[adminMiddleware] Access denied, role:', user?.role || 'undefined');
//     res.status(403).json({ message: 'Admin access required' });
//     return;
//   }
//   console.log('[adminMiddleware] Admin access granted for user:', user.email);
//   next();
// };


// backend/src/middleware/adminMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { IUser, UserRole } from '../interfaces/userInterface';
import AppError from '../utils/appError';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
    const user = req.user as IUser; 

    console.log('[adminMiddleware] Checking user role:', user ? { email: user.email, role: user.role } : 'No user');

    if (!user || user.role !== UserRole.Admin) {
        console.log('[adminMiddleware] Access denied, role:', user?.role || 'undefined');
        return next(new AppError('Admin access required', 403));
        // res.status(403).json({ message: 'Admin access required' });
        // return;
    }

    console.log('[adminMiddleware] Admin access granted for user:', user.email);
    next();
};