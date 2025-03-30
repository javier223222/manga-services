import { Request, Response } from 'express';
import prisma from '../../prisma/client';

import { uploadFile } from '../services/cloudinary.service';
import { UploadedFile } from 'express-fileupload';

export const createChapter = async (req: Request, res: Response) => {
    try {
      const { mangaId, number, title, releaseDate } = req.body;
      const pdf = req.files?.pdf;
  
      if (!pdf){ res.status(400).json({ error: 'PDF is required' });}else{
        const pdfUrl = await uploadFile(pdf as UploadedFile, 'raw');
  
        const chapter = await prisma.chapter.create({
          data: {
            mangaId,
            number: parseInt(number),
            title,
            releaseDate: new Date(releaseDate),
            pdfUrl,
          },
        });
    
        res.status(201).json(chapter);
      }
  
   
    } catch (err) {
      res.status(500).json({ error: 'Error creating chapter', detail: err });
    }
  };
  
  export const getAllChapters = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
  
      const [total, chapters] = await Promise.all([
        prisma.chapter.count(),
        prisma.chapter.findMany({ skip, take: limit, include: { manga: true } }),
      ]);
  
      const totalPages = Math.ceil(total / limit);
  
      res.json({ total, totalPages, currentPage: page, limit, chapters });
    } catch (err) {
      res.status(500).json({ error: 'Error getting chapters', detail: err });
    }
  };
  
  export const getChapterById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const chapter = await prisma.chapter.findUnique({
        where: { id },
        include: { manga: true },
      });
      if (!chapter){
          res.status(404).json({ error: 'Chapter not found' });}else{
            res.json(chapter);
         }
      
    } catch (err) {
      res.status(500).json({ error: 'Error getting chapter', detail: err });
    }
  };
  
  export const updateChapter = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, number, releaseDate } = req.body;
      const chapter = await prisma.chapter.update({
        where: { id },
        data: {
          title,
          number: parseInt(number),
          releaseDate: new Date(releaseDate),
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