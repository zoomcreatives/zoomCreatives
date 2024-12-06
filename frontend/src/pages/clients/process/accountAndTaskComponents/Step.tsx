// import React, { useState, useEffect } from 'react';
// import { Timeline, Select } from 'antd';
// import { CheckCircle, Clock, XCircle } from 'lucide-react';

// const { Option } = Select;

// const Step = ({ client, allData }) => {
//   const [completedSteps, setCompletedSteps] = useState({});

//   // Debugging Logs
//   console.log("Client ID:", client);
//   console.log("All Data:", allData);

//   // Validate the structure of allData
//   if (!allData || !Array.isArray(allData.application)) {
//     console.error("Invalid allData or application array:", allData);
//     return <p>Data structure is invalid. Please check the input data.</p>;
//   }

//   // Find clientData based on client ID
//   const clientData = allData.application.find(
//     (data) => String(data.clientId?._id) === String(client)
//   );

//   if (!clientData) {
//     console.warn("No matching client data found for ID:", client);
//     return <p>No data found for the specified client.</p>;
//   }

//   // Initialize completed steps when clientData is available
//   useEffect(() => {
//     if (clientData?.step?.stepName?.length > 0) {
//       const initialSteps = clientData.step.stepName.reduce((acc, step) => {
//         acc[step] = 'pending'; // Default to 'pending'
//         return acc;
//       }, {});
//       setCompletedSteps(initialSteps);
//     }
//   }, [clientData]);

//   // Update step status
//   const handleStatusChange = (step, value) => {
//     setCompletedSteps((prevState) => ({
//       ...prevState,
//       [step]: value,
//     }));
//   };

//   // Render step status with color and icon
//   const renderStatus = (status) => {
//     switch (status) {
//       case 'completed':
//         return { color: 'green', icon: <CheckCircle className="h-5 w-5 text-green-500" /> };
//       case 'processing':
//         return { color: 'yellow', icon: <Clock className="h-5 w-5 text-yellow-500" /> };
//       default:
//         return { color: 'gray', icon: <XCircle className="h-5 w-5 text-gray-400" /> };
//     }
//   };

//   return (
//     <div>
//       <h1>
//         {/* Client: {clientData.clientName} ({clientData.country}) */}
//       </h1>
//       <Timeline>
//         {clientData.step.stepName.map((stepName) => {
//           const status = completedSteps[stepName] || 'pending'; // Default to 'pending'
//           const { color, icon } = renderStatus(status);

//           return (
//             <Timeline.Item
//               key={stepName}
//               color={color}
//               dot={icon}
//             >
//               <div className="flex items-center justify-between">
//                 <h2>
//                   {stepName}{" "}
//                   {status === 'completed'
//                     ? '(Completed)'
//                     : status === 'processing'
//                     ? '(Processing)'
//                     : '(Pending)'}
//                 </h2>
//                 <Select
//                   defaultValue={status}
//                   style={{ width: 120 }}
//                   onChange={(value) => handleStatusChange(stepName, value)}
//                 >
//                   <Option value="pending">Pending</Option>
//                   <Option value="processing">Processing</Option>
//                   <Option value="completed">Completed</Option>
//                 </Select>
//               </div>
//             </Timeline.Item>
//           );
//         })}
//       </Timeline>
//     </div>
//   );
// };

// export default Step;






import React, { useState, useEffect } from 'react';
import { Timeline, Select, message } from 'antd';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const { Option } = Select;

const Step = ({ client, allData }) => {
  const [completedSteps, setCompletedSteps] = useState({});

  // Validate the structure of allData
  if (!allData || !Array.isArray(allData.application)) {
    console.error("Invalid allData or application array:", allData);
    return <p>Data structure is invalid. Please check the input data.</p>;
  }

  // Find clientData based on client ID
  const clientData = allData.application.find(
    (data) => String(data.clientId?._id) === String(client)
  );

  if (!clientData) {
    console.warn("No matching client data found for ID:", client);
    return <p>No data found for the specified client.</p>;
  }

  // Initialize completed steps when clientData is available
  useEffect(() => {
    if (clientData?.step) {
      const initialSteps = Object.entries(clientData.step).reduce((acc, [stepName, stepData]) => {
        acc[stepName] = stepData.status || 'pending'; // Default to 'pending' if status not available
        return acc;
      }, {});
      setCompletedSteps(initialSteps);
    }
  }, [clientData]);

  // Update step status
  const handleStatusChange = (step, value) => {
    setCompletedSteps((prevState) => ({
      ...prevState,
      [step]: value,
    }));

    // Sync status with the server
    fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/v1/appointment/updateStatus`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: client, step, status: value }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          message.success('Status updated successfully!');
        } else {
          message.error('Failed to update status.');
        }
      })
      .catch(() => {
        message.error('Failed to communicate with the server.');
      });
  };

  // Render step status with color and icon
  const renderStatus = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'green', icon: <CheckCircle className="h-5 w-5 text-green-500" /> };
      case 'processing':
        return { color: 'yellow', icon: <Clock className="h-5 w-5 text-yellow-500" /> };
      default:
        return { color: 'gray', icon: <XCircle className="h-5 w-5 text-gray-400" /> };
    }
  };

  return (
    <div>
      <h1>
        Client: {clientData.clientName} ({clientData.country})
      </h1>
      <Timeline>
        {/* Iterate through the steps and display each step name */}
        {Object.entries(clientData.step).map(([stepName, stepData]) => {
          const status = stepData.status || 'pending'; // Default to 'pending'
          const { color, icon } = renderStatus(status);

          return (
            <Timeline.Item
              key={stepName}
              color={color}
              dot={icon}
            >
              <div className="flex items-center justify-between">
                <h2>
                  {stepName}{" "}
                  {status === 'completed'
                    ? '(Completed)'
                    : status === 'processing'
                    ? '(Processing)'
                    : '(Pending)'}
                </h2>
                <Select
                  value={status}
                  style={{ width: 120 }}
                  onChange={(value) => handleStatusChange(stepName, value)}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="processing">Processing</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </div>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </div>
  );
};

export default Step;
