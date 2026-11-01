export type Lang = 'en' | 'th';
export const LANGS: Lang[] = ['en', 'th'];

const en = {
  htmlLang: 'en',
  skip: 'Skip to main content',
  nav: { home: 'Home', about: 'About', services: 'Services', news: 'News', contact: 'Contact', quote: 'Get a Quote', menu: 'Menu', close: 'Close menu', primary: 'Primary navigation', allServices: 'All services' },
  langName: 'English', switchTo: 'ไทย', switchLabel: 'เปลี่ยนเป็นภาษาไทย',
  learnMore: 'Learn more', readMore: 'Read article', backToNews: 'Back to news', published: 'Published',
  relatedServices: 'Other services', keyBenefits: 'Key benefits', serviceProcess: 'Service process', overview: 'Overview',
  quickQuote: { title: 'Quick quote', service: 'Service', origin: 'Origin', destination: 'Destination', originPh: 'City or country', destPh: 'City or country', go: 'Continue to quote form', any: 'Select a service' },
  contactCard: { address: 'Address', phone: 'Phone', email: 'Email', map: 'View on Google Maps', mapTitle: 'Our location', mapNote: 'Open our location in Google Maps' },
  footer: { explore: 'Explore', services: 'Services', contact: 'Contact', privacy: 'Privacy policy', language: 'Language' },
  services: { air: 'Air Freight', sea: 'Sea Freight', land: 'Land Freight', intl: 'International Logistics Solutions' },
  form: {
    required: 'required', optional: 'optional',
    fullName: 'Full name', company: 'Company name', email: 'Email address', phone: 'Phone number',
    serviceType: 'Service type', selectService: 'Select a service',
    origin: 'Origin', destination: 'Destination', cargo: 'Cargo description', weight: 'Estimated cargo weight', volume: 'Estimated cargo volume',
    extra: 'Additional requirements', subject: 'Subject', message: 'Message',
    ph: { weight: 'For example, 250 kg', volume: 'For example, 1.5 CBM', origin: 'City, port or country', destination: 'City, port or country', cargo: 'What are you shipping? Include packaging type and quantity if known.', extra: 'Anything else we should know, such as deadlines or special handling.' },
    serviceOptions: { 'air-freight': 'Air Freight', 'sea-freight': 'Sea Freight', 'land-freight': 'Land Freight', 'international-logistics': 'International Logistics Solutions', other: 'Not sure yet' },
    submitQuote: 'Send quote request', submitContact: 'Send message', sending: 'Sending…',
    successTitle: 'Thank you. We have received your message.', successQuote: 'Our team will review your request and reply by email or phone.', successContact: 'Our team will reply by email or phone.',
    sendAnother: 'Send another request',
    errorTitle: 'Your message was not sent.',
    err: {
      validation: 'Please check the highlighted fields and try again.',
      captcha: 'We could not verify that you are human. Please complete the check and try again.',
      captchaMissing: 'Please complete the human verification check before sending.',
      origin: 'The request was blocked for security reasons. Please reload the page and try again.',
      server: 'Something went wrong on our side. Please try again, or email us directly at',
      network: 'We could not reach the server. Check your connection and try again, or email us directly at',
      rate: 'Too many requests. Please wait a moment and try again.'
    },
    privacyNote: 'We use the details you provide only to respond to your request.'
  },
  notFound: { title: 'Page not found', body: 'The page you are looking for does not exist or has moved.', home: 'Back to home', quote: 'Get a Quote' },
  adminOnly: ''
};

