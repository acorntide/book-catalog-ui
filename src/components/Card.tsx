import { Card as MuiCard, CardActions, CardActionArea, CardMedia } from '@mui/material';
import { FavoriteBorder, TurnedInNot } from '@mui/icons-material';

interface CardProps {
  handleModalOpen: () => void;
}

export default function Card({ handleModalOpen }: CardProps) {
    return (
        <MuiCard sx={{ maxWidth: 188 }}>
            <CardActionArea onClick={handleModalOpen}>
                <CardMedia
                    component="img"
                    height="240"
                    image="/static/images/everyone-poops.jpg"
                    alt="everyone poops"
                />
            </CardActionArea>
            <CardActions>
                <FavoriteBorder fontSize='small' />
                <TurnedInNot fontSize='small' />
            </CardActions>
        </MuiCard>
    );
}