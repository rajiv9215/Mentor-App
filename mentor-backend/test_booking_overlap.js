import axios from 'axios';

const API_URL = 'http://localhost:7777/api/v1';
let userToken = '';
let userId = '';
let mentorId = '';

const login = async () => {
    try {
        // Register/Login a test user
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';

        try {
            await axios.post(`${API_URL}/user/register`, {
                name: 'Test Payment User',
                email,
                password
            });
        } catch (e) {
            // ignore if exists
        }

        const res = await axios.post(`${API_URL}/user/login`, { email, password });
        userToken = res.data.data.token;
        userId = res.data.data.user._id;
        console.log('✅ Logged in as User');
    } catch (err) {
        console.error('Login failed:', err.response?.data || err.message);
        process.exit(1);
    }
};

const findMentor = async () => {
    try {
        const res = await axios.get(`${API_URL}/mentors`);
        if (res.data.data.length > 0) {
            mentorId = res.data.data[0]._id;
            console.log('✅ Found Mentor:', mentorId);
        } else {
            console.error('❌ No mentors found.');
            process.exit(1);
        }
    } catch (err) {
        console.error('Fetch mentors failed:', err.message);
        process.exit(1);
    }
};

const testBookingOverlapKeyLogic = async () => {
    await login();
    await findMentor();

    // Use a unique date far in future to avoid collisions with real data
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // 30 days from now
    const dateStr = futureDate.toISOString().split('T')[0];

    console.log(`\n🚀 Testing Overlap Logic on Date: ${dateStr}`);

    const booking1 = {
        mentorId,
        date: dateStr,
        startTime: '10:00',
        endTime: '11:00',
        sessionType: 'video',
        price: 100,
        notes: 'Test Booking 1'
    };

    const booking2 = {
        mentorId,
        date: dateStr,
        startTime: '10:30', // Overlaps!
        endTime: '11:30',
        sessionType: 'video',
        price: 100,
        notes: 'Test Booking 2'
    };

    const config = { headers: { Authorization: `Bearer ${userToken}` } };

    try {
        console.log('1. Creating Base Booking (10:00 - 11:00)...');
        const res1 = await axios.post(`${API_URL}/bookings`, booking1, config);
        console.log('✅ Booking 1 Created:', res1.data.data._id);
    } catch (err) {
        console.log('ℹ️ Booking 1 creation failed (maybe exists):', err.response?.data?.message || err.message);
    }

    try {
        console.log('2. Creating Overlapping Booking (10:30 - 11:30)...');
        await axios.post(`${API_URL}/bookings`, booking2, config);
        console.error('❌ Booking 2 Created (Should have failed!)');
    } catch (err) {
        if (err.response && err.response.status === 409) {
            console.log('✅ Booking 2 Failed as expected (409 Conflict):', err.response.data.message);
        } else {
            console.error('❌ Unexpected error for Booking 2:', err.response?.data || err.message);
            console.error('   Status:', err.response?.status);
        }
    }
};

const testPaymentVerification = async () => {
    await login();
    await findMentor();

    try {
        // 1. Create Order
        console.log('\n🚀 Creating Order...');
        const orderData = {
            amount: 500,
            currency: 'INR',
            mentorId,
            sessionType: 'video',
            bookingData: {
                date: new Date().toISOString(),
                startTime: '10:00',
                endTime: '11:00',
                notes: 'Test Payment Verification'
            }
        };

        const config = { headers: { Authorization: `Bearer ${userToken}` } };
        const orderRes = await axios.post(`${API_URL}/payments/create-order`, orderData, config);

        const { orderId, paymentId } = orderRes.data.data;
        console.log('✅ Order Created:', { orderId, paymentId });

        // 2. Mock Verification (Send Dummy Signature)
        // We want to see if backend returns 400 (Valid logic, invalid sig) or 500 (Crash/Missing Key)
        console.log('\n🔐 Testing Verification (Sending Dummy Data)...');

        const dummyPaymentId = 'pay_dummy123';
        const dummySignature = 'invalid_signature_test';

        try {
            await axios.post(`${API_URL}/payments/verify`, {
                orderId,
                paymentId: dummyPaymentId,
                signature: dummySignature,
                paymentRecordId: paymentId
            }, config);
            console.log('❓ Verification succeeded unexpectedly?');
        } catch (error) {
            if (error.response) {
                console.log('✅ Backend Response Received:');
                console.log('   Status:', error.response.status); // 400 = OK (Security working), 500 = Broken
                console.log('   Message:', error.response.data.message);
            } else {
                console.error('❌ Network Error:', error.message);
            }
        }

    } catch (error) {
        console.error('❌ Test Flow Error:', error.response?.data || error.message);
    }
};

testPaymentVerification();
testBookingOverlapKeyLogic();
