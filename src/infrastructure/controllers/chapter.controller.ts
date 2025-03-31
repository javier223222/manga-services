import { Request, Response } from 'express';
import prisma from '../../prisma/client';

import { uploadFile } from '../services/cloudinary.service';
import { UploadedFile } from 'express-fileupload';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const createChapter = async (req: Request, res: Response) => {
  try {
    const { mangaId, number, title, releaseDate, public: isPublic } = req.body;
    const pdf = req.files?.pdf;

    if (!pdf){  res.status(400).json({ error: 'PDF is required' });}else{
      const pdfUrl = await uploadFile(pdf as UploadedFile, 'raw');

      const chapter = await prisma.chapter.create({
        data: {
          mangaId,
          number: parseInt(number),
          title,
          releaseDate: new Date(releaseDate),
          pdfUrl,
          public: isPublic === 'true' || isPublic === true
        },
      });
  
      res.status(201).json(chapter);
    }

   
  } catch (err) {
    res.status(500).json({ error: 'Error creating chapter', detail: err });
  }
};

export const getAllChapters = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const chapters = await prisma.chapter.findMany({
      skip,
      take: limit,
      include: { manga: true },
    });

    const total = await prisma.chapter.count();
    const totalPages = Math.ceil(total / limit);

    const accessibleChapters = await Promise.all(
      chapters.map(async (chapter) => {
        if (chapter.public) return chapter;

        const hasAccess = await prisma.chapterAccess.findFirst({
          where: {
            userId,
            chapterId: chapter.id
          }
        });

        return hasAccess ? chapter : null;
      })
    );

    const filteredChapters = accessibleChapters.filter(Boolean);

    res.json({
      total,
      totalPages,
      currentPage: page,
      limit,
      chapters: filteredChapters
    });
  } catch (err) {
    res.status(500).json({ error: 'Error getting chapters', detail: err });
  }
};

export const getChapterById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: { manga: true },
    });

    if (!chapter){res.status(404).json({ error: 'Chapter not found' });}else{
      if (!chapter.public) {
        const access = await prisma.chapterAccess.findFirst({
          where: { chapterId: chapter.id, userId },
        });
        if (!access) {
           res.status(403).json({ error: 'No tienes acceso a este capítulo.' });
        }else{
          res.json(chapter);
        }
      }
    }

    

    
  } catch (err) {
    res.status(500).json({ error: 'Error getting chapter', detail: err });
  }
};

export const updateChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, number, releaseDate, public: isPublic } = req.body;
    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        title,
        number: parseInt(number),
        releaseDate: new Date(releaseDate),
        public: isPublic === 'true' || isPublic === true
      },
    });
    res.json(chapter);
  } catch (err) {
    res.status(404).json({ error: 'Chapter not found', detail: err });
  }
};

export const deleteChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.chapter.delete({ where: { id } });
    res.json({ message: 'Chapter deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Chapter not found', detail: err });
  }
};

export const grantChapterAccess = async (req: Request, res: Response) => {
  try {
    const { userId, chapterId, paymentId } = req.body;

    const access = await prisma.chapterAccess.create({
      data: { userId, chapterId, paymentId },
    });

    res.status(201).json({ message: 'Acceso otorgado', access });
  } catch (err) {
    res.status(500).json({ error: 'Error al otorgar acceso', detail: err });
  }
};

export const getChapterWithAccess = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: chapterId } = req.params;
    const userId = req.user?.id;

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { manga: true },
    });

    if (!chapter){  res.status(404).json({ error: 'Capítulo no encontrado' });}else{
      if (!chapter.public) {
        const access = await prisma.chapterAccess.findFirst({
          where: { chapterId, userId },
        });
  
        if (!access) {
           res.status(403).json({ error: 'No tienes acceso a este capítulo.' });
        }else{
          res.json(chapter);
        }
      }
    }

    

    
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener capítulo', detail: err });
  }
};


  