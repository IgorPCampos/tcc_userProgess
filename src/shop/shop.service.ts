import { Injectable, Logger } from '@nestjs/common';
import { ShopItem } from './shop_item.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateShopItemDto } from './dto/create_shop_item.dto';
import { UserCharacter } from 'src/user_character/user_character.entity';

@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  constructor(
    @InjectModel(ShopItem.name)
    private shopModel: Model<ShopItem>,
    @InjectModel(UserCharacter.name)
    private userCharacterModel: Model<UserCharacter>,
  ) {}

  public async create(createShopItemDto: CreateShopItemDto): Promise<ShopItem> {
    this.logger.log(
      `Creating shop item with name: "${createShopItemDto.name}"`,
    );
    try {
      const createdShopItem = new this.shopModel(createShopItemDto);
      return await createdShopItem.save();
    } catch (error) {
      this.logger.error(`Failed to create shop item.`, error.stack);
      throw new Error('A failure occurred while creating the shop item.');
    }
  }

  public async findAll(): Promise<ShopItem[]> {
    this.logger.log('Finding all shop items.');
    try {
      return this.shopModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to find all shop items.', error.stack);
      throw new Error('A failure occurred while retrieving shop items.');
    }
  }

  public async update(
    id: string,
    updateShopItemDto: CreateShopItemDto,
  ): Promise<ShopItem> {
    this.logger.log(`Updating shop item with ID: "${id}"`);
    try {
      const updatedShopItem = await this.shopModel
        .findByIdAndUpdate(id, updateShopItemDto, { new: true })
        .exec();
      if (!updatedShopItem) {
        throw new Error(`Shop item with ID "${id}" not found.`);
      }
      return updatedShopItem;
    } catch (error) {
      this.logger.error(`Failed to update shop item with ID: "${id}"`, error);
      throw new Error('A failure occurred while updating the shop item.');
    }
  }

  public async buyItem(id: string, userId: string): Promise<ShopItem> {
    this.logger.log(`Buying shop item with ID: "${id}"`);
    try {
      const userCharacter = await this.userCharacterModel
        .find({ user_id: userId })
        .exec();

      if (userCharacter.length === 0) {
        throw new Error(`User character with ID "${userId}" not found.`);
      }

      const shopItem = await this.shopModel.findById(id).exec();

      if (!shopItem) {
        throw new Error(`Shop item with ID "${id}" not found.`);
      }

      const availableCoins = userCharacter[0].coins;
      const shopItemId = shopItem._id as mongoose.Types.ObjectId;

      if (availableCoins >= shopItem.price) {
        userCharacter[0].coins -= shopItem.price;
        userCharacter[0].items.push(shopItemId.toString());
        await userCharacter[0].save();
        return shopItem;
      } else {
        throw new Error('Not enough coins to buy the item.');
      }
    } catch (error) {
      this.logger.error(`Failed to buy shop item with ID: "${id}"`, error);
      throw new Error('A failure occurred while buying the shop item.');
    }
  }
}
