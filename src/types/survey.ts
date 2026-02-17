export type Relationship = 'grandchild' | 'nephew_niece' | 'child_friend' | 'sibling' | 'other';
export type GiverCareer = 'student' | 'worker' | 'entrepreneur' | 'unemployed' | 'etc';
export type MaritalStatus = 'single' | 'married';
export type ReceiverStatus = 'preschooler' | 'elementary' | 'middle_high' | 'university' | 'worker' | 'etc';
export type AgeGroup = 'under_10' | '10s' | '20s' | '30s' | '40_plus';

export interface SurveyEntry {
    id?: string;
    created_at?: string;
    // Giving information (The User)
    giver_career: GiverCareer;
    giver_marital: MaritalStatus;
    giver_age_group: AgeGroup;
    // Receiving information
    relationship: Relationship;
    receiver_status: ReceiverStatus;
    receiver_age_group: AgeGroup;
    // Gift details
    amount: number;
    is_planned: boolean;
}
