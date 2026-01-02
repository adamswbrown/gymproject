import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentResponseDto } from './dto/document-response.dto';

@Injectable()
export class DocumentsService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'documents');

  constructor(private readonly prisma: PrismaService) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async getUserDocuments(userId: string): Promise<DocumentResponseDto[]> {
    const documents = await this.prisma.document.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });

    return documents.map((doc) => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      url: doc.url,
      uploadedAt: doc.uploadedAt,
    }));
  }

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
  ): Promise<DocumentResponseDto> {
    // Generate unique filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Create database record
    const document = await this.prisma.document.create({
      data: {
        userId,
        name: file.originalname,
        type: file.mimetype,
        url: `/uploads/documents/${fileName}`, // Mock URL - in production this would be S3/Azure URL
      },
    });

    return {
      id: document.id,
      name: document.name,
      type: document.type,
      url: document.url,
      uploadedAt: document.uploadedAt,
    };
  }

  async deleteDocument(userId: string, documentId: string): Promise<void> {
    const document = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });

    if (!document) {
      throw new NotFoundException({
        code: 'DOCUMENT_NOT_FOUND',
        message: 'Document not found',
      });
    }

    // Delete file from disk
    const fileName = path.basename(document.url);
    const filePath = path.join(this.uploadDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await this.prisma.document.delete({
      where: { id: documentId },
    });
  }
}

