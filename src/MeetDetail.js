import React, { useEffect, useState } from 'react';
import { collection, getDoc, doc } from 'firebase/firestore';
import styled from 'styled-components';
import { dbService } from './fbase';
import { useParams } from 'react-router-dom';

// 스타일 정의
const Container = styled.div`
  padding: 20px;
`;

const MeetingItem = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  margin: 0 0 10px;
`;

const Description = styled.p`
  margin: 0 0 10px;
`;

const Info = styled.p`
  margin: 5px 0;
`;

const TimeTable = styled.table`
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
`;

const TimeCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  cursor: pointer;

  &.selected {
    background-color: #4caf50;
    color: white;
  }

  &:hover {
    background-color: #ddd;
  }
`;

// 날짜와 요일 가져오기
const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

// MeetDetail 컴포넌트
const MeetDetail = () => {
  const { id } = useParams(); // URL에서 ID 가져오기
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState([]); // 선택된 시간 상태 추가

  useEffect(() => {
    const fetchMeeting = async (meetingId) => {
      setLoading(true);
      try {
        const meetingDoc = doc(dbService, 'meeting', meetingId);
        const meetingSnapshot = await getDoc(meetingDoc);

        if (meetingSnapshot.exists()) {
          setMeeting({ id: meetingSnapshot.id, ...meetingSnapshot.data() });
        } else {
          console.log('No such document!');
          setMeeting(null);
        }
      } catch (error) {
        console.error('Error fetching meeting: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting(id); // useEffect에서 특정 ID로 호출
  }, [id]);

  const handleTimeClick = (day, time) => {
    setSelectedTimes((prev) => {
      const selectedKey = `${day}-${time}`;
      if (prev.includes(selectedKey)) {
        return prev.filter((t) => t !== selectedKey); // 이미 선택된 시간은 취소
      }
      return [...prev, selectedKey]; // 새로 선택
    });
  };

  const renderTimeTable = () => {
    if (!meeting) return null;

    const { startTime, endTime, selectedDays } = meeting;

    // 시작 시간과 끝 시간을 숫자로 변환
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);

    return (
      <TimeTable>
        <thead>
          <tr>
            <th>Time / Date</th>
            {selectedDays.map((day) => (
              <th key={day}>{getDayName(day)} ({day})</th> // 날짜와 요일 표시
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 30분 단위로 시간 슬롯 생성 */}
          {[...Array(endHour - startHour + 1).keys()].flatMap((hour) => {
            return (
              <>
                <tr key={`${hour}-0`}>
                  <td>{startHour + hour}:00</td>
                  {selectedDays.map((day) => {
                    const formattedTime = `${startHour + hour}:00`;
                    return (
                      <TimeCell
                        key={`${day}-${formattedTime}`}
                        className={selectedTimes.includes(`${day}-${formattedTime}`) ? 'selected' : ''}
                        onClick={() => handleTimeClick(day, formattedTime)}
                      >
                        {selectedTimes.includes(`${day}-${formattedTime}`) ? formattedTime : ''}
                      </TimeCell>
                    );
                  })}
                </tr>
                <tr key={`${hour}-30`}>
                  <td>{startHour + hour}:30</td>
                  {selectedDays.map((day) => {
                    const formattedTime = `${startHour + hour}:30`;
                    return (
                      <TimeCell
                        key={`${day}-${formattedTime}`}
                        className={selectedTimes.includes(`${day}-${formattedTime}`) ? 'selected' : ''}
                        onClick={() => handleTimeClick(day, formattedTime)}
                      >
                        {selectedTimes.includes(`${day}-${formattedTime}`) ? formattedTime : ''}
                      </TimeCell>
                    );
                  })}
                </tr>
              </>
            );
          })}
        </tbody>
      </TimeTable>
    );
  };

  const renderSelectedSchedule = () => {
    if (!selectedTimes.length) return null;

    return (
      <div>
        <h2>Selected Schedule</h2>
        <ul>
          {selectedTimes.map((time) => (
            <li key={time}>{time.split('-')[1]} on {time.split('-')[0]}</li> // 날짜와 시간 표시
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>Meeting Details</h1>
      {meeting ? (
        <MeetingItem>
          <Title>{meeting.name}</Title>
          <Description>{meeting.description}</Description>
          <Info>Year: {meeting.selectedYear}</Info>
          <Info>Month: {meeting.selectedMonth}</Info>
          <Info>Days: {meeting.selectedDays.join(', ')}</Info>
          <Info>Start Time: {meeting.startTime}</Info>
          <Info>End Time: {meeting.endTime}</Info>

          {/* 시간 선택 테이블 추가 */}
          <h2>Select Time Slots</h2>
          {renderTimeTable()}
          {renderSelectedSchedule()} {/* 선택된 시간표 표시 */}
        </MeetingItem>
      ) : (
        <p>No meeting found.</p>
      )}
    </Container>
  );
};

export default MeetDetail;
