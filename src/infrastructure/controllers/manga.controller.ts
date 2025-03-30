import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import { uploadFile } from '../services/cloudinary.service';
import { UploadedFile } from 'express-fileupload';
import {AuthenticatedRequest} from "../middlewares/authMiddleware";
export const createManga = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, genre } = req.body;
    const authorId = req.user.id; // Assuming the user ID is stored in req.user after authentication
    const cover = req.files?.cover;

    if (!cover){ 
         res.status(400).json({ error: 'Cover image is required' });
    }else{
        const coverUrl = await uploadFile(cover as UploadedFile, 'image');

    const manga = await prisma.manga.create({
      data: { title, description, authorId, genre, coverUrl },
    });

    res.status(201).json(manga);

    }

    
  } catch (err) {
    res.status(500).json({ error: 'Error creating manga', detail: err });
  }
};
export const getMangasByTag = async (req: Request, res: Response) => {
    try {
      const { tagId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
  
      const [total, mangas] = await Promise.all([
        prisma.mangaTag.count({ where: { tagId } }),
        prisma.mangaTag.findMany({
          where: { tagId },
          skip,
          take: limit,
          include: { manga: true },
        })
      ]);
  
      const totalPages = Math.ceil(total / limit);
      const mangaList = mangas.map(mt => mt.manga);
  
      res.json({ total, totalPages, currentPage: page, limit, mangas: mangaList });
    } catch (err) {
      res.status(500).json({ error: 'Error getting mangas by tag', detail: err });
    }
  };
export const getAllMangas = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
  
      const [total, mangas] = await Promise.all([
        prisma.manga.count(),
        prisma.manga.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      ]);
  
      const totalPages = Math.ceil(total / limit);
  
      res.json({ total, totalPages, currentPage: page, limit, mangas });
    } catch (err) {
      res.status(500).json({ error: 'Error getting mangas', detail: err });
    }
  };
  
  export const getMangasByAuthor = async (req: Request, res: Response) => {
    try {
      const { authorId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
  
      const [total, mangas] = await Promise.all([
        prisma.manga.count({ where: { authorId } }),
        prisma.manga.findMany({ where: { authorId }, skip, take: limit }),
      ]);
  
      const totalPages = Math.ceil(total / limit);
  
      res.json({ total, totalPages, currentPage: page, limit, mangas });
    } catch (err) {
      res.status(500).json({ error: 'Error getting mangas by author', detail: err });
    }
  };
  
  export const getMangaById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const manga = await prisma.manga.findUnique({
        where: { id },
        include: { chapters: true, tags: { include: { tag: true } } },
      });
      if (!manga){  res.status(404).json({ error: 'Manga not found' });}else{
        res.json(manga);
      }
     
    } catch (err) {
      res.status(500).json({ error: 'Error getting manga', detail: err });
    }
  };
  
  export const updateManga = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, genre } = req.body;
      const manga = await prisma.manga.update({
        where: { id },
        data: { title, description, genre },
      });
      res.json(manga);
    } catch (err) {
      res.status(404).json({ error: 'Manga not found', detail: err });
    }
  };
  
  export const deleteManga = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.manga.delete({ where: { id } });
      res.json({ message: 'Manga deleted' });
    } catch (err) {
      res.status(404).json({ error: 'Manga not found', detail: err });
    }
  };
