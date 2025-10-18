export interface QuestionnaireFormData {
    fio: string;
    presence: string;
    companion: string;
    secondDay: string;
    children: string;
    wishes: string;
}

export interface QuestionnaireErrors {
    fio?: string;
    presence?: string;
    companion?: string;
    secondDay?: string;
    children?: string;
}

export type SubmitStatus = '' | 'success' | 'error';