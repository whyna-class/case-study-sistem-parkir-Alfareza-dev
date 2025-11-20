import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';

@Controller('parkir')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  // CREATE
  @Post()
  create(@Body() body: CreateParkingDto) {
    return this.parkingService.create(body);
  }

  // GET ALL (Bonus: search, filter, pagination)
  @Get()
  findAll(@Query() query: any) {
    return this.parkingService.findAll(query);
  }

  // GET BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parkingService.findOne(+id);
  }

  // TOTAL PENDAPATAN
  @Get('/total/pendapatan')
  totalPendapatan() {
    return this.parkingService.totalPendapatan();
  }

  // BONUS: PATCH (update lama parkir)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateParkingDto) {
    return this.parkingService.update(+id, body);
  }

  // BONUS: DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingService.remove(+id);
  }
}
