/**
 * @file Book Card component
 * Displays book cover image, book title and author, and opens book detail modal on click
 */

import { Card as MuiCard, CardActionArea, Box } from '@mui/material';
import * as React from 'react';
import type { Book } from '../types/book';
import { sx, sizes } from '../themes/themePrimitives';
import SafeImage from './SafeImage';

interface CardProps {
    book: Book;
    handleModalOpen: (book?: Book | null) => void;
}

export default function Card({ book, handleModalOpen }: CardProps) {
    const [noUpscale, setNoUpscale] = React.useState(false);

    // Memoize image source to avoid recalculation
    const imgSrc = React.useMemo(() => {
        return book.cover_url || `${import.meta.env.BASE_URL}static/images/default-cover.jpg`;
    }, [book.cover_url]);

    return (
        <MuiCard sx={{ width: sizes.cover.width }}>
            <CardActionArea onClick={() => handleModalOpen(book)}>
                <Box sx={{ ...sx.coverViewport, width: sizes.cover.width, height: sizes.cover.height }}>
                    <SafeImage
                        src={imgSrc}
                        alt={book.title || 'Book cover'}
                        onLoad={(e: any) => {
                            try {
                                const nw = e.currentTarget.naturalWidth;
                                const nh = e.currentTarget.naturalHeight;
                                if (nw <= sizes.cover.width && nh <= sizes.cover.height) {
                                    setNoUpscale(true);
                                } else {
                                    setNoUpscale(false);
                                }
                            } catch (err) {
                                setNoUpscale(false);
                            }
                        }}
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: noUpscale ? 'contain' : 'cover',
                            objectPosition: 'center',
                        }}
                    />
                </Box>
            </CardActionArea>
        </MuiCard>
    );
}