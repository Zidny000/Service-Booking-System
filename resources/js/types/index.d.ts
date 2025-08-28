import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Service {
    id?: number;
    name: string;
    description: string;
    price: number;
    status: string;
}

export interface Booking {
    id: number;
    user_id: number;
    service_id: number;
    booking_date: string;
    status: string;
    notes?: string;
    created_at: string;
    user?: User;
    service?: Service;
}
