import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopItemDto } from './dto/create_shop_item.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post()
  async create(@Body() createShopItemDto: CreateShopItemDto) {
    return await this.shopService.create(createShopItemDto);
  }

  @Get()
  async findAll() {
    return await this.shopService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShopItemDto: CreateShopItemDto,
  ) {
    return await this.shopService.update(id, updateShopItemDto);
  }
}
