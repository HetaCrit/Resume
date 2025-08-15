//types/navigation.d.ts

export interface NavItem {
    label: string;
    to: string;
    icon?: string; // Optional icon field
    children?: NavItem[]; // For submenus
}

export interface BreadcrumbItem {
    label: string;
    icon?: string;
    to: string;
}
