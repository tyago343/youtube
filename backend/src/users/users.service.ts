import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class UsersService {
  private readonly AVATAR_FOLDER = 'avatars';

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly storageService: StorageService,
  ) {}
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.save({ ...user, ...updateUserDto });
  }
  async findOne(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
  async uploadAvatar(
    id: string,
    avatar: Express.Multer.File,
  ): Promise<{ avatarUrl: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const avatarUrl = await this.storageService.uploadFile(
      avatar,
      this.AVATAR_FOLDER,
    );
    await this.userRepository.update(id, { avatarUrl });
    return { avatarUrl };
  }
  async getAllUsers() {
    return this.userRepository.find();
  }
}
