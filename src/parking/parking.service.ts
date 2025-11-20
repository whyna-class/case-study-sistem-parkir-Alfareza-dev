// src/parking/parking.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';

@Injectable()
export class ParkingService {
  constructor(private prisma: PrismaService) {}

  // helper: map DTO string -> enum Prisma
  private mapJenisToEnum(jenis?: string) {
    if (!jenis) return undefined;
    if (typeof jenis !== 'string') return undefined;
    const j = jenis.toLowerCase();
    if (j === 'roda2') return 'RODA2';
    if (j === 'roda4') return 'RODA4';
    return undefined;
  }

  // helper: map enum Prisma -> simple 'roda2'|'roda4' for calculations
  private enumToSimpleJenis(jenis?: string | null) {
    if (!jenis) return undefined;
    const j = String(jenis).toUpperCase();
    if (j === 'RODA2') return 'roda2';
    if (j === 'RODA4') return 'roda4';
    return undefined;
  }

  // Perhitungan total berdasarkan aturan soal
  // menerima params opsional supaya aman terhadap undefined
  hitungTotal(jenis?: string, durasi?: number): number {
    if (!jenis || typeof durasi !== 'number' || durasi < 1) return 0;

    if (jenis === 'roda2') {
      if (durasi === 1) return 3000;
      return 3000 + (durasi - 1) * 2000;
    }

    if (jenis === 'roda4') {
      if (durasi === 1) return 6000;
      return 6000 + (durasi - 1) * 4000;
    }

    return 0;
  }

  // CREATE
  async create(data: CreateParkingDto) {
    const enumJenis = this.mapJenisToEnum(data.jenis_kendaraan);
    // pastikan durasi adalah number
    const durasi =
      typeof (data as any).durasi !== 'undefined'
        ? Number((data as any).durasi)
        : 0;
    // hitung total berdasarkan bentuk yang dipakai hitungTotal (roda2/roda4)
    const jenisForCalc =
      this.enumToSimpleJenis(enumJenis) ?? data.jenis_kendaraan;
    const total = this.hitungTotal(jenisForCalc, durasi);

    return this.prisma.parking.create({
      data: {
        platNomor: data.plat_nomor,
        jenisKendaraan: enumJenis as any, // cast karena type yang di-generate Prisma
        entryTime: new Date(),
        durasi,
        total,
      },
    });
  }

  // GET ALL + BONUS: Search, Filter, Pagination
  async findAll(query: any) {
    const { page = 1, limit = 10, search, jenis_kendaraan } = query;

    const where: any = {};

    if (search) {
      where.platNomor = { contains: String(search) };
    }

    if (jenis_kendaraan) {
      const mapped = this.mapJenisToEnum(jenis_kendaraan);
      if (mapped) where.jenisKendaraan = mapped;
    }

    return this.prisma.parking.findMany({
      where,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { id: 'asc' },
    });
  }

  // GET BY ID
  async findOne(id: number) {
    const data = await this.prisma.parking.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Data parkir tidak ditemukan');
    return data;
  }

  // BONUS: PATCH (Update durasi + total)
  async update(id: number, body: UpdateParkingDto) {
    const existing = await this.findOne(id);

    // existing.jenisKendaraan adalah enum 'RODA2' | 'RODA4'
    const existingJenisSimple = this.enumToSimpleJenis(existing.jenisKendaraan);
    const bodyJenisEnum = this.mapJenisToEnum((body as any).jenis_kendaraan);
    const newJenisEnum = bodyJenisEnum ?? existing.jenisKendaraan;
    const newJenisSimple =
      this.enumToSimpleJenis(newJenisEnum) ?? existingJenisSimple;

    // pastikan newDurasi adalah number (fallback ke existing.durasi atau 0)
    const newDurasi: number =
      typeof (body as any).durasi !== 'undefined'
        ? Number((body as any).durasi)
        : (existing.durasi ?? 0);

    // sekarang aman dipanggil karena durasi pasti number (atau 0)
    const total = this.hitungTotal(newJenisSimple, newDurasi);

    // prepare update payload: map snake_case DTO to camelCase fields
    const updatePayload: any = {
      ...((body as any).plat_nomor
        ? { platNomor: (body as any).plat_nomor }
        : {}),
      ...(bodyJenisEnum ? { jenisKendaraan: bodyJenisEnum } : {}),
      ...(typeof (body as any).durasi !== 'undefined'
        ? { durasi: newDurasi }
        : {}),
      total,
      // jika ingin set exitTime misalnya:
      ...(typeof (body as any).exit_time !== 'undefined'
        ? { exitTime: (body as any).exit_time }
        : {}),
    };

    return this.prisma.parking.update({
      where: { id },
      data: updatePayload,
    });
  }

  // BONUS: DELETE
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.parking.delete({ where: { id } });
  }

  // Total Pendapatan
  async totalPendapatan() {
    const sum = await this.prisma.parking.aggregate({
      _sum: { total: true },
    });

    const totalValue = (sum as any)._sum?.total ?? 0;
    return { total_pendapatan: totalValue };
  }
}
