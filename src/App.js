import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import styled from 'styled-components';
import { dbService } from './fbase';

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const TitleInput = styled.input`
  width: 300px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const DescriptionInput = styled.textarea`
  width: 300px;
  height: 100px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const DateInput = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-top: 20px;
`;

const DayBox = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: ${(props) => 
    props.isSelected ? '#f39c12' : '#f0f0f0'};
  color: ${(props) => (props.isSelected ? 'white' : 'black')};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isSelected ? '#45a049' : '#ddd')};
  }
`;

// 메인 컴포넌트
const App = () => {
  const today = new Date(); // 오늘 날짜
  const [meetingName, setMeetingName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 월은 0부터 시작하므로 +1
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedDays, setSelectedDays] = useState([today.getDate()]); // 오늘 날짜 기본 선택

  // 선택한 년/월에 맞는 달력 갱신
  useEffect(() => {
    const updateCalendar = () => {
      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 해당 달의 첫째 날 요일
      const lastDateOfMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // 해당 달의 마지막 날짜
      const daysArray = Array.from({ length: lastDateOfMonth }, (_, i) => ({
        day: i + 1,
        isToday: selectedYear === today.getFullYear() && selectedMonth === today.getMonth() + 1 && i + 1 === today.getDate(),
      }));

      // 앞에 비는 요일 채우기
      for (let i = 0; i < firstDayOfMonth; i++) {
        daysArray.unshift(null); // null로 빈 공간을 채움
      }

      setDaysInMonth(daysArray);
    };

    updateCalendar();
  }, [selectedYear, selectedMonth]);

  const handleDateChange = (type, value) => {
    if (type === 'year') {
      setSelectedYear(Number(value));
    } else if (type === 'month') {
      setSelectedMonth(Number(value));
    }
  };

  const handleDayClick = (day) => {
    // 이미 선택된 날짜면 선택 해제, 선택되지 않은 날짜면 선택
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter(selectedDay => selectedDay !== day)
        : [...prevSelectedDays, day]
    );
  };

  const handleSubmit = async() => {
    console.log('Meeting Name:', meetingName);
    console.log('Description:', description);
    console.log('Selected Year:', selectedYear);
    console.log('Selected Month:', selectedMonth);
    console.log('Selected Days:', selectedDays);

    const meetingCollection = collection(dbService, "meeting");
    const newMeetingData = {
      name: meetingName,
      description: description,
      selectedYear: selectedYear,
      selectedMonth: selectedMonth,
      selectedDays: selectedDays
    };

    await addDoc(meetingCollection, newMeetingData);
  };

  return (
    <Container>
      <h1>Meeting Scheduler</h1>
      <TitleInput
        type="text"
        placeholder="Enter meeting name"
        value={meetingName}
        onChange={(e) => setMeetingName(e.target.value)}
      />
      <DescriptionInput
        placeholder="Enter meeting description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DateInput>
        <Select value={selectedYear} onChange={(e) => handleDateChange('year', e.target.value)}>
          {Array.from({ length: 10 }, (_, i) => today.getFullYear() + i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
        <Select value={selectedMonth} onChange={(e) => handleDateChange('month', e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </Select>
      </DateInput>

      <CalendarContainer>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <DayBox key={dayName} isToday={false}>{dayName}</DayBox>
        ))}
        {daysInMonth.map((day, index) =>
          day ? (
            <DayBox
              key={index}
              isSelected={selectedDays.includes(day.day)}
              onClick={() => handleDayClick(day.day)}
            >
              {day.day}
            </DayBox>
          ) : (
            <div key={index}></div>
          )
        )}
      </CalendarContainer>

      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
};

export default App;