const th: typeof en = {
  htmlLang: 'th',
  skip: 'ข้ามไปยังเนื้อหาหลัก',
  nav: { home: 'หน้าแรก', about: 'เกี่ยวกับเรา', services: 'บริการ', news: 'ข่าวสาร', contact: 'ติดต่อเรา', quote: 'ขอใบเสนอราคา', menu: 'เมนู', close: 'ปิดเมนู', primary: 'เมนูหลัก', allServices: 'บริการทั้งหมด' },
  langName: 'ไทย', switchTo: 'EN', switchLabel: 'Switch to English',
  learnMore: 'ดูรายละเอียด', readMore: 'อ่านบทความ', backToNews: 'กลับไปหน้าข่าวสาร', published: 'เผยแพร่เมื่อ',
  relatedServices: 'บริการอื่น ๆ', keyBenefits: 'ประโยชน์หลัก', serviceProcess: 'ขั้นตอนบริการ', overview: 'ภาพรวม',
  quickQuote: { title: 'ขอราคาเบื้องต้น', service: 'บริการ', origin: 'ต้นทาง', destination: 'ปลายทาง', originPh: 'เมือง หรือประเทศ', destPh: 'เมือง หรือประเทศ', go: 'ไปยังแบบฟอร์มขอใบเสนอราคา', any: 'เลือกบริการ' },
  contactCard: { address: 'ที่อยู่', phone: 'โทรศัพท์', email: 'อีเมล', map: 'ดูใน Google Maps', mapTitle: 'ที่ตั้งของเรา', mapNote: 'เปิดตำแหน่งของเราใน Google Maps' },
  footer: { explore: 'เมนู', services: 'บริการ', contact: 'ติดต่อ', privacy: 'นโยบายความเป็นส่วนตัว', language: 'ภาษา' },
  services: { air: 'ขนส่งทางอากาศ', sea: 'ขนส่งทางเรือ', land: 'ขนส่งทางบก', intl: 'โซลูชันโลจิสติกส์ระหว่างประเทศ' },
  form: {
    required: 'จำเป็น', optional: 'ไม่บังคับ',
    fullName: 'ชื่อ-นามสกุล', company: 'ชื่อบริษัท', email: 'อีเมล', phone: 'เบอร์โทรศัพท์',
    serviceType: 'ประเภทบริการ', selectService: 'เลือกบริการ',
    origin: 'ต้นทาง', destination: 'ปลายทาง', cargo: 'รายละเอียดสินค้า', weight: 'น้ำหนักสินค้าโดยประมาณ', volume: 'ปริมาตรสินค้าโดยประมาณ',
    extra: 'ความต้องการเพิ่มเติม', subject: 'หัวข้อ', message: 'ข้อความ',
    ph: { weight: 'เช่น 250 กก.', volume: 'เช่น 1.5 ลบ.ม.', origin: 'เมือง ท่าเรือ หรือประเทศ', destination: 'เมือง ท่าเรือ หรือประเทศ', cargo: 'สินค้าที่ต้องการส่งคืออะไร ระบุประเภทการบรรจุและจำนวนหากทราบ', extra: 'ข้อมูลอื่นที่เราควรทราบ เช่น กำหนดส่งหรือการจัดการพิเศษ' },
    serviceOptions: { 'air-freight': 'ขนส่งทางอากาศ', 'sea-freight': 'ขนส่งทางเรือ', 'land-freight': 'ขนส่งทางบก', 'international-logistics': 'โซลูชันโลจิสติกส์ระหว่างประเทศ', other: 'ยังไม่แน่ใจ' },
    submitQuote: 'ส่งคำขอใบเสนอราคา', submitContact: 'ส่งข้อความ', sending: 'กำลังส่ง…',
    successTitle: 'ขอบคุณ เราได้รับข้อความของคุณแล้ว', successQuote: 'ทีมงานจะตรวจสอบคำขอและตอบกลับทางอีเมลหรือโทรศัพท์', successContact: 'ทีมงานจะตอบกลับทางอีเมลหรือโทรศัพท์',
    sendAnother: 'ส่งคำขออื่น',
    errorTitle: 'ยังไม่ได้ส่งข้อความของคุณ',
    err: {
      validation: 'กรุณาตรวจสอบช่องที่ไฮไลต์แล้วลองใหม่อีกครั้ง',
      captcha: 'เราไม่สามารถยืนยันได้ว่าคุณเป็นบุคคลจริง กรุณาทำการตรวจสอบและลองใหม่อีกครั้ง',
      captchaMissing: 'กรุณาทำการตรวจสอบยืนยันตัวตนก่อนส่ง',
      origin: 'คำขอถูกบล็อกด้วยเหตุผลด้านความปลอดภัย กรุณาโหลดหน้าใหม่แล้วลองอีกครั้ง',
      server: 'เกิดข้อผิดพลาดที่ฝั่งเรา กรุณาลองอีกครั้ง หรืออีเมลถึงเราโดยตรงที่',
      network: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง หรืออีเมลถึงเราโดยตรงที่',
      rate: 'มีคำขอมากเกินไป กรุณารอสักครู่แล้วลองอีกครั้ง'
    },
    privacyNote: 'เราใช้ข้อมูลที่คุณให้เพื่อตอบกลับคำขอของคุณเท่านั้น'
  },
  notFound: { title: 'ไม่พบหน้าที่ต้องการ', body: 'หน้าที่คุณกำลังมองหาไม่มีอยู่หรือถูกย้ายแล้ว', home: 'กลับไปหน้าแรก', quote: 'ขอใบเสนอราคา' },
  adminOnly: ''
};

export const ui = { en, th };
export type UI = typeof en;
