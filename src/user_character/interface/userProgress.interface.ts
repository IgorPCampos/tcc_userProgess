export interface IUserProgress {
    user_id: string;
    lesson_plan_id: string;
    external_id?: string;
    answer: string;
    type: string;
    points: number
    final_grade?: number
}