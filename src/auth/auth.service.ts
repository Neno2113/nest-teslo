import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt'
import {  } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt";
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jsonwebtoken-payload.interface';


@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepositpory: Repository<User>,

    private readonly jwtService: JwtService
  ){

  }


  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto
      
      const user = this.userRepositpory.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepositpory.save( user );
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBError(error)
       
    }
  }

  async login( loginUserDto: LoginUserDto ) {
    
    const { password, email } = loginUserDto;

    const user = await this.userRepositpory.findOne({
      where: { email },
      select: { email: true, password: true, id: true, }
    });

    if ( !user ){
      throw new UnauthorizedException('Not valid Credentials');
    }

    if( !bcrypt.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Not valid Credentials');
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  async checkStatus( user: User ) {
    
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }


  private getJwtToken( payload: JwtPayload ) {
    
    const token = this.jwtService.sign( payload );
    return token;
  }



  private handleDBError( error: any ): never {

    if( error.code == '23505' )
      throw new BadRequestException( error.detail );

    console.log(error);

    throw new InternalServerErrorException('Please check server logs')
    
  }


}
