"use client"
import React, { useState } from 'react';
import PatientInfo from './pages/PatientInfo';

const YourComponent = () => {
  const [responseData, setResponseData] = useState(null);
  const [encounterId, setEncounterId] = useState(null); // State to store EncounterId
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('Click to Proceed');
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    id: '',
    ssn: '',
    gender: 'female',
    dobMonth: 0,
    dobDay: 0,
    dobYear: 0
  });

  const fetchData = async () => {
    const url = 'https://www.ptimhservice.com/api/v2/imh/encounters';
    const username = '64077fae-24ff-41bd-aefc-c626054330fb';
    const password = 'Promptly1@$';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponseData(data); // Update state with response data
      if (data && data.Encounter && data.Encounter.EncounterId) {
        setEncounterId(data.Encounter.EncounterId); // Set EncounterId state
        console.log('Encounter created with EncounterId:', data.Encounter.EncounterId);
      } else {
        console.error('Encounter creation failed:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsButtonDisabled(true);
    setButtonText('Started');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value });
  };

  const handleDateChange = (e) => {
    const dob = new Date(e.target.value);
    setPatientInfo({
      ...patientInfo,
      dobMonth: dob.getMonth() + 1, // Month is 0-based, so add 1
      dobDay: dob.getDate(),
      dobYear: dob.getFullYear()
    });
  };

  const submitPatientInfo = async (e) => {
    e.preventDefault();
    if (!encounterId) {
      console.error('No EncounterId available');
      return;
    }

    const url = `https://www.ptimhservice.com/api/v2/imh/encounters/${encounterId}/patient`;
    const username = '64077fae-24ff-41bd-aefc-c626054330fb';
    const password = 'Promptly1@$';

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`
        },
        body: JSON.stringify({
          Patient: {
            FirstName: patientInfo.firstName,
            MiddleName: patientInfo.middleName,
            LastName: patientInfo.lastName,
            Id: patientInfo.id,
            SSN: patientInfo.ssn,
            Gender: patientInfo.gender,
            DOBMonth: patientInfo.dobMonth,
            DOBDay: patientInfo.dobDay,
            DOBYear: patientInfo.dobYear
          }
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Patient info updated:', data);
    } catch (error) {
      console.error('Error submitting patient info:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <button className='bg-blue-500 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={fetchData} disabled={isButtonDisabled}>{buttonText}</button>
      <div>
        {responseData && (
          <div>
            {buttonText === 'Started' && (
              <form onSubmit={submitPatientInfo} className="mt-4">
                <div>
                  <label htmlFor="firstName">First Name:</label>
                  <input type="text" id="firstName" name="firstName" value={patientInfo.firstName} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="middleName">Middle Name:</label>
                  <input type="text" id="middleName" name="middleName" value={patientInfo.middleName} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name:</label>
                  <input type="text" id="lastName" name="lastName" value={patientInfo.lastName} onChange={handleInputChange} />
                </div>
                <div>
                  <label htmlFor="dob">Date of Birth:</label>
                  <input type="date" id="dob" name="dob" onChange={handleDateChange} />
                </div>
                {/* Add other form fields as needed */}
                <button type="submit" className='bg-green-500 mt-4 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Submit Patient Info</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YourComponent;
