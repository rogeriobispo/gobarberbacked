import path from 'path';
import fs from 'fs';
import IUserRepository from '../repositories/IUserRepository'
import IStorageProvider from '@shared/container/providers/StorageProviders/model/IStorageProvider'
import { injectable, inject } from 'tsyringe'

import uploadConfig from '@config/upload';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
    ){}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {

    const user = await this.usersRepository.findById(user_id);

    if (!user)
      throw new AppError('Only authenticated users can change avatar', 401);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar)
    }

    const filename = await this.storageProvider.saveFile(avatarFilename)

    user.avatar = filename;
    await this.usersRepository.update(user);
    return user;
  }
}

export default UpdateUserAvatarService;
