import { Transform } from 'class-transformer';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;

  @Transform(({ value }) => {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return String(value);
  })
  createdAt: string;
}
