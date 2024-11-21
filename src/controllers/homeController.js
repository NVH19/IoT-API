const axios = require('axios');
const db = require('../models/index')
// Biến lưu trữ giá trị độ ẩm
let humidity = 0;

// Hàm gửi dữ liệu độ ẩm tới server (mô phỏng gửi từ Arduino)
const sendHumidityToServer = async () => {
    try {
        const humidityValue = 70;  // Giả lập độ ẩm từ Arduino
        const response = await axios.get('http://localhost:3000/getHumidity', {
            params: {
                humidity: humidityValue // Độ ẩm bạn muốn gửi
            }
        });
        console.log('Data sent to server:', response.data);
    } catch (error) {
        console.error('Error sending humidity data:', error.message);
    }
};

// API GET nhận dữ liệu độ ẩm từ Arduino
let getHumidity = async (req, res) => {
    const humidityValue = req.query.humidity;

    // Kiểm tra xem độ ẩm có được gửi tới hay không
    if (humidityValue) {
        humidity = humidityValue;
        console.log(`Humidity received: ${humidity}`);
        res.send(`Humidity of ${humidity}% received successfully`);
    } else {
        res.status(400).send('No humidity data received');
    }
};

// API GET trả về giá trị độ ẩm hiện tại
let sendHumidity = async (req, res) => {
    res.json({ humidity: humidity });
};

// API lấy thông tin thời tiết (ví dụ từ Weather API)
let getWeather = async (req, res) => {
    const { city } = req.body;
    console.log('City:', city);

    // Kiểm tra nếu city không được cung cấp
    if (!city) {
        return res.status(400).send({ error: 'City is required' });
    }

    try {
        console.log('API Key:', process.env.WEATHER_API_KEY);

        // Gửi request đến WeatherAPI
        const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: city
            }
        });

        // Truy xuất thông tin cần thiết từ response
        const weatherData = {
            temperature: response.data.current.temp_c, // Nhiệt độ (°C)
            humidity: response.data.current.humidity, // Độ ẩm (%)
            precipitation: response.data.current.precip_mm // Lượng mưa (mm)
        };

        // Trả về dữ liệu cần thiết
        res.send(weatherData);

    } catch (error) {
        console.error('Error message:', error.message);
        res.status(500).send({ error: 'Error fetching weather data' });
    }
};

let controlPump = async (req,res) =>{
    const { state } = req.body;

    if (!state) {
        return res.status(400).send({ error: "State is required" });
    }

    try {
        // Gửi lệnh bật/tắt máy bơm đến Arduino qua HTTP
        // const response = await axios.get(`http://localhost:8080/pump?state=${state}`);
        const newHistory = await db.History.create({
            state: state,
            time: new Date().toISOString() // Save the current time
        });
        console.log(`Pump state: ${state}`);
        res.send({ message: `Pump is now ${state}`,
            history: newHistory
        });
    } catch (error) {
        console.error("Error controlling pump:", error);
        res.status(500).send({ error: "Error controlling pump" });
    }
};

module.exports = {
    getWeather,
    getHumidity,
    sendHumidity,
    controlPump
};

// Gọi hàm gửi dữ liệu độ ẩm giả lập
sendHumidityToServer();
