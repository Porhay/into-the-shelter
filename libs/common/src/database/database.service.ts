import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
    fn(): string {
        return 'DatabaseService'
    }
}
