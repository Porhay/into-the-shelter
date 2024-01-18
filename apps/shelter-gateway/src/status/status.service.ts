import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
    getStatus(): object {
        const res: object = {
            status: "OK"
        }
        return res
    }
}
