export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    name?: string; // optional, depending on your user model
    profile?: {
        avatar?: string;
    };
    // add more fields based on your backend response
}