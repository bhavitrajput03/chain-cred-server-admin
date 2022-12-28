import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable({})
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getToken(signInDto: SignInDto) {
    const { username, password } = signInDto;
    const user = await this.userService.findByKey('username', username);
    if (!user) throw new ForbiddenException('User not Found');
    const passwordMatch = await bcrypt.compare(password, user['password']);
    if (!passwordMatch) throw new ForbiddenException('Incorrect Password');
    delete user['password'];
    const token = await this.signInToken(user['id'], user['email']);
    const payload = { ...user, token };
    return payload;
  }

  async signInToken(userId: number, email: string): Promise<string> {
    const secret = this.configService.get('JWT_SECRET');
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret,
    });
    return token;
  }
}
