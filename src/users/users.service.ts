import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor (private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // email is already registered?
    const emailAlreadyRegistered = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
    if ( emailAlreadyRegistered ) throw new HttpException('This e-mail is already registered', HttpStatus.BAD_REQUEST);
    
    // user name is available?
    const userNameNotAvailable = await this.prisma.user.findUnique({ where: { user_name: createUserDto.user_name } });
    if ( userNameNotAvailable ) throw new HttpException('This user name is not available...', HttpStatus.CONFLICT);

    // proceed if ok
    return this.prisma.user.create({ data: { ...createUserDto } });
  }

  async findAll() {
    // simply returning all users
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    // user with the given id exists?
    const user = await this.prisma.user.findUnique({ where: { id }});
    if( !user ) throw new HttpException(`Cannot find user with id ${id}`, HttpStatus.NOT_FOUND);
    
    // return user if it exists
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // user exists?
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if ( !existingUser ) throw new HttpException(`Cannot find user with id ${id}`, HttpStatus.NOT_FOUND);

    // the new email provided cannot already be registered
    const emailAlreadyInUse = await this.prisma.user.findUnique({ where: { email: updateUserDto.email } });
    if ( emailAlreadyInUse ) throw new HttpException('This email address is already in use', HttpStatus.CONFLICT);

    // the new user name cannot already been chosen
    const userNameAlreadyChosen = await this.prisma.user.findUnique({ where: { user_name: updateUserDto.user_name } });
    if( userNameAlreadyChosen ) throw new HttpException('This username is not available', HttpStatus.CONFLICT);

    // if all right, update user
    return this.prisma.user.update({ where: { id }, data: { ...updateUserDto }})
  }

  async remove(id: number) {
    // user exists?
    const userExists = await this.prisma.user.findUnique({ where: { id } });
    if ( !userExists ) throw new HttpException(`Cannot find user with id ${id}`, HttpStatus.NOT_FOUND);

    // delete user
    return this.prisma.user.delete({ where: { id } });
  }
}
