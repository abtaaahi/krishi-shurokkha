import { toBanglaNumber } from "../utils/banglaFormatter";

interface Props {
    temp: number;     // তাপমাত্রা (°C)
    humidity: number; // আর্দ্রতা (%)
    rain: number;     // বৃষ্টিপাত (mm or % pop)
    //crop: string;
}

export default function Advisory({ temp, humidity, rain }: Props) {

    const getTemperatureAdvice = () => {
        const tempBn = toBanglaNumber(parseFloat(temp.toFixed(1)));
        if (temp < 15) {
            return `
তাপমাত্রা ${tempBn} ডিগ্রি সেলসিয়াস → খুব কম তাপমাত্রা।
- মাটির উর্বরতা কমে যেতে পারে।
- বীজ অঙ্কুরোদগম ধীর হবে।
- চারা ঢেকে রাখুন।
- নাজুক গাছের চারপাশে খড়/পলিথিন ব্যবহার করুন।
`;
        }

        if (temp >= 15 && temp <= 25) {
            return `
তাপমাত্রা ${tempBn} ডিগ্রি সেলসিয়াস → ফসলের জন্য আদর্শ।
- নিয়মিত সেচ দিন।
- সার প্রয়োগ করলে ভালো ফল পাবেন।
`;
        }

        if (temp > 25 && temp <= 35) {
            return `
তাপমাত্রা ${tempBn} ডিগ্রি সেলসিয়াস → মাঝারি গরম।
- গাছের পানির চাহিদা বেশি।
- দুপুরে সেচ দেওয়া এড়িয়ে চলুন।
- সকাল বা সন্ধ্যায় সেচ দিন।
`;
        }

        if (temp > 35) {
            return `
তাপমাত্রা ${tempBn} ডিগ্রি সেলসিয়াস → অতিরিক্ত গরম।
- তাপজনিত চাপ (Heat Stress) হতে পারে।
- গাছের গোড়া ভিজিয়ে রাখুন।
- ছায়া (নেট/পলিশেড) দিন।
- ফল/সবজি বৃদ্ধি কমে যেতে পারে।
`;
        }

        return "";
    };

    const getHumidityAdvice = () => {
        const humBn = toBanglaNumber(humidity);
        if (humidity < 40) {
            return `
আর্দ্রতা ${humBn} শতাংশ → খুব কম।
- গাছ দ্রুত শুকিয়ে যায়।
- পাতায় পোড়া ধরতে পারে।
- ঘন ঘন কিন্তু কম সেচ দিন।
`;
        }

        if (humidity >= 40 && humidity <= 70) {
            return `
আর্দ্রতা ${humBn} শতাংশ → ফসলের জন্য উপযুক্ত।
- সবজি, ধান, ডালের জন্য ভালো।
- রোগবালাই কম হয়।
- সার প্রয়োগের ভালো সময়।
`;
        }

        if (humidity > 70) {
            return `
আর্দ্রতা ${humBn} শতাংশ → খুব বেশি।
- পাতা দাগ, পাতা ঝলসে যাওয়া, ভাইরাসের ঝুঁকি।
- ধান, আলু, বেগুন বেশি আক্রান্ত হয়।
- ছত্রাকনাশক (Fungicide) ব্যবহার করুন।
- জমির পানি বের হওয়ার ব্যবস্থা রাখুন।
`;
        }

        return "";
    };

    const getRainAdvice = () => {
        const rainBn = toBanglaNumber(Math.round(rain));

        // 🌦 No rain expected
        if (rain === 0) {
            return `
বৃষ্টিপাত ${rainBn} শতাংশ → আজকের দিনে বৃষ্টির কোনো সম্ভাবনা নেই।
- সেচ দেওয়ার জন্য উপযুক্ত সময়।
- জমি শুকনো থাকলে পানি দিন।
`;
        }

        // 🌦 Very low rain (0–10%)
        if (rain > 0 && rain < 10) {
            return `
বৃষ্টিপাত ${rainBn} শতাংশ → খুব কম বৃষ্টি হতে পারে।
- সেচের প্রয়োজন হতে পারে।
- সার প্রয়োগের পর হালকা পানি দিন।
`;
        }

        // 🌧 Moderate rain
        if (rain >= 10 && rain <= 50) {
            return `
বৃষ্টিপাত ${rainBn} শতাংশ → মাঝারি বৃষ্টি।
- ধান, সবজি, ভুট্টার জন্য ভালো।
- জমিতে পানি জমতে দেবেন না।
`;
        }

        // ⛈ Heavy rain
        if (rain > 50) {
            return `
বৃষ্টিপাত ${rainBn} শতাংশ → ভারী বৃষ্টি।
- জমিতে পানি জমে যাওয়ার ঝুঁকি।
- সবজির শিকড় পচে যেতে পারে।
- পানি বের হওয়ার নালা পরিষ্কার রাখুন।
- অতিরিক্ত সার দেবেন না (বৃষ্টিতে নষ্ট হবে)।
`;
        }

        return "";
    };


    const finalMessage = `

${getTemperatureAdvice()}
${getHumidityAdvice()}
${getRainAdvice()}
`;

    return (
        <div className="p-4 bg-yellow-100 border-l-4 border-green-600 rounded mt-3 whitespace-pre-line text-brown">
            {finalMessage}
        </div>
    );
}
