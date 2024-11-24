import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isAfter, startOfDay, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Video, MapPin } from 'lucide-react';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import Button from '../../components/Button';
import AddAppointmentModal from './AddAppointmentModal';
import { useStore } from '../../store';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: any[];
  deadlines: any[];
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { appointments, applications } = useStore();

  const today = startOfDay(new Date());

  // Get today's appointments
  const todayAppointments = appointments.filter(apt => {
    if (!apt.date) return false;
    const aptDate = parseISO(apt.date);
    return isSameDay(aptDate, today);
  });

  // Get today's deadlines
  const todayDeadlines = applications.filter(app => {
    if (!app.deadline) return false;
    const deadline = parseISO(app.deadline);
    return isSameDay(deadline, today);
  });

  // Get upcoming deadlines (next 7 days)
  const upcomingDeadlines = applications.filter(app => {
    if (!app.deadline) return false;
    const deadline = parseISO(app.deadline);
    return isAfter(deadline, today) && !isAfter(deadline, addDays(today, 7));
  });

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments.filter(apt => {
    if (!apt.date) return false;
    const aptDate = parseISO(apt.date);
    return isAfter(aptDate, today) && !isAfter(aptDate, addDays(today, 7));
  });

  const getCalendarDays = (): CalendarDay[] => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return days.map(date => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      appointments: appointments.filter(apt => {
        if (!apt.date) return false;
        return isSameDay(parseISO(apt.date), date);
      }),
      deadlines: applications.filter(app => {
        if (!app.deadline) return false;
        return isSameDay(parseISO(app.deadline), date);
      })
    }));
  };

  const getDayClassNames = (day: CalendarDay) => {
    const hasAppointments = day.appointments.length > 0;
    const hasDeadlines = day.deadlines.length > 0;
    
    return `
      relative h-24 border border-gray-200 p-2 cursor-pointer transition-colors
      ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50/50'}
      ${isToday(day.date) ? 'border-brand-yellow border-2' : ''}
      ${hasDeadlines ? 'border-red-300' : ''}
      ${hasAppointments ? 'border-l-4 border-l-brand-yellow' : ''}
      hover:bg-gray-50
      ${!day.isCurrentMonth ? 'opacity-50' : ''}
    `;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsAddModalOpen(true);
  };

  const calendarDays = getCalendarDays();

  const formatAppointmentTime = (time: string) => {
    try {
      // Assuming time is in HH:mm format
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    } catch (error) {
      return 'Invalid time';
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Calendar"
        description="Schedule appointments and track deadlines"
        icon={CalendarIcon}
        action={{
          label: 'Add Appointment',
          onClick: () => setIsAddModalOpen(true),
        }}
      />
      
      <div className="space-y-6">
        {/* Calendar Grid */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-7 gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-sm py-2">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={getDayClassNames(day)}
                onClick={() => handleDateClick(day.date)}
              >
                <div className="flex justify-between">
                  <span className={`
                    text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center
                    ${isToday(day.date) ? 'bg-brand-yellow text-brand-black' : ''}
                  `}>
                    {format(day.date, 'd')}
                  </span>
                  <div className="flex gap-1">
                    {day.appointments.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-yellow/10 text-brand-black font-medium">
                        {day.appointments.length}
                      </span>
                    )}
                    {day.deadlines.length > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">
                        {day.deadlines.length}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-1 space-y-1">
                  {day.appointments.slice(0, 2).map((apt, i) => (
                    <div
                      key={i}
                      className="text-xs p-1 rounded bg-brand-yellow/10 text-brand-black truncate"
                      title={`${apt.clientName} - ${apt.type}`}
                    >
                      {apt.time && formatAppointmentTime(apt.time)} - {apt.clientName}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Today's Schedule</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Appointments</h3>
                {todayAppointments.length === 0 ? (
                  <p className="text-sm text-gray-500">No appointments scheduled for today</p>
                ) : (
                  <div className="space-y-2">
                    {todayAppointments.map((apt, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{apt.clientName}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            {apt.time && formatAppointmentTime(apt.time)}
                            {apt.meetingType === 'online' ? (
                              <Video className="h-4 w-4" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{apt.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Deadlines</h3>
                {todayDeadlines.length === 0 ? (
                  <p className="text-sm text-gray-500">No deadlines for today</p>
                ) : (
                  <div className="space-y-2">
                    {todayDeadlines.map((app, index) => (
                      <div key={index} className="p-2 bg-red-50 rounded">
                        <p className="font-medium">{app.clientName}</p>
                        <p className="text-sm text-red-600">{app.type} - {app.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Upcoming (Next 7 Days)</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Appointments</h3>
                {upcomingAppointments.length === 0 ? (
                  <p className="text-sm text-gray-500">No upcoming appointments</p>
                ) : (
                  <div className="space-y-2">
                    {upcomingAppointments.map((apt, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <div className="flex justify-between">
                          <p className="font-medium">{apt.clientName}</p>
                          <p className="text-sm text-gray-600">
                            {apt.date && format(parseISO(apt.date), 'MMM d')}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{apt.type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Deadlines</h3>
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-gray-500">No upcoming deadlines</p>
                ) : (
                  <div className="space-y-2">
                    {upcomingDeadlines.map((app, index) => (
                      <div key={index} className="p-2 bg-red-50 rounded">
                        <div className="flex justify-between">
                          <p className="font-medium">{app.clientName}</p>
                          <p className="text-sm text-red-600">
                            {app.deadline && format(parseISO(app.deadline), 'MMM d')}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600">{app.type} - {app.country}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
      />
    </Layout>
  );
}