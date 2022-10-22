import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepositpory: Repository<User>
  ){

  }


  async create(createUserDto: CreateUserDto) {
    try {
      
      const user = this.userRepositpory.create( createUserDto );

      await this.userRepositpory.save( user );

      return user;

    } catch (error) {
      this.handleDBError(error)
      
    }
  }



  private handleDBError( error: any ): never {

    if( error.code == '23505' )
      throw new BadRequestException( error.detail );

    console.log(error);

    throw new InternalServerErrorException('Please check server logs')
    
  }


}
