import { Grid as MuiGrid } from '@mui/material';
import Card from './Card';

interface GridProps {
  handleModalOpen: () => void;
}

export default function Grid({ handleModalOpen }: GridProps) {
  return (
    <MuiGrid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
    >
        {Array.from(Array(10)).map((_, index) => (
            <MuiGrid
                key={index}
                size="auto"
            >
                <Card handleModalOpen={handleModalOpen} />
            </MuiGrid>
        ))}
    </MuiGrid>
  );
}