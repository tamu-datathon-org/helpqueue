import React from 'react';
import { useDrag, useDrop, DndProvider, DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HamburgerIcon } from '@chakra-ui/icons';

interface PreferenceEditorProps {
  preferences: string[];
  setPreferences: React.Dispatch<React.SetStateAction<string[]>>;
}

interface DraggableItemProps {
  challenge: string;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ challenge, index, moveItem }) => {
  const ref = React.useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'ITEM',
    item: { index },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ITEM',
    hover: (item: { index: number }, monitor: DropTargetMonitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      style={{ opacity: isDragging ? 0.2 : 1 }}
      className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-300"
    >
      <span className="text-gray-600 font-medium">{index + 1}.</span>
      <span className="flex-1 mx-2">{challenge}</span>
      <HamburgerIcon boxSize={4} className="text-gray-500" />
    </li>
  );
};

const PreferenceEditorInternal: React.FC<PreferenceEditorProps> = ({ preferences, setPreferences }) => {
  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedPreferences = [...preferences];
    const [movedItem] = updatedPreferences.splice(fromIndex, 1);
    updatedPreferences.splice(toIndex, 0, movedItem);
    setPreferences(updatedPreferences);
    localStorage.setItem('mentorPreferences', JSON.stringify(updatedPreferences));
  };

  return (
    <ul className="space-y-2">
      {preferences.map((challenge, index) => (
        <DraggableItem key={challenge} challenge={challenge} index={index} moveItem={moveItem} />
      ))}
    </ul>
  );
};

const PreferenceEditor: React.FC<PreferenceEditorProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <PreferenceEditorInternal {...props} />
    </DndProvider>
  );
};

export default PreferenceEditor;