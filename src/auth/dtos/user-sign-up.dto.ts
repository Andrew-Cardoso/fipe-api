import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSignUpDto {
  @IsEmail()
  email: string;

  @MinLength(10, {
    message: 'Your password should have at least 10 characters',
  })
  password: string;

  @IsNotEmpty()
  name: string;
}
