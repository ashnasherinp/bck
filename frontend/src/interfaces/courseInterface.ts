


// frontend/src/interfaces/courseInterface.ts


export interface Category {
    _id: string; 
    name: string;
    description?: string;
    discountPercentage?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface IFrontendPopulatedUser {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    categoryId: Category; 
    creatorId: IFrontendPopulatedUser;
    level: string;
    price: number;
    discountPrice?: number;
    effectivePrice?: number;
    imageUrl?: string;
    isApproved: boolean;
    enrolledUsers: string[];
    createdAt: string;
    updatedAt: string;
}

export interface IFrontendCreateCourseData {
    title: string;
    description: string;
    categoryId: string; 
    creatorId: string;
    level: string;
    price: number;
    discountPrice?: number;
    imageUrl?: string;
    isApproved?: boolean;
}