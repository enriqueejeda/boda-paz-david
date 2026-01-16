export interface Photo {
    id: string;
    url: string;
    title: string;
    subtitle: string;
    description: string;
    color: string;
}

export interface CardProps {
    i: number;
    photo: Photo;
    progress: any; // Using 'any' for Framer Motion ScrollMotionValue type compatibility in this snippet
    range: [number, number];
    targetScale: number;
}


export interface RSVPData {
    fullNames: string;
    email: string;
    attendingDay1: boolean; // 31 Julio
    attendingDay2: boolean; // 1 Agosto
    attendingDay3: boolean; // 2 Agosto
    notAttending: boolean;
    adultCount: number;
    childCount: number;
    dietaryRestrictions: string;
}

export const Day = {
    DAY1: 'DAY1',
    DAY2: 'DAY2',
    DAY3: 'DAY3'
} as const;

export type Day = typeof Day[keyof typeof Day];
