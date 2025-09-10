

// frontend/src/pages/CourseCreate.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/button';
import { createCourse, getCategories } from '../services/CourseServices';
import { createLesson } from '../services/lessonServices';
import { createMaterial } from '../services/materialServices';
import { createAssessment, createQuestion } from '../services/assessmentServices';
import { Category } from '../interfaces/courseInterface';
import { AssessmentType } from '../interfaces/assessmentInterface';
import { QuestionType } from '../interfaces/questionInterface';
import '../styles/Login.css';

interface Lesson {
    title: string;
    description: string;
    orderIndex: number;
    isPublished: boolean;
}

interface Material {
    lessonIndex: number;
    title: string;
    file: File | null;
    type: string;
    description?: string;
}

interface Assessment {
    title: string;
    maxScore: number;
    durationMinutes: number;
    passPercentage: number;
    isPublished: boolean;
    type: AssessmentType;
}

interface Question {
    assessmentIndex: number;
    questionText: string;
    type: QuestionType;
    options: string[];
    correctAnswer: number | boolean;
    points: number;
    file?: File;
}

const CourseCreate: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: '',
        level: '',
        price: '',
        discountPrice: '',
    });
    const [courseImage, setCourseImage] = useState<File | null>(null);
    const [courseImageName, setCourseImageName] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryList = await getCategories();
                setCategories(categoryList);
                if (categoryList.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: categoryList[0]._id }));
                }
            } catch (err: any) {
                setError('Failed to load categories.');
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'price' || name === 'discountPrice') {
            if (value === '' || !isNaN(parseFloat(value))) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('Selected course image:', file.name);
            setCourseImage(file);
            setCourseImageName(file.name);
            setError(null);
        } else {
            console.log('No file selected for course image');
            setCourseImage(null);
            setCourseImageName('');
        }
    };

    const addLesson = () => {
        setLessons([...lessons, { title: '', description: '', orderIndex: lessons.length + 1, isPublished: false }]);
    };

    const updateLesson = (index: number, field: string, value: string | boolean) => {
        const updatedLessons = lessons.map((lesson, i) =>
            i === index ? { ...lesson, [field]: value } : lesson
        );
        setLessons(updatedLessons);
    };

    const addMaterial = (lessonIndex: number) => {
        setMaterials([...materials, { lessonIndex, title: '', file: null, type: 'image', description: '' }]);
    };

    const updateMaterial = (index: number, field: string, value: string | File | null | number) => {
        const updatedMaterials = materials.map((material, i) =>
            i === index ? { ...material, [field]: value } : material
        );
        setMaterials(updatedMaterials);
    };

    const addAssessment = () => {
        setAssessments([...assessments, {
            title: '',
            maxScore: 100,
            durationMinutes: 60,
            passPercentage: 70,
            isPublished: false,
            type: AssessmentType.Quiz
        }]);
    };

    const updateAssessment = (index: number, field: string, value: string | number | boolean) => {
        const updatedAssessments = assessments.map((assessment, i) =>
            i === index ? { ...assessment, [field]: value } : assessment
        );
        setAssessments(updatedAssessments);
    };

    const addQuestion = (assessmentIndex: number) => {
        setQuestions([...questions, {
            assessmentIndex,
            questionText: '',
            type: QuestionType.MultipleChoice,
            options: ['', '', '', ''],
            correctAnswer: 0,
            points: 1
        }]);
    };

    const updateQuestion = (index: number, field: string, value: string | string[] | number | File | undefined | QuestionType | boolean) => {
        const updatedQuestions = questions.map((question, i) =>
            i === index ? { ...question, [field]: value } : question
        );
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('categoryId', formData.categoryId);
        data.append('level', formData.level);
        data.append('price', formData.price);
        if (formData.discountPrice) {
            data.append('discountPrice', formData.discountPrice);
        }
        if (courseImage) {
            data.append('image', courseImage);
        }

        console.log('[FormData] Course Entries:');
        const fields = ['title', 'description', 'categoryId', 'level', 'price', 'discountPrice', 'image'];
        fields.forEach(key => {
            const value = data.get(key);
            if (value instanceof File) {
                console.log(`[FormData] ${key}:`, value.name);
            } else if (value) {
                console.log(`[FormData] ${key}:`, value);
            }
        });

        if (!formData.title || !formData.description || !formData.categoryId || !formData.level || !formData.price) {
            setError('Please fill in all required course fields.');
            return;
        }

        if (!courseImage) {
            setError('Please upload a valid course image.');
            return;
        }

        try {
            const course = await createCourse(data);
            console.log('[CourseCreate] Course created:', course._id);
            const lessonIds: string[] = [];
            for (const lesson of lessons) {
                if (!lesson.title) {
                    setError('All lessons must have a title.');
                    return;
                }
                const createdLesson = await createLesson(course._id, lesson);
                lessonIds.push(createdLesson._id);
            }

            for (const material of materials) {
                if (!material.file || !material.title || !material.type) {
                    setError('All materials must have a title, file, and type.');
                    return;
                }
                if (material.lessonIndex < 0 || material.lessonIndex >= lessonIds.length) {
                    setError(`Invalid lesson index ${material.lessonIndex + 1} for material "${material.title}".`);
                    return;
                }
                const lessonId = lessonIds[material.lessonIndex];
                const materialData = new FormData();
                materialData.append('lessonId', lessonId);
                materialData.append('title', material.title);
                materialData.append('material', material.file);
                materialData.append('type', material.type);
                if (material.description) {
                    materialData.append('description', material.description);
                }
                console.log('[CourseCreate] Material FormData:', Array.from(materialData.entries()));
                await createMaterial(lessonId, materialData);
            }

            for (const assessment of assessments) {
                if (!assessment.title || !assessment.type) {
                    setError('All assessments must have a title and type.');
                    return;
                }
                const createdAssessment = await createAssessment(course._id, assessment);
                const assessmentQuestions = questions.filter(q => q.assessmentIndex === assessments.indexOf(assessment));
                for (const question of assessmentQuestions) {
                    if (!question.questionText) {
                        setError('All questions must have text.');
                        return;
                    }
                    if (question.type === QuestionType.MultipleChoice && (question.options.length !== 4 || question.options.some(opt => !opt))) {
                        setError('Multiple choice questions must have four non-empty options.');
                        return;
                    }
                    if (question.points < 1) {
                        setError('Points must be at least 1.');
                        return;
                    }
                    if (!Object.values(QuestionType).includes(question.type)) {
                        setError(`Invalid question type: ${question.type}`);
                        return;
                    }
                    const questionData = new FormData();
                    questionData.append('questionText', question.questionText);
                    questionData.append('type', question.type);
                    if (question.type === QuestionType.MultipleChoice) {
                        if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
                            setError('Multiple choice questions must have a correct answer between 0 and 3.');
                            return;
                        }
                        questionData.append('options', JSON.stringify(question.options));
                        questionData.append('correctAnswer', question.correctAnswer.toString());
                    } else if (question.type === QuestionType.TrueFalse) {
                        if (typeof question.correctAnswer !== 'boolean') {
                            setError('True/False questions must have a boolean correct answer.');
                            return;
                        }
                        questionData.append('correctAnswer', question.correctAnswer.toString());
                    }
                    questionData.append('points', question.points.toString());
                    if (question.file) {
                        questionData.append('questionImage', question.file);
                    }
                    console.log('[CourseCreate] Question FormData:');
                    Array.from(questionData.entries()).forEach(([key, value]) => {
                        if (value instanceof File) {
                            console.log(`[FormData] ${key}:`, value.name);
                        } else {
                            console.log(`[FormData] ${key}:`, value);
                        }
                    });
                    await createQuestion(createdAssessment._id, questionData);
                }
            }

            alert('Course and content created successfully!');
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to create course. Please check all fields and try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Create New Course</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Course Title"
                    label="Title"
                    required
                />
                <Input
                    type="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Course Description"
                    label="Description"
                    required
                />
                <div>
                    <label htmlFor="categoryId">Category</label>
                    <select
                        name="categoryId"
                        id="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="level">Level</label>
                    <select
                        name="level"
                        id="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select a level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    label="Price (INR)"
                    required
                    min="0"
                />
                <Input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    placeholder="Discount Price (Optional)"
                    label="Discount Price (INR)"
                    min="0"
                />
                <div>
                    <label htmlFor="image">Course Image</label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleFileChange}
                        required
                        accept="image/*"
                    />
                    {courseImageName && <p>Selected: {courseImageName}</p>}
                </div>

                <h3>Lessons</h3>
                {lessons.map((lesson, index) => (
                    <div key={index} className="lesson-form">
                        <Input
                            type="text"
                            name={`lesson-title-${index}`}
                            value={lesson.title}
                            onChange={(e) => updateLesson(index, 'title', e.target.value)}
                            placeholder="Lesson Title"
                            label={`Lesson ${index + 1} Title`}
                            required
                        />
                        <Input
                            type="textarea"
                            name={`lesson-description-${index}`}
                            value={lesson.description}
                            onChange={(e) => updateLesson(index, 'description', e.target.value)}
                            placeholder="Lesson Description"
                            label="Description"
                        />
                        <label>
                            Published:
                            <input
                                type="checkbox"
                                checked={lesson.isPublished}
                                onChange={(e) => updateLesson(index, 'isPublished', e.target.checked)}
                            />
                        </label>
                    </div>
                ))}
                <Button type="button" onClick={addLesson}>Add Lesson</Button>

                <h3>Materials</h3>
                {lessons.length === 0 && materials.length > 0 && (
                    <div className="error">Please add at least one lesson before adding materials.</div>
                )}
                {materials.map((material, index) => (
                    <div key={index} className="material-form">
                        <select
                            value={material.lessonIndex.toString()}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateMaterial(index, 'lessonIndex', parseInt(e.target.value))}
                            disabled={lessons.length === 0}
                        >
                            {lessons.length === 0 ? (
                                <option value="" disabled>No lessons available</option>
                            ) : (
                                lessons.map((_, i) => (
                                    <option key={i} value={i}>Lesson {i + 1}</option>
                                ))
                            )}
                        </select>
                        <Input
                            type="text"
                            name={`material-title-${index}`}
                            value={material.title}
                            onChange={(e) => updateMaterial(index, 'title', e.target.value)}
                            placeholder="Material Title"
                            label="Title"
                            required
                        />
                        <Input
                            type="textarea"
                            name={`material-description-${index}`}
                            value={material.description || ''}
                            onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                            placeholder="Material Description"
                            label="Description"
                        />
                        <Input
                            type="file"
                            name={`material-file-${index}`}
                            onChange={(e) => updateMaterial(index, 'file', e.target.files![0])}
                            label="Material File"
                            accept="image/*,application/pdf,video/*,audio/*,.ppt,.pptx,.doc,.docx,.txt"
                            required
                        />
                        <select
                            value={material.type}
                            onChange={(e) => updateMaterial(index, 'type', e.target.value)}
                        >
                            <option value="image">Image</option>
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="ppt">PPT</option>
                            <option value="text">Text</option>
                            <option value="url">URL</option>
                        </select>
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() => addMaterial(0)}
                    disabled={lessons.length === 0}
                >
                    Add Material
                </Button>

                <h3>Assessments</h3>
                {assessments.map((assessment, index) => (
                    <div key={index} className="assessment-form">
                        <Input
                            type="text"
                            name={`assessment-title-${index}`}
                            value={assessment.title}
                            onChange={(e) => updateAssessment(index, 'title', e.target.value)}
                            placeholder="Assessment Title"
                            label="Title"
                            required
                        />
                        <Input
                            type="number"
                            name={`assessment-maxScore-${index}`}
                            value={assessment.maxScore.toString()}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || !isNaN(parseInt(value))) {
                                    updateAssessment(index, 'maxScore', value === '' ? 0 : parseInt(value));
                                }
                            }}
                            placeholder="Max Score"
                            label="Max Score"
                            required
                            min="0"
                        />
                        <Input
                            type="number"
                            name={`assessment-durationMinutes-${index}`}
                            value={assessment.durationMinutes.toString()}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || !isNaN(parseInt(value))) {
                                    updateAssessment(index, 'durationMinutes', value === '' ? 0 : parseInt(value));
                                }
                            }}
                            placeholder="Duration (Minutes)"
                            label="Duration"
                            required
                            min="0"
                        />
                        <Input
                            type="number"
                            name={`assessment-passPercentage-${index}`}
                            value={assessment.passPercentage.toString()}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || !isNaN(parseInt(value))) {
                                    updateAssessment(index, 'passPercentage', value === '' ? 0 : parseInt(value));
                                }
                            }}
                            placeholder="Pass Percentage"
                            label="Pass Percentage"
                            required
                            min="0"
                            max="100"
                        />
                        <div>
                            <label htmlFor={`assessment-type-${index}`}>Type</label>
                            <select
                                name={`assessment-type-${index}`}
                                id={`assessment-type-${index}`}
                                value={assessment.type}
                                onChange={(e) => updateAssessment(index, 'type', e.target.value as AssessmentType)}
                                required
                            >
                                <option value="" disabled>Select a type</option>
                                <option value={AssessmentType.Quiz}>Quiz</option>
                                <option value={AssessmentType.Exam}>Exam</option>
                                <option value={AssessmentType.Assignment}>Assignment</option>
                                <option value={AssessmentType.Practice}>Practice</option>
                            </select>
                        </div>
                        <label>
                            Published:
                            <input
                                type="checkbox"
                                checked={assessment.isPublished}
                                onChange={(e) => updateAssessment(index, 'isPublished', e.target.checked)}
                            />
                        </label>
                    </div>
                ))}
                <Button type="button" onClick={addAssessment}>Add Assessment</Button>

                <h3>Questions</h3>
                {assessments.length === 0 && questions.length > 0 && (
                    <div className="error">Please add at least one assessment before adding questions.</div>
                )}
                {questions.map((question, index) => (
                    <div key={index} className="question-form">
                        <select
                            value={question.assessmentIndex.toString()}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateQuestion(index, 'assessmentIndex', parseInt(e.target.value))}
                            disabled={assessments.length === 0}
                        >
                            {assessments.length === 0 ? (
                                <option value="" disabled>No assessments available</option>
                            ) : (
                                assessments.map((_, i) => (
                                    <option key={i} value={i}>Assessment {i + 1}</option>
                                ))
                            )}
                        </select>
                        <Input
                            type="text"
                            name={`question-text-${index}`}
                            value={question.questionText}
                            onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                            placeholder="Question Text"
                            label="Question"
                            required
                        />
                        <select
                            name={`question-type-${index}`}
                            value={question.type}
                            onChange={(e) => updateQuestion(index, 'type', e.target.value as QuestionType)}
                        >
                            <option value={QuestionType.MultipleChoice}>Multiple Choice</option>
                            <option value={QuestionType.TrueFalse}>True/False</option>
                            <option value={QuestionType.FileUpload}>File Upload</option>
                        </select>
                        {question.type === QuestionType.MultipleChoice && question.options.map((option, optIndex) => (
                            <Input
                                key={optIndex}
                                type="text"
                                name={`question-option-${index}-${optIndex}`}
                                value={option}
                                onChange={(e) => {
                                    const newOptions = [...question.options];
                                    newOptions[optIndex] = e.target.value;
                                    updateQuestion(index, 'options', newOptions);
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                                label={`Option ${optIndex + 1}`}
                                required
                            />
                        ))}
                        {question.type === QuestionType.MultipleChoice && (
                            <Input
                                type="number"
                                name={`question-correctAnswer-${index}`}
                                value={typeof question.correctAnswer === 'number' ? question.correctAnswer.toString() : '0'}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || !isNaN(parseInt(value))) {
                                        updateQuestion(index, 'correctAnswer', value === '' ? 0 : parseInt(value));
                                    }
                                }}
                                placeholder="Correct Option (0-3)"
                                label="Correct Option"
                                min="0"
                                max="3"
                                required
                            />
                        )}
                        {question.type === QuestionType.TrueFalse && (
                            <select
                                name={`question-correctAnswer-${index}`}
                                value={question.correctAnswer.toString()}
                                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value === 'true')}
                            >
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        )}
                        <Input
                            type="number"
                            name={`question-points-${index}`}
                            value={question.points.toString()}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || !isNaN(parseInt(value))) {
                                    updateQuestion(index, 'points', value === '' ? 1 : parseInt(value));
                                }
                            }}
                            placeholder="Points"
                            label="Points"
                            required
                            min="1"
                        />
                        {/* <div>
                            <label htmlFor={`question-file-${index}`}>Question Image (Optional)</label>
                            <input
                                type="file"
                                name={`question-file-${index}`}
                                id={`question-file-${index}`}
                                onChange={(e) => updateQuestion(index, 'file', e.target.files?.[0])}
                                accept="image/*"
                            />
                            {question.file && <p>Selected: {question.file.name}</p>}
                        </div> */}
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() => addQuestion(0)}
                    disabled={assessments.length === 0}
                >
                    Add Question
                </Button>

                {error && <div className="error">{error}</div>}
                <Button type="submit">Create Course</Button>
            </form>
        </div>
    );
};

export default CourseCreate;