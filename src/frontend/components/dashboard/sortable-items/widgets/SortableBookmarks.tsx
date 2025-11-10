import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grid2 } from '@mui/material';
import React from 'react';

import { BookmarksWidget } from '../../base-items/widgets/BookmarksWidget';
import { WidgetContainer } from '../../base-items/widgets/WidgetContainer';


type Props = {
    id: string;
    editMode: boolean;
    isOverlay?: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onDuplicate?: () => void;
    config?: {
        title?: string;
        hideTitle?: boolean;
        hideIcons?: boolean;
        hideHostnames?: boolean;
        bookmarks?: Array<{ id: string; name: string; url: string; icon?: string }>;
    };
};

export const SortableBookmarksWidget: React.FC<Props> = ({ id, editMode, isOverlay = false, onDelete, onEdit, onDuplicate, config }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    return (
        <Grid2
            size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
            ref={!isOverlay ? setNodeRef : undefined}
            {...(!isOverlay ? attributes : {})}
            {...(!isOverlay ? listeners : {})}
            sx={{
                transition,
                transform: transform ? CSS.Translate.toString(transform) : undefined,
                opacity: isOverlay ? .6 : 1,
                visibility: isDragging ? 'hidden' : 'visible'
            }}
        >
            <WidgetContainer editMode={editMode} id={id} onDelete={onDelete} onEdit={onEdit} onDuplicate={onDuplicate}>
                <BookmarksWidget config={config} />
            </WidgetContainer>
        </Grid2>
    );
};
