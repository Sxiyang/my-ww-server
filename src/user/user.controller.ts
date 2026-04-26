import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { User } from './user.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

interface AuthUser {
  userId: number;
  username: string;
  roles?: string[];
}

@Controller('user')
// @UseGuards(JwtAuthGuard) TODO: 测试用，后续移除
export class UserController {
  @Get('error')
  testError() {
    throw new Error('测试错误');
  }
  @Get('info')
  getInfo(@Request() req: { user?: AuthUser }) {
    return req.user;
  }
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAdminInfo(@Request() req: { user?: AuthUser }) {
    return { message: '这是管理员信息', user: req.user };
  }
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): User {
    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`用户ID${id} 不存在`);
    }
    return user;
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  created(@Body() createUserDto: CreateUserDto): User {
    return this.userService.create(createUserDto);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: { name?: string; email?: string },
  ): User {
    const user = this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`用户ID${id} 不存在`);
    }
    return user;
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    const success = this.userService.remove(id);
    if (!success) {
      throw new NotFoundException(`用户ID${id} 不存在`);
    }
  }
}
