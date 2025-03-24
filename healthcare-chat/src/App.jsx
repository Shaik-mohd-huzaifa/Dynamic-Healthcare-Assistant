import React, { useState, useRef, useEffect } from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Card, CardBody, CardTitle } from '@progress/kendo-react-layout';
import { Button, Toolbar, ToolbarSeparator, ButtonGroup } from '@progress/kendo-react-buttons';
import { TextBox } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { getChainForRole } from './prompts';
import { dummyData, determineComponent } from './data';
import './kendo-theme.js';
import './App.css';
import { Notification } from "@progress/kendo-react-notification";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";

const roles = [
  { text: 'Patient', value: 'patient' },
  { text: 'Receptionist', value: 'receptionist' },
  { text: 'Doctor', value: 'doctor' }
];

const PatientInfoForm = ({ data }) => (
  <div className="chat-message bot">
    <div className="message-content prompt">
      <Card>
        <CardBody>
          <CardTitle>Patient Information</CardTitle>
          <div className="form-group">
            <label>Name:</label>
            <TextBox value={data.name} placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <DatePicker value={new Date(data.dob)} />
          </div>
          <div className="form-group">
            <label>Medical History:</label>
            <TextBox multiline={true} rows={3} value={data.medicalHistory} placeholder="Enter your medical history" />
          </div>
          <Button primary={true}>Update Information</Button>
        </CardBody>
      </Card>
    </div>
  </div>
);

const AppointmentSchedule = ({ data }) => (
  <div className="chat-message bot">
    <div className="message-content prompt">
      <Card>
        <CardBody>
          <CardTitle>Appointment Schedule</CardTitle>
          <div className="form-group">
            <label>Doctor:</label>
            <TextBox value={data.doctorName} disabled />
          </div>
          <div className="form-group">
            <label>Specialization:</label>
            <TextBox value={data.specialization} disabled />
          </div>
          <div className="form-group">
            <label>Availability:</label>
            <TextBox value={data.availability} disabled />
          </div>
          <div className="form-group">
            <label>Preferred Date:</label>
            <DatePicker />
          </div>
          <Button primary={true}>Schedule Appointment</Button>
        </CardBody>
      </Card>
    </div>
  </div>
);

const PatientRecords = ({ data }) => (
  <div className="chat-message bot">
    <div className="message-content prompt">
      <Card>
        <CardBody>
          <CardTitle>Patient Records</CardTitle>
          <div className="form-group">
            <label>Patient ID:</label>
            <TextBox value={data.patientId} disabled />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <TextBox value={data.name} disabled />
          </div>
          <div className="form-group">
            <label>Medical History:</label>
            <TextBox multiline={true} rows={3} value={data.medicalHistory} disabled />
          </div>
          <div className="form-group">
            <label>Diagnosis:</label>
            <TextBox multiline={true} rows={3} placeholder="Enter diagnosis" />
          </div>
          <div className="form-group">
            <label>Prescription:</label>
            <TextBox multiline={true} rows={3} placeholder="Enter prescription" />
          </div>
          <Button primary={true}>Save Records</Button>
        </CardBody>
      </Card>
    </div>
  </div>
);

