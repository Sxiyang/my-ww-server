import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from './dto/create-user.dto' 
import type { User } from './user.service';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Get()
    findAll(): User[] {
        return this.userService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): User {
        const user = this.userService.findOne(id);
        if (!user) {
            throw new NotFoundException(`用户I的${id} 不存在`)
        }
        return user
    }
    @Post()
    created(@Body() createUserDto: CreateUserDto): User {
        return this.userService.create(createUserDto)
    }
}
