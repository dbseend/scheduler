// Gemini.jsx
import React, { useState } from "react";
import { storage } from "./fbase"; // Firebase 설정 파일
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import OpenAI from "openai"; // OpenAI API 사용

const TimetableOrganizer = () => {
  const [file, setFile] = useState(null);
  const [timetableData, setTimetableData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Firebase Storage에 파일 업로드
    const storageRef = ref(storage, `timetables/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);

    // OpenAI API 초기화
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });

    // 시간표 분석 요청
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `Please analyze the uploaded photo of the timetable at this URL: ${fileURL} and extract the relevant information.`,
          },
        ],
      });

      const organizedData = organizeTimetableData(completion.choices[0].message.content);
      setTimetableData(organizedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const organizeTimetableData = (data) => {
    const timetable = {};

    // 예시: 텍스트를 줄 단위로 나누고, 각 줄을 분석하여 시간표 객체 생성
    const lines = data.split("\n");
    lines.forEach((line) => {
      const [time, subject] = line.split(":"); // 예시: "09:00: Math"
      if (time && subject) {
        timetable[time.trim()] = subject.trim();
      }
    });

    return timetable;
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Timetable</button>
      {timetableData && (
        <div>
          <h3>Organized Timetable:</h3>
          <pre>{JSON.stringify(timetableData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TimetableOrganizer;
