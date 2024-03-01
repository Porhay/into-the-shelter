export class CreateFileDto {
    userId: string;
    filename: string;
    size: number;
    mime: string;
    type?: string;
    metadata?: string;
}