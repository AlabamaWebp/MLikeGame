import { Body, Controller, Post } from '@nestjs/common';
import { DataService } from 'src/websocket/data/data.service';
import { NicknameDto } from './dto/nickname.dto';

@Controller('nickname')
export class NicknameController {
    constructor(private data: DataService) { }
    @Post()
    findAll(
        @Body() body: NicknameDto
    ): boolean {
        const nickname = body.nickname
        if (typeof nickname == "string") {
            return !this.data.clients.some(el => el.name == nickname && el.socket != null);
        }
        return false;
    }
}
