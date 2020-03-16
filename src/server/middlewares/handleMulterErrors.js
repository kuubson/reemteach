import { MulterError } from 'multer'

import { multer } from '@middlewares'

export default image => (req, res, next) =>
    multer.single(image)(req, res, error => {
        switch (true) {
            case error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE':
                next(new ApiError('Wybrany plik ma za duży rozmiar!', 500))
                break
            case req.allowedExtenstionsError:
                next(new ApiError('Wybrany plik ma niedozwolone rozszerzenie!', 500))
                break
            default:
                next()
        }
    })
