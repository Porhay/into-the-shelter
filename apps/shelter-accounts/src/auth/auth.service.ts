import { Injectable } from '@nestjs/common';
import { UserDetails } from '../utils/types';
import { DatabaseService } from '@app/common'

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService,) { }

    async validateUser(details: UserDetails) {
        console.log('UserDetails', details);

        const user = await this.databaseService.getUserByEmail(details.email);
        if (user) {
            return user;
        }

        // new user
        const newUser = await this.databaseService.createUser(details);
        console.log('User is not found, creating...');
        return newUser;
    }

    async findUser(id: string) {
        const user = await this.databaseService.getUserById(id);
        return user;
    }
}
