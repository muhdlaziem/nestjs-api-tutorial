import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
    return bookmarks;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });

    if (!bookmark) throw new NotFoundException('Bookmark Not Found');

    return bookmark;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    // check if bookmark belong to user
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(`Access to bookmark ${bookmarkId} denied`);

    const updatedBookmark = await this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
    return updatedBookmark;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // get bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    // check if bookmark belong to user
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(`Access to bookmark ${bookmarkId} denied`);

    await this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
