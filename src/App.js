import React, { useState } from 'react';
import styled from 'styled-components';

const App = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [meetingName, setMeetingName] = useState('');
  const [description, setDescription] = useState('');

  const handleDateClick = (date) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Meeting Name:', meetingName);
    console.log('Description:', description);
    console.log('Selected Dates:', selectedDates);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Label>Meeting Name</Label>
        <Input
          type="text"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          placeholder="Enter meeting name"
        />
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter meeting description"
        />
        <Label>Select Dates</Label>
        <DateGrid>
          {[...Array(30).keys()].map((i) => {
            const date = i + 1;
            return (
              <DateButton
                key={date}
                selected={selectedDates.includes(date)}
                onClick={() => handleDateClick(date)}
              >
                {date}
              </DateButton>
            );
          })}
        </DateGrid>
        <SubmitButton type="submit">Submit</SubmitButton>
      </Form>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
`;

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  height: 100px;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

const DateButton = styled.button`
  padding: 10px;
  background-color: ${(props) => (props.selected ? '#4CAF50' : '#f1f1f1')};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.selected ? '#45a049' : '#ddd')};
  }
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;


export default App;