const DoctorSchedule = ({ data }) => (
  <div className="chat-message bot">
    <div className="message-content prompt">
      <Card>
        <CardBody>
          <CardTitle>Doctor Schedule</CardTitle>
          <div className="form-group">
            <label>Doctor:</label>
            <TextBox value={data.doctorName} disabled />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <DatePicker />
          </div>
          <div className="form-group">
            <label>Appointments:</label>
            <div className="appointments-list">
              {data.appointments.map((apt, index) => (
                <div key={index} className="appointment-item">
                  <span>{apt.patientName}</span>
                  <span>{apt.time}</span>
                  <span>{apt.type}</span>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
);

const AppointmentManagement = ({ data }) => (
  <div className="chat-message bot">
    <div className="message-content prompt">
      <Card>
        <CardBody>
          <CardTitle>Appointment Management</CardTitle>
          <div className="form-group">
            <label>Patient Name:</label>
            <TextBox value={data.patientName} disabled />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <DatePicker value={new Date(data.date)} />
          </div>
          <div className="form-group">
            <label>Time:</label>
            <TextBox value={data.time} />
          </div>
          <div className="form-group">
            <label>Type:</label>
            <DropDownList
              data={['Check-up', 'Follow-up', 'Emergency', 'Consultation']}
              value={data.type}
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <DropDownList
              data={['Scheduled', 'Completed', 'Cancelled']}
              value={data.status}
            />
          </div>
          <Button primary={true}>Update Appointment</Button>
        </CardBody>
      </Card>
    </div>
  </div>
);

const BillingForm = ({ data }) => (
  <div className="chat-message bot">
    <div className="message-content prompt">
      <Card>
        <CardBody>
          <CardTitle>Billing Information</CardTitle>
          <div className="form-group">
            <label>Patient Name:</label>
            <TextBox value={data.patientName} disabled />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <TextBox value={data.amount} type="number" />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <DatePicker value={new Date(data.date)} />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <DropDownList
              data={['Pending', 'Paid', 'Cancelled']}
              value={data.status}
            />
          </div>
          <Button primary={true}>Process Payment</Button>
        </CardBody>
      </Card>
    </div>
  </div>
);

const DoctorAppointmentsGrid = ({ data }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notifStatus, setNotifStatus] = useState(false);
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(true);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setGridData(data.appointments);
    }, 1000);
  }, [data.appointments]);

  useEffect(() => {
    if (notifStatus) {
      const timer = setTimeout(() => {
        setNotifStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifStatus]);

  const handleRowClick = (event) => {
    setSelectedAppointment(event.dataItem);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    try {
      setGridData(gridData.filter((apt) => apt.id !== selectedAppointment.id));
      setNotifStatus(true);
      setShowDeleteModal(false);
    } catch (e) {
      setError("Error deleting appointment");
    }
  };

  return (
    <div className="chat-message bot">
      <div className="message-content prompt">
        <Card>
          <CardBody>
            <CardTitle>Upcoming Appointments - {data.doctorName}</CardTitle>
            {error && (
              <Notification
                className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8"
                closable={true}
                type={{ style: "error", icon: true }}
              >
                {error}
              </Notification>
            )}
            {notifStatus && (
              <Notification closable={true} type={{ style: "success", icon: true }}>
                Appointment deleted successfully!
              </Notification>
            )}
            <Grid
              style={{ height: "400px" }}
              data={gridData}
              dataItemKey="id"
              onRowClick={handleRowClick}
              showLoader={showLoader}
              sortable={{
                allowUnsort: true,
                mode: "single",
              }}
              filterable={true}
              pageable={{
                buttonCount: 5,
                pageSizes: true,
                info: true
              }}
            >
              <GridColumn field="patientName" title="Patient Name" width="200px" />
              <GridColumn field="date" title="Date" width="150px" filter="date" format="{0:d}" />
              <GridColumn field="time" title="Time" width="120px" />
              <GridColumn field="type" title="Type" width="150px" />
              <GridColumn field="status" title="Status" width="120px" />
            </Grid>

            {showDeleteModal && (
              <Dialog title="Delete Appointment" onClose={() => setShowDeleteModal(false)}>
                <p style={{ margin: "25px", textAlign: "center" }}>
                  Are you sure you want to delete the appointment for {selectedAppointment?.patientName}?
                </p>
                <DialogActionsBar>
                  <Button themeColor="error" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button themeColor="base" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                </DialogActionsBar>
              </Dialog>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const ICUPatientsGrid = ({ data }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notifStatus, setNotifStatus] = useState(false);
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(true);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setGridData(data.patients);
    }, 1000);
  }, [data.patients]);

  useEffect(() => {
    if (notifStatus) {
      const timer = setTimeout(() => {
        setNotifStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifStatus]);

  const handleRowClick = (event) => {
    setSelectedPatient(event.dataItem);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    try {
      setGridData(gridData.filter((patient) => patient.id !== selectedPatient.id));
      setNotifStatus(true);
      setShowDeleteModal(false);
    } catch (e) {
      setError("Error removing patient from ICU");
    }
  };

  return (
    <div className="chat-message bot">
      <div className="message-content prompt">
        <Card>
          <CardBody>
            <CardTitle>ICU Patients</CardTitle>
            {error && (
              <Notification
                className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8"
                closable={true}
                type={{ style: "error", icon: true }}
              >
                {error}
              </Notification>
            )}
            {notifStatus && (
              <Notification closable={true} type={{ style: "success", icon: true }}>
                Patient removed from ICU successfully!
              </Notification>
            )}
            <Grid
              style={{ height: "400px" }}
              data={gridData}
              dataItemKey="id"
              onRowClick={handleRowClick}
              showLoader={showLoader}
              sortable={{
                allowUnsort: true,
                mode: "single",
              }}
              filterable={true}
              pageable={{
                buttonCount: 5,
                pageSizes: true,
                info: true
              }}
            >
              <GridColumn field="name" title="Patient Name" width="200px" />
              <GridColumn field="age" title="Age" width="100px" filter="numeric" />
              <GridColumn field="condition" title="Condition" width="150px" />
              <GridColumn field="room" title="Room" width="120px" />
              <GridColumn field="doctor" title="Doctor" width="200px" />
              <GridColumn field="admissionDate" title="Admission Date" width="150px" filter="date" format="{0:d}" />
            </Grid>

            {showDeleteModal && (
              <Dialog title="Remove from ICU" onClose={() => setShowDeleteModal(false)}>
                <p style={{ margin: "25px", textAlign: "center" }}>
                  Are you sure you want to remove {selectedPatient?.name} from ICU?
                </p>
                <DialogActionsBar>
                  <Button themeColor="error" onClick={handleDelete}>
                    Remove
                  </Button>
                  <Button themeColor="base" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                </DialogActionsBar>
              </Dialog>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const WaitingPatientsGrid = ({ data }) => (
  <div className="chat-message bot">
    <div className="message-content prompt">
      <Card>
        <CardBody>
          <CardTitle>Waiting Patients</CardTitle>
          <Grid
            data={data.patients}
            style={{ height: '400px' }}
            sortable={true}
            filterable={true}
            groupable={true}
            pageable={{
              buttonCount: 5,
              pageSizes: true,
              info: true
            }}
          >
            <GridColumn field="name" title="Patient Name" />
            <GridColumn field="waitTime" title="Wait Time" />
            <GridColumn field="priority" title="Priority" />
            <GridColumn field="doctor" title="Doctor" />
            <GridColumn field="status" title="Status" />
          </Grid>
        </CardBody>
      </Card>
    </div>
  </div>
);

const DoctorsListGrid = ({ data }) => (
  <div className="chat-message bot">
    <div className="message-content prompt">
      <Card>
        <CardBody>
          <CardTitle>Doctors List</CardTitle>
          <Grid
            data={data.doctors}
            style={{ height: '400px' }}
            sortable={true}
            filterable={true}
            groupable={true}
            pageable={{
              buttonCount: 5,
              pageSizes: true,
              info: true
            }}
          >
            <GridColumn field="name" title="Doctor Name" />
            <GridColumn field="specialization" title="Specialization" />
            <GridColumn field="availability" title="Availability" />
            <GridColumn field="status" title="Status" />
          </Grid>
        </CardBody>
      </Card>
    </div>
  </div>
);

const SurgeryProgressGrid = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const newTimeLeft = {};
      
      data.surgeries.forEach(surgery => {
        const startTime = new Date(surgery.startTime);
        const totalTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        const elapsed = now - startTime;
        const remaining = Math.max(0, totalTime - elapsed);
        const progress = Math.min(100, (elapsed / totalTime) * 100);
        
        newTimeLeft[surgery.id] = {
          remaining,
          progress
        };
      });
      
      setTimeLeft(newTimeLeft);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [data.surgeries]);

  const formatTimeLeft = (ms) => {
    if (ms <= 0) return 'Completed';
    
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const totalSurgeries = data.surgeries.length;
  const completedSurgeries = data.surgeries.filter(surgery => {
    const timeData = timeLeft[surgery.id];
    return timeData && timeData.progress >= 100;
  }).length;

  return (
    <div className="chat-message bot">
      <div className="message-content prompt">
        <div className="mt-4 mb-4">
          {/* Heading Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Surgery Progress Information</h2>
          </div>
          {/* Cards Section */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Card for Total Surgeries */}
            <Card style={{ width: 300 }} type="info">
              <CardBody>
                <CardTitle>Total Surgeries</CardTitle>
                <p>Number of surgeries scheduled today.</p>
                <div className="progress-container">
                  <ProgressBar 
                    value={totalSurgeries} 
                    type="info"
                    animation={false}
                    className="custom-progress"
                  />
                  <div className="progress-value">{totalSurgeries}</div>
                </div>
              </CardBody>
            </Card>

            {/* Card for Completed Surgeries */}
            <Card style={{ width: 300 }} type="success">
              <CardBody>
                <CardTitle>Completed Surgeries</CardTitle>
                <p>Number of surgeries completed.</p>
                <div className="progress-container">
                  <ProgressBar 
                    value={completedSurgeries} 
                    type="success"
                    animation={false}
                    className="custom-progress"
                  />
                  <div className="progress-value">{completedSurgeries}</div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <Card>
          <CardBody>
            <CardTitle>Upcoming Surgeries</CardTitle>
            <Grid
              data={data.surgeries}
              style={{ height: '400px' }}
              sortable={true}
              filterable={true}
              groupable={true}
              pageable={{
                buttonCount: 5,
                pageSizes: true,
                info: true
              }}
            >
              <GridColumn field="patientName" title="Patient Name" />
              <GridColumn field="doctor" title="Doctor" />
              <GridColumn field="type" title="Surgery Type" />
              <GridColumn field="duration" title="Duration" />
              <GridColumn field="status" title="Status" />
              <GridColumn
                title="Time Left"
                cell={(props) => {
                  const surgery = props.dataItem;
                  const timeData = timeLeft[surgery.id];
                  return (
                    <div className="progress-cell">
                      <div className="time-left">{formatTimeLeft(timeData?.remaining || 0)}</div>
                      <div className="progress-container">
                        <ProgressBar
                          value={timeData?.progress || 0}
                          type="success"
                          animation={false}
                          className="custom-progress"
                        />
                      </div>
                    </div>
                  );
                }}
              />
            </Grid>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const DischargeProgressGrid = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const newTimeLeft = {};
      
      data.discharges.forEach(discharge => {
        const dischargeTime = new Date(discharge.dischargeTime);
        const totalTime = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        const elapsed = now - dischargeTime;
        const remaining = Math.max(0, totalTime - elapsed);
        const progress = Math.min(100, (elapsed / totalTime) * 100);
        
        newTimeLeft[discharge.id] = {
          remaining,
          progress
        };
      });
      
      setTimeLeft(newTimeLeft);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [data.discharges]);

  const formatTimeLeft = (ms) => {
    if (ms <= 0) return 'Ready for Discharge';
    
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const totalDischarges = data.discharges.length;
  const readyDischarges = data.discharges.filter(discharge => {
    const timeData = timeLeft[discharge.id];
    return timeData && timeData.progress >= 100;
  }).length;

  return (
    <div className="chat-message bot">
      <div className="message-content prompt">
        <div className="mt-4 mb-4">
          {/* Heading Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Discharge Progress Information</h2>
          </div>
          {/* Cards Section */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Card for Total Discharges */}
            <Card style={{ width: 300 }} type="info">
              <CardBody>
                <CardTitle>Total Discharges</CardTitle>
                <p>Number of pending discharges.</p>
                <div className="progress-container">
                  <ProgressBar 
                    value={totalDischarges} 
                    type="info"
                    animation={false}
                    className="custom-progress"
                  />
                  <div className="progress-value">{totalDischarges}</div>
                </div>
              </CardBody>
            </Card>

            {/* Card for Ready Discharges */}
            <Card style={{ width: 300 }} type="success">
              <CardBody>
                <CardTitle>Ready for Discharge</CardTitle>
                <p>Number of patients ready for discharge.</p>
                <div className="progress-container">
                  <ProgressBar 
                    value={readyDischarges} 
                    type="success"
                    animation={false}
                    className="custom-progress"
                  />
                  <div className="progress-value">{readyDischarges}</div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <Card>
          <CardBody>
            <CardTitle>Pending Discharges</CardTitle>
            <Grid
              data={data.discharges}
              style={{ height: '400px' }}
              sortable={true}
              filterable={true}
              groupable={true}
              pageable={{
                buttonCount: 5,
                pageSizes: true,
                info: true
              }}
            >
              <GridColumn field="patientName" title="Patient Name" />
              <GridColumn field="doctor" title="Doctor" />
              <GridColumn field="reason" title="Reason" />
              <GridColumn field="status" title="Status" />
              <GridColumn
                title="Time Until Discharge"
                cell={(props) => {
                  const discharge = props.dataItem;
                  const timeData = timeLeft[discharge.id];
                  return (
                    <div className="progress-cell">
                      <div className="time-left">{formatTimeLeft(timeData?.remaining || 0)}</div>
                      <div className="progress-container">
                        <ProgressBar
                          value={timeData?.progress || 0}
                          type="info"
                          animation={false}
                          className="custom-progress"
                        />
                      </div>
                    </div>
                  );
                }}
              />
            </Grid>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const ReceptionistAppointmentsGrid = ({ data }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [gridData, setGridData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notifStatus, setNotifStatus] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setGridData(data.appointments);
    }, 1000);
  }, [data.appointments]);

  useEffect(() => {
    if (notifStatus) {
      const timer = setTimeout(() => {
        setNotifStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notifStatus]);

  const handleRowClick = (event) => {
    setSelectedAppointment(event.dataItem);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    try {
      setGridData(gridData.filter((apt) => apt.id !== selectedAppointment.id));
      setNotifStatus(true);
      setShowDeleteModal(false);
    } catch (e) {
      setError("Error deleting appointment");
    }
  };

  return (
    <div className="chat-message bot">
      <div className="message-content prompt">
        <div className="p-4 bg-gray-100">
          <h2 className="text-xl font-bold mb-4">Upcoming Patient Appointments</h2>
          
          {error && (
            <Notification
              className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8"
              closable={true}
              type={{ style: "error", icon: true }}
            >
              {error}
            </Notification>
          )}
          {notifStatus && (
            <Notification closable={true} type={{ style: "success", icon: true }}>
              Appointment deleted successfully!
            </Notification>
          )}

          <div className="overflow-x-auto">
            <Grid
              style={{ height: "365px" }}
              data={gridData}
              dataItemKey="id"
              onRowClick={handleRowClick}
              showLoader={showLoader}
              sortable={true}
              filterable={true}
              pageable={true}
            >
              <GridColumn field="patientName" title="Patient Name" width="200px" />
              <GridColumn field="date" title="Date" width="150px" filter="date" format="{0:d}" />
              <GridColumn field="time" title="Time" width="120px" />
              <GridColumn field="type" title="Type" width="150px" />
              <GridColumn field="doctor" title="Doctor" width="200px" />
              <GridColumn field="status" title="Status" width="120px" />
              <GridColumn field="notes" title="Notes" width="250px" />
            </Grid>

            {showDeleteModal && (
              <Dialog title="Delete Appointment" onClose={() => setShowDeleteModal(false)}>
                <p style={{ margin: "25px", textAlign: "center" }}>
                  Are you sure you want to delete the appointment for {selectedAppointment?.patientName}?
                </p>
                <DialogActionsBar>
                  <Button themeColor="error" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button themeColor="base" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                </DialogActionsBar>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickPrompts = ({ onSelectPrompt, selectedRole }) => {
  const prompts = {
    patient: [
      "Schedule an appointment",
      "View my medical records",
      "Check my upcoming appointments"
    ],
    receptionist: [
      "List out the upcoming patients appointments",
      "Show waiting patients",
      "View doctor schedules"
    ],
    doctor: [
      "Show my upcoming appointments",
      "View ICU patients",
      "Check surgery progress"
    ]
  };

  return (
    <div className="quick-prompts">
      <h3 className="text-lg font-semibold mb-3">Quick Prompts</h3>
      <div className="prompts-grid">
        {prompts[selectedRole.value].map((prompt, index) => (
          <button
            key={index}
            className="prompt-button"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

const PrescriptionForm = () => {
  const [prescription, setPrescription] = useState("");
  const [showToolbar, setShowToolbar] = useState(true);

  const onFormat = (format) => {
    const textarea = document.getElementById('prescription-text');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = prescription.substring(start, end);
    
    let formattedText = prescription;
    switch(format) {
      case 'bold':
        formattedText = prescription.substring(0, start) + 
          `**${selectedText}**` + 
          prescription.substring(end);
        break;
      case 'italic':
        formattedText = prescription.substring(0, start) + 
          `*${selectedText}*` + 
          prescription.substring(end);
        break;
      case 'underline':
        formattedText = prescription.substring(0, start) + 
          `__${selectedText}__` + 
          prescription.substring(end);
        break;
      case 'bullet':
        formattedText = prescription.substring(0, start) + 
          `\n• ${selectedText}` + 
          prescription.substring(end);
        break;
      case 'number':
        formattedText = prescription.substring(0, start) + 
          `\n1. ${selectedText}` + 
          prescription.substring(end);
        break;
      default:
        return;
    }
    setPrescription(formattedText);
  };

  const handleSave = () => {
    // Here you would typically save the prescription
    setShowToolbar(false);
  };

  return (
    <div className="chat-message bot">
      <div className="message-content prompt">
        <div className="p-4 bg-gray-100">
          <h2 className="text-xl font-bold mb-4">Write Prescription</h2>
          {showToolbar && (
            <Toolbar className="mb-4">
              <ButtonGroup>
                <Button
                  className="k-toolbar-button"
                  title="Bold"
                  onClick={() => onFormat("bold")}
                >
                  <span className="k-icon k-i-bold"></span>
                </Button>
                <Button
                  className="k-toolbar-button"
                  title="Italic"
                  onClick={() => onFormat("italic")}
                >
                  <span className="k-icon k-i-italic"></span>
                </Button>
                <Button
                  className="k-toolbar-button"
                  title="Underline"
                  onClick={() => onFormat("underline")}
                >
                  <span className="k-icon k-i-underline"></span>
                </Button>
              </ButtonGroup>
              <ToolbarSeparator />
              <ButtonGroup>
                <Button
                  className="k-toolbar-button"
                  title="Bullet List"
                  onClick={() => onFormat("bullet")}
                >
                  <span className="k-icon k-i-list-unordered"></span>
                </Button>
                <Button
                  className="k-toolbar-button"
                  title="Numbered List"
                  onClick={() => onFormat("number")}
                >
                  <span className="k-icon k-i-list-ordered"></span>
                </Button>
              </ButtonGroup>
            </Toolbar>
          )}
          <div className="prescription-container">
            <textarea
              id="prescription-text"
              className="prescription-textarea"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Write prescription here..."
            />
            {showToolbar && (
              <div className="mt-4 flex justify-end">
                <Button themeColor="primary" onClick={handleSave}>
                  Save Prescription
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your healthcare assistant. How can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentWidget, setCurrentWidget] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const messagesEndRef = useRef(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderWidget = (componentData) => {
    if (!componentData) return null;

    switch (componentData.type) {
      case 'PatientInfoForm':
        return <PatientInfoForm data={componentData.data} />;
      case 'AppointmentSchedule':
        return <AppointmentSchedule data={componentData.data} />;
      case 'PatientRecords':
        return <PatientRecords data={componentData.data} />;
      case 'DoctorSchedule':
        return <DoctorSchedule data={componentData.data} />;
      case 'AppointmentManagement':
        return <AppointmentManagement data={componentData.data} />;
      case 'BillingForm':
        return <BillingForm data={componentData.data} />;
      case 'DoctorAppointmentsGrid':
        return <DoctorAppointmentsGrid data={componentData.data} />;
      case 'ICUPatientsGrid':
        return <ICUPatientsGrid data={componentData.data} />;
      case 'WaitingPatientsGrid':
        return <WaitingPatientsGrid data={componentData.data} />;
      case 'DoctorsListGrid':
        return <DoctorsListGrid data={componentData.data} />;
      case 'SurgeryProgressGrid':
        return <SurgeryProgressGrid data={componentData.data} />;
      case 'DischargeProgressGrid':
        return <DischargeProgressGrid data={componentData.data} />;
      case 'ReceptionistAppointmentsGrid':
        return <ReceptionistAppointmentsGrid data={componentData.data} />;
      case 'Prescription':
        return <PrescriptionForm />;
      default:
        return null;
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setShowQuickPrompts(false);
      const userMessage = inputMessage.trim();
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
      setInputMessage('');

      try {
        // Get the appropriate chain for the current role
        const chain = getChainForRole(selectedRole.value);
        
        // Prepare the chat history
        const formattedHistory = chatHistory.map(msg => ({
          role: msg.type === 'user' ? 'human' : 'assistant',
          content: msg.content
        }));

        // Get response from the chain
        const response = await chain.invoke({
          input: userMessage,
          history: formattedHistory
        });

        // Update chat history
        setChatHistory(prev => [...prev, 
          { type: 'user', content: userMessage },
          { type: 'bot', content: response.content }
        ]);

        // Update messages
        setMessages(prev => [...prev, {
          type: 'bot',
          content: response.content
        }]);

        // Determine which widget to show based on the message content
        const componentData = determineComponent(userMessage, selectedRole.value);
        setCurrentWidget(renderWidget(componentData));
      } catch (error) {
        console.error('Error getting response:', error);
        setMessages(prev => [...prev, {
          type: 'bot',
          content: 'I apologize, but I encountered an error. Please try again.'
        }]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    setMessages([
      {
        type: 'bot',
        content: `Welcome ${e.target.value.text}! How can I assist you today?`
      }
    ]);
    setChatHistory([]);
    setCurrentWidget(null);
    setShowQuickPrompts(true);
  };

  const handleClearChat = () => {
    setMessages([
      {
        type: 'bot',
        content: 'Chat history has been cleared. How can I assist you today?'
      }
    ]);
    setChatHistory([]);
    setCurrentWidget(null);
    setShowClearDialog(false);
    setShowQuickPrompts(true);
  };

  const handlePromptSelect = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Healthcare AI Assistant</h1>
        <div className="header-controls">
          <Button 
            themeColor="error" 
            onClick={() => setShowClearDialog(true)}
            className="clear-chat-btn"
          >
            Clear Chat
          </Button>
          <div className="role-selector">
            <DropDownList
              data={roles}
              textField="text"
              dataItemKey="value"
              value={selectedRole}
              onChange={handleRoleChange}
              placeholder="Select your role"
            />
          </div>
        </div>
      </div>
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.type}`}>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {currentWidget}
          {showQuickPrompts && messages.length === 1 && (
            <QuickPrompts 
              onSelectPrompt={handlePromptSelect} 
              selectedRole={selectedRole}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <TextBox
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="message-input"
          />
          <Button primary={true} onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </div>

      {showClearDialog && (
        <Dialog title="Clear Chat History" onClose={() => setShowClearDialog(false)}>
          <p style={{ margin: "25px", textAlign: "center" }}>
            Are you sure you want to clear the chat history? This action cannot be undone.
          </p>
          <DialogActionsBar>
            <Button themeColor="error" onClick={handleClearChat}>
              Clear
            </Button>
            <Button themeColor="base" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
}

export default App;
