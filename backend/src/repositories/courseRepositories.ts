

// import { Types, Document, Query } from 'mongoose';
// import { CourseModel } from '../models/courseModel';
// import { ICourseRepository } from '../interfaces/courseRepositoryInterface';
// import { ICourseBase, ICoursePopulated, ICourse } from '../interfaces/courseInterface';
// import { ICourseCategoryPopulated } from '../interfaces/courseCategoryInterface';
// import { IUserPopulated } from '../interfaces/userInterface';


// export class CourseRepository implements ICourseRepository {
//     async create(courseData: Partial<ICourseBase>): Promise<ICourse> {
//         const newCourse = new CourseModel(courseData);
//         return (await newCourse.save()) as ICourse;
//     }

//     private async populateCourse(query: Query<any, any>): Promise<ICoursePopulated | null> {
//         const populatedCourse = await query
//             .populate<{ categoryId: ICourseCategoryPopulated }>('categoryId')
//             .populate<{ creatorId: IUserPopulated }>('creatorId', 'name email profilePicture phone')
//             .lean()
//             .exec();
//         return populatedCourse as ICoursePopulated | null;
//     }

//     private async populateCourses(query: Query<any, any>): Promise<ICoursePopulated[]> {
//         const populatedCourses = await query
//             .populate<{ categoryId: ICourseCategoryPopulated }>('categoryId')
//             .populate<{ creatorId: IUserPopulated }>('creatorId', 'name email profilePicture phone')
//             .lean()
//             .exec();
//         return populatedCourses as ICoursePopulated[];
//     }

//     async findById(id: Types.ObjectId): Promise<ICourse | null> {
//         // This should return the basic, non-populated document
//         return await CourseModel.findById(id).exec() as ICourse | null;
//     }

//     async findByIdPopulated(id: Types.ObjectId): Promise<ICoursePopulated | null> {
//         return this.populateCourse(CourseModel.findById(id));
//     }

//     async findByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]> {
//         return this.populateCourses(CourseModel.find({ creatorId }));
//     }

//     async findApprovedCourses(): Promise<ICoursePopulated[]> {
//         return this.populateCourses(CourseModel.find({ isApproved: true }));
//     }

//     async findNewCourses(): Promise<ICoursePopulated[]> {
//         // Assuming "new" means recently created and approved
//         return this.populateCourses(CourseModel.find({ isApproved: true }).sort({ createdAt: -1 }).limit(10)); // Adjust limit as needed
//     }

//     async findEnrolledCourses(userId: Types.ObjectId): Promise<ICoursePopulated[]> {
//         return this.populateCourses(CourseModel.find({ enrolledUsers: userId }));
//     }

//     async findByTitleAndCreator(title: string, creatorId: Types.ObjectId): Promise<ICourse | null> {
//         return await CourseModel.findOne({ title, creatorId }).exec() as ICourse | null;
//     }

//     async update(id: Types.ObjectId, updateData: Partial<ICourseBase>): Promise<ICourse | null> {
//         // Return non-populated document after update
//         return await CourseModel.findByIdAndUpdate(
//             id,
//             { $set: updateData },
//             { new: true }
//         ).exec() as ICourse | null;
//     }

//     async delete(id: Types.ObjectId): Promise<boolean> {
//         const result = await CourseModel.deleteOne({ _id: id });
//         return result.deletedCount === 1;
//     }

//     async findAll(): Promise<ICoursePopulated[]> {
//         // This method will return all courses, populated
//         return this.populateCourses(CourseModel.find({}));
//     }

//     async findAllPopulated(): Promise<ICoursePopulated[]> {
//         // Explicitly for populated results
//         return this.populateCourses(CourseModel.find({}));
//     }

//     async findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICoursePopulated[]> {
//         return this.populateCourses(CourseModel.find({ _id: { $in: courseIds } }));
//     }

//     async addLessonToCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean> {
//         const result = await CourseModel.updateOne(
//             { _id: courseId, 'lessons': { $ne: lessonId } },
//             { $addToSet: { lessons: lessonId } }
//         ).exec();
//         return result.modifiedCount === 1;
//     }

//     async removeLessonFromCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean> {
//         const result = await CourseModel.updateOne(
//             { _id: courseId },
//             { $pull: { lessons: lessonId } }
//         ).exec();
//         return result.modifiedCount === 1;
//     }

//     async addAssessmentToCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean> {
//         const result = await CourseModel.updateOne(
//             { _id: courseId, 'assessments': { $ne: assessmentId } },
//             { $addToSet: { assessments: assessmentId } }
//         ).exec();
//         return result.modifiedCount === 1;
//     }

//     async removeAssessmentFromCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean> {
//         const result = await CourseModel.updateOne(
//             { _id: courseId },
//             { $pull: { assessments: assessmentId } }
//         ).exec();
//         return result.modifiedCount === 1;
//     }

