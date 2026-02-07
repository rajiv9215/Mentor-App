
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CallCard from "./components/CallCard";
import Button from "../../components/Btncomponent";
import { FaStar, FaLinkedin, FaTwitter, FaGlobe, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaTimes, FaComments, FaPhone, FaVideo } from "react-icons/fa";
import mentorService from "../../services/mentorService";
import paymentService from "../../services/paymentService";

const MentorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const sessionOptions = [
    { type: 'chat', title: '10-Min Chat', duration: '10 minutes', price: 15, icon: 'chat' },
    { type: 'call', title: '10-Min Call', duration: '10 minutes', price: 25, icon: 'phone' },
    { type: 'video', title: 'Video Call', duration: '30 minutes', price: 50, icon: 'video' }
  ];

  const getSessionIcon = (type) => {
    switch (type) {
      case 'chat': return <FaComments className="inline" />;
      case 'call': return <FaPhone className="inline" />;
      case 'video': return <FaVideo className="inline" />;
      default: return null;
    }
  };

  const getSessionBadge = (type) => {
    const badges = {
      chat: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      call: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      video: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return badges[type] || 'bg-gray-100 text-gray-700';
  };

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true);
        const response = await mentorService.getMentorById(id);
        if (response.success) {
          setMentor(response.data);
        } else {
          setError("Failed to load mentor data");
        }
      } catch (err) {
        console.error("Error fetching mentor:", err);
        setError(err.message || "Failed to load mentor data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentor();
    }
  }, [id]);

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowSessionModal(true);
  };

  const handleBookSession = async (sessionType, price) => {
    try {
      if (!selectedSlot) return;

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setBookingMessage('Please log in to book a session');
        setShowSessionModal(false);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      setProcessingPayment(true);
      setShowSessionModal(false);

      let targetDate;

      if (selectedSlot.date) {
        // Use specific date
        targetDate = new Date(selectedSlot.date);
      } else {
        // Calculate date for the next occurrence of this day
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const targetDayIndex = days.indexOf(selectedSlot.day);
        const today = new Date();
        const currentDayIndex = today.getDay();

        let daysUntilTarget = targetDayIndex - currentDayIndex;
        if (daysUntilTarget <= 0) daysUntilTarget += 7; // Next week if today or passed

        targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);
      }

      const bookingData = {
        date: targetDate.toISOString(),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: `Booking for ${sessionType} session`
      };

      // Create Razorpay order
      const orderResponse = await paymentService.createOrder({
        amount: price,
        currency: 'INR',
        mentorId: mentor._id,
        sessionType,
        bookingData
      });

      if (!orderResponse.success) {
        throw new Error('Failed to create order');
      }

      // Initialize Razorpay checkout
      console.log('📦 Order Response:', orderResponse);

      const options = {
        key: 'rzp_test_SDA5Q4VyjPwnOH', // Your actual Razorpay Key ID
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'MentorHub',
        description: `${sessionType} session with ${mentor.name}`,
        order_id: orderResponse.data.orderId,
        handler: async function (response) {
          console.log('🔄 Razorpay Handler Response:', response);
          try {
            const verificationData = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              paymentRecordId: orderResponse.data.paymentId
            };
            console.log('📤 Sending Verification Data:', verificationData);

            // Verify payment
            const verifyResponse = await paymentService.verifyPayment(verificationData);
            console.log('✅ Verify Response:', verifyResponse);

            if (verifyResponse.success) {
              setBookingMessage('Payment successful! Booking confirmed.');
              setTimeout(() => {
                navigate('/bookings'); // Redirect to bookings page
              }, 2000);
            }
          } catch (error) {
            console.log('❌ Payment verification error object:', error);
            if (error.response) {
              console.log('❌ Error response data:', error.response.data);
              console.log('❌ Error response status:', error.response.status);
            }

            const errorMessage = error.response?.data?.message || error.message || 'Payment verification failed. Please contact support.';
            setBookingMessage(errorMessage);
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: '', // Can be filled from user data
          email: '',
          contact: ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            setBookingMessage('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error details:', error.response?.data || error.message);
      setBookingMessage(error.response?.data?.message || error.message || 'Failed to initiate payment');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300">
        <p className="text-xl font-bold mb-4">{error || "Mentor not found"}</p>
        <Button variant="primary" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20 transition-colors duration-300">
      {/* Session Selection Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full p-8 relative">
            <button
              onClick={() => setShowSessionModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Choose Session Type</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Selected: {selectedSlot?.date ? new Date(selectedSlot.date).toLocaleDateString() : selectedSlot?.day} • {selectedSlot?.startTime} - {selectedSlot?.endTime}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sessionOptions
                .filter(option => selectedSlot?.sessionTypes?.includes(option.type))
                .map((option) => (
                  <div
                    key={option.type}
                    onClick={() => handleBookSession(option.type, option.price)}
                    className="cursor-pointer"
                  >
                    <CallCard
                      title={option.title}
                      duration={option.duration}
                      price={`₹${option.price} `}
                      icon={option.icon}
                    />
                  </div>
                ))}
            </div>
            {selectedSlot?.sessionTypes?.length === 0 && (
              <p className="text-center text-neutral-500 mt-4">No session types available for this slot</p>
            )}
          </div>
        </div>
      )}

      {/* Profile Header Background */}
      <div className="h-64 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl overflow-hidden mb-12 border border-neutral-100 dark:border-neutral-800">
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">

            {/* Profile Image & Quick Stats */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-lg"
                  src={mentor.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt={mentor.name}
                />
                <div className={`absolute bottom-2 right-2 w-5 h-5 border-2 border-white dark:border-neutral-800 rounded-full ${mentor.availability === 'available' ? 'bg-green-500' : 'bg-red-500'} `}></div>
              </div>

              <div className="flex gap-4 mt-6">
                {mentor.linkedIn && <a href={mentor.linkedIn} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-600 transition-colors"><FaLinkedin size={24} /></a>}
                {mentor.twitter && <a href={mentor.twitter} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-600 transition-colors"><FaTwitter size={24} /></a>}
                {mentor.website && <a href={mentor.website} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-600 transition-colors"><FaGlobe size={24} /></a>}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{mentor.name}</h1>
                  <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-2 flex items-center gap-2">
                    <FaBriefcase className="text-sm" /> {mentor.jobTitle}
                    <span className="text-neutral-300 dark:text-neutral-700">|</span>
                    <FaBuilding className="text-sm" /> {mentor.company}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1"><FaMapMarkerAlt /> {mentor.location || "Remote"}</span>
                    <span className="flex items-center gap-1 text-yellow-400 font-bold"><FaStar /> {mentor.rating} ({mentor.totalSessions} sessions)</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">Share</Button>
                  <Button variant="primary">Follow</Button>
                </div>
              </div>

              <div className="prose max-w-none text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">About Me</h3>
                <p>{mentor.bio || "No bio available."}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {mentor.skills && mentor.skills.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-lg text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Available Slots */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">Available Slots</h3>
                {bookingMessage && (
                  <div className="p-3 mb-3 bg-blue-100 text-blue-800 rounded">{bookingMessage}</div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mentor.slots && mentor.slots.length > 0 ? (
                    mentor.slots.map((slot, index) => (
                      <button
                        key={index}
                        disabled={slot.isBooked}
                        onClick={() => handleSlotClick(slot)}
                        className={`p-3 rounded-lg border text-sm transition-all ${slot.isBooked
                          ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                          : 'bg-white dark:bg-neutral-800 border-primary-200 hover:border-primary-500 hover:shadow-md dark:text-white'
                          }`}
                      >
                        <div className="font-bold text-primary-600 mb-1">
                          {slot.date
                            ? new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : slot.day
                          }
                        </div>
                        <div className="mb-2">{slot.startTime} - {slot.endTime}</div>
                        {slot.isBooked && <div className="text-xs mt-1">Booked</div>}
                        {!slot.isBooked && slot.sessionTypes && slot.sessionTypes.length > 0 && (
                          <div className="flex gap-1 flex-wrap justify-center mt-2">
                            {slot.sessionTypes.map((type, idx) => (
                              <span key={idx} className={`text-xs px-1.5 py-0.5 rounded ${getSessionBadge(type)}`}>
                                {getSessionIcon(type)}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-neutral-500 col-span-4">No slots available currently.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetail;
