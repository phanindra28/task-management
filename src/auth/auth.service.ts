import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository, extendedUserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private usersRepository: UserRepository;
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    this.usersRepository = this.repository.extend(extendedUserRepository);
  }

  public async signup(user: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(user);
  }

  public async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
