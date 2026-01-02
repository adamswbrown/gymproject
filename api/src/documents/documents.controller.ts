import { Controller, Get, Post, Delete, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentResponseDto } from './dto/document-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('members/documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MEMBER)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async getDocuments(@CurrentUser() user: any): Promise<{ ok: true; data: DocumentResponseDto[] }> {
    const documents = await this.documentsService.getUserDocuments(user.id);
    return { ok: true, data: documents };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ ok: true; data: DocumentResponseDto }> {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const document = await this.documentsService.uploadDocument(user.id, file);
    return { ok: true, data: document };
  }

  @Delete(':id')
  async deleteDocument(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ): Promise<{ ok: true; data: {} }> {
    await this.documentsService.deleteDocument(user.id, id);
    return { ok: true, data: {} };
  }
}

