import { IsString, IsIn, IsInt, Min } from 'class-validator';

export class CreateParkingDto {
  @IsString()
  plat_nomor: string;

  @IsIn(['roda2', 'roda4'])
  jenis_kendaraan: 'roda2' | 'roda4';

  @IsInt()
  @Min(1)
  durasi: number; // durasi dalam jam
}
