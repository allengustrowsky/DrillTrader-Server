import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/auth.guard';
import { IsAdminGuard } from 'src/auth/admin.guard';
import { RemovePortfilioPropsInterceptor } from '../interceptors/user.interceptor';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseInterceptors(RemovePortfilioPropsInterceptor)
    @Post()
    @ApiCreatedResponse({ description: 'Created succssfully.' })
    @ApiConflictResponse({ description: 'Email must be unique.' })
    @ApiInternalServerErrorResponse({ description: 'An internal server error occurred.' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Get()
    @ApiOkResponse({ description: 'Successfuly returned resources.' })
    findAll() {
        return this.userService.findAll();
    }

    @UseGuards(ApiAuthGuard)
    @Get(':id')
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    @ApiNotFoundResponse({ description: 'Resource not found.' })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @UseGuards(ApiAuthGuard)
    @Patch(':id')
    @ApiOkResponse({ description: 'Successfully updated resource.' })
    @ApiNotFoundResponse({ description: 'Usere with given id not found' })
    @ApiForbiddenResponse({ description: 'Not allowed to modify this resource.' })
    @ApiConflictResponse({ description: 'User with this email already taken.' })
    @ApiInternalServerErrorResponse({ description: 'An internal server error occurred.' }) 
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() request: Request) {
        return this.userService.update(+id, updateUserDto, request);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully deleted resource.' })
    @ApiNotFoundResponse({ description: 'User not found.' })
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}
