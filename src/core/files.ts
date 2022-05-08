import { assert } from "./assert";

export enum EFileType {
    Image = 'Image',
    Video = 'Video',
    Audio = 'Audio'
}

export function getFileType(file: Express.Multer.File): EFileType {
    const typeRaw = file.mimetype.split('/')[0];

    const availableMimeTypes = ['image', 'video', 'audio'];

    assert(availableMimeTypes.includes(typeRaw), `Multer file type must be one of following: ${availableMimeTypes.join(', ')}`);

    switch (typeRaw) {
        case 'image':
            return EFileType.Image;
        case 'video':
            return EFileType.Video;
        case 'audio':
            return EFileType.Audio;
        default:
            throw Error('Unknown type');
    }
}
