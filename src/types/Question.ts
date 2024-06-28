import { Option } from "./Option"
import { QuestionType } from "./QuestionType"

export type Question = {
    id?: number,
    label: string,
    text?: string,
    type: QuestionType,
    options?: Option[]
    active: boolean,
    required: boolean
}