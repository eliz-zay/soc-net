import { ETag, Tag } from '../../model';

export const tagSeeds = [
    new Tag({ code: ETag.Architecture, name: 'Архитектура' }),
    new Tag({ code: ETag.Art, name: 'Искусство' }),
    new Tag({ code: ETag.Business, name: 'Бизнес' }),
    new Tag({ code: ETag.Cooking, name: 'Кулинария' }),
    new Tag({ code: ETag.IT, name: 'IT' }),
    new Tag({ code: ETag.Music, name: 'Музыка' }),
    new Tag({ code: ETag.Nature, name: 'Природа' }),
    new Tag({ code: ETag.Travelling, name: 'Путешествия' }),
];
