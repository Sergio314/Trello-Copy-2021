import React, { useState } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  DraggableLocation
} from "react-beautiful-dnd";

import Column, { NewColumn } from "./components/Column";
import AddColumnButton from "./components/AddColumnButton";
import { useBoard } from "./context/BoardContext";

import { reorderList, switchCards } from "./utils/listUtils";
import { Column as ColumnInterface } from "./types";
import { Board, Header, List } from "./styles";

import "./styles/style.scss";

const AddNewColumn: React.FC = () => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const { columns, addColumn } = useBoard();

  const cancelColumnAddition = () => {
    setIsAddingColumn(false);
  };

  const addNewColumn = (id: string, title: string) => {
    addColumn(id, title);
    setIsAddingColumn(false);
  };

  if (isAddingColumn) {
    return (
      <NewColumn onSuccess={addNewColumn} onDismiss={cancelColumnAddition} />
    );
  }

  return (
    <AddColumnButton
      isFirst={columns?.length === 0}
      onClick={() => setIsAddingColumn(true)}
      disabled={columns?.length >=5}
    />
  );
};

export default function App() {
  const { columns, setColumns, } = useBoard();

  const onCardDrag = (result: DropResult) => {
    const sourceColumnIndex = columns.findIndex(
      (column) => column.id === result.source.droppableId
    );
    const sourceCardIndex = result.source.index; 

    const destinationColumnIndex = columns.findIndex(
      (column) => column.id === result.destination?.droppableId
    );
    const destinationCardIndex = (result.destination as DraggableLocation)
      .index;

    setColumns(() =>
      switchCards(
        columns,
        sourceColumnIndex,
        sourceCardIndex,
        destinationColumnIndex,
        destinationCardIndex
      )
    );
  };

  const onColumnDrag = (result: DropResult) => {
    setColumns(
      reorderList<ColumnInterface>(
        columns,
        result.source.index,
        (result.destination as DraggableLocation).index
      )
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.type === "card") {
      onCardDrag(result);
      return;
    }

    if (result.type === "column") {
      onColumnDrag(result);
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Header />
      <Board>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided, snapshot) => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {columns.map((column, index) => (
                <Column
                  currentIndex={index}
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  cards={column.cards}
                />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
        <div>
          <AddNewColumn />
        </div>
      </Board>
    </DragDropContext>
  );
}
