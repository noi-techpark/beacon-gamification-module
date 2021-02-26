
export type Quest = {
    id: number;
    name: string;
    description?: string;
    epilogue?: string;
    instructions?: string;
    position: string; //format: latitude,longitude
    image?: string;
    steps: QuestStep[];
}

export type QuestStep = {
    id: number;
    beacon: number;
    instructions: string;
    name: string;
    properties: string;
    quest: number;
    quest_index: number;
    type: 'question' | 'multi';
    value_points: number;
    value_points_error: number;
    image?: string;
}

export type QuestFinder = {
    beacon: {
        id: number;
        name: string;
        beacon_id: string;
    };
    quests: Quest[];
}

export type QuestionMetadata = {
    question: string;
    answer: string | string[];
    kind: 'text' | 'number' | 'multiple' | 'single' | 'order' | 'image';
    correctAnswerMessage: string;
    wrongAnswerMessage: string;
    options: string[];
    help: string;
    finder?: string;
}