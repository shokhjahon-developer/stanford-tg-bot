import { Keyboard } from "grammy";
import type { text } from "stream/consumers";

export const createMainMenuKeyboard = () => {
  return new Keyboard()
    .text("🌟 Leaderboard 📊")
    .text("📝 Musobaqada qatnashish 🏆")
    .row()
    .text("📚 Kurslar 🔥")
    .text("✍️ Kursga yozilish 📝")
    .row()
    .text("ℹ️ Biz haqimizda 🏢")
    .text("📞 Biz bilan bog'lanish 📲")
    .row()
    .text("📩  Shikoyat  |  Talab  |  Taklif  🗣️")
    .text("🛠️ Botdagi Muammo yoki Taklif 💡");
};

export const createAdminMainMenuKeyboard = () => {
  return new Keyboard()
    .text("🌟 Leaderboard 📊")
    .text("👥 Foydalanuvchilar soni")
    .row()
    .text("📝 Musobaqa yaratish 🏆")
    .text("🏁 Musobaqani yakunlash 🏁")
    .text("🚫 Musobaqani bekor qilish 🚫")
    .row()
    .text("✍️ Xabar yuborish 📝");
};

export const courseInfoRu = `
🇷🇺 <b>Rus tili kurslari - Yangi imkoniyatlarga eshik oching!</b>

Stanford Academy siz uchun <b>zamonaviy, qiziqarli va samarali</b> Rus tili kurslarini taqdim etadi:

- 🔥 <b>Bir necha oy ichida</b> tez va ravon gapirish ko'nikmalarini o'zlashtiring!
- 🧑‍🏫 <b>Professional o'qituvchilar</b> bilan har bir darsdan zavqlaning.
- 📚 Rus tili gramatikasi va <b>boy so'z boyligi</b>ni o'rganing.
- 💬 <b>Speaking Club</b>da o'zingizni erkin ifoda qiling va ko'nikmalaringizni mustahkamlang.
- 📆 <b>Quvlay jadval:</b> Darslar ish kunlari va dam olish kunlariga moslashadi.
- 📈 Kurs yakunida <b>yuqori sertifikat</b> bilan muvaffaqiyatlaringizni tasdiqlang.

💼 Rus tilida so'zlashib, <b>yangi ish imkoniyatlari</b> va <b>olimiy yutuqlar</b>ga erishing! 

Stanford Academy - kelajakka o'zgarish qiling! 🌟
`;

export const courseInfoEn = `
🇬🇧 <b>Ingliz tili kurslari - Dunyo eshiklarini oching!</b>

Stanford Academy siz uchun <b>zamonaviy va innovatsion</b> Ingliz tili kurslarini taqdim etadi:

- 🔥 <b>IELTS tayyorlov</b> darslari - <b>yuqori natija kafolati</b>!
- 🧑‍🏫 <b>Xalqaro tajribaga ega o'qituvchilar</b> bilan bilimlaringizni kengaytiring.
- 💬 <b>Speaking va Writing Club</b> orqali muloqot va yozish ko'nikmalarini rivojlantiring.
- 📚 Zamonaviy <b>o'quv materiallari</b> va amaliy mashg'ulotlar bilan qiziqarli o'rganish jarayoni.
- 📈 Chet elda o'qish yoki ishlash uchun <b>yangi ufqlarni</b> kashf eting.

💼 Stanford Academy sizni <b>kelajakka tayyorlaydi</b>! 🌍 

Birgalikda rivojlanamiz va yutuqlarga erishamiz! ✨
`;

export const courseInfoKo = `
🇰🇷 <b>Koreys tili kurslari - Kelajak sari qadam tashlang!</b>

Stanford Academy siz uchun <b>maxsus va innovatsion</b> Koreys tili kurslarini taqdim etadi:

- 🔥 <b>TOPIK tayyorlov</b> darslari bilan <b>Koreyada ta'lim olish imkoniyati</b>ni qo'lga kiriting.
- 🧑‍🏫 <b>Tajribali va do'stona o'qituvchilar</b> bilan qulay ta'lim jarayonini his eting.
- 📚 Koreys grammatikasini <b>mukammal o'rganing</b> va tinglash, yozish, o'qish ko'nikmalarini rivojlantiring.
- 💬 Koreys madaniyati va kundalik muloqot uslublarini <b>amaliy mashg'ulotlarda</b> o'rganing.
- 📆 <b>O'zingizga qulay jadval</b>ni tanlang va maqsadlaringiz sari harakat qiling.

💼 Koreys tilini o'rganib, <b>ish va ta'lim imkoniyatlarini kengaytiring</b>! 🚀 

Stanford Academy bilan birga yuksak marralarni zabt eting! 🌟
`;

