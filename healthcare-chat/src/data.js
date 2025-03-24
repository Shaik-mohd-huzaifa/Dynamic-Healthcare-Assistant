// Dummy data for different roles
export const dummyData = {
  doctors: [
    { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiologist', availability: 'Mon-Fri, 9AM-5PM', status: 'Available' },
    { id: 2, name: 'Dr. Michael Chen', specialization: 'Pediatrician', availability: 'Mon-Thu, 10AM-6PM', status: 'In Surgery' },
    { id: 3, name: 'Dr. Emily Brown', specialization: 'Neurologist', availability: 'Tue-Sat, 8AM-4PM', status: 'Available' },
    { id: 4, name: 'Dr. James Wilson', specialization: 'Surgeon', availability: 'Mon-Fri, 8AM-6PM', status: 'In Surgery' },
    { id: 5, name: 'Dr. Lisa Anderson', specialization: 'Emergency Medicine', availability: '24/7', status: 'Available' }
  ],
  appointments: [
    { id: 1, patientName: 'John Doe', date: '2024-03-20', time: '10:00 AM', type: 'Check-up', status: 'Scheduled', doctorId: 1 },
    { id: 2, patientName: 'Jane Smith', date: '2024-03-20', time: '2:30 PM', type: 'Follow-up', status: 'Scheduled', doctorId: 2 },
    { id: 3, patientName: 'Mike Wilson', date: '2024-03-21', time: '11:00 AM', type: 'Emergency', status: 'Completed', doctorId: 3 },
    { id: 4, patientName: 'Sarah Johnson', date: '2024-03-21', time: '3:00 PM', type: 'Consultation', status: 'Scheduled', doctorId: 1 },
    { id: 5, patientName: 'David Brown', date: '2024-03-22', time: '9:00 AM', type: 'Check-up', status: 'Scheduled', doctorId: 2 }
  ],
  patients: [
    { id: 1, name: 'John Doe', dob: '1990-05-15', medicalHistory: 'Hypertension, Asthma', status: 'Regular' },
    { id: 2, name: 'Jane Smith', dob: '1985-08-22', medicalHistory: 'Diabetes Type 2', status: 'Regular' },
    { id: 3, name: 'Mike Wilson', dob: '1995-03-10', medicalHistory: 'None', status: 'Regular' }
  ],
  bills: [
    { id: 1, patientName: 'John Doe', amount: 150, date: '2024-03-19', status: 'Paid' },
    { id: 2, patientName: 'Jane Smith', amount: 200, date: '2024-03-18', status: 'Pending' },
    { id: 3, patientName: 'Mike Wilson', amount: 300, date: '2024-03-17', status: 'Paid' }
  ],
  // New data for ICU and waiting patients
  icuPatients: [
    { id: 1, name: 'Robert Taylor', age: 65, condition: 'Critical', room: 'ICU-101', doctor: 'Dr. Sarah Johnson', admissionDate: '2024-03-19' },
    { id: 2, name: 'Mary Johnson', age: 58, condition: 'Stable', room: 'ICU-102', doctor: 'Dr. Michael Chen', admissionDate: '2024-03-18' },
    { id: 3, name: 'William Brown', age: 72, condition: 'Critical', room: 'ICU-103', doctor: 'Dr. Emily Brown', admissionDate: '2024-03-17' }
  ],
  waitingPatients: [
    { id: 1, name: 'Alice White', waitTime: '15 mins', priority: 'High', doctor: 'Dr. Sarah Johnson', status: 'Waiting' },
    { id: 2, name: 'Bob Green', waitTime: '30 mins', priority: 'Medium', doctor: 'Dr. Michael Chen', status: 'Waiting' },
    { id: 3, name: 'Carol Black', waitTime: '45 mins', priority: 'Low', doctor: 'Dr. Emily Brown', status: 'Waiting' }
  ],
  surgeries: [
    { 
      id: 1, 
      patientName: 'John Doe', 
      doctor: 'Dr. James Wilson', 
      type: 'Heart Surgery',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: '4 hours',
      status: 'Scheduled'
    },
    { 
      id: 2, 
      patientName: 'Mary Johnson', 
      doctor: 'Dr. Sarah Johnson', 
      type: 'Brain Surgery',
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      duration: '6 hours',
      status: 'Scheduled'
    }
  ],
  discharges: [
    {
      id: 1,
      patientName: 'John Doe',
      doctor: 'Dr. Michael Chen',
      dischargeTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours from now
      reason: 'Recovery Complete',
      status: 'Pending'
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      doctor: 'Dr. Emily Brown',
      dischargeTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      reason: 'Post-Surgery Recovery',
      status: 'Pending'
    }
  ]
};

// Utility functions to get Kendo React components with dummy data
export const getKendoComponents = {
  // Patient-related components
  getPatientInfoForm: (patientId) => {
    const patient = dummyData.patients.find(p => p.id === patientId) || dummyData.patients[0];
    return {
      type: 'PatientInfoForm',
      data: {
        name: patient.name,
        dob: patient.dob,
        medicalHistory: patient.medicalHistory
      }
    };
  },

  getAppointmentSchedule: (doctorId) => {
    const doctor = dummyData.doctors.find(d => d.id === doctorId) || dummyData.doctors[0];
    return {
      type: 'AppointmentSchedule',
      data: {
        doctorName: doctor.name,
        specialization: doctor.specialization,
        availability: doctor.availability
      }
    };
  },

  // Doctor-related components
  getPatientRecords: (patientId) => {
    const patient = dummyData.patients.find(p => p.id === patientId) || dummyData.patients[0];
    return {
      type: 'PatientRecords',
      data: {
        patientId: patient.id,
        name: patient.name,
        medicalHistory: patient.medicalHistory
      }
    };
  },

  getDoctorSchedule: (doctorId) => {
    const doctor = dummyData.doctors.find(d => d.id === doctorId) || dummyData.doctors[0];
    const doctorAppointments = dummyData.appointments.filter(a => a.doctorId === doctorId);
    return {
      type: 'DoctorSchedule',
      data: {
        doctorName: doctor.name,
        appointments: doctorAppointments
      }
    };
  },

  // Receptionist-related components
  getAppointmentManagement: (appointmentId) => {
    const appointment = dummyData.appointments.find(a => a.id === appointmentId) || dummyData.appointments[0];
    return {
      type: 'AppointmentManagement',
      data: {
        appointmentId: appointment.id,
        patientName: appointment.patientName,
        date: appointment.date,
        time: appointment.time,
        type: appointment.type,
        status: appointment.status
      }
    };
  },

  getBillingForm: (billId) => {
    const bill = dummyData.bills.find(b => b.id === billId) || dummyData.bills[0];
    return {
      type: 'BillingForm',
      data: {
        billId: bill.id,
        patientName: bill.patientName,
        amount: bill.amount,
        date: bill.date,
        status: bill.status
      }
    };
  },

  getDoctorAppointmentsGrid: (doctorId) => {
    const doctor = dummyData.doctors.find(d => d.id === doctorId) || dummyData.doctors[0];
    const doctorAppointments = dummyData.appointments.filter(a => a.doctorId === doctorId);
    return {
      type: 'DoctorAppointmentsGrid',
      data: {
        doctorName: doctor.name,
        appointments: doctorAppointments
      }
    };
  },

  getICUPatientsGrid: () => {
    return {
      type: 'ICUPatientsGrid',
      data: {
        patients: dummyData.icuPatients
      }
    };
  },

  getWaitingPatientsGrid: () => {
    return {
      type: 'WaitingPatientsGrid',
      data: {
        patients: dummyData.waitingPatients
      }
    };
  },

  getDoctorsListGrid: () => {
    return {
      type: 'DoctorsListGrid',
      data: {
        doctors: dummyData.doctors
      }
    };
  },

  getSurgeryProgressGrid: () => {
    return {
      type: 'SurgeryProgressGrid',
      data: {
        surgeries: dummyData.surgeries
      }
    };
  },

  getDischargeProgressGrid: () => {
    return {
      type: 'DischargeProgressGrid',
      data: {
        discharges: dummyData.discharges
      }
    };
  }
};

// Function to determine which component to show based on the message content
export const determineComponent = (message, role) => {
  const lowerMessage = message.toLowerCase();

  // Doctor role components
  if (role === 'doctor') {
    if (lowerMessage.includes('upcoming appointments')) {
      return {
        type: 'DoctorAppointmentsGrid',
        data: {
          doctorName: 'Dr. Smith',
          appointments: [
            { id: 1, patientName: 'John Doe', date: new Date(), time: '10:00 AM', type: 'Check-up', status: 'Scheduled' },
            { id: 2, patientName: 'Jane Smith', date: new Date(), time: '2:30 PM', type: 'Follow-up', status: 'Scheduled' }
          ]
        }
      };
    }
    if (lowerMessage.includes('icu patients')) {
      return {
        type: 'ICUPatientsGrid',
        data: {
          patients: [
            { id: 1, name: 'John Doe', age: 45, condition: 'Critical', room: 'ICU-101', doctor: 'Dr. Smith', admissionDate: new Date() },
            { id: 2, name: 'Jane Smith', age: 32, condition: 'Stable', room: 'ICU-102', doctor: 'Dr. Smith', admissionDate: new Date() }
          ]
        }
      };
    }
    if (lowerMessage.includes('surgery progress')) {
      return {
        type: 'SurgeryProgressGrid',
        data: {
          surgeries: [
            { id: 1, patientName: 'John Doe', doctor: 'Dr. Smith', type: 'Cardiac', duration: '4 hours', status: 'In Progress', startTime: new Date() },
            { id: 2, patientName: 'Jane Smith', doctor: 'Dr. Smith', type: 'Orthopedic', duration: '3 hours', status: 'Scheduled', startTime: new Date() }
          ]
        }
      };
    }
    if (lowerMessage.includes('discharge progress')) {
      return {
        type: 'DischargeProgressGrid',
        data: {
          discharges: [
            { id: 1, patientName: 'John Doe', doctor: 'Dr. Smith', reason: 'Recovery Complete', status: 'Pending', dischargeTime: new Date() },
            { id: 2, patientName: 'Jane Smith', doctor: 'Dr. Smith', reason: 'Treatment Complete', status: 'In Progress', dischargeTime: new Date() }
          ]
        }
      };
    }
    if (lowerMessage.includes('write a prescription') || lowerMessage.includes('want to write a prescription')) {
      return {
        type: 'Prescription'
      };
    }
  }

  // Receptionist role components
  if (role === 'receptionist') {
    if (lowerMessage.includes('upcoming patients appointments') || lowerMessage.includes('list out the upcoming patients appointments')) {
      return {
        type: 'ReceptionistAppointmentsGrid',
        data: {
          appointments: [
            { id: 1, patientName: 'John Doe', date: new Date(), time: '10:00 AM', type: 'Check-up', doctor: 'Dr. Smith', status: 'Scheduled', notes: 'Regular check-up' },
            { id: 2, patientName: 'Jane Smith', date: new Date(), time: '2:30 PM', type: 'Follow-up', doctor: 'Dr. Johnson', status: 'Scheduled', notes: 'Post-surgery follow-up' }
          ]
        }
      };
    }
    if (lowerMessage.includes('waiting patients')) {
      return {
        type: 'WaitingPatientsGrid',
        data: {
          patients: [
            { name: 'John Doe', waitTime: '15 mins', priority: 'High', doctor: 'Dr. Smith', status: 'Waiting' },
            { name: 'Jane Smith', waitTime: '30 mins', priority: 'Medium', doctor: 'Dr. Johnson', status: 'Waiting' }
          ]
        }
      };
    }
    if (lowerMessage.includes('doctor schedules')) {
      return {
        type: 'DoctorsListGrid',
        data: {
          doctors: [
            { name: 'Dr. Smith', specialization: 'Cardiology', availability: '9 AM - 5 PM', status: 'Available' },
            { name: 'Dr. Johnson', specialization: 'Orthopedics', availability: '10 AM - 6 PM', status: 'Available' }
          ]
        }
      };
    }
  }

  // Patient role components
  if (role === 'patient') {
    if (lowerMessage.includes('schedule an appointment')) {
      return {
        type: 'AppointmentSchedule',
        data: {
          doctorName: 'Dr. Smith',
          specialization: 'Cardiology',
          availability: '9 AM - 5 PM'
        }
      };
    }
    if (lowerMessage.includes('medical records')) {
      return {
        type: 'PatientRecords',
        data: {
          patientId: 'P12345',
          name: 'John Doe',
          medicalHistory: 'Hypertension, Diabetes Type 2'
        }
      };
    }
    if (lowerMessage.includes('upcoming appointments')) {
      return {
        type: 'PatientInfoForm',
        data: {
          name: 'John Doe',
          dob: new Date('1990-01-01'),
          medicalHistory: 'Hypertension, Diabetes Type 2'
        }
      };
    }
  }

  return null;
}; 