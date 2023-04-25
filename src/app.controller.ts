import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/setup')
    @ApiOkResponse({ description: 'Successfully created resources.' })
    @ApiInternalServerErrorResponse({ description: 'An internal server error occurred. '})
    setup() {
        return this.appService.setup();
    }
}