export const academyInfo = `
🌟 <b>Stanford Academy - Sizning kelajagingiz bu yerdan boshlanadi!</b> 🌟

🌍 <b>O'zingizni yangi darajaga olib chiqing va dunyoni zabt eting!</b>  
Stanford Academy nafaqat bilim beradi, balki sizni orzularingiz sari yo'naltiradi. Bizning missiyamiz - har bir talabani cheksiz imkoniyatlar dunyosiga tayyorlashdir!  

🔥 <b>Nega aynan Stanford Academy?</b>  
- 📖 <b>O'zgacha va samaradorlikka yo'naltirilgan o'quv dasturlari:</b> Natija beradi!  
- 🧑‍🏫 <b>Ilhomlantiruvchi o'qituvchilar:</b> Sizning har bir savolingizga javob beradigan va qo'llab-quvvatlaydigan xalqaro mutaxassislar.  
- 🏆 <b>Garantiya berilgan muvaffaqiyat:</b> IELTS, TOPIK, CEFR va boshqa sertifikatlarga tayyorgarlikda yutuqqa erishing!  
- 🌍 <b>Cheksiz imkoniyatlar:</b> Chet elda o'qish, ishlash va global miqyosda yangi ufqlarni oching!  
- 💼 <b>Shaxsiy yondashuv va qulay jadval:</b> O'zingizga mos keladigan jadvalni tanlang va maqsadlaringizga erishing.

✨ <b>Bizda o'qish orqali siz quyidagilarga erishasiz:</b>  
- 💬 Erkin so'zlashuv ko'nikmasi: Sharmandalikni unutib, o'zingizni ishonchli ifoda qiling!  
- 📚 Eng zamonaviy bilim va texnikalar: Ta'lim jarayoningizni qiziqarli va samarali qiling.  
- 🌟 Orzularingizni haqiqatga aylantirish: Kelajakda muvaffaqiyatlar va dunyo darajasidagi tajribaga ega bo'ling.  

📍 <b>Bizning manzilimiz:</b>  
Toshkent, Yangiyo'l tumani, Leninizm, Yusuf ota choyxonasi (2-qavat)📌
  
📞 <b>Biz bilan bog'laning:</b>  
- Telefon: <a href="tel:+998932453539"><b>+998 (93) 245-35-39</b></a> 📲  
- Telegram: <a href="https://t.me/An_Nur_edu_admin"><b>@An_Nur_edu_admin</b></a> ✈️  

📢 <b>Bizning rasmiy Telegram kanali:</b>  
🔗 <a href="https://t.me/StanfordNGO"><b>@StanfordNGO</b></a> 🌐

🚀 <b>Orzuingizdagi bilim darajasiga birinchi qadamni qo'ying!</b>  
Stanford Academy bilan muvaffaqiyatli kelajakni bugundan boshlang. Siz tayyormisiz? 💪  
`;

export const courses = {
  english: {
    photo:
      "AgACAgIAAxkDAAMoZ3FSJ5DfwdOu1ik9gaDl0NKKTRIAAn_1MRsuFJFLM5SsL8xbq9QBAAMCAAN4AAM2BA",
    caption: courseInfoEn,
    next: "next_course_ru",
  },
  russian: {
    photo:
      "AgACAgIAAxkDAAMpZ3FSLMdvRUg4sqOXrJuO5C3Hb-AAAoD1MRsuFJFLrTyf3xG7uTkBAAMCAAN4AAM2BA",
    caption: courseInfoRu,
    next: "next_course_korean",
    prev: "next_course_english",
  },
  korean: {
    photo:
      "AgACAgIAAxkDAAMqZ3FSMqh7UW9QgBxMDG8MwY-8MgsAAoH1MRsuFJFLUik4pW6UBj8BAAMCAAN5AAM2BA",
    caption: courseInfoKo,
    next: "next_course_english",
    prev: "next_course_ru",
  },
};
