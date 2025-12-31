
import axios from 'axios';

export interface WeatherData {
    current_condition: Array<{
        temp_C: string;
        weatherDesc: Array<{ value: string }>;
    }>;
    weather: Array<{
        date: string;
        maxtempC: string;
        mintempC: string;
    }>;
}

export async function getWeather(city: string = 'Nanjing'): Promise<WeatherData | null> {
    try {
        const response = await axios.get(`https://wttr.in/${city}?format=j1`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return null;
    }
}
