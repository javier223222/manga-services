import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const tag = await prisma.tag.create({ data: { name } });
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ error: 'Error creating tag', detail: err });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: 'Error getting tags', detail: err });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag){
        res.status(404).json({ error: 'Tag not found' });
    } else{
        res.json(tag);

    }
    
  } catch (err) {
    res.status(500).json({ error: 'Error getting tag', detail: err });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const tag = await prisma.tag.update({
      where: { id },
      data: { name },
    });
    res.json(tag);
  } catch (err) {
    res.status(404).json({ error: 'Tag not found', detail: err });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.tag.delete({ where: { id } });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Tag not found', detail: err });
  }
};

export const assignTagToManga = async (req: Request, res: Response) => {
    try {
      const { mangaId, tagId } = req.body;
      const exists = await prisma.mangaTag.findFirst({ where: { mangaId, tagId } });
      if (exists) { res.status(400).json({ error: 'Tag already assigned to manga' });}else{
        const mangaTag = await prisma.mangaTag.create({
            data: { mangaId, tagId },
          });
          res.status(201).json(mangaTag);
      }
  
     
    } catch (err) {
      res.status(500).json({ error: 'Error assigning tag', detail: err });
    }
  };
  
  export const removeTagFromManga = async (req: Request, res: Response) => {
    try {
      const { mangaId, tagId } = req.body;
      await prisma.mangaTag.deleteMany({ where: { mangaId, tagId } });
      res.json({ message: 'Tag removed from manga' });
    } catch (err) {
      res.status(500).json({ error: 'Error removing tag', detail: err });
    }
  };
  