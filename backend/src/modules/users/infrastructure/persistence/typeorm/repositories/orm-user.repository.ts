import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/user.entity';
import { UserRepository } from '../../../../application/ports/user.repository';
import { UserId } from '../../../../domain/vo/user-id.vo';
import { Email } from '../../../../domain/vo/email.vo';
import { Username } from '../../../../domain/vo/username.vo';
import { UserSchema } from '../entities/user.schema';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class OrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: Repository<UserSchema>,
  ) {
    super();
  }

  async save(user: User): Promise<User> {
    const schema = UserMapper.toPersistence(user);
    const saved = await this.userRepository.save(schema);
    return UserMapper.toDomain(saved);
  }

  async findById(id: UserId): Promise<User | null> {
    const schema = await this.userRepository.findOne({
      where: { id: id.value },
    });
    return schema ? UserMapper.toDomain(schema) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const schema = await this.userRepository.findOne({
      where: { email: email.value },
    });
    return schema ? UserMapper.toDomain(schema) : null;
  }

  async findByUsername(username: Username): Promise<User | null> {
    const schema = await this.userRepository.findOne({
      where: { username: username.value },
    });
    return schema ? UserMapper.toDomain(schema) : null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email: email.value },
    });
    return count > 0;
  }

  async existsByUsername(username: Username): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { username: username.value },
    });
    return count > 0;
  }

  async findAll(): Promise<User[]> {
    const schemas = await this.userRepository.find();
    return schemas.map((schema) => UserMapper.toDomain(schema));
  }

  async delete(id: UserId): Promise<void> {
    await this.userRepository.delete(id.value);
  }
}
