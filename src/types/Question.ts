import Option from "./Option"
import QuestionType from "./QuestionType"

interface Question {
    id?: number,
    label: string,
    text?: string,
    type: QuestionType,
    options?: Option[]
    active: boolean,
    required: boolean
}

export default Question;