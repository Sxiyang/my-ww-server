import { Injectable, Inject } from '@nestjs/common';
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

@Injectable()
export class UserService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly dbConfig: any,
  ) {
    console.log('数据库配置', this.dbConfig);
  }
  private users: User[] = [
    {
      id: 1,
      name: '张三',
      email: 'zhangsan@qq.com',
      createdAt: new Date('2023-01-01'),
    },
    {
      id: 2,
      name: '李四',
      email: 'lisi@qq.com',
      createdAt: new Date('2023-01-02'),
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@qq.com',
      createdAt: new Date('2023-01-03'),
    },
  ];
  findAll(): User[] {
    return this.users;
  }
  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
  create(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: this.getNextId(),
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
  update(id: number, userData: Partial<Omit<User, 'id'>>): User | undefined {
    const user = this.findOne(id);
    if (!user) {
      return undefined;
    }
    Object.assign(user, userData);
    return user;
  }
  remove(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
  private getNextId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) + 1 : 1;
  }
}