//     async addUserToEnrolled(courseId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
//         const result = await CourseModel.updateOne(
//             { _id: courseId, 'enrolledUsers': { $ne: userId } },
//             { $addToSet: { enrolledUsers: userId } }
//         ).exec();
//         return result.modifiedCount === 1;
//     }
// }















// backend/src/repositories/courseRepository.ts
import { Types, Document, Query, PopulateOptions } from 'mongoose';
import { CourseModel } from '../models/courseModel';
import { ICourseRepository } from '../interfaces/courseRepositoryInterface';
import { ICourseBase, ICoursePopulated, ICourse } from '../interfaces/courseInterface';
import { ICourseCategoryPopulated } from '../interfaces/courseCategoryInterface';
import { IUserPopulated } from '../interfaces/userInterface';


export class CourseRepository implements ICourseRepository {
    async create(courseData: Partial<ICourseBase>): Promise<ICourse> {
        const newCourse = new CourseModel(courseData);
        return (await newCourse.save()) as ICourse;
    }

  
private async populateCourse(query: Query<any, any>): Promise<ICoursePopulated | null> {
    const populatedCourse = await query
        .populate([
            {
                path: 'categoryId',
                model: 'Category'  
            },
            {
                path: 'creatorId',
                model: 'User',
                select: 'name email profilePicture phone'
            }
        ])
        .lean()
        .exec();
    return populatedCourse as ICoursePopulated | null;
}

private async populateCourses(query: Query<any, any>): Promise<ICoursePopulated[]> {
    const populatedCourses = await query
        .populate([
            {
                path: 'categoryId',
                model: 'Category' 
            },
            {
                path: 'creatorId',
                model: 'User',
                select: 'name email profilePicture phone'
            }
        ])
        .lean()
        .exec();
    return populatedCourses as ICoursePopulated[];
}


    async findById(id: Types.ObjectId): Promise<ICourse | null> {

        return await CourseModel.findById(id).exec() as ICourse | null;
    }

    async findByIdPopulated(id: Types.ObjectId): Promise<ICoursePopulated | null> {
        return this.populateCourse(CourseModel.findById(id));
    }

    async findByCreator(creatorId: Types.ObjectId): Promise<ICoursePopulated[]> {
        return this.populateCourses(CourseModel.find({ creatorId }));
    }

    async findApprovedCourses(): Promise<ICoursePopulated[]> {
        return this.populateCourses(CourseModel.find({ isApproved: true }));
    }

    async findNewCourses(): Promise<ICoursePopulated[]> {

        return this.populateCourses(CourseModel.find({ isApproved: true }).sort({ createdAt: -1 }).limit(10)); // Adjust limit as needed
    }

    async findEnrolledCourses(userId: Types.ObjectId): Promise<ICoursePopulated[]> {
        return this.populateCourses(CourseModel.find({ enrolledUsers: userId }));
    }

    async findByTitleAndCreator(title: string, creatorId: Types.ObjectId): Promise<ICourse | null> {
        return await CourseModel.findOne({ title, creatorId }).exec() as ICourse | null;
    }

    async update(id: Types.ObjectId, updateData: Partial<ICourseBase>): Promise<ICourse | null> {
  
        return await CourseModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).exec() as ICourse | null;
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        const result = await CourseModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }

    async findAll(): Promise<ICoursePopulated[]> {

        return this.populateCourses(CourseModel.find({}));
    }

    async findAllPopulated(): Promise<ICoursePopulated[]> {
        return this.populateCourses(CourseModel.find({}));
    }

    async findCoursesByIds(courseIds: Types.ObjectId[]): Promise<ICoursePopulated[]> {
        return this.populateCourses(CourseModel.find({ _id: { $in: courseIds } }));
    }

    async addLessonToCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean> {
        const result = await CourseModel.updateOne(
            { _id: courseId, 'lessons': { $ne: lessonId } },
            { $addToSet: { lessons: lessonId } }
        ).exec();
        return result.modifiedCount === 1;
    }

    async removeLessonFromCourse(courseId: Types.ObjectId, lessonId: Types.ObjectId): Promise<boolean> {
        const result = await CourseModel.updateOne(
            { _id: courseId },
            { $pull: { lessons: lessonId } }
        ).exec();
        return result.modifiedCount === 1;
    }

    async addAssessmentToCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean> {
        const result = await CourseModel.updateOne(
            { _id: courseId, 'assessments': { $ne: assessmentId } },
            { $addToSet: { assessments: assessmentId } }
        ).exec();
        return result.modifiedCount === 1;
    }

    async removeAssessmentFromCourse(courseId: Types.ObjectId, assessmentId: Types.ObjectId): Promise<boolean> {
        const result = await CourseModel.updateOne(
            { _id: courseId },
            { $pull: { assessments: assessmentId } }
        ).exec();
        return result.modifiedCount === 1;
    }

    async addUserToEnrolled(courseId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
        const result = await CourseModel.updateOne(
            { _id: courseId, 'enrolledUsers': { $ne: userId } },
            { $addToSet: { enrolledUsers: userId } }
        ).exec();
        return result.modifiedCount === 1;
    }
}
