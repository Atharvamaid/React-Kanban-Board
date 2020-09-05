import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import uuid from 'uuid/dist/v4';
import {BsPlus} from 'react-icons/bs'
import {Navbar, Form,NavbarBrand, Toast, ToastBody, ToastHeader, Card, CardHeader, CardBody, UncontrolledCollapse, FormGroup, Input, Label, Button} from 'reactstrap';
const cards = [
  {
    id : uuid(),
    content : 'first task'
  },
  {
    id : uuid(),
    content : 'second task'
  },
  {
    id : uuid(),
    content : 'third task'
  },
  {
    id : uuid(),
    content : 'task 4'
  }
];

const columnsFromBackend = 
{
    [uuid()]: {
      id : 'col1',
      name : 'Todo',
      items : cards
    },
    [uuid()]:{
      id : 'col2',
      name : 'Inprogress',
      items : []
    },
    [uuid()]:{
      id : 'col3',
      name : 'Bugs',
      items : []
    },
    [uuid()]:{
      id : 'col4',
      name : 'Done',
      items : []
    }
};

const onDragEnd = (result, columns, setColumns)=>{
  if (!result.destination)return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items : sourceItems
      },
      [destination.droppableId]:{
        ...destColumn,
        items : destItems
      }
    })
  }
  else{
    const column = columns[source.droppableId];
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]:{
        ...column,
        items : copiedItems
      }
    });
  }
};




function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [value, setValue] = useState("");
   const i = '#';

   const submit = (e)=>{
    e.preventDefault();
    if (e.target.id==="col1"){
      cards.push({
          id : uuid(),
          content : value
      });
      
    }

    setValue("");
    }

  return (
    <div>
      <Navbar expand="md">
        <NavbarBrand href="" className="text-white" style={{ fontSize : '30px' }}>Kanban-Board</NavbarBrand>
      </Navbar>
      <div className="mt-4 container-fluid " >
        <div className="row">
        <DragDropContext  onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column])=>{
          return(
            <div className="col-md-3 ">
              <h3 className="text-white text-center">{column.name}</h3>
              <div>
            <Droppable droppableId={id} >
                {(provided, snapshot)=>{
                  return(
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ backgroundColor : '#d9d9d9' }}
                      className=" p-2 rounded"
                      >
                        {column.items.map((item,index)=>{
                          return(
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot)=>{
                                  return(
                                    <div ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                   
                                      >
                                          <Card className="m-2">
                                            <CardHeader className="font-weight-bold">Task : </CardHeader>
                                  <CardBody>{item.content}</CardBody>
                                          </Card>
                                    </div>
                                  );
                                }}
                            </Draggable>
                            
                          );
                        })}
                        {provided.placeholder}
                        <ToastHeader  id={column.name}  style={{ cursor : "pointer", backgroundColor : "#f2f2f2" }} className="m-2"><BsPlus />Add Card</ToastHeader>
                        <UncontrolledCollapse toggler={i+column.name} className="bg-light p-2 mt-2 mx-2">
                         <Form onSubmit={submit} id={column.id}>
                                <FormGroup>
                                  <Label>Enter Task : </Label>
                                  <Input type="text" placeholder="enter task" value={value} onChange={ (e)=> setValue(e.target.value) } required />
                                </FormGroup>
                                <Button color="primary">Add Card</Button>
                              </Form>
                          
                        </UncontrolledCollapse>
                    </div>
                  )
                }}
            </Droppable>
            </div>
            </div>
          )
        })}
        </DragDropContext>
        </div>
    </div>
    </div>
  );
}

export default App;
