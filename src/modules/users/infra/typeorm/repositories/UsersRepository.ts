import { getRepository, Repository, Not } from 'typeorm';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTo from '@modules/users/dtos/IFindAllProvidersDto';
import User from '../entities/User';

class UsersRespository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTo): Promise<User[]> {
    let users: User[];
    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  async update(user: User): Promise<User> {
    // save
    return this.ormRepository.save(user);
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const appointment = this.ormRepository.create({
      name,
      email,
      password,
    });

    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default UsersRespository;
