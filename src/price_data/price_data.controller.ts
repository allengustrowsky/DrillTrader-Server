import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PriceDataService } from './price_data.service';
// import { CreatePriceDatumDto } from './dto/create-price_datum.dto';
// import { UpdatePriceDatumDto } from './dto/update-price_datum.dto';

@Controller('price-data')
export class PriceDataController {
  constructor(private readonly priceDataService: PriceDataService) {}

//   @Post()
//   create(@Body() createPriceDatumDto: CreatePriceDatumDto) {
//     return this.priceDataService.create(createPriceDatumDto);
//   }

  @Get()
  findAll() {
    return this.priceDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.priceDataService.findOne(+id);
  }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updatePriceDatumDto: UpdatePriceDatumDto) {
//     return this.priceDataService.update(+id, updatePriceDatumDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.priceDataService.remove(+id);
//   }
}
